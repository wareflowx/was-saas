# Error Handling and Code Quality Refactoring

**Priority:** Critical
**Status:** Discussion Required
**Type:** Architecture / Code Quality
**Created:** 2025-02-04
**Tags:** architecture, error-handling, functional-programming, ipc, database, hooks

---

## Problem Statement

The codebase has accumulated significant technical debt related to error handling and code quality. Several architectural issues make the application difficult to maintain, debug, and extend:

### Current Issues

#### 1. **Unsafe Navigation Patterns**
- **Location:** `src/routes/locations.tsx`, `src/routes/zones.tsx`, `src/routes/sectors.tsx`
- **Problem:** Using `useEffect` for navigation is an anti-pattern in React
- **Impact:** Can cause infinite loops, race conditions, and violates React best practices
- **Example:**
```typescript
useEffect(() => {
  if (warehouses?.length === 0) {
    navigate({ to: "/onboarding/welcome" })
  }
}, [warehouses, navigate]) // navigate changes on every render
```

#### 2. **Confusing Data Fetching Logic**
- **Location:** All data fetching routes
- **Problems:**
  - `useWarehouses()` is called but its result is often ignored
  - `useLocations(undefined)` is passed but intent is unclear (get all? get first?)
  - Fallback logic inside hooks (`warehouseId || firstWarehouse.id`) creates confusion
- **Impact:** Unpredictable behavior, hard to understand what data will be fetched

#### 3. **"God Hook" Anti-Pattern**
- **Location:** `useBackend()` hook
- **Problems:**
  - Single hook handles all IPC communication
  - No separation of concerns
  - Difficult to test and mock
  - Violates Single Responsibility Principle
- **Impact:** Tight coupling, low reusability, difficult to extend

#### 4. **Broken Type Chain with Global Access**
- **Location:** Throughout the codebase where Electron IPC is accessed
- **Problems:**
  - Using `(window as any).electronAPI` breaks the entire type chain
  - Creates tight 3D coupling between renderer and main process
  - No type safety for IPC calls
  - Impossible to refactor safely
  - Global mutable state
- **Impact:** Type errors at runtime, impossible to track IPC usage, unsafe refactoring

#### 5. **Inadequate Error Handling**
- **Location:** `safeIpcCall()` and throughout the codebase
- **Problems:**
  - `safeIpcCall()` returns fallback values but errors are silently ignored
  - No structured error types
  - No retry logic for transient failures
  - No user feedback for errors
  - No logging/monitoring
- **Impact:** Errors are swallowed, impossible to debug, poor UX

---

## Proposed Solution

### Functional Programming Approach

We should adopt a functional programming approach with the following patterns:

#### 1. **Result Type Pattern**
Replace throwing exceptions with explicit error handling using discriminated unions:

```typescript
// Discriminated union for explicit error handling
type Result<T, E = AppError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Helper functions (pure, composable)
const success = <T>(data: T): Result<T> => ({ success: true, data })
const failure = <E>(error: E): Result<never, E> => ({ success: false, error })

// Transformations
const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> =>
  result.success ? success(fn(result.data)) : result

const chain = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> =>
  result.success ? fn(result.data) : result

// Benefits:
// - Type-safe: forced to handle errors explicitly
// - Composable: map, chain, flatMap operations
// - Immutable: readonly properties prevent mutations
// - No exceptions: predictable control flow
```

#### 2. **Union Types for Error Domains**
Use union types instead of enums for better type safety and functional programming:

```typescript
// Union type for error domains
type ErrorDomain =
  | 'DATABASE'
  | 'IPC'
  | 'VALIDATION'
  | 'NETWORK'
  | 'BUSINESS'

// Error type as a product type (readonly for immutability)
type AppError = Readonly<{
  domain: ErrorDomain
  code: string
  message: string
  cause?: unknown
  context?: Readonly<Record<string, unknown>>
  timestamp: Date
  recoverable: boolean
}>

// Constructor functions (pure)
const createError = (
  domain: ErrorDomain,
  code: string,
  message: string,
  options?: {
    cause?: unknown
    context?: Record<string, unknown>
    recoverable?: boolean
  }
): AppError => ({
  domain,
  code,
  message,
  cause: options?.cause,
  context: options?.context,
  timestamp: new Date(),
  recoverable: options?.recoverable ?? false
})

// Specific error creators
const databaseError = (
  operation: string,
  table: string,
  cause: unknown
): AppError =>
  createError('DATABASE', `DB_${operation.toUpperCase()}_FAILED`,
    `Failed to ${operation} on ${table}`,
    { cause, context: { table, operation } }
  )

const ipcError = (
  channel: string,
  cause: unknown
): AppError =>
  createError('IPC', 'IPC_CALL_FAILED',
    `IPC call to '${channel}' failed`,
    { cause, context: { channel }, recoverable: true }
  )

const validationError = (
  field: string,
  value: unknown,
  message: string
): AppError =>
  createError('VALIDATION', 'VALIDATION_FAILED',
    message,
    { context: { field, value } }
  )
```

#### 3. **IPC Wrapper with Retry Logic**
Create a wrapper that handles:
- Timeout management
- Automatic retry with exponential backoff
- Structured error logging
- Proper error propagation

```typescript
const safeIpcCall = async <T>(
  channel: string,
  data?: unknown,
  options?: IpcOptions
): Promise<Result<T, AppError>>
```

#### 4. **tRPC Pattern with Direct API Calls**
No service layer - direct function calls through tRPC:

```typescript
// Backend API - just functions, no classes, no services
type BackendApi = {
  readonly locations: {
    readonly getAll: (warehouseId?: string) => Promise<Result<LocationsData, AppError>>
    readonly getById: (id: string) => Promise<Result<Location, AppError>>
    readonly create: (data: CreateLocationDto) => Promise<Result<Location, AppError>>
  }
  readonly zones: {
    readonly getAll: (warehouseId?: string) => Promise<Result<ZonesData, AppError>>
    readonly getById: (id: string) => Promise<Result<Zone, AppError>>
  }
  // ... for all entities
}

// Usage through tRPC - direct calls, no intermediate services
const { data } = await api.locations.getAll()
// Returns Result<LocationsData, AppError>

// In React Query / tRPC hooks
const useAllLocations = (warehouseId?: string) => {
  return useQuery({
    queryKey: ['locations', warehouseId],
    queryFn: () => api.locations.getAll(warehouseId),
    // Result<T, E> automatically converted to throw on error
  })
}

// Benefits:
// - No service layer overhead
// - Direct function calls (composable, testable)
// - tRPC provides type safety end-to-end
// - Clear contract: functions take X and return Y
```

#### 5. **React Query Integration**
Integrate with React Query properly:
- Convert `Result<T, E>` to throw errors for React Query's built-in error handling
- Use `retry` option based on error.recoverable flag
- Clear separation between data fetching and business logic

#### 6. **Navigation Pattern**
Replace `useEffect` navigation with:
- Router-based redirects in loaders
- Conditional rendering
- Protected routes pattern

#### 7. **Type-Safe IPC Layer**
Replace `(window as any).electronAPI` with a properly typed injection:

```typescript
// Define IPC interface in shared types
type ElectronIpcApi = Readonly<{
  locations: {
    readonly getAll: (warehouseId?: string) => Promise<Result<LocationsData, AppError>>
    readonly getById: (id: string) => Promise<Result<Location, AppError>>
  }
  // ... all other IPC channels
}>

// Inject at app initialization (not during renders)
const createIpcApi = (): ElectronIpcApi => ({
  locations: {
    getAll: (warehouseId) =>
      window.electronAPI.locations.getAll(warehouseId),
    getById: (id) =>
      window.electronAPI.locations.getById(id),
  },
  // ... map all channels
})

// Use React Context for dependency injection
const IpcContext = createContext<ElectronIpcApi | null>(null)

export const useIpc = (): ElectronIpcApi => {
  const api = useContext(IpcContext)
  if (!api) throw new Error('useIpc must be used within IpcProvider')
  return api
}

// In App.tsx
const ipcApi = createIpcApi()

<IpcProvider value={ipcApi}>
  <App />
</IpcProvider>

// Benefits:
// - Full type safety chain
// - No global mutable access
// - Easy to test/mock
// - Clear dependency graph
// - Refactor-safe
```

---

## Affected Areas

- [ ] All route components (`locations.tsx`, `zones.tsx`, `sectors.tsx`, etc.)
- [ ] `useBackend()` hook
- [ ] `use-locations.ts` (all data fetching hooks)
- [ ] `src/backend/import/` (IPC communication)
- [ ] All `(window as any).electronAPI` accesses
- [ ] Error handling throughout the application
- [ ] Navigation/redirects

---

## Implementation Plan

### Phase 1: Foundation
1. **Define core types**
   - `Result<T, E>` type
   - `AppError` type
   - Error domains and codes

2. **Create type-safe IPC layer**
   - Define `ElectronIpcApi` type
   - Create `IpcContext` and `useIpc` hook
   - Replace all `(window as any).electronAPI` accesses
   - Implement dependency injection in App.tsx

3. **Create IPC wrapper**
   - Implement `safeIpcCall()` with retry logic
   - Add structured logging

### Phase 2: Backend API (tRPC Pattern)
1. **Create tRPC router**
   - Define API as readonly object with functions
   - All functions return `Result<T, AppError>`
   - No classes, no services, just functions

2. **Update database layer**
   - Return typed results
   - Add validation at boundaries
   - Direct mapping to tRPC procedures

### Phase 3: Frontend Hooks
1. **Simplify hooks**
   - Remove "god hook" anti-pattern
   - Use tRPC procedures directly
   - Each hook calls api.entities.xxx() directly
   - Clear contract: `api.locations.getAll(warehouseId?)`

2. **Fix navigation**
   - Remove `useEffect` navigation
   - Use router loaders or conditional rendering

### Phase 4: Error Handling
1. **Error boundaries**
   - Create error boundary components
   - Add user-friendly error displays

2. **Monitoring/logging**
   - Structured error logging
   - Development vs production behavior

---

## Open Questions

1. **Migration Strategy**
   - Should we migrate incrementally or all at once?
   - How do we handle existing code during migration?

2. **Backward Compatibility**
   - Do we need to maintain existing APIs during transition?
   - What's our deprecation policy?

3. **Testing Strategy**
   - How do we test the new error handling patterns?
   - Do we need property-based testing?

4. **User Experience**
   - How do we display recoverable vs non-recoverable errors to users?
   - What retry behavior do we expose in the UI?

---

## Related Issues

- Data mixing between warehouses (partially addressed)
- Dashboard vs detailed pages data inconsistency
- Mock data generation architecture

---

## References

- [Railway-Oriented Programming](https://blog.ploeh.dk/amateurs-and-error-handling/)
- [Result Type Pattern](https://vicluck.medium.com/using-result-types-in-javascript-typescript-771be0f55b55)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-error-boundaries)
- [Functional Programming Patterns](https://github.com/fpontencier/expression-oriented-api-examples)

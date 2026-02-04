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

#### 4. **Inadequate Error Handling**
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
type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E }

// Benefits:
// - Type-safe: forced to handle errors explicitly
// - Composable: map, chain, flatMap operations
// - No exceptions: predictable control flow
```

#### 2. **Hierarchical Error Types**
Define explicit error domains with structured information:

```typescript
enum ErrorDomain {
  DATABASE = 'DATABASE',
  IPC = 'IPC',
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  BUSINESS = 'BUSINESS'
}

interface AppError {
  domain: ErrorDomain
  code: string
  message: string
  cause?: unknown
  context?: Record<string, unknown>
  timestamp: Date
  recoverable: boolean  // Can this error be retried?
}
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

#### 4. **Service Layer Pattern**
Separate business logic from IPC/Database concerns:

```typescript
const LocationService = {
  getAll: (): Promise<Result<LocationsData, AppError>>,
  getByWarehouse: (id: string): Promise<Result<Location[], AppError>>,
  // Clear interface, explicit about what can fail
}
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

---

## Affected Areas

- [ ] All route components (`locations.tsx`, `zones.tsx`, `sectors.tsx`, etc.)
- [ ] `useBackend()` hook
- [ ] `use-locations.ts` (all data fetching hooks)
- [ ] `src/backend/import/` (IPC communication)
- [ ] Error handling throughout the application
- [ ] Navigation/redirects

---

## Implementation Plan

### Phase 1: Foundation
1. **Define core types**
   - `Result<T, E>` type
   - `AppError` interface
   - Error domains and codes

2. **Create IPC wrapper**
   - Implement `safeIpcCall()` with retry logic
   - Add structured logging

### Phase 2: Backend Services
1. **Create service layer**
   - `LocationService`, `WarehouseService`, etc.
   - Each service has clear interface
   - All methods return `Result<T, AppError>`

2. **Update database layer**
   - Return typed results
   - Add validation at boundaries

### Phase 3: Frontend Hooks
1. **Simplify hooks**
   - Remove "god hook" anti-pattern
   - Each hook uses appropriate service
   - Clear contract for what data is fetched

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

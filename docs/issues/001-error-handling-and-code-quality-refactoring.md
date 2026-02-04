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

### Backend Issues (src/backend/)

#### 6. **Fake Service Layer Anti-Pattern**
- **Location:** `src/backend/services/*.ts`
- **Problems:**
  - `*-service.ts` files exist but are just thin wrappers
  - No actual business logic, just pass-through functions
  - Adds unnecessary indirection
  - Violates YAGNI principle
- **Example:**
```typescript
// services/analysis-service.ts
export const performABCAnalysis = (...args) => {
  return runABCAnalysis(...args)  // Useless wrapper!
}
```
- **Impact:** Code bloat, false sense of architecture, harder to navigate

#### 7. **Global Mutable State - Plugin Registry**
- **Location:** `src/backend/import/plugins/registry.ts`
- **Problems:**
  - `export const registry: PluginRegistry = {}` is global and mutable
  - `registerPlugin()` mutates global state at runtime
  - No way to know which plugins are registered without side effects
  - Testing nightmare (shared state between tests)
- **Impact:** Race conditions, unpredictable behavior, impossible to test in isolation

#### 8. **Runtime `require()` Instead of Static Imports**
- **Location:** `src/backend/analysis/abc-analysis.ts:33`, `dead-stock-analysis.ts:21`
- **Problems:**
  - `const { getProductMovementTotals } = require('../database/queries')`
  - Hides dependencies from compiler
  - No type checking at import time
  - Impossible to tree-shake
  - Errors only appear at runtime
- **Impact:** Lost type safety, hidden dependencies, production crashes

#### 9. **Dynamic Imports in Electron Main Process**
- **Location:** `src/backend/services/import-service.ts:109, 225`
- **Problems:**
  - `const { loadToDatabase } = await import('../import/loader')`
  - No code splitting benefit in Electron main process
  - Hides dependencies
  - Makes code tracing difficult
- **Impact:** No performance gain, added complexity

#### 10. **No Data Validation**
- **Location:** `src/backend/import/loader.ts`
- **Problems:**
  - All `insert*` functions accept `readonly any[]`
  - No Zod validation or schema checking
  - Malformed data silently fails or crashes
- **Example:**
```typescript
export const insertWarehouses = (warehouses: readonly any[]): number => {
  return bulkInsert(warehousesTable, warehouses, (w) => ({
    // No validation that w has correct fields!
  }), 'Warehouses')
}
```
- **Impact:** Data corruption, cryptic errors, impossible to debug

#### 11. **Massive Code Duplication**
- **Location:** `src/backend/import/loader.ts`
- **Problems:**
  - Same pattern repeated 20+ times for each entity
  - 750+ lines doing essentially the same thing
  - Every entity has identical `insert*` function
- **Example:**
```typescript
export const insertWarehouses = (warehouses: readonly any[]): number => {
  return bulkInsert(warehousesTable, warehouses, (w) => ({...}), 'Warehouses')
}
export const insertUsers = (users: readonly any[]): number => {
  return bulkInsert(usersTable, users, (u) => ({...}), 'Users')
}
// ... 18 more times
```
- **Impact:** Maintenance nightmare, error-prone, violates DRY

#### 12. **God Function - loadToDatabase**
- **Location:** `src/backend/import/loader.ts:621-752`
- **Problems:**
  - 131 lines in a single function
  - 20+ `if` blocks checking each array
  - No abstraction, just procedural code
- **Impact:** Untestable, unreadable, unmaintainable

#### 13. **TODOs in Production Code**
- **Location:** `src/backend/import/mapping-service.ts:282, 292`
- **Problems:**
  - `saveMappingPreset()` and `loadMappingPreset()` are stubs
  - Functions do nothing but log
  - No implementation of persistence
- **Impact:** Features appear to work but don't actually persist data

#### 14. **Type Safety Lost with SQL Queries**
- **Location:** `src/backend/database/index.ts:177-183`
- **Problems:**
  - Raw SQL queries return `any[]`
  - All type information lost at database boundary
  - `prepare('SELECT * FROM warehouses ORDER BY id').all()` returns `any`
- **Example:**
```typescript
export const getAllWarehouses = () => {
  const db = getDbRaw()
  return db
    .prepare('SELECT * FROM warehouses ORDER BY id')
    .all()  // Returns any[], no typing!
}
```
- **Impact:** Complete loss of type safety, runtime type errors

#### 15. **Global Singleton with Mutable State**
- **Location:** `src/backend/database/index.ts:15`
- **Problems:**
  - `let sqliteDb: any | null = null` (global mutable, plus `any`!)
  - Singleton pattern makes testing impossible
  - No way to reset or mock database in tests
  - `any` type removes all type safety
- **Impact:** Untestable code, shared state, lost type safety

#### 16. **Silent Error Handling**
- **Location:** `src/backend/import/loader.ts:44`
- **Problems:**
  - Try/catch logs errors but continues execution
  - No way to know if insertions failed
  - No Result types, just console.error
- **Example:**
```typescript
try {
  db.insert(table).values(transform(item)).run()
  inserted++
} catch (error) {
  console.error(`Error inserting ${entityName}:`, error)
  // Continues anyway, no way to track failures!
}
```
- **Impact:** Silent data loss, impossible to debug

#### 17. **Hard-coded String Literals**
- **Location:** Throughout backend
- **Problems:**
  - Status types as strings: `'success' | 'failed'`
  - Movement types: `'inbound' | 'outbound' | 'transfer'`
  - No type safety, typos possible
  - Refactor impossible
- **Impact:** Runtime errors from typos, impossible to refactor safely

#### 18. **Production Logging with console.log**
- **Location:** Throughout backend
- **Problems:**
  - `console.log('🎲 [MOCK DATA] Starting generation...')`
  - `console.log('✅ [DB INSERT] Warehouses:', ...)`
  - No structured logging
  - Impossible to disable in production
  - Performance impact
  - No observability
- **Impact:** Performance degradation, no monitoring, cluttered code

#### 19. **Inconsistent Naming Conventions**
- **Location:** Throughout backend
- **Problems:**
  - `SCHEMAS` vs `ipcContract` vs `registry`
  - `performABCAnalysis` vs `runDeadStockAnalysis`
  - `warehouseId` vs `plugin_id` (camelCase vs snake_case)
- **Impact:** Confusion, cognitive load, errors

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

#### 7. **Type-Safe IPC Layer with Zod Contract**
Replace `(window as any).electronAPI` with a Zod-based contract system:

```typescript
// shared/ipc/contract.ts - Single source of truth
import { z } from 'zod'

const locationSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.string(),
  // ... all fields
})

const locationsDataSchema = z.object({
  locations: z.array(locationSchema),
  kpis: z.object({
    totalLocations: z.number(),
    // ... all KPIs
  }),
})

// IPC Contract - defined once, shared between frontend/backend
const ipcContract = {
  locations: {
    getAll: {
      input: z.object({ warehouseId: z.string().optional() }).optional(),
      output: locationsDataSchema,
    },
  },
  zones: {
    getAll: {
      input: z.object({ warehouseId: z.string().optional() }).optional(),
      output: zonesDataSchema,
    },
  },
} as const

// Type inference from Zod schemas
type IpcInput<T extends keyof IpcContract, M extends keyof IpcContract[T]> =
  z.infer<IpcContract[T][M]['input']>
type IpcOutput<T extends keyof IpcContract, M extends keyof IpcContract[T]> =
  z.output<IpcContract[T][M]['output']>

// Type-safe proxy generator
type IpcProxy<T extends IpcContract> = {
  [K in keyof T]: {
    [M in keyof T[K]]: (
      input: IpcInput<K, M>
    ) => Promise<Result<IpcOutput<K, M>, AppError>>
  }
}

const createIpcProxy = <T extends IpcContract>(
  channels: unknown
): IpcProxy<T> => {
  // Recursive proxy that validates input/output with Zod
  return createProxy(channels, ipcContract)
}

// Usage - 100% type-safe, runtime validated
const ipc = createIpcProxy<IpcContract>(window.electronAPI)

const result = await ipc.locations.getAll({ warehouseId: 'WH-001' })
// ↑ Compile-time type checking + Runtime Zod validation
// Returns: Result<LocationsData, AppError>

// Benefits:
// - Single source of truth (no type duplication)
// - Compile-time type safety (TypeScript)
// - Runtime validation (Zod)
// - Lightweight (~50kb vs 2MB for tRPC)
// - Designed for IPC (not HTTP)
// - Easy to test (mock contract)
// - Refactor-safe (contract break = compile error)
```

**Backend (Electron Main):**
```typescript
// backend/ipc/handlers.ts
import { ipcHandler } from './ipc-handler'
import { ipcContract } from '../../shared/ipc/contract'

ipcHandler.handle(ipcContract.locations.getAll, async (input) => {
  // Input already validated by Zod
  const data = await getLocationsByWarehouse(input?.warehouseId)
  return success(data) // Output validated by Zod
})
```

#### 8. **Functional Backend Architecture (No Services)**
Backend should use pure functions and composition, no service layer:

```typescript
// ❌ BAD: Service layer (delete this)
// services/analysis-service.ts
export const performABCAnalysis = (...args) => {
  return runABCAnalysis(...args)  // Useless wrapper!
}

// ✅ GOOD: Direct function calls
// backend/analysis/abc.ts
import { getProductMovementTotals } from '../database/queries'
import type { Result } from '../types/result'

export const analyzeABC = (
  warehouseId: string,
  dateFrom?: string,
  dateTo?: string
): Result<ABCAnalysisResult, DatabaseError> => {
  // Pure function, no side effects
  const movements = getProductMovementTotals(warehouseId, 'outbound', dateFrom, dateTo)

  if (movements.length === 0) {
    return failure(databaseError('QUERY_FAILED', 'abc_analysis', 'No movements found'))
  }

  const analysis = computeABCClassification(movements)
  return success(analysis)
}

// Usage: Direct import, no service layer
import { analyzeABC } from './backend/analysis/abc'
const result = analyzeABC(warehouseId)
```

**Plugin Registry - Pure Functions:**
```typescript
// ❌ BAD: Global mutable state
export const registry: PluginRegistry = {}
export const registerPlugin = (plugin: ImportPlugin): void => {
  registry[plugin.id] = plugin  // Mutation!
}

// ✅ GOOD: Pure functions with readonly data
// backend/import/plugins/config.ts
import { genericExcelPlugin } from './generic-excel'
import { mockDataGeneratorPlugin } from './mock-data-generator'

const defaultPlugins: Readonly<Record<string, ImportPlugin>> = {
  [genericExcelPlugin.id]: genericExcelPlugin,
  [mockDataGeneratorPlugin.id]: mockDataGeneratorPlugin,
} as const

export const getPlugin = (id: string): ImportPlugin | undefined =>
  defaultPlugins[id]

export const listPlugins = (): readonly ImportPlugin[] =>
  Object.values(defaultPlugins)

export const withCustomPlugin = (
  plugin: ImportPlugin
): Readonly<Record<string, ImportPlugin>> => ({
  ...defaultPlugins,
  [plugin.id]: plugin,
})
```

**Generic Database Operations:**
```typescript
// ❌ BAD: 20 identical functions
export const insertWarehouses = (warehouses: readonly any[]): number => {
  return bulkInsert(warehousesTable, warehouses, (w) => ({...}), 'Warehouses')
}
export const insertUsers = (users: readonly any[]): number => {
  return bulkInsert(usersTable, users, (u) => ({...}), 'Users')
}
// ... 18 more

// ✅ GOOD: Single generic function with Zod validation
import type { Result } from '../types/result'
import { warehouseSchema } from '../schemas/warehouse'

export const bulkInsertValidated = <T>(
  table: Table,
  schema: z.ZodSchema<T>,
  data: readonly T[]
): Result<number, ValidationError> => {
  // Validate all data first
  const validation = schema.array().safeParse(data)
  if (!validation.success) {
    return failure(validationError('BULK_INSERT_FAILED', validation.error))
  }

  // Use Drizzle transaction
  const inserted = db.transaction((items: readonly T[]) => {
    return items.reduce((count, item) => {
      try {
        db.insert(table).values(item).run()
        return count + 1
      } catch (error) {
        // Log and return count (don't throw)
        logError('INSERT_FAILED', { table: table[Symbol.for('name')], error })
        return count
      }
    }, 0)
  })(validation.data)

  return success(inserted)
}

// Usage - type-safe and validated
const result = bulkInsertValidated(warehousesTable, warehouseSchema, warehouses)
```

---

## Affected Areas

### Frontend
- [ ] All route components (`locations.tsx`, `zones.tsx`, `sectors.tsx`, etc.)
- [ ] `useBackend()` hook
- [ ] `use-locations.ts` (all data fetching hooks)
- [ ] All `(window as any).electronAPI` accesses
- [ ] Error handling throughout frontend
- [ ] Navigation/redirects

### Backend
- [ ] Remove all `src/backend/services/*.ts` (fake service layer)
- [ ] `src/backend/import/plugins/registry.ts` (global mutable state)
- [ ] `src/backend/import/loader.ts` (code duplication, validation)
- [ ] `src/backend/import/mapping-service.ts` (TODO stubs)
- [ ] `src/backend/database/index.ts` (singleton, type safety)
- [ ] `src/backend/analysis/*.ts` (runtime requires)
- [ ] All `console.log` statements (replace with structured logging)
- [ ] All error handling (add Result types)


---

## Implementation Plan

### Phase 1: Foundation
1. **Define core types**
   - `Result<T, E>` type
   - `AppError` type
   - Error domains and codes

2. **Create Zod IPC contract**
   - Define all Zod schemas for entities (Location, Zone, Sector, etc.)
   - Create `ipcContract` with input/output schemas for all channels
   - Add type inference utilities (`IpcInput`, `IpcOutput`)
   - Implement `createIpcProxy()` with Zod validation

3. **Create IPC wrapper**
   - Implement `safeIpcCall()` with retry logic
   - Add structured logging
   - Replace all `(window as any).electronAPI` accesses with `ipc` proxy

### Phase 2: Backend Refactoring (Functional Approach)
1. **Remove fake service layer**
   - Delete all `src/backend/services/*.ts` files
   - Move functions directly where they're needed
   - No intermediate "service" layer

2. **Replace global mutable state**
   - Convert plugin registry to pure functions
   - Pass plugins as parameters instead of global mutation
   - Create `getPlugins()` function that returns readonly list

3. **Add data validation**
   - Create Zod schemas for all entities
   - Validate at boundaries (IPC, database, file parsing)
   - Return `Result<T, AppError>` from all operations

4. **Eliminate code duplication**
   - Create generic `bulkInsert` with entity schemas
   - Use generic types instead of repeating for each entity
   - Reduce `loader.ts` from 750+ lines to <200 lines

5. **Fix database singleton**
   - Replace global singleton with dependency injection
   - Pass database connection as parameter
   - Remove `any` types, use proper Drizzle types

6. **Replace runtime requires**
   - Convert `require()` to static ES6 imports
   - Make dependencies explicit and type-checked

7. **Remove TODO stubs**
   - Either implement or remove `saveMappingPreset`/`loadMappingPreset`
   - No half-implemented features in production

### Phase 3: Frontend Hooks
1. **Simplify hooks**
   - Remove "god hook" anti-pattern
   - Use IPC proxy directly through `ipc` object
   - Each hook calls `ipc.entities.xxx()` directly
   - Clear contract: `ipc.locations.getAll({ warehouseId })`

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

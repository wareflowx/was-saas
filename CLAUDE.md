# Development Guidelines - WAS SaaS

This document contains all architectural rules, patterns, and conventions for developing the WAS SaaS application with Electron, TypeScript, and SQLite.

## Core Principles

### 1. Functional Programming Only

**DO:**
- Use pure functions without side effects
- Use readonly types for immutability
- Use discriminated unions for error handling
- Compose functions instead of chaining methods
- Pass data as parameters, never use global mutable state

**DON'T:**
- Use classes or service layers
- Use object-oriented patterns
- Use mutable global state
- Use methods on objects
- Use dependency injection containers

### 2. Type Safety Is Mandatory

**DO:**
- Use `readonly` on all type properties
- Use `Readonly<T>` wrapper for objects
- Use `as const` on literals
- Use Zod schemas for runtime validation
- Never use `any` type

**DON'T:**
- Use `any` type
- Use type assertions `as any`
- Use mutable properties without `readonly`
- Bypass TypeScript's type checking

### 3. Explicit Error Handling

**DO:**
```typescript
// Use Result type for all operations that can fail
type Result<T, E = AppError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Helper functions
const success = <T>(data: T): Result<T> => ({ success: true, data })
const failure = <E>(error: E): Result<never, E> => ({ success: false, error })

// Usage
const getUser = (id: string): Result<User, AppError> => {
  const user = db.query.users.findFirst({ where: eq(users.id, id) })
  if (!user) return failure(userNotFound(id))
  return success(user)
}
```

**DON'T:**
```typescript
// ❌ Don't throw exceptions
throw new Error('User not found')

// ❌ Don't return null/undefined without explicit type
return null

// ❌ Don't use try/catch for control flow
try {
  return fetchUser()
} catch (error) {
  return null  // Error is swallowed!
}
```

---

## TypeScript Rules

### Types vs Interfaces

**ALWAYS use `type`, never `interface`:**

```typescript
// ✅ GOOD
type User = Readonly<{
  readonly id: string
  readonly name: string
  readonly email: string
}>

// ❌ BAD
interface User {
  id: string
  name: string
  email: string
}
```

### Union Types vs Enums

**ALWAYS use union types, never enums:**

```typescript
// ✅ GOOD
type Status = 'active' | 'inactive' | 'pending'
type MovementType = 'inbound' | 'outbound' | 'transfer' | 'adjustment'

// ❌ BAD
enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}
```

### Readonly Immutability

**ALWAYS use readonly for immutability:**

```typescript
// ✅ GOOD - individual properties
type Location = Readonly<{
  readonly id: string
  readonly code: string
  readonly zoneId: string
}>

// ✅ GOOD - wrapper
type Location = Readonly<{
  id: string
  code: string
  zoneId: string
}>

// ❌ BAD - mutable
type Location = {
  id: string
  code: string
  zoneId: string
}
```

---

## Error Handling

### Result Type Pattern

All functions that can fail MUST return `Result<T, E>`:

```typescript
// src/shared/types/result.ts
type Result<T, E = AppError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Composable helpers
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

// Usage example
const getLocation = (id: string): Result<Location, AppError> => {
  const location = db.query.locations.findFirst({
    where: eq(locations.id, id)
  })

  if (!location) {
    return failure(notFoundError('Location', id))
  }

  return success(location)
}

// Compose with map
const result = getLocation('loc-1')
const code = map(result, loc => loc.code)
```

### Error Type Definition

```typescript
// src/shared/types/error.ts
type ErrorDomain =
  | 'DATABASE'
  | 'IPC'
  | 'VALIDATION'
  | 'NETWORK'
  | 'BUSINESS'

type AppError = Readonly<{
  readonly domain: ErrorDomain
  readonly code: string
  readonly message: string
  readonly cause?: unknown
  readonly context?: Readonly<Record<string, unknown>>
  readonly timestamp: Date
  readonly recoverable: boolean
}>

// Error constructors (pure functions)
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

---

## Electron IPC Architecture

### Type-Safe IPC with Zod Contract

**DO:**

```typescript
// shared/ipc/contract.ts
import { z } from 'zod'

// Define schemas
const locationSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.string(),
  capacity: z.number().nullable(),
  status: z.string(),
})

const locationsDataSchema = z.object({
  locations: z.array(locationSchema),
  kpis: z.object({
    totalLocations: z.number(),
    availableLocations: z.number(),
  }),
})

// IPC contract - single source of truth
const ipcContract = {
  locations: {
    getAll: {
      input: z.object({
        warehouseId: z.string().optional()
      }).optional(),
      output: locationsDataSchema,
    },
    getById: {
      input: z.object({ id: z.string() }),
      output: locationSchema,
    },
  },
} as const

// Type inference
type IpcContract = typeof ipcContract
type IpcInput<T extends keyof IpcContract, M extends keyof IpcContract[T]> =
  z.infer<IpcContract[T][M]['input']>
type IpcOutput<T extends keyof IpcContract, M extends keyof IpcContract[T]> =
  z.output<IpcContract[T][M]['output']>

// Type-safe proxy
type IpcProxy<T extends IpcContract> = {
  readonly [K in keyof T]: {
    readonly [M in keyof T[K]]: (
      input: IpcInput<K, M>
    ) => Promise<Result<IpcOutput<K, M>, AppError>>
  }
}

const createIpcProxy = <T extends IpcContract>(
  channels: unknown
): IpcProxy<T> => {
  // Create recursive proxy with Zod validation
  return createProxy(channels, ipcContract)
}

// Usage in renderer
const ipc = createIpcProxy<IpcContract>(window.electronAPI)
const result = await ipc.locations.getAll({ warehouseId: 'WH-001' })
// Returns Result<LocationsData, AppError>
```

**DON'T:**

```typescript
// ❌ NEVER break type chain with (window as any)
const api = (window as any).electronAPI
const data = await api.locations.getAll(warehouseId)
// No type safety, no validation, nightmare

// ❌ NEVER use untyped IPC
window.electronAPI.send('get-locations', { warehouseId })
```

### IPC Handlers (Main Process)

```typescript
// backend/ipc/handlers/locations.ts
import type { Result } from '$shared/types/result'
import { success, failure } from '$shared/types/result'
import { databaseError } from '$shared/types/error'
import { getLocationsByWarehouse } from '../database/queries'

export const registerLocationHandlers = (
  ipcMain: Electron.IpcMain
): void => {
  ipcMain.handle('locations:getAll', async (event, input) => {
    try {
      // Input already validated by Zod in proxy
      const data = await getLocationsByWarehouse(input?.warehouseId)

      if (!data) {
        return failure(databaseError('QUERY', 'locations', 'No data found'))
      }

      return success(data)
    } catch (error) {
      return failure(databaseError('QUERY', 'locations', error))
    }
  })
}
```

---

## Backend Rules (Electron Main Process)

### No Service Layer

**DO: Direct function calls**

```typescript
// ✅ GOOD: Direct import and call
// backend/analysis/abc.ts
import { getProductMovementTotals } from '../database/queries'

export const analyzeABC = (
  warehouseId: string,
  dateFrom?: string,
  dateTo?: string
): Result<ABCAnalysisResult, DatabaseError> => {
  const movements = getProductMovementTotals(
    warehouseId,
    'outbound',
    dateFrom,
    dateTo
  )

  if (movements.length === 0) {
    return failure(databaseError('QUERY_FAILED', 'abc_analysis', 'No movements'))
  }

  const analysis = computeABCClassification(movements)
  return success(analysis)
}

// Usage
import { analyzeABC } from './backend/analysis/abc'
const result = analyzeABC(warehouseId)
```

**DON'T: Service wrapper**

```typescript
// ❌ BAD: Useless service layer
// services/analysis-service.ts
export const performABCAnalysis = (...args) => {
  return runABCAnalysis(...args)  // Just a wrapper!
}

// DELETE ALL -services/*.ts FILES
```

### Pure Functions, No Global State

**DO:**

```typescript
// ✅ GOOD: Pure plugin registry
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

**DON'T:**

```typescript
// ❌ BAD: Global mutable registry
export const registry: PluginRegistry = {}
export const registerPlugin = (plugin: ImportPlugin): void => {
  registry[plugin.id] = plugin  // Mutation!
}
```

### Static Imports, Not require()

**DO:**

```typescript
// ✅ GOOD: Static import
import { getProductMovementTotals } from '../database/queries'
import type { Result } from '$shared/types/result'

export const analyzeABC = (...): Result<ABCAnalysis, Error> => {
  const movements = getProductMovementTotals(...)
}
```

**DON'T:**

```typescript
// ❌ BAD: Runtime require
const { getProductMovementTotals } = require('../database/queries')
// Hides dependencies, no type checking
```

### Generic Operations, Not Code Duplication

**DO:**

```typescript
// ✅ GOOD: Generic validated insert
import type { Result } from '$shared/types/result'
import { warehouseSchema } from '$shared/schemas/warehouse'

export const bulkInsertValidated = <T>(
  table: Table,
  schema: z.ZodSchema<T>,
  data: readonly T[]
): Result<number, ValidationError> => {
  // Validate with Zod first
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
        logError('INSERT_FAILED', { table, error })
        return count  // Don't throw, just count
      }
    }, 0)
  })(validation.data)

  return success(inserted)
}

// Usage - single function for all entities
const warehouses = bulkInsertValidated(warehousesTable, warehouseSchema, data)
const zones = bulkInsertValidated(zonesTable, zoneSchema, data)
const products = bulkInsertValidated(productsTable, productSchema, data)
```

**DON'T:**

```typescript
// ❌ BAD: 20 identical functions
export const insertWarehouses = (warehouses: readonly any[]): number => {
  return bulkInsert(warehousesTable, warehouses, (w) => ({...}), 'Warehouses')
}
export const insertUsers = (users: readonly any[]): number => {
  return bulkInsert(usersTable, users, (u) => ({...}), 'Users')
}
export const insertZones = (zones: readonly any[]): number => {
  return bulkInsert(zonesTable, zones, (z) => ({...}), 'Zones')
}
// ... 17 more times
```

### Database Access

**DO:**

```typescript
// ✅ GOOD: Use Drizzle ORM with types
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

export const getLocationById = (id: string): Result<Location, DatabaseError> => {
  try {
    const location = db.query.locations.findFirst({
      where: eq(schema.locations.id, id)
    })

    if (!location) {
      return failure(databaseError('NOT_FOUND', 'locations', id))
    }

    return success(location)
  } catch (error) {
    return failure(databaseError('QUERY_FAILED', 'locations', error))
  }
}
```

**DON'T:**

```typescript
// ❌ BAD: Raw SQL returns any[]
export const getAllWarehouses = () => {
  const db = getDbRaw()
  return db
    .prepare('SELECT * FROM warehouses ORDER BY id')
    .all()  // Returns any[], no type safety!
}

// ❌ BAD: Global singleton with any
let sqliteDb: any | null = null  // ❌ any type
```

---

## Frontend Rules (Renderer Process)

### React Hooks

**DO:**

```typescript
// ✅ GOOD: Direct IPC calls through typed proxy
import { ipc } from './ipc/proxy'

export function useLocations(warehouseId?: string) {
  return useQuery({
    queryKey: ['locations', warehouseId],
    queryFn: () => ipc.locations.getAll({ warehouseId }),
  })
}
```

**DON'T:**

```typescript
// ❌ BAD: God hook
export function useBackend() {
  return {
    getLocations: () => ipcRenderer.invoke('get-locations'),
    getZones: () => ipcRenderer.invoke('get-zones'),
    // ... 50 more methods
  }
}
```

### Navigation

**DO:**

```typescript
// ✅ GOOD: Router loader or conditional render
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/locations')({
  beforeLoad: async ({ context }) => {
    const warehouses = await context.ipc.warehouses.getAll()

    if (warehouses.length === 0) {
      throw redirect({ to: '/onboarding/welcome' })
    }
  },
  component: Locations,
})
```

**DON'T:**

```typescript
// ❌ BAD: useEffect for navigation
useEffect(() => {
  if (warehouses?.length === 0) {
    navigate({ to: "/onboarding/welcome" })
  }
}, [warehouses, navigate])  // navigate changes on every render!
```

### Data Fetching

**DO:**

```typescript
// ✅ GOOD: Clear intent
const { data: zonesData } = useZones(undefined)  // All zones from all warehouses

// ✅ GOOD: Specific warehouse
const { data: zonesData } = useZones(warehouseId)  // Zones from specific warehouse
```

**DON'T:**

```typescript
// ❌ BAD: Confusing intent
const warehouses = useWarehouses()  // Called but result ignored
const data = useLocations(undefined)  // Why undefined? Get all? Get first?
const defaultWarehouseId = warehouses?.[0]?.id
const data = useLocations(defaultWarehouseId || undefined)  // ???
```

---

## Code Quality Rules

### Function Length

**Maximum 50 lines per function.**

If longer, extract smaller functions:

```typescript
// ❌ BAD: 131-line god function
export const loadToDatabase = (data: NormalizedData) => {
  if (data.warehouses?.length) {
    stats.warehousesImported = insertWarehouses(data.warehouses)
  }
  if (data.users?.length) {
    stats.usersImported = insertUsers(data.users)
  }
  // ... 20 more if blocks
}

// ✅ GOOD: Extract to array of operations
const entityLoaders = ReadonlyArray<{
  readonly key: keyof NormalizedData
  readonly loader: (data: readonly any[]) => number
}>([
  { key: 'warehouses', loader: insertWarehouses },
  { key: 'users', loader: insertUsers },
  // ...
])

export const loadToDatabase = (data: NormalizedData): ImportStats => {
  return entityLoaders.reduce((stats, { key, loader }) => {
    const items = data[key]
    if (items?.length) {
      stats[`${key}Imported`] = loader(items)
    }
    return stats
  }, {} as ImportStats)
}
```

### No TODOs in Production

**Never commit TODO stubs:**

```typescript
// ❌ BAD
export const saveMappingPreset = (preset: MappingPreset): void => {
  // TODO: Implement persistence to database
  console.log('Saving mapping preset:', preset.id)
}

// ✅ GOOD: Either implement or remove
// If not implemented, don't export the function
// Make it clear in planning, not in code
```

### No console.log in Production

**DO:**

```typescript
// ✅ GOOD: Structured logging
import { logger } from './utils/logger'

logger.info('Data imported', {
  warehouseId,
  rowsProcessed: stats.rowsProcessed,
  duration: stats.duration,
})

logger.error('Import failed', {
  error,
  warehouseId,
  pluginId,
})
```

**DON'T:**

```typescript
// ❌ BAD: console.log everywhere
console.log('🎲 [MOCK DATA] Starting generation...')
console.log('✅ [DB INSERT] Warehouses:', { inserted, total })
console.error('❌ [ERROR] Import failed:', error)
```

---

## Naming Conventions

### Be Consistent

**DO:**
- Use `camelCase` for all TypeScript variables and properties
- Use `PascalCase` for types and interfaces
- Use `UPPER_SNAKE_CASE` for constants
- Be consistent with verb prefixes: `get`, `find`, `create`, `update`, `delete`

```typescript
// ✅ GOOD: Consistent
getLocationsByWarehouse(warehouseId)
findProductById(productId)
createWarehouse(data)
updateLocationStatus(id, status)
deleteUser(id)

// ✅ GOOD: Clear prefixes
const isLoading = true
const hasError = false
const shouldRetry = true
```

**DON'T:**

```typescript
// ❌ BAD: Inconsistent verbs
performABCAnalysis(warehouseId)
runDeadStockAnalysis(warehouseId)
executeImport(filePath)  // perform, run, execute - pick one!

// ❌ BAD: Mixed conventions
warehouseId vs plugin_id  // camelCase vs snake_case
SCHEMAS vs ipcContract  // UPPER vs camelCase
```

---

## File Organization

### Folder Structure

```
src/
├── frontend/           # Renderer process code
│   ├── hooks/         # React hooks (no services!)
│   ├── routes/        # TanStack Router routes
│   └── components/    # React components
├── backend/           # Main process code
│   ├── database/      # Database queries
│   ├── analysis/      # Analysis functions (no services!)
│   ├── import/        # Import functions (no services!)
│   └── ipc/           # IPC handlers
├── shared/            # Shared types and utilities
│   ├── types/         # Type definitions
│   ├── schemas/       # Zod schemas
│   └── utils/         # Pure utility functions
└── main/              # Electron main entry point
```

### No Services Folder

**DELETE ALL services Folders:**

```
❌ src/backend/services/
   ├── plugin-service.ts      # DELETE
   ├── analysis-service.ts    # DELETE
   └── import-service.ts      # DELETE
```

Move functions directly where they're needed.

---

## Testing Strategy

### Pure Functions Are Easy to Test

```typescript
// ✅ GOOD: Pure function
export const analyzeABC = (
  warehouseId: string,
  dateFrom?: string,
  dateTo?: string
): Result<ABCAnalysisResult, DatabaseError> => {
  const movements = getProductMovementTotals(warehouseId, 'outbound', dateFrom, dateTo)
  // ...
}

// Easy to test
describe('analyzeABC', () => {
  it('should return ABC classification', () => {
    const result = analyzeABC('WH-001')
    expect(result.success).toBe(true)
    expect(result.data.products).toHaveLength(100)
  })
})
```

### No Global State = Easy Tests

```typescript
// ✅ GOOD: Pass dependencies
export const loadPlugins = (
  customPlugins?: Readonly<Record<string, ImportPlugin>>
): readonly ImportPlugin[] => {
  const allPlugins = customPlugins
    ? { ...defaultPlugins, ...customPlugins }
    : defaultPlugins

  return Object.values(allPlugins)
}

// Easy to test with mock plugins
test('loadPlugins with custom plugin', () => {
  const custom = { 'my-plugin': mockPlugin }
  const plugins = loadPlugins(custom)
  expect(plugins).toContain(mockPlugin)
})
```

---

## Migration Strategy

When migrating existing code:

1. **Start with types** - Add Result<T, E> return types
2. **Add Zod schemas** - Validate at boundaries
3. **Remove services** - Delete service wrappers
4. **Remove globals** - Pass as parameters
5. **Add validation** - Replace `any[]` with typed data
6. **Fix requires** - Convert to static imports
7. **Remove console.log** - Add structured logging
8. **Delete TODOs** - Implement or remove

---

## Summary Checklist

Before committing code, verify:

- [ ] No `any` types used
- [ ] No `interface` (use `type`)
- [ ] No `enum` (use union types)
- [ ] All properties are `readonly`
- [ ] All functions return `Result<T, E>` if they can fail
- [ ] No global mutable state
- [ ] No service layer (direct function calls)
- [ ] No classes (use functions and types)
- [ ] No runtime `require()` (use static imports)
- [ ] All data validated with Zod at boundaries
- [ ] No console.log (use structured logging)
- [ ] No TODO stubs
- [ ] Functions < 50 lines
- [ ] No code duplication
- [ ] Consistent naming conventions
- [ ] No `(window as any)` (use typed IPC proxy)

---

## References

- [Railway-Oriented Programming](https://blog.ploeh.dk/amateurs-and-error-handling/)
- [Result Type Pattern](https://vicluck.medium.com/using-result-types-in-javascript-typescript-771be0f55b55)
- [Functional Programming Patterns](https://github.com/fpontencier/expression-oriented-api-examples)
- [Zod Validation](https://zod.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)

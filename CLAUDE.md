# Development Guidelines - WAS SaaS

Architectural rules and conventions for the WAS SaaS application (Electron + TypeScript + SQLite).

## Core Principles

### 1. Functional Programming Only

**DO:**
- Pure functions without side effects
- Readonly types for immutability
- Discriminated unions for error handling
- Function composition
- Pass data as parameters

**DON'T:**
- Classes or service layers
- Object-oriented patterns
- Mutable global state
- Methods on objects
- Dependency injection containers

### 2. Type Safety Is Mandatory

**DO:**
- Use `readonly` on all type properties or `Readonly<T>` wrapper
- Use `as const` on literals
- Zod schemas for runtime validation

**DON'T:**
- Use `any` type (EVER)
- Type assertions `as any`
- Mutable properties without `readonly`

### 3. Explicit Error Handling

All functions that can fail MUST return `Result<T, E>` discriminated union:

```typescript
type Result<T, E = AppError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }
```

## TypeScript Rules

### Types vs Interfaces vs Enums

**ALWAYS use `type` with union types, NEVER `interface` or `enum`:**

```typescript
// ✅ GOOD
type User = Readonly<{ id: string; name: string }>
type Status = 'active' | 'inactive' | 'pending'

// ❌ BAD
interface User { id: string }
enum Status { Active = 'active' }
```

### Readonly Immutability

All objects must be immutable:

```typescript
// ✅ GOOD
type Location = Readonly<{
  readonly id: string
  readonly code: string
}>

// ✅ GOOD (shorthand)
type Location = Readonly<{
  id: string
  code: string
}>

// ❌ BAD
type Location = { id: string; code: string }
```

## Error Handling

### Result Type Pattern

Every operation that can fail returns `Result<T, E>`:

```typescript
const success = <T>(data: T): Result<T> => ({ success: true, data })
const failure = <E>(error: E): Result<never, E> => ({ success: false, error })

// Usage
const getUser = (id: string): Result<User, AppError> => {
  const user = db.query.users.findFirst({ where: eq(users.id, id) })
  return user ? success(user) : failure(userNotFound(id))
}
```

### Error Type

```typescript
type ErrorDomain = 'DATABASE' | 'IPC' | 'VALIDATION' | 'NETWORK' | 'BUSINESS'

type AppError = Readonly<{
  readonly domain: ErrorDomain
  readonly code: string
  readonly message: string
  readonly cause?: unknown
  readonly context?: Readonly<Record<string, unknown>>
  readonly timestamp: Date
  readonly recoverable: boolean
}>
```

## Electron IPC Architecture

### Type-Safe IPC with Zod Contract

Single source of truth using Zod schemas:

```typescript
// shared/ipc/contract.ts
const ipcContract = {
  locations: {
    getAll: {
      input: z.object({ warehouseId: z.string().optional() }).optional(),
      output: locationsDataSchema,
    },
  },
} as const

// Type-safe proxy with validation
const ipc = createIpcProxy<IpcContract>(window.electronAPI)
const result = await ipc.locations.getAll({ warehouseId: 'WH-001' })
```

### NEVER Break Type Chain

```typescript
// ❌ FORBIDDEN
const api = (window as any).electronAPI
const data = await api.locations.getAll(warehouseId)
```

## Backend Rules (Main Process)

### No Service Layer

**Direct function calls only:**

```typescript
// ✅ GOOD
// backend/analysis/abc.ts
export const analyzeABC = (warehouseId: string): Result<ABCAnalysis, Error> => {
  const movements = getProductMovementTotals(warehouseId, 'outbound')
  return computeABCClassification(movements)
}

// ❌ BAD - DELETE ALL services/*.ts FILES
// services/analysis-service.ts
export const performABCAnalysis = (...args) => runABCAnalysis(...args)
```

### Pure Functions, No Global State

```typescript
// ✅ GOOD
const defaultPlugins: Readonly<Record<string, ImportPlugin>> = {
  [genericExcelPlugin.id]: genericExcelPlugin,
} as const

export const getPlugin = (id: string): ImportPlugin | undefined => defaultPlugins[id]

// ❌ BAD
export const registry: PluginRegistry = {}
export const registerPlugin = (plugin: ImportPlugin): void => {
  registry[plugin.id] = plugin  // Mutation!
}
```

### Static Imports Only

```typescript
// ✅ GOOD
import { getProductMovementTotals } from '../database/queries'

// ❌ BAD
const { getProductMovementTotals } = require('../database/queries')
```

### Generic Operations

**Eliminate code duplication with generic functions:**

```typescript
// ✅ GOOD - Single generic function
export const bulkInsertValidated = <T>(
  table: Table,
  schema: z.ZodSchema<T>,
  data: readonly T[]
): Result<number, ValidationError> => {
  const validation = schema.array().safeParse(data)
  if (!validation.success) return failure(validationError(...))

  const inserted = db.transaction((items) =>
    items.reduce((count, item) => {
      try {
        db.insert(table).values(item).run()
        return count + 1
      } catch (error) {
        logError('INSERT_FAILED', { table, error })
        return count
      }
    }, 0)
  )(validation.data)

  return success(inserted)
}

// Usage - no duplication
bulkInsertValidated(warehousesTable, warehouseSchema, data)
bulkInsertValidated(zonesTable, zoneSchema, data)
```

```typescript
// ❌ BAD - 20 identical functions
export const insertWarehouses = (warehouses: readonly any[]): number => {
  return bulkInsert(warehousesTable, warehouses, (w) => ({...}), 'Warehouses')
}
export const insertUsers = (users: readonly any[]): number => {
  return bulkInsert(usersTable, users, (u) => ({...}), 'Users')
}
// ... 18 more times
```

### Database Access

```typescript
// ✅ GOOD - Use Drizzle with types
import { drizzle } from 'drizzle-orm/better-sqlite3'

export const getLocationById = (id: string): Result<Location, DatabaseError> => {
  const location = db.query.locations.findFirst({ where: eq(schema.locations.id, id) })
  return location ? success(location) : failure(databaseError('NOT_FOUND', 'locations', id))
}

// ❌ BAD - Raw SQL returns any[]
export const getAllWarehouses = () => {
  return db.prepare('SELECT * FROM warehouses').all()  // any[]!
}

// ❌ BAD - Global singleton with any
let sqliteDb: any | null = null
```

## Frontend Rules (Renderer Process)

### React Hooks

```typescript
// ✅ GOOD - Direct IPC through typed proxy
import { ipc } from './ipc/proxy'

export function useLocations(warehouseId?: string) {
  return useQuery({
    queryKey: ['locations', warehouseId],
    queryFn: () => ipc.locations.getAll({ warehouseId }),
  })
}

// ❌ BAD - God hook
export function useBackend() {
  return {
    getLocations: () => ipcRenderer.invoke('get-locations'),
    getZones: () => ipcRenderer.invoke('get-zones'),
    // ... 50 more methods
  }
}
```

### Navigation

```typescript
// ✅ GOOD - Router loader
export const Route = createFileRoute('/locations')({
  beforeLoad: async ({ context }) => {
    const warehouses = await context.ipc.warehouses.getAll()
    if (warehouses.length === 0) {
      throw redirect({ to: '/onboarding/welcome' })
    }
  },
})

// ❌ BAD - useEffect for navigation
useEffect(() => {
  if (warehouses?.length === 0) {
    navigate({ to: "/onboarding/welcome" })
  }
}, [warehouses, navigate])
```

### Data Fetching Clarity

```typescript
// ✅ GOOD - Clear intent
useZones(undefined)  // All zones from all warehouses
useZones(warehouseId)  // Zones from specific warehouse

// ❌ BAD - Confusing
const warehouses = useWarehouses()  // Result ignored
const data = useLocations(undefined)  // Why undefined?
```

## Code Quality Rules

### Function Length

**Maximum 50 lines.** Extract smaller functions if longer.

### No TODOs in Production

Either implement or remove. Don't commit stub functions.

### No console.log in Production

Use structured logging instead:

```typescript
// ✅ GOOD
logger.info('Data imported', { warehouseId, rowsProcessed, duration })
logger.error('Import failed', { error, warehouseId })

// ❌ BAD
console.log('🎲 [MOCK DATA] Starting...')
console.error('❌ [ERROR] Import failed:', error)
```

## Naming Conventions

**Be consistent:**

- `camelCase` for variables and properties
- `PascalCase` for types
- `UPPER_SNAKE_CASE` for constants
- Consistent verb prefixes: `get`, `find`, `create`, `update`, `delete`
- Consistent boolean prefixes: `is`, `has`, `should`

```typescript
// ✅ GOOD
getLocationsByWarehouse(warehouseId)
findProductById(productId)
const isLoading = true
const hasError = false

// ❌ BAD
performABCAnalysis(warehouseId)
runDeadStockAnalysis(warehouseId)
warehouseId vs plugin_id  // Mixed conventions
```

## File Organization

**No services folder:**

```
src/
├── frontend/           # Renderer (hooks, routes, components)
├── backend/           # Main process
│   ├── database/      # Queries
│   ├── analysis/      # Analysis functions
│   ├── import/        # Import functions
│   └── ipc/           # IPC handlers
├── shared/            # Types, schemas, utils
└── main/              # Electron entry point

❌ DELETE: src/backend/services/*.ts
```

## Testing Strategy

### Pure Functions Are Testable

```typescript
// Pure function = easy test
export const analyzeABC = (warehouseId: string): Result<ABCAnalysis, Error> => {
  const movements = getProductMovementTotals(warehouseId, 'outbound')
  return computeABCClassification(movements)
}

// Test
expect(analyzeABC('WH-001').success).toBe(true)
```

### No Global State = Mockable

```typescript
// Pass dependencies for testability
export const loadPlugins = (
  customPlugins?: Readonly<Record<string, ImportPlugin>>
): readonly ImportPlugin[] => {
  const allPlugins = customPlugins
    ? { ...defaultPlugins, ...customPlugins }
    : defaultPlugins
  return Object.values(allPlugins)
}
```

## Pre-Commit Checklist

- [ ] No `any` types
- [ ] No `interface` (use `type`)
- [ ] No `enum` (use union types)
- [ ] All properties `readonly`
- [ ] Functions return `Result<T, E>` if they can fail
- [ ] No global mutable state
- [ ] No service layer
- [ ] No classes
- [ ] No runtime `require()` (static imports only)
- [ ] Data validated with Zod at boundaries
- [ ] No console.log (structured logging)
- [ ] No TODO stubs
- [ ] Functions < 50 lines
- [ ] No code duplication
- [ ] Consistent naming
- [ ] No `(window as any)` (use typed IPC proxy)

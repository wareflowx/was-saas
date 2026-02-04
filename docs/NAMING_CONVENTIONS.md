# Naming Conventions Guide

This document defines the standard naming conventions used throughout the Wareflow SaaS application.

## General Principles

- **Be consistent** - Follow the established patterns
- **Be explicit** - Names should clearly indicate what they represent
- **Be concise but clear** - Avoid unnecessary abbreviations
- **Use English** - All code, comments, and documentation should be in English

## File and Directory Naming

### Directories
- **Format:** `kebab-case` (lowercase with hyphens)
- **Examples:**
  - `src/components/`
  - `src/backend/database/`
  - `src/routes/onboarding/`

### Files
- **Components:** `PascalCase` for component files
  - `WarehousePage.tsx`
  - `AppSidebar.tsx`
- **Utilities/Helpers:** `kebab-case`
  - `use-locations.ts`
  - `api-client.ts`
  - `date-utils.ts`
- **Types:** `kebab-case` for type definition files
  - `entities.ts`
  - `enums.ts`
  - `api-types.ts`
- **Tests:** Same as file being tested with `.test` or `.spec` suffix
  - `use-locations.test.ts`
  - `WarehousePage.spec.tsx`

## Variable Naming

### Constants
- **Format:** `UPPER_SNAKE_CASE` for global constants
- **Examples:**
  ```typescript
  const DEFAULT_WAREHOUSE_ID = 'WH-DEFAULT'
  const MAX_RETRY_ATTEMPTS = 3
  const API_BASE_URL = 'https://api.example.com'
  ```

### Local Variables
- **Format:** `camelCase`
- **Examples:**
  ```typescript
  const warehouseId = 'WH-001'
  const zoneName = 'Storage Zone A'
  const isLoading = false
  ```

### Variables that hold DOM Elements
- **Prefix:** `str` for DOM nodes (legacy, not recommended in React)
- **Examples:**
  ```typescript
  const strUserElement = document.getElementById('user')
  ```

### Boolean Variables
- **Prefix:** `is`, `has`, `should`, `can`, `are`
- **Examples:**
  ```typescript
  const isLoading = true
  const hasPermission = false
  const shouldFetch = true
  const canDelete = false
  const areValid = true
  ```

### Functions
- **Format:** `camelCase`, starting with a verb
- **Examples:**
  ```typescript
  function getWarehouseById(id: string) { }
  function calculateOccupancyRate() { }
  function validateFormData() { }
  ```

### Async Functions
- **Prefix:** No special prefix needed, but name should imply async nature
- **Examples:**
  ```typescript
  async function fetchWarehouses() { }
  async function saveWarehouse(warehouse: Warehouse) { }
  ```

## TypeScript-Specific Naming

### Interfaces and Types
- **Format:** `PascalCase`
- **Examples:**
  ```typescript
  interface Warehouse { }
  type LocationStatus = 'active' | 'inactive'
  type Result<T, E> = { success: true; data: T } | { success: false; error: E }
  ```

### Type Parameters
- **Format:** Single letter or descriptive `PascalCase` for generic types
- **Examples:**
  ```typescript
  function identity<T>(value: T): T { }
  function map<T, U>(array: T[], fn: (item: T) => U): U[] { }
  interface Result<TData, TError> { }
  ```

### Enums
- **Format:** `PascalCase` for the enum name, `UPPER_SNAKE_CASE` for values
- **Examples:**
  ```typescript
  enum EntityStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
  }
  ```
  **Note:** In this codebase, we prefer const objects with `as const` over enums (see `src/shared/types/enums.ts`)

## React-Specific Naming

### Components
- **Format:** `PascalCase`
- **Examples:**
  ```typescript
  export function WarehousePage() { }
  export const AppSidebar: React.FC = () => { }
  ```

### Props
- **Format:** `camelCase`
- **Examples:**
  ```typescript
  interface Props {
    warehouseId: string
    onEdit: () => void
    isLoading: boolean
  }
  ```

### Hooks
- **Format:** `use` prefix + `PascalCase` for the hook name
- **Examples:**
  ```typescript
  function useWarehouses() { }
  function useLocations(warehouseId?: string) { }
  function useDashboardKPIs() { }
  ```

### Event Handlers
- **Format:** `handle` prefix + `PascalCase` for the action
- **Examples:**
  ```typescript
  const handleSubmit = () => { }
  const handleEdit = (id: string) => { }
  const handleWarehouseSelect = (warehouse: Warehouse) => { }
  ```

### Callback Props
- **Format:** `on` prefix + `PascalCase` for the event
- **Examples:**
  ```typescript
  interface Props {
    onEdit: () => void
    onSave: (data: Warehouse) => void
    onWarehouseChange: (warehouse: Warehouse) => void
  }
  ```

## Database-Specific Naming

### Tables
- **Format:** `snake_case` (database convention)
- **Examples:**
  ```sql
  CREATE TABLE warehouses ( )
  CREATE TABLE purchase_orders ( )
  CREATE TABLE picking_lines ( )
  ```

### Columns
- **Format:** `snake_case`
- **Examples:**
  ```sql
  warehouse_id TEXT PRIMARY KEY
  created_at TIMESTAMP
  updated_at TIMESTAMP
  total_quantity INTEGER
  ```

### Relationships
- **Foreign Key Naming:** `{table}_id`
- **Examples:**
  ```sql
  warehouse_id TEXT REFERENCES warehouses(id)
  zone_id TEXT REFERENCES zones(id)
  user_id TEXT REFERENCES users(id)
  ```

## API and IPC Naming

### IPC Channels
- **Format:** `domain:action` pattern with `camelCase` for the action
- **Examples:**
  ```typescript
  'warehouses:getAll'
  'products:getAll'
  'dashboard:getKPIs'
  'analysis:abc'
  'import:generate-mock-data'
  ```

### API Endpoints (when applicable)
- **Format:** RESTful resource naming with `kebab-case`
- **Examples:**
  ```
  GET /api/warehouses
  GET /api/warehouses/:id
  POST /api/warehouses
  PUT /api/warehouses/:id
  DELETE /api/warehouses/:id
  ```

## Class Names (if using classes)

- **Format:** `PascalCase`
- **Examples:**
  ```typescript
  class DatabaseManager { }
  class PluginRegistry { }
  class ValidationError { }
  ```

## Private Members (in classes)

- **Format:** `_camelCase` with underscore prefix
- **Examples:**
  ```typescript
  class DatabaseManager {
    private _connection: Database
    private _isConnected: boolean
  }
  ```

## Acronyms and Abbreviations

### In camelCase/PascalCase
- **Format:** Capitalize only the first letter
- **Examples:**
  - `Http` → `http`
  - `XML` → `Xml`
  - `SQL` → `Sql`
  - `ABC` → `Abc` (first letter capitalized)
  - `getByID` → `getById`
  - `parseHTMLFile` → `parseHtmlFile`

### In snake_case
- **Format:** All lowercase
- **Examples:**
  - `user_id` (not `user_ID`)
  - `xml_file` (not `XML_file`)
  - `abc_class` (not `ABC_class`)
  - `http_response` (not `HTTP_response`)

## Test File Naming

- **Format:** Same as source file + `.test.ts` or `.spec.ts`
- **Examples:**
  - `use-locations.ts` → `use-locations.test.ts`
  - `WarehousePage.tsx` → `WarehousePage.spec.tsx`
  - `utils/date.ts` → `utils/date.test.ts`

## Mock Data Naming

- **Format:** Descriptive `camelCase`
- **Examples:**
  ```typescript
  const testWarehouse = { }
  const mockUser = { }
  const sampleProduct = { }
  ```

## Configuration Files

- **Format:** `kebab-case` with consistent extension
- **Examples:**
  - `vite.config.ts`
  - `tsconfig.json`
  - `.eslintrc.json`
  - `docker-compose.yml`

## Environment Variables

- **Format:** `UPPER_SNAKE_CASE` with `APP_` prefix for app-specific variables
- **Examples:**
  ```bash
  APP_NAME=Wareflow
  APP_ENV=development
  DATABASE_URL=sqlite:///database.db
  API_TIMEOUT=30000
  ```

## Summary Table

| Category | Convention | Example |
|----------|------------|---------|
| Directories | `kebab-case` | `src/components/`, `src/backend/database/` |
| Files (code) | `kebab-case` | `use-locations.ts`, `api-client.ts` |
| Files (React) | `PascalCase` | `WarehousePage.tsx`, `AppSidebar.tsx` |
| Files (types) | `kebab-case` | `entities.ts`, `enums.ts` |
| Variables | `camelCase` | `warehouseId`, `isLoading` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRY_ATTEMPTS`, `API_BASE_URL` |
| Functions | `camelCase` | `getWarehouseById`, `calculateOccupancyRate` |
| Classes/Interfaces | `PascalCase` | `Warehouse`, `Location`, `Result` |
| Type Parameters | `PascalCase` | `T`, `TData`, `TError` |
| Enums (values) | `UPPER_SNAKE_CASE` | `ACTIVE`, `IN_PROGRESS` |
| Components | `PascalCase` | `DashboardPage`, `ZonesTable` |
| Hooks | `use` + `PascalCase` | `useWarehouses`, `useLocations` |
| Events | `on` + `PascalCase` | `onSave`, `onEdit`, `onSubmit` |
| Handlers | `handle` + `PascalCase` | `handleSubmit`, `handleEdit` |
| Booleans | `is/has/should/can` | `isLoading`, `hasPermission` |
| Tables (SQL) | `snake_case` | `warehouses`, `purchase_orders` |
| Columns (SQL) | `snake_case` | `warehouse_id`, `created_at` |
| IPC Channels | `domain:action` | `warehouses:getAll`, `dashboard:getKPIs` |
| Acronyms | Capitalize first | `http` not `HTTP`, `Sql` not `SQL` |

## Anti-Patterns to Avoid

❌ **Don't use:**
```typescript
const warehouse_id = 'WH-001'  // Wrong: snake_case in TypeScript
const WarehousesData = []     // Wrong: plural type name
const handle_get_warehouse()   // Wrong: underscores in function names
const getID()                  // Wrong: acronym all caps
const XMLParser = () => {}     // Wrong: acronym all caps (should be XmlParser)
```

✅ **Use instead:**
```typescript
const warehouseId = 'WH-001'   // Correct: camelCase in TypeScript
const warehouseData = []        // Correct: singular type name
const handleGetWarehouse()     // Correct: camelCase
const getId()                  // Correct: only first letter capitalized
const xmlParser = () => {}      // Correct: only first letter capitalized
```

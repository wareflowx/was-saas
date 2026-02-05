# Drizzle Schema Guidelines

## Table Definition

### Use sqliteTable for SQLite

Always use `sqliteTable` from `drizzle-orm/sqlite-core` for table definitions:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
})
```

### Column Naming

- Use TypeScript camelCase for column names
- Provide database column name as first argument if different from TS key
- Example: `text('first_name')` creates TS key `firstName` mapped to `first_name` in DB

### Primary Keys

- Always define primary keys explicitly
- Use `primaryKey({ autoIncrement: true })` for auto-incrementing IDs
- Use composite primary keys only when necessary

### Foreign Keys

- Define foreign keys using `.references()` method
- Use column reference syntax, not string values:

```typescript
// ✅ GOOD
warehouseId: integer('warehouse_id').references(() => warehouses.id)

// ❌ BAD
warehouseId: integer('warehouse_id').references('warehouses.id')
```

### Constraints

- Use `.notNull()` for required fields
- Use `.unique()` for unique constraints
- Define check constraints at table level when needed

## Schema Organization

### Single File Schema

For small projects, keep all tables in `src/backend/database/schema.ts`:

```typescript
// src/backend/database/schema.ts
export const users = sqliteTable('users', { ... })
export const warehouses = sqliteTable('warehouses', { ... })
export const products = sqliteTable('products', { ... })
```

### Multiple File Schema

For larger projects, organize by domain:

```
src/backend/database/schema/
├── users.ts
├── warehouses.ts
├── inventory.ts
└── index.ts (exports all)
```

### Exports

Always export table definitions for Drizzle Kit to detect them:

```typescript
// schema/index.ts
export * from './users'
export * from './warehouses'
```

## Type Inference

Use Drizzle's type inference instead of manual types:

```typescript
// ✅ GOOD - Use inferred types
type NewUser = typeof users.$inferInsert
type User = typeof users.$inferSelect

// ❌ BAD - Manual type definition
type User = {
  id: number
  name: string
  email: string
}
```

## Enum-like Columns

For enum-like values, use text columns with check constraints:

```typescript
export const users = sqliteTable('users', {
  role: text('role').notNull(), // 'admin' | 'manager' | 'operator'
})

// Define type separately
type UserRole = 'admin' | 'manager' | 'operator'
```

## Timestamps

Include timestamp columns for audit trail:

```typescript
export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}

// Use in tables
export const products = sqliteTable('products', {
  ...timestamps,
  // other columns
})
```

## Indexes

Define indexes for frequently queried columns:

```typescript
export const products = sqliteTable('products', {
  sku: text('sku').notNull(),
}, (table) => ({
  skuIdx: index('sku_idx').on(table.sku),
}))
```

# Drizzle Query Guidelines

## Database Connection

### Initialize Drizzle with better-sqlite3

```typescript
// src/backend/database/index.ts
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('was.db')
export const db = drizzle({ client: sqlite, schema })
```

### Single Instance

- Export a single `db` instance
- Never create multiple database connections
- Import this `db` instance throughout your backend code

## Query Patterns

### Select Queries

Use `db.select()` for retrieving data:

```typescript
// Get all users
const allUsers = await db.select().from(users)

// Get specific user
const user = await db.select().from(users).where(eq(users.id, userId))
```

### Insert Queries

Use `db.insert()` for creating records:

```typescript
// Single insert
await db.insert(users).values({ name: 'John', email: 'john@example.com' })

// Bulk insert
await db.insert(users).values([
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' },
])
```

### Update Queries

Use `db.update()` for modifying records:

```typescript
await db.update(users)
  .set({ name: 'John Doe' })
  .where(eq(users.id, userId))
```

### Delete Queries

Use `db.delete()` for removing records:

```typescript
await db.delete(users).where(eq(users.id, userId))
```

## Query Building

### Where Clauses

Use operators from `drizzle-orm`:

```typescript
import { eq, and, or, like, gt, lt } from 'drizzle-orm'

// Single condition
.where(eq(users.id, 1))

// Multiple conditions (AND)
.where(and(
  eq(users.role, 'admin'),
  gt(users.createdAt, new Date('2024-01-01'))
))

// OR conditions
.where(or(
  eq(users.role, 'admin'),
  eq(users.role, 'manager')
))
```

### Joins

```typescript
const result = await db.select()
  .from(users)
  .innerJoin(warehouses, eq(users.warehouseId, warehouses.id))
```

### Ordering and Limiting

```typescript
await db.select()
  .from(products)
  .orderBy(desc(products.createdAt))
  .limit(10)
```

## Transaction Safety

Use transactions for multi-step operations:

```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3'

const result = db.transaction((tx) => {
  const user = tx.insert(users).values({ ... })
  tx.insert(warehouses).values({ userId: user.lastInsertRowid, ... })
  return user
})
```

## Query Functions

### Pure Functions for Queries

Create reusable pure functions for common queries:

```typescript
// src/backend/database/queries/users.ts
import { eq } from 'drizzle-orm'
import { db } from '../index'
import { users } from '../schema'

export const getUserById = (id: number) => {
  const user = db.select().from(users).where(eq(users.id, id)).get()
  return user || null
}

export const getAllUsers = () => {
  return db.select().from(users).all()
}
```

### No Service Layer

- DO: Create query functions in `src/backend/database/queries/`
- DON'T: Create a service layer
- DON'T: Wrap queries in classes

### Error Handling

Wrap queries in try-catch and use Result type:

```typescript
import type { Result } from '@/shared/types'

export const getUserById = (id: number): Result<User, Error> => {
  try {
    const user = db.select().from(users).where(eq(users.id, id)).get()
    return user ? success(user) : failure(new Error('User not found'))
  } catch (error) {
    return failure(error as Error)
  }
}
```

## Performance

### Use Prepared Statements

better-sqlite3 automatically prepares statements. Reuse query functions instead of inline queries.

### Index Usage

Ensure columns used in `where` clauses are indexed:

```typescript
export const users = sqliteTable('users', {
  email: text('email').notNull(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}))
```

### Bulk Operations

Use bulk insert/update instead of loops:

```typescript
// ✅ GOOD
await db.insert(users).values(userDataArray)

// ❌ BAD
for (const user of userDataArray) {
  await db.insert(users).values(user)
}
```

## Relation Queries

### Use Relational Queries v2

Configure relations in separate file and use `db.query`:

```typescript
// src/backend/database/relations.ts
import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
  users: {
    warehouses: r.many.warehouses({
      from: r.users.id,
      to: r.warehouses.userId,
    }),
  },
}))

// db.ts
import { relations } from './relations'
export const db = drizzle({ client: sqlite, schema, relations })

// Usage
const usersWithWarehouses = await db.query.users.findMany({
  with: {
    warehouses: true,
  },
})
```

# Drizzle Migration Guidelines

## Configuration

### Create drizzle.config.ts

Place `drizzle.config.ts` in project root:

```typescript
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/backend/database/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './was.db',
  },
})
```

### Environment Variables

Never hardcode database paths. Use `.env`:

```bash
# .env
DATABASE_PATH=./was.db
```

```typescript
// drizzle.config.ts
dbCredentials: {
  url: process.env.DATABASE_PATH!,
}
```

## Migration Workflow

### Development Workflow

Use `drizzle-kit push` for rapid development:

```bash
# Apply schema changes directly to DB
pnpm drizzle-kit push
```

**Use this for:**
- Local development
- Prototyping
- Testing schema changes

**DO NOT use for:**
- Production deployments
- Team collaboration

### Production Workflow

Use migration files for production:

```bash
# Generate migration file
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate
```

### Migration Files

Migration files are stored in `drizzle/` directory:

```
drizzle/
├── 0001_initial.sql
├── 0002_add_warehouse_table.sql
├── meta/
│   ├── 0001.json
│   └── 0002.json
└── snapshot.json
```

## Migration Best Practices

### Descriptive Migration Names

Always use descriptive prefixes:

```bash
# ✅ GOOD
0001_initial_schema.sql
0002_add_users_table.sql
0003_add_warehouse_foreign_key.sql

# ❌ BAD
0001.sql
0002.sql
0003_update.sql
```

### Review Generated Migrations

Always review generated SQL before committing:

```sql
-- Review the generated SQL file
-- Ensure it matches your intent
-- Check for unintended destructive changes
```

### Version Control

- Always commit migration files
- Never modify existing migrations
- Create new migrations for changes

### Rollback Strategy

SQLite doesn't support ALTER TABLE well. For breaking changes:

```sql
-- 0004_rename_column.sql
-- Create new table
CREATE TABLE users_new (...);

-- Copy data
INSERT INTO users_new SELECT ... FROM users;

-- Drop old table
DROP TABLE users;

-- Rename new table
ALTER TABLE users_new RENAME TO users;
```

## Database Initialization

### Seed Data

Create seed script in `src/backend/database/seed.ts`:

```typescript
import { db } from './index'
import { users, warehouses } from './schema'

export const seed = () => {
  db.insert(users).values([
    { name: 'Admin', email: 'admin@was.com', role: 'admin' },
  ])
}
```

### Migration in Electron

Run migrations on app startup in main process:

```typescript
// electron/main.ts
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from '../backend/database'

app.whenReady().then(async () => {
  await migrate(db, { migrationsFolder: './drizzle' })
  createWindow()
})
```

## Drizzle Kit Commands

### Common Commands

```bash
# Push schema changes (dev only)
drizzle-kit push

# Generate migration
drizzle-kit generate

# Apply migrations
drizzle-kit migrate

# Pull schema from existing DB
drizzle-kit pull

# Open Studio UI
drizzle-kit studio

# View migrations
drizzle-kit migrate --custom
# Verify: true, dry run: false, silent: false
```

### NPM Scripts

Add convenience scripts to `package.json`:

```json
{
  "scripts": {
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/backend/database/seed.ts"
  }
}
```

## Schema Changes

### Non-Breaking Changes

Safe changes that can be done with `push`:

- Adding new tables
- Adding new columns (nullable or with default)
- Creating indexes
- Creating foreign keys

### Breaking Changes

Changes that require careful migration:

- Dropping columns
- Dropping tables
- Renaming columns
- Changing column types
- Adding NOT NULL to existing columns

For breaking changes, always use migration files and test thoroughly.

## Team Collaboration

### Schema Synchronization

When working in a team:

1. Pull latest changes
2. Run `drizzle-kit migrate` to apply new migrations
3. Make your schema changes
4. Generate new migration with `drizzle-kit generate`
5. Commit both schema and migration files
6. Push changes

### Conflict Resolution

If migration conflicts occur:

1. Compare migration files
2. Decide on the correct order
3. Renumber migrations if necessary
4. Test on clean database

## Testing

### Test Database

Use separate database for testing:

```typescript
// test/setup.ts
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const testDb = new Database(':memory:')
export const testDb = drizzle({ client: testDb })
```

### Cleanup After Tests

```typescript
afterEach(() => {
  testDb.close()
  fs.unlinkSync('test.db')
})
```

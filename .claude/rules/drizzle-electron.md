# Drizzle with Electron Guidelines

## Architecture

### Database Location

Store database file in app data directory, not project directory:

```typescript
// electron/main.ts
import { app } from 'electron'
import path from 'path'

const isDev = !app.isPackaged

const dbPath = isDev
  ? path.join(__dirname, '../was.db') // Dev: project root
  : path.join(app.getPath('userData'), 'was.db') // Prod: app data

const sqlite = new Database(dbPath)
```

### Database in Main Process Only

- ✅ DO: Initialize database in Electron main process
- ❌ DON'T: Access database directly from renderer process

## IPC Pattern

### Expose Database Functions via IPC

Create type-safe IPC endpoints for database operations:

```typescript
// backend/ipc/users.ts
import { ipcMain } from 'electron'
import * as usersQueries from '../database/queries/users'

export const registerUsersHandlers = () => {
  ipcMain.handle('users:getAll', async () => {
    return usersQueries.getAllUsers()
  })

  ipcMain.handle('users:getById', async (_, id: number) => {
    return usersQueries.getUserById(id)
  })
}
```

### Register Handlers in Main Process

```typescript
// electron/main.ts
import { registerUsersHandlers } from '../backend/ipc/users'

app.whenReady().then(() => {
  registerUsersHandlers()
  createWindow()
})
```

### Preload Script

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  users: {
    getAll: () => ipcRenderer.invoke('users:getAll'),
    getById: (id: number) => ipcRenderer.invoke('users:getById', id),
  },
})
```

### Type-Safe IPC Contract

```typescript
// shared/ipc/contract.ts
import { z } from 'zod'

const ipcContract = {
  users: {
    getAll: {
      input: z.undefined(),
      output: z.array(userSchema),
    },
    getById: {
      input: z.object({ id: z.number() }),
      output: userSchema,
    },
  },
} as const
```

## Database Initialization

### Run Migrations on Startup

```typescript
// electron/main.ts
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { db } from '../backend/database'

app.whenReady().then(async () => {
  // Run migrations
  await migrate(db, { migrationsFolder: './drizzle' })

  createWindow()
})
```

### Handle Migration Errors

```typescript
try {
  await migrate(db, { migrationsFolder: './drizzle' })
} catch (error) {
  console.error('Migration failed:', error)
  app.exit(1)
}
```

## Performance

### Single Database Instance

- Create one `db` instance in main process
- Export and reuse throughout backend code
- Never create multiple connections

```typescript
// backend/database/index.ts
let dbInstance: DrizzleSQLiteDatabase | null = null

export const getDb = () => {
  if (!dbInstance) {
    const sqlite = new Database(getDatabasePath())
    dbInstance = drizzle({ client: sqlite, schema })
  }
  return dbInstance
}
```

### Asynchronous Operations

All database operations in main process should be async to avoid blocking UI:

```typescript
ipcMain.handle('users:getAll', async () => {
  // Use await even though better-sqlite3 is sync
  // This keeps the operation non-blocking
  const users = await db.select().from(usersTable).all()
  return users
})
```

## Error Handling

### IPC Error Propagation

Errors in IPC handlers are automatically serialized and sent to renderer:

```typescript
ipcMain.handle('users:create', async (_, userData) => {
  try {
    const user = await db.insert(users).values(userData).returning()
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
```

### Use Result Type

Prefer Result type over try-catch in query functions:

```typescript
// backend/database/queries/users.ts
export const createUser = (data: NewUser): Result<User, Error> => {
  try {
    const user = db.insert(users).values(data).returning().get()
    return success(user)
  } catch (error) {
    return failure(error as Error)
  }
}
```

## Development vs Production

### Development Mode

- Use database in project root
- Enable verbose logging
- Use Drizzle Studio for inspection

```typescript
if (isDev) {
  app.commandLine.appendSwitch('enable-logging')
  // Open DevTools
  mainWindow.webContents.openDevTools()
}
```

### Production Mode

- Store database in app data directory
- Disable logging
- Use prepared statements only

## Database Backup

### Backup Functionality

```typescript
// backend/database/backup.ts
import fs from 'fs'
import path from 'path'

export const backupDatabase = (backupPath: string) => {
  const dbPath = getDatabasePath()
  fs.copyFileSync(dbPath, backupPath)
}
```

### Auto Backup on App Close

```typescript
app.on('before-quit', () => {
  const backupPath = path.join(app.getPath('userData'), `backup-${Date.now()}.db`)
  backupDatabase(backupPath)
})
```

## Schema Updates

### Hot Reload in Development

When schema changes in development:

1. Update schema files
2. Run `drizzle-kit push`
3. Restart Electron app
4. Vite plugin will rebuild and reload

### Production Updates

For production schema updates:

1. Generate migration files
2. Include migrations in app update
3. Migrations run automatically on app startup
4. Handle migration failures gracefully

## Security

### SQL Injection Prevention

- Always use Drizzle query builder
- Never use raw SQL with user input
- Validate input with Zod schemas

### File Permissions

Set appropriate permissions on database file:

```typescript
import fs from 'fs'

const dbPath = getDatabasePath()
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '')
  fs.chmodSync(dbPath, 0o600) // Read/write for owner only
}
```

## Testing

### Mock IPC in Tests

```typescript
// test/utils/mock-ipc.ts
export const mockElectronAPI = {
  users: {
    getAll: async () => mockUsers,
    getById: async (id: number) => mockUsers.find(u => u.id === id),
  },
}
```

### Test Database

Use in-memory database for tests:

```typescript
const testDb = new Database(':memory:')
const testClient = drizzle({ client: testDb, schema })
```

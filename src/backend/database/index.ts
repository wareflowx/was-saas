/**
 * Database connection and initialization using Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { app } from 'electron'
import * as schema from './drizzle-schema'
import { DATABASE_SCHEMA, getDatabasePath, SCHEMA_VERSION } from './schema'

// ============================================================================
// SINGLETON DATABASE INSTANCE
// ============================================================================

let db: ReturnType<typeof drizzle<typeof schema>> | null = null
let sqliteDb: Database.Database | null = null

/**
 * Get or create database instance
 * @returns Drizzle database instance
 */
export const getDatabase = () => {
  if (db) return db

  // Get user data path from Electron
  const userDataPath = app.getPath('userData')
  const dbPath = getDatabasePath(userDataPath)

  // Create SQLite database connection
  sqliteDb = new Database(dbPath)

  // Enable foreign keys
  sqliteDb.pragma('foreign_keys = ON')

  // Enable WAL mode for better concurrent read performance
  sqliteDb.pragma('journal_mode = WAL')

  // Initialize schema if needed
  initializeSchema(sqliteDb)

  // Create Drizzle ORM instance
  db = drizzle(sqliteDb, { schema })

  return db
}

/**
 * Initialize database schema
 * Creates all tables if they don't exist
 */
function initializeSchema(sqlite: Database.Database) {
  // Check if warehouses table exists
  const tableExists = sqlite
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`
    )
    .get()

  if (!tableExists) {
    console.log('🔧 Initializing database schema...')
    sqlite.exec(DATABASE_SCHEMA)
    console.log('✅ Database schema initialized')
  }
}

/**
 * Close database connection
 */
export const closeDatabase = () => {
  if (sqliteDb) {
    sqliteDb.close()
    db = null
    sqliteDb = null
  }
}

/**
 * Get database file path for logging/debugging
 * @returns Absolute path to database file
 */
export const getDatabaseFilePath = (): string => {
  const userDataPath = app.getPath('userData')
  return getDatabasePath(userDataPath)
}

/**
 * Vacuum database to reclaim unused space
 * Should be called periodically (e.g., on app exit)
 */
export const vacuumDatabase = (): void => {
  const sqlite = getDbRaw()
  sqlite.exec('VACUUM')
}

/**
 * Get database statistics
 * @returns Object with database stats
 */
export const getDatabaseStats = () => {
  const sqlite = getDbRaw()

  const tableCount = sqlite
    .prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
    .get() as { count: number }

  const databaseSize = sqlite
    .prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()')
    .get() as { size: number }

  return {
    tables: tableCount.count,
    sizeBytes: databaseSize.size,
    sizeMB: Math.round((databaseSize.size / 1024 / 1024) * 100) / 100,
  }
}

/**
 * Get raw SQLite database instance
 * For direct SQL queries when needed
 */
export const getDbRaw = () => {
  if (!sqliteDb) {
    const userDataPath = app.getPath('userData')
    const dbPath = getDatabasePath(userDataPath)
    sqliteDb = new Database(dbPath)
    sqliteDb.pragma('foreign_keys = ON')
    sqliteDb.pragma('journal_mode = WAL')
  }
  return sqliteDb
}

/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export const initializeDatabase = (): void => {
  const sqlite = getDbRaw()

  // Check if warehouses table exists
  const tableExists = sqlite
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`
    )
    .get()

  if (!tableExists) {
    console.log('🔧 Initializing database schema...')
    sqlite.exec(DATABASE_SCHEMA)
    console.log('✅ Database schema initialized')
  }

  // Log schema version
  const schemaVersion = sqlite
    .prepare('PRAGMA schema_version')
    .get() as { schema_version: number }

  console.log(`Database initialized. Schema version: ${schemaVersion.schema_version}, expected: ${SCHEMA_VERSION}`)
}

/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns True if warehouse exists
 */
export const warehouseExists = (warehouseId: string): boolean => {
  const database = getDatabase()
  const result = database
    .select({ count: schema.warehouses.id })
    .from(schema.warehouses)
    .where(eq(schema.warehouses.id, warehouseId))
    .get()

  return result !== undefined
}

/**
 * Get all warehouses
 * @returns Array of all warehouses
 */
export const getAllWarehouses = () => {
  const database = getDatabase()
  return database
    .select()
    .from(schema.warehouses)
    .orderBy(schema.warehouses.name)
    .all()
}

/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Created warehouse
 */
export const createWarehouse = (warehouse: {
  id: string
  code: string
  name: string
  city: string
  country: string
  surface?: number
  capacity?: number
  manager?: string
  email?: string
  phone?: string
}) => {
  const database = getDatabase()

  database
    .insert(schema.warehouses)
    .values({
      id: warehouse.id,
      code: warehouse.code,
      name: warehouse.name,
      city: warehouse.city,
      country: warehouse.country,
      surface: warehouse.surface,
      capacity: warehouse.capacity,
      manager: warehouse.manager,
      email: warehouse.email,
      phone: warehouse.phone,
      status: 'active',
      openingDate: new Date().toISOString(),
    })
    .run()

  return database
    .select()
    .from(schema.warehouses)
    .where(eq(schema.warehouses.id, warehouse.id))
    .get()
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './drizzle-schema'
export { DATABASE_SCHEMA, getDatabasePath, DEFAULT_WAREHOUSE_ID } from './schema'

// Import eq helper for queries
import { eq } from 'drizzle-orm'

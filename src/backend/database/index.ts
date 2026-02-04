/**
 * Database connection and initialization using Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database, { Database as DatabaseType } from 'better-sqlite3'
import { app } from 'electron'
import * as schema from './drizzle-schema'
import { DATABASE_SCHEMA, getDatabasePath, SCHEMA_VERSION } from './schema'
import type { Result, AppError } from '../../shared/types'
import { success, failure, databaseError } from '../../shared/types'
import { logger } from '../../shared/utils/logger'

// ============================================================================
// SINGLETON DATABASE INSTANCES
// ============================================================================

let sqliteDb: DatabaseType | null = null
let drizzleDb: ReturnType<typeof drizzle> | null = null

/**
 * Get or create raw SQLite database instance
 * @returns Raw SQLite database instance
 */
const getOrCreateSqliteDb = (): DatabaseType => {
  if (sqliteDb) {
    return sqliteDb
  }

  // Get user data path from Electron
  const userDataPath = app.getPath('userData')
  const dbPath = getDatabasePath(userDataPath)

  logger.info('Creating database connection', { dbPath })

  // Create SQLite database connection
  sqliteDb = new Database(dbPath)

  // Enable foreign keys
  sqliteDb.pragma('foreign_keys = ON')

  // Enable WAL mode for better concurrent read performance
  sqliteDb.pragma('journal_mode = WAL')

  // Initialize schema if needed
  initializeSchema(sqliteDb)

  logger.info('Database connection established')

  return sqliteDb
}

/**
 * Get or create Drizzle ORM instance
 * @returns Drizzle database instance
 */
export const getDatabase = () => {
  if (drizzleDb) {
    return drizzleDb
  }

  const sqlite = getOrCreateSqliteDb()
  drizzleDb = drizzle(sqlite, { schema })

  return drizzleDb
}

/**
 * Initialize database schema
 * Creates all tables if they don't exist
 */
function initializeSchema(sqlite: DatabaseType) {
  // Check if warehouses table exists
  const tableExists = sqlite
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`
    )
    .get()

  if (!tableExists) {
    logger.info('Initializing database schema...')
    sqlite.exec(DATABASE_SCHEMA)
    logger.info('Database schema initialized')
  }
}

/**
 * Close database connection
 */
export const closeDatabase = (): Result<void, AppError> => {
  try {
    if (sqliteDb) {
      sqliteDb.close()
      sqliteDb = null
      drizzleDb = null
      logger.info('Database connection closed')
    }
    return success(undefined)
  } catch (error) {
    return failure(databaseError('CLOSE', 'database', error))
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
export const vacuumDatabase = (): Result<void, AppError> => {
  try {
    const sqlite = getDbRaw()
    sqlite.exec('VACUUM')
    logger.info('Database vacuumed successfully')
    return success(undefined)
  } catch (error) {
    return failure(databaseError('VACUUM', 'database', error))
  }
}

/**
 * Get database statistics
 * @returns Object with database stats
 */
export const getDatabaseStats = (): Result<{
  tables: number
  sizeBytes: number
  sizeMB: number
}, AppError> => {
  try {
    const sqlite = getDbRaw()

    const tableCount = sqlite
      .prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
      .get() as { count: number }

    const databaseSize = sqlite
      .prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()')
      .get() as { size: number }

    return success({
      tables: tableCount.count,
      sizeBytes: databaseSize.size,
      sizeMB: Math.round((databaseSize.size / 1024 / 1024) * 100) / 100,
    })
  } catch (error) {
    return failure(databaseError('QUERY', 'database', error))
  }
}

/**
 * Get raw SQLite database instance
 * For direct SQL queries when needed
 */
export const getDbRaw = (): DatabaseType => {
  return getOrCreateSqliteDb()
}

/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export const initializeDatabase = (): Result<void, AppError> => {
  try {
    const sqlite = getDbRaw()

    // Check if warehouses table exists
    const tableExists = sqlite
      .prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`
      )
      .get()

    if (!tableExists) {
      logger.info('Initializing database schema...')
      sqlite.exec(DATABASE_SCHEMA)
      logger.info('Database schema initialized')
    }

    // Log schema version
    const schemaVersion = sqlite
      .prepare('PRAGMA schema_version')
      .get() as { schema_version: number }

    logger.info('Database initialized', {
      schemaVersion: schemaVersion.schema_version,
      expectedVersion: SCHEMA_VERSION,
    })

    return success(undefined)
  } catch (error) {
    return failure(databaseError('INITIALIZE', 'database', error))
  }
}

/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns Result with boolean
 */
export const warehouseExists = (warehouseId: string): Result<boolean, AppError> => {
  try {
    const db = getDbRaw()
    const result = db
      .prepare('SELECT COUNT(*) as count FROM warehouses WHERE id = ?')
      .get(warehouseId) as { count: number }

    return success(result.count > 0)
  } catch (error) {
    return failure(databaseError('QUERY', 'warehouses', error))
  }
}

/**
 * Get all warehouses
 * @returns Result with array of all warehouses
 */
export const getAllWarehouses = (): Result<any[], AppError> => {
  try {
    const db = getDbRaw()
    // Order by id to ensure consistent ordering (WH-FR-01 first)
    const warehouses = db
      .prepare('SELECT * FROM warehouses ORDER BY id')
      .all()

    return success(warehouses)
  } catch (error) {
    return failure(databaseError('QUERY', 'warehouses', error))
  }
}

/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Result with created warehouse
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
}): Result<any, AppError> => {
  try {
    const db = getDbRaw()

    const stmt = db.prepare(`
      INSERT INTO warehouses (
        id, code, name, city, country, surface, capacity,
        manager, email, phone, status, opening_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `)

    stmt.run(
      warehouse.id,
      warehouse.code,
      warehouse.name,
      warehouse.city,
      warehouse.country,
      warehouse.surface || null,
      warehouse.capacity || null,
      warehouse.manager || null,
      warehouse.email || null,
      warehouse.phone || null,
      'active'
    )

    const created = db
      .prepare('SELECT * FROM warehouses WHERE id = ?')
      .get(warehouse.id)

    logger.info('Warehouse created', { warehouseId: warehouse.id })

    return success(created)
  } catch (error) {
    return failure(databaseError('INSERT', 'warehouses', error))
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from './drizzle-schema'
export { DATABASE_SCHEMA, getDatabasePath, DEFAULT_WAREHOUSE_ID } from './schema'

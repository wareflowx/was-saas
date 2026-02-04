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
// TYPES
// ============================================================================

/**
 * Database class encapsulating both SQLite and Drizzle connections
 * Supports dependency injection pattern
 */
export class Database {
  private readonly sqlite: DatabaseType
  private readonly drizzle: ReturnType<typeof drizzle>

  private constructor(sqlite: DatabaseType) {
    this.sqlite = sqlite
    this.drizzle = drizzle(sqlite, { schema })
  }

  /**
   * Create a new Database instance with schema initialization
   */
  static create(dbPath: string): Database {
    logger.info('Creating database connection', { dbPath })

    const sqlite = new Database(dbPath)

    // Enable foreign keys
    sqlite.pragma('foreign_keys = ON')

    // Enable WAL mode for better concurrent read performance
    sqlite.pragma('journal_mode = WAL')

    // Initialize schema if needed
    Database.initializeSchema(sqlite)

    logger.info('Database connection established')

    return new Database(sqlite)
  }

  /**
   * Initialize database schema
   */
  private static initializeSchema(sqlite: DatabaseType): void {
    const tableExists = sqlite
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`)
      .get()

    if (!tableExists) {
      logger.info('Initializing database schema...')
      sqlite.exec(DATABASE_SCHEMA)
      logger.info('Database schema initialized')
    }
  }

  /**
   * Get Drizzle ORM instance
   */
  getDrizzle(): ReturnType<typeof drizzle> {
    return this.drizzle
  }

  /**
   * Get raw SQLite instance
   */
  getSqlite(): DatabaseType {
    return this.sqlite
  }

  /**
   * Close database connection
   */
  close(): Result<void, AppError> {
    try {
      this.sqlite.close()
      logger.info('Database connection closed')
      return success(undefined)
    } catch (error) {
      return failure(databaseError('CLOSE', 'database', error))
    }
  }

  /**
   * Vacuum database to reclaim unused space
   */
  vacuum(): Result<void, AppError> {
    try {
      this.sqlite.exec('VACUUM')
      logger.info('Database vacuumed successfully')
      return success(undefined)
    } catch (error) {
      return failure(databaseError('VACUUM', 'database', error))
    }
  }

  /**
   * Get database statistics
   */
  getStats(): Result<{
    tables: number
    sizeBytes: number
    sizeMB: number
  }, AppError> {
    try {
      const tableCount = this.sqlite
        .prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
        .get() as { count: number }

      const databaseSize = this.sqlite
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
}

// ============================================================================
// LEGACY SINGLETON (for backward compatibility)
// ============================================================================

let legacyDatabase: Database | null = null

/**
 * Get or create singleton database instance
 * @deprecated Use dependency injection instead
 */
export const getDatabase = () => {
  if (legacyDatabase) {
    return legacyDatabase.getDrizzle()
  }

  const userDataPath = app.getPath('userData')
  const dbPath = getDatabasePath(userDataPath)

  legacyDatabase = Database.create(dbPath)

  return legacyDatabase.getDrizzle()
}

/**
 * Get raw SQLite database instance
 * @deprecated Use Database.getSqlite() instead
 */
export const getDbRaw = (): DatabaseType => {
  if (legacyDatabase) {
    return legacyDatabase.getSqlite()
  }

  const userDataPath = app.getPath('userData')
  const dbPath = getDatabasePath(userDataPath)

  legacyDatabase = Database.create(dbPath)

  return legacyDatabase.getSqlite()
}

/**
 * Close database connection
 * @deprecated Use Database.close() instead
 */
export const closeDatabase = (): Result<void, AppError> => {
  try {
    if (legacyDatabase) {
      legacyDatabase.close()
      legacyDatabase = null
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
 * @deprecated Use Database.vacuum() instead
 */
export const vacuumDatabase = (): Result<void, AppError> => {
  if (legacyDatabase) {
    return legacyDatabase.vacuum()
  }
  return success(undefined)
}

/**
 * Get database statistics
 * @deprecated Use Database.getStats() instead
 */
export const getDatabaseStats = (): Result<{
  tables: number
  sizeBytes: number
  sizeMB: number
}, AppError> => {
  if (legacyDatabase) {
    return legacyDatabase.getStats()
  }
  return failure(databaseError('QUERY', 'database', 'Database not initialized'))
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

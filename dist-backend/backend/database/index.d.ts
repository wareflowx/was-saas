/**
 * Database connection and initialization using Drizzle ORM
 */
import { Database as DatabaseType } from 'better-sqlite3';
import type { Result, AppError } from '../../shared/types';
/**
 * Get or create Drizzle ORM instance
 * @returns Drizzle database instance
 */
export declare const getDatabase: () => import("drizzle-orm/better-sqlite3").BetterSQLite3Database<Record<string, unknown>> & {
    $client: DatabaseType;
};
/**
 * Close database connection
 */
export declare const closeDatabase: () => Result<void, AppError>;
/**
 * Get database file path for logging/debugging
 * @returns Absolute path to database file
 */
export declare const getDatabaseFilePath: () => string;
/**
 * Vacuum database to reclaim unused space
 * Should be called periodically (e.g., on app exit)
 */
export declare const vacuumDatabase: () => Result<void, AppError>;
/**
 * Get database statistics
 * @returns Object with database stats
 */
export declare const getDatabaseStats: () => Result<{
    tables: number;
    sizeBytes: number;
    sizeMB: number;
}, AppError>;
/**
 * Get raw SQLite database instance
 * For direct SQL queries when needed
 */
export declare const getDbRaw: () => DatabaseType;
/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export declare const initializeDatabase: () => Result<void, AppError>;
/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns Result with boolean
 */
export declare const warehouseExists: (warehouseId: string) => Result<boolean, AppError>;
/**
 * Get all warehouses
 * @returns Result with array of all warehouses
 */
export declare const getAllWarehouses: () => Result<any[], AppError>;
/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Result with created warehouse
 */
export declare const createWarehouse: (warehouse: {
    id: string;
    code: string;
    name: string;
    city: string;
    country: string;
    surface?: number;
    capacity?: number;
    manager?: string;
    email?: string;
    phone?: string;
}) => Result<any, AppError>;
export * from './drizzle-schema';
export { DATABASE_SCHEMA, getDatabasePath, DEFAULT_WAREHOUSE_ID } from './schema';

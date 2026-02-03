/**
 * Database connection and initialization using Drizzle ORM
 */
import * as schema from './drizzle-schema';
/**
 * Get or create database instance
 * @returns Drizzle database instance
 */
export declare const getDatabase: () => import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof schema> & {
    $client: Database;
};
/**
 * Close database connection
 */
export declare const closeDatabase: () => void;
/**
 * Get database file path for logging/debugging
 * @returns Absolute path to database file
 */
export declare const getDatabaseFilePath: () => string;
/**
 * Vacuum database to reclaim unused space
 * Should be called periodically (e.g., on app exit)
 */
export declare const vacuumDatabase: () => void;
/**
 * Get database statistics
 * @returns Object with database stats
 */
export declare const getDatabaseStats: () => {
    tables: number;
    sizeBytes: number;
    sizeMB: number;
};
/**
 * Get raw SQLite database instance
 * For direct SQL queries when needed
 */
export declare const getDbRaw: () => any;
/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export declare const initializeDatabase: () => void;
/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns True if warehouse exists
 */
export declare const warehouseExists: (warehouseId: string) => boolean;
/**
 * Get all warehouses
 * @returns Array of all warehouses
 */
export declare const getAllWarehouses: () => any;
/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Created warehouse
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
}) => any;
export * from './drizzle-schema';
export { DATABASE_SCHEMA, getDatabasePath, DEFAULT_WAREHOUSE_ID } from './schema';

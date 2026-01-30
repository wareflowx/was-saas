import Database from 'better-sqlite3';
type Database = Database.Database;
/**
 * Get or create database connection
 * @returns Database connection
 */
export declare const getDatabase: () => Database;
/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export declare const initializeDatabase: () => void;
/**
 * Close database connection
 * Called when app is shutting down
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
 * @returns Created warehouse with generated ID
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
export {};
//# sourceMappingURL=index.d.ts.map
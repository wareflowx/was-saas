import Database from 'better-sqlite3';
import { app } from 'electron';
import { DATABASE_SCHEMA, getDatabasePath, SCHEMA_VERSION } from './schema';
// Database state
let db = null;
/**
 * Get or create database connection
 * @returns Database connection
 */
export const getDatabase = () => {
    if (db) {
        return db;
    }
    // Get user data path from Electron
    const userDataPath = app.getPath('userData');
    const dbPath = getDatabasePath(userDataPath);
    // Create database connection
    db = new Database(dbPath);
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    // Enable WAL mode for better concurrent read performance
    db.pragma('journal_mode = WAL');
    return db;
};
/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
export const initializeDatabase = () => {
    const database = getDatabase();
    // Execute schema
    database.exec(DATABASE_SCHEMA);
    // Store schema version
    const schemaVersion = database
        .prepare('SELECT version FROM pragma_schema_version()')
        .get();
    if (schemaVersion.version !== SCHEMA_VERSION) {
        console.log(`Database schema version: ${schemaVersion.version}, expected: ${SCHEMA_VERSION}`);
    }
};
/**
 * Close database connection
 * Called when app is shutting down
 */
export const closeDatabase = () => {
    if (db) {
        db.close();
        db = null;
    }
};
/**
 * Get database file path for logging/debugging
 * @returns Absolute path to database file
 */
export const getDatabaseFilePath = () => {
    const userDataPath = app.getPath('userData');
    return getDatabasePath(userDataPath);
};
/**
 * Vacuum database to reclaim unused space
 * Should be called periodically (e.g., on app exit)
 */
export const vacuumDatabase = () => {
    const database = getDatabase();
    database.exec('VACUUM');
};
/**
 * Get database statistics
 * @returns Object with database stats
 */
export const getDatabaseStats = () => {
    const database = getDatabase();
    const tableCount = database
        .prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
        .get();
    const databaseSize = database
        .prepare('SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()')
        .get();
    return {
        tables: tableCount.count,
        sizeBytes: databaseSize.size,
        sizeMB: Math.round((databaseSize.size / 1024 / 1024) * 100) / 100,
    };
};
/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns True if warehouse exists
 */
export const warehouseExists = (warehouseId) => {
    const database = getDatabase();
    const result = database
        .prepare('SELECT COUNT(*) as count FROM warehouses WHERE id = ?')
        .get(warehouseId);
    return result.count > 0;
};
/**
 * Get all warehouses
 * @returns Array of all warehouses
 */
export const getAllWarehouses = () => {
    const database = getDatabase();
    return database
        .prepare('SELECT * FROM warehouses ORDER BY name')
        .all();
};
/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Created warehouse with generated ID
 */
export const createWarehouse = (warehouse) => {
    const database = getDatabase();
    const stmt = database.prepare(`
    INSERT INTO warehouses (
      id, code, name, city, country, surface, capacity,
      manager, email, phone, status, opening_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
    stmt.run(warehouse.id, warehouse.code, warehouse.name, warehouse.city, warehouse.country, warehouse.surface || null, warehouse.capacity || null, warehouse.manager || null, warehouse.email || null, warehouse.phone || null, 'active');
    return database
        .prepare('SELECT * FROM warehouses WHERE id = ?')
        .get(warehouse.id);
};

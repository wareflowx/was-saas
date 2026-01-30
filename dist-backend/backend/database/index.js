"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWarehouse = exports.getAllWarehouses = exports.warehouseExists = exports.getDatabaseStats = exports.vacuumDatabase = exports.getDatabaseFilePath = exports.closeDatabase = exports.initializeDatabase = exports.getDatabase = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const electron_1 = require("electron");
const schema_1 = require("./schema");
// Database state
let db = null;
/**
 * Get or create database connection
 * @returns Database connection
 */
const getDatabase = () => {
    if (db) {
        return db;
    }
    // Get user data path from Electron
    const userDataPath = electron_1.app.getPath('userData');
    const dbPath = (0, schema_1.getDatabasePath)(userDataPath);
    // Create database connection
    db = new better_sqlite3_1.default(dbPath);
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    // Enable WAL mode for better concurrent read performance
    db.pragma('journal_mode = WAL');
    return db;
};
exports.getDatabase = getDatabase;
/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
const initializeDatabase = () => {
    const database = (0, exports.getDatabase)();
    // Execute schema
    database.exec(schema_1.DATABASE_SCHEMA);
    // Store schema version
    const schemaVersion = database
        .prepare('SELECT version FROM pragma_schema_version()')
        .get();
    if (schemaVersion.version !== schema_1.SCHEMA_VERSION) {
        console.log(`Database schema version: ${schemaVersion.version}, expected: ${schema_1.SCHEMA_VERSION}`);
    }
};
exports.initializeDatabase = initializeDatabase;
/**
 * Close database connection
 * Called when app is shutting down
 */
const closeDatabase = () => {
    if (db) {
        db.close();
        db = null;
    }
};
exports.closeDatabase = closeDatabase;
/**
 * Get database file path for logging/debugging
 * @returns Absolute path to database file
 */
const getDatabaseFilePath = () => {
    const userDataPath = electron_1.app.getPath('userData');
    return (0, schema_1.getDatabasePath)(userDataPath);
};
exports.getDatabaseFilePath = getDatabaseFilePath;
/**
 * Vacuum database to reclaim unused space
 * Should be called periodically (e.g., on app exit)
 */
const vacuumDatabase = () => {
    const database = (0, exports.getDatabase)();
    database.exec('VACUUM');
};
exports.vacuumDatabase = vacuumDatabase;
/**
 * Get database statistics
 * @returns Object with database stats
 */
const getDatabaseStats = () => {
    const database = (0, exports.getDatabase)();
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
exports.getDatabaseStats = getDatabaseStats;
/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns True if warehouse exists
 */
const warehouseExists = (warehouseId) => {
    const database = (0, exports.getDatabase)();
    const result = database
        .prepare('SELECT COUNT(*) as count FROM warehouses WHERE id = ?')
        .get(warehouseId);
    return result.count > 0;
};
exports.warehouseExists = warehouseExists;
/**
 * Get all warehouses
 * @returns Array of all warehouses
 */
const getAllWarehouses = () => {
    const database = (0, exports.getDatabase)();
    return database
        .prepare('SELECT * FROM warehouses ORDER BY name')
        .all();
};
exports.getAllWarehouses = getAllWarehouses;
/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Created warehouse with generated ID
 */
const createWarehouse = (warehouse) => {
    const database = (0, exports.getDatabase)();
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
exports.createWarehouse = createWarehouse;

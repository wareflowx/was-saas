"use strict";
/**
 * Database connection and initialization using Drizzle ORM
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_WAREHOUSE_ID = exports.getDatabasePath = exports.DATABASE_SCHEMA = exports.createWarehouse = exports.getAllWarehouses = exports.warehouseExists = exports.initializeDatabase = exports.getDbRaw = exports.getDatabaseStats = exports.vacuumDatabase = exports.getDatabaseFilePath = exports.closeDatabase = exports.getDatabase = void 0;
const better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
const better_sqlite3_2 = __importDefault(require("better-sqlite3"));
const electron_1 = require("electron");
const schema = __importStar(require("./drizzle-schema"));
const schema_1 = require("./schema");
// ============================================================================
// SINGLETON DATABASE INSTANCE
// ============================================================================
let sqliteDb = null;
/**
 * Get or create database instance
 * @returns Drizzle database instance
 */
const getDatabase = () => {
    if (sqliteDb) {
        return (0, better_sqlite3_1.drizzle)(sqliteDb, { schema });
    }
    // Get user data path from Electron
    const userDataPath = electron_1.app.getPath('userData');
    const dbPath = (0, schema_1.getDatabasePath)(userDataPath);
    // Create SQLite database connection
    sqliteDb = new better_sqlite3_2.default(dbPath);
    // Enable foreign keys
    sqliteDb.pragma('foreign_keys = ON');
    // Enable WAL mode for better concurrent read performance
    sqliteDb.pragma('journal_mode = WAL');
    // Initialize schema if needed
    initializeSchema(sqliteDb);
    // Create Drizzle ORM instance
    return (0, better_sqlite3_1.drizzle)(sqliteDb, { schema });
};
exports.getDatabase = getDatabase;
/**
 * Initialize database schema
 * Creates all tables if they don't exist
 */
function initializeSchema(sqlite) {
    // Check if warehouses table exists
    const tableExists = sqlite
        .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`)
        .get();
    if (!tableExists) {
        console.log('🔧 Initializing database schema...');
        sqlite.exec(schema_1.DATABASE_SCHEMA);
        console.log('✅ Database schema initialized');
    }
}
/**
 * Close database connection
 */
const closeDatabase = () => {
    if (sqliteDb) {
        sqliteDb.close();
        sqliteDb = null;
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
    const sqlite = (0, exports.getDbRaw)();
    sqlite.exec('VACUUM');
};
exports.vacuumDatabase = vacuumDatabase;
/**
 * Get database statistics
 * @returns Object with database stats
 */
const getDatabaseStats = () => {
    const sqlite = (0, exports.getDbRaw)();
    const tableCount = sqlite
        .prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'")
        .get();
    const databaseSize = sqlite
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
 * Get raw SQLite database instance
 * For direct SQL queries when needed
 */
const getDbRaw = () => {
    if (!sqliteDb) {
        const userDataPath = electron_1.app.getPath('userData');
        const dbPath = (0, schema_1.getDatabasePath)(userDataPath);
        sqliteDb = new better_sqlite3_2.default(dbPath);
        sqliteDb.pragma('foreign_keys = ON');
        sqliteDb.pragma('journal_mode = WAL');
        initializeSchema(sqliteDb);
    }
    return sqliteDb;
};
exports.getDbRaw = getDbRaw;
/**
 * Initialize database schema
 * Creates all tables and indexes if they don't exist
 */
const initializeDatabase = () => {
    const sqlite = (0, exports.getDbRaw)();
    // Check if warehouses table exists
    const tableExists = sqlite
        .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='warehouses'`)
        .get();
    if (!tableExists) {
        console.log('🔧 Initializing database schema...');
        sqlite.exec(schema_1.DATABASE_SCHEMA);
        console.log('✅ Database schema initialized');
    }
    // Log schema version
    const schemaVersion = sqlite
        .prepare('PRAGMA schema_version')
        .get();
    console.log(`Database initialized. Schema version: ${schemaVersion.schema_version}, expected: ${schema_1.SCHEMA_VERSION}`);
};
exports.initializeDatabase = initializeDatabase;
/**
 * Check if warehouse exists
 * @param warehouseId - Warehouse ID to check
 * @returns True if warehouse exists
 */
const warehouseExists = (warehouseId) => {
    const db = (0, exports.getDbRaw)();
    const result = db
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
    const db = (0, exports.getDbRaw)();
    // Order by id to ensure consistent ordering (WH-FR-01 first)
    return db
        .prepare('SELECT * FROM warehouses ORDER BY id')
        .all();
};
exports.getAllWarehouses = getAllWarehouses;
/**
 * Create a new warehouse
 * @param warehouse - Warehouse data
 * @returns Created warehouse
 */
const createWarehouse = (warehouse) => {
    const db = (0, exports.getDbRaw)();
    const stmt = db.prepare(`
    INSERT INTO warehouses (
      id, code, name, city, country, surface, capacity,
      manager, email, phone, status, opening_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
    stmt.run(warehouse.id, warehouse.code, warehouse.name, warehouse.city, warehouse.country, warehouse.surface || null, warehouse.capacity || null, warehouse.manager || null, warehouse.email || null, warehouse.phone || null, 'active');
    return db
        .prepare('SELECT * FROM warehouses WHERE id = ?')
        .get(warehouse.id);
};
exports.createWarehouse = createWarehouse;
// ============================================================================
// EXPORTS
// ============================================================================
__exportStar(require("./drizzle-schema"), exports);
var schema_2 = require("./schema");
Object.defineProperty(exports, "DATABASE_SCHEMA", { enumerable: true, get: function () { return schema_2.DATABASE_SCHEMA; } });
Object.defineProperty(exports, "getDatabasePath", { enumerable: true, get: function () { return schema_2.getDatabasePath; } });
Object.defineProperty(exports, "DEFAULT_WAREHOUSE_ID", { enumerable: true, get: function () { return schema_2.DEFAULT_WAREHOUSE_ID; } });

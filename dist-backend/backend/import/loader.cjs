"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadToDatabase = exports.insertMovements = exports.insertInventory = exports.insertLocations = exports.insertSectors = exports.insertZones = exports.insertProducts = void 0;
const index_1 = require("../database/index");
/**
 * Insert products into database
 * @param products - Array of products to insert
 * @returns Number of products inserted
 */
const insertProducts = (products) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, sku, name, description, category, subcategory, brand, unit,
      weight, volume, min_stock, max_stock, reorder_point, reorder_quantity,
      cost_price, selling_price, supplier, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
    let inserted = 0;
    const insertMany = db.transaction((products) => {
        for (const product of products) {
            try {
                stmt.run(product.id, product.sku, product.name, product.description || null, product.category, product.subcategory || null, product.brand || null, product.unit, product.weight || null, product.volume || null, product.minStock || null, product.maxStock || null, product.reorderPoint || null, product.reorderQuantity || null, product.costPrice || null, product.sellingPrice || null, product.supplier || null, product.status);
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting product ${product.sku}:`, error);
            }
        }
    });
    insertMany(products);
    return inserted;
};
exports.insertProducts = insertProducts;
/**
 * Insert zones into database
 * @param zones - Array of zones to insert
 * @returns Number of zones inserted
 */
const insertZones = (zones) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO zones (
      id, warehouse_id, code, name, type,
      surface, capacity, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
    let inserted = 0;
    const insertMany = db.transaction((zones) => {
        for (const zone of zones) {
            try {
                stmt.run(zone.id, zone.warehouseId, zone.code, zone.name, zone.type, zone.surface || null, zone.capacity || null, zone.status);
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting zone ${zone.code}:`, error);
            }
        }
    });
    insertMany(zones);
    return inserted;
};
exports.insertZones = insertZones;
/**
 * Insert sectors into database
 * @param sectors - Array of sectors to insert
 * @returns Number of sectors inserted
 */
const insertSectors = (sectors) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO sectors (
      id, warehouse_id, zone_id, code, name, type,
      capacity, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
    let inserted = 0;
    const insertMany = db.transaction((sectors) => {
        for (const sector of sectors) {
            try {
                stmt.run(sector.id, sector.warehouseId, sector.zoneId, sector.code, sector.name, sector.type, sector.capacity || null, sector.status);
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting sector ${sector.code}:`, error);
            }
        }
    });
    insertMany(sectors);
    return inserted;
};
exports.insertSectors = insertSectors;
/**
 * Insert locations into database
 * @param locations - Array of locations to insert
 * @returns Number of locations inserted
 */
const insertLocations = (locations) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO locations (
      id, warehouse_id, zone_id, sector_id, code, type,
      capacity, used_capacity, product_count, picker_count,
      aisle, level, position, barcode, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
    let inserted = 0;
    const insertMany = db.transaction((locations) => {
        for (const location of locations) {
            try {
                stmt.run(location.id, location.warehouseId, location.zoneId, location.sectorId, location.code, location.type, location.capacity || null, location.usedCapacity || null, location.productCount || null, location.pickerCount || null, location.aisle || null, location.level || null, location.position || null, location.barcode || null, location.status);
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting location ${location.code}:`, error);
            }
        }
    });
    insertMany(locations);
    return inserted;
};
exports.insertLocations = insertLocations;
/**
 * Insert inventory records into database
 * @param warehouseId - Warehouse ID
 * @param inventory - Array of inventory records
 * @returns Number of records inserted
 */
const insertInventory = (warehouseId, inventory) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO inventory (
      id, warehouse_id, product_id, location_id,
      quantity, available_quantity, reserved_quantity,
      last_received_at, last_shipped_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
    let inserted = 0;
    const insertMany = db.transaction((inventory) => {
        for (const inv of inventory) {
            try {
                const id = `${warehouseId}-${inv.productId}-${inv.locationId || 'default'}`;
                stmt.run(id, warehouseId, inv.productId, inv.locationId || null, inv.quantity, inv.availableQuantity, inv.reservedQuantity, null, // last_received_at
                null // last_shipped_at
                );
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting inventory for product ${inv.productId}:`, error);
            }
        }
    });
    insertMany(inventory);
    return inserted;
};
exports.insertInventory = insertInventory;
/**
 * Insert movements into database
 * @param movements - Array of movements to insert
 * @returns Number of movements inserted
 */
const insertMovements = (movements) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    INSERT INTO movements (
      id, warehouse_id, product_id, product_sku, product_name,
      type, source_location_id, source_zone, source_location_code,
      destination_location_id, destination_zone, destination_location_code,
      quantity, unit, movement_date, user, reason,
      lot, expiration_date, reference_type, reference_id,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    let inserted = 0;
    const insertMany = db.transaction((movements) => {
        for (const movement of movements) {
            try {
                const id = `${movement.warehouseId}-${movement.productId}-${movement.movementDate.getTime()}-${Math.random().toString(36).substring(2, 15)}`;
                stmt.run(id, movement.warehouseId, movement.productId, movement.productSku, movement.productName, movement.type, movement.sourceLocationId || null, movement.sourceZone || null, movement.sourceLocationCode || null, movement.destinationLocationId || null, movement.destinationZone || null, movement.destinationLocationCode || null, movement.quantity, movement.unit, formatDate(movement.movementDate), movement.user || null, movement.reason || null, movement.lot || null, movement.expirationDate ? formatDate(movement.expirationDate) : null, movement.referenceType || null, movement.referenceId || null);
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting movement:`, error);
            }
        }
    });
    insertMany(movements);
    return inserted;
};
exports.insertMovements = insertMovements;
/**
 * Load normalized data into database
 * @param data - Normalized data from plugin
 * @returns Import statistics
 */
const loadToDatabase = (data) => {
    const stats = {
        productsImported: 0,
        inventoryImported: 0,
        movementsImported: 0,
        zonesImported: 0,
        sectorsImported: 0,
        locationsImported: 0,
        ordersImported: 0,
        pickingsImported: 0,
        receptionsImported: 0,
        restockingsImported: 0,
        returnsImported: 0,
    };
    // Insert zones first (locations reference them)
    if (data.zones && data.zones.length > 0) {
        stats.zonesImported = (0, exports.insertZones)(data.zones);
    }
    // Insert sectors (locations reference them)
    if (data.sectors && data.sectors.length > 0) {
        stats.sectorsImported = (0, exports.insertSectors)(data.sectors);
    }
    // Insert locations (products and inventory reference them)
    if (data.locations && data.locations.length > 0) {
        stats.locationsImported = (0, exports.insertLocations)(data.locations);
    }
    // Insert products
    if (data.products.length > 0) {
        stats.productsImported = (0, exports.insertProducts)(data.products);
    }
    // Insert inventory
    if (data.inventory.length > 0) {
        stats.inventoryImported = (0, exports.insertInventory)(data.metadata.warehouseId, data.inventory);
    }
    // Insert movements
    if (data.movements.length > 0) {
        stats.movementsImported = (0, exports.insertMovements)(data.movements);
    }
    // TODO: Insert orders, pickings, receptions, restockings, returns
    // These will be implemented as needed
    return stats;
};
exports.loadToDatabase = loadToDatabase;
/**
 * Format date to SQLite string format
 */
function formatDate(date) {
    return date.toISOString();
}

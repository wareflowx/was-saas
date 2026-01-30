"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationsByWarehouse = exports.getDeadStock = exports.getProductMovementTotals = exports.getOrdersByWarehouse = exports.getLastMovementDate = exports.getMovementsByWarehouse = exports.getInventoryByWarehouse = exports.getProductBySku = exports.getProductById = exports.getProductsByWarehouse = void 0;
const index_1 = require('./index.cjs');
// ============================================================================
// PRODUCTS
// ============================================================================
/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
const getProductsByWarehouse = (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    SELECT DISTINCT
      p.id,
      p.sku,
      p.name,
      p.description,
      p.category,
      p.subcategory,
      p.brand,
      p.unit,
      p.weight,
      p.volume,
      p.min_stock,
      p.max_stock,
      p.reorder_point,
      p.reorder_quantity,
      p.cost_price,
      p.selling_price,
      p.supplier,
      p.status,
      i.quantity as current_quantity,
      i.available_quantity,
      i.reserved_quantity
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id AND i.warehouse_id = ?
    WHERE EXISTS (
      SELECT 1 FROM inventory inv
      WHERE inv.product_id = p.id AND inv.warehouse_id = ?
    )
    ORDER BY p.name
  `);
    return stmt.all(warehouseId, warehouseId);
};
exports.getProductsByWarehouse = getProductsByWarehouse;
/**
 * Get a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
const getProductById = (productId) => {
    const db = (0, index_1.getDatabase)();
    return db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
};
exports.getProductById = getProductById;
/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
const getProductBySku = (sku) => {
    const db = (0, index_1.getDatabase)();
    return db.prepare('SELECT * FROM products WHERE sku = ?').get(sku);
};
exports.getProductBySku = getProductBySku;
// ============================================================================
// INVENTORY
// ============================================================================
/**
 * Get all inventory for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of inventory records
 */
const getInventoryByWarehouse = (filters) => {
    const db = (0, index_1.getDatabase)();
    let sql = `
    SELECT
      i.id,
      i.warehouse_id,
      i.product_id,
      p.sku as product_sku,
      p.name as product_name,
      i.location_id,
      l.code as location_code,
      i.quantity,
      i.available_quantity,
      i.reserved_quantity,
      i.last_received_at,
      i.last_shipped_at
    FROM inventory i
    INNER JOIN products p ON i.product_id = p.id
    LEFT JOIN locations l ON i.location_id = l.id
    WHERE i.warehouse_id = ?
  `;
    const params = [filters.warehouseId];
    if (filters.productId) {
        sql += ' AND i.product_id = ?';
        params.push(filters.productId);
    }
    if (filters.locationId) {
        sql += ' AND i.location_id = ?';
        params.push(filters.locationId);
    }
    sql += ' ORDER BY p.name';
    const stmt = db.prepare(sql);
    return stmt.all(...params);
};
exports.getInventoryByWarehouse = getInventoryByWarehouse;
// ============================================================================
// MOVEMENTS
// ============================================================================
/**
 * Get movements for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of movements
 */
const getMovementsByWarehouse = (filters) => {
    const db = (0, index_1.getDatabase)();
    let sql = 'SELECT * FROM movements WHERE warehouse_id = ?';
    const params = [filters.warehouseId];
    if (filters.productId) {
        sql += ' AND product_id = ?';
        params.push(filters.productId);
    }
    if (filters.type) {
        sql += ' AND type = ?';
        params.push(filters.type);
    }
    if (filters.dateFrom) {
        sql += ' AND movement_date >= ?';
        params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
        sql += ' AND movement_date <= ?';
        params.push(filters.dateTo);
    }
    sql += ' ORDER BY movement_date DESC';
    if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);
    }
    const stmt = db.prepare(sql);
    return stmt.all(...params);
};
exports.getMovementsByWarehouse = getMovementsByWarehouse;
/**
 * Get last movement date for a product in a warehouse
 * @param warehouseId - Warehouse ID
 * @param productId - Product ID
 * @returns Last movement date or null
 */
const getLastMovementDate = (warehouseId, productId) => {
    const db = (0, index_1.getDatabase)();
    const result = db
        .prepare('SELECT MAX(movement_date) as last_date FROM movements WHERE warehouse_id = ? AND product_id = ?')
        .get(warehouseId, productId);
    return result.last_date;
};
exports.getLastMovementDate = getLastMovementDate;
// ============================================================================
// ORDERS
// ============================================================================
/**
 * Get orders for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of orders
 */
const getOrdersByWarehouse = (filters) => {
    const db = (0, index_1.getDatabase)();
    let sql = 'SELECT * FROM orders WHERE warehouse_id = ?';
    const params = [filters.warehouseId];
    if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
    }
    sql += ' ORDER BY order_date DESC';
    if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(filters.limit);
    }
    const stmt = db.prepare(sql);
    return stmt.all(...params);
};
exports.getOrdersByWarehouse = getOrdersByWarehouse;
// ============================================================================
// ANALYTICS HELPERS
// ============================================================================
/**
 * Get product movement totals for ABC analysis
 * @param warehouseId - Warehouse ID
 * @param type - Movement type (typically 'outbound')
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns Array of products with movement totals
 */
const getProductMovementTotals = (warehouseId, type, dateFrom, dateTo) => {
    const db = (0, index_1.getDatabase)();
    let sql = `
    SELECT
      m.product_id,
      p.sku,
      p.name,
      SUM(m.quantity) as total_quantity,
      COUNT(*) as movement_count
    FROM movements m
    INNER JOIN products p ON m.product_id = p.id
    WHERE m.warehouse_id = ? AND m.type = ?
  `;
    const params = [warehouseId, type];
    if (dateFrom) {
        sql += ' AND m.movement_date >= ?';
        params.push(dateFrom);
    }
    if (dateTo) {
        sql += ' AND m.movement_date <= ?';
        params.push(dateTo);
    }
    sql += ' GROUP BY m.product_id ORDER BY total_quantity DESC';
    const stmt = db.prepare(sql);
    return stmt.all(...params);
};
exports.getProductMovementTotals = getProductMovementTotals;
/**
 * Get dead stock products
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for considering as dead stock
 * @returns Array of products with last movement date and tied capital
 */
const getDeadStock = (warehouseId, thresholdDays = 90) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    SELECT
      p.id,
      p.sku,
      p.name,
      p.category,
      p.cost_price,
      i.quantity as current_quantity,
      MAX(m.movement_date) as last_movement_date,
      (julianday('now') - julianday(MAX(m.movement_date))) as days_since_last_move,
      (i.quantity * p.cost_price) as tied_capital
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    LEFT JOIN movements m ON p.id = m.product_id AND m.warehouse_id = i.warehouse_id
    WHERE i.warehouse_id = ? AND i.quantity > 0
    GROUP BY p.id
    HAVING days_since_last_move >= ?
    ORDER BY tied_capital DESC
  `);
    return stmt.all(warehouseId, thresholdDays);
};
exports.getDeadStock = getDeadStock;
// ============================================================================
// LOCATIONS
// ============================================================================
/**
 * Get all locations for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of locations with zone, sector, warehouse info and products
 */
const getLocationsByWarehouse = (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    SELECT DISTINCT
      l.id,
      l.code,
      l.type,
      l.capacity,
      l.used_capacity as usedCapacity,
      l.product_count as productCount,
      l.picker_count as pickerCount,
      l.aisle,
      l.level,
      l.position,
      l.barcode,
      l.status,
      l.updated_at as lastUpdated,
      z.id as zone_id,
      z.name as zone_name,
      z.code as zone_code,
      s.id as sector_id,
      s.name as sector_name,
      s.code as sector_code,
      w.id as warehouse_id,
      w.name as warehouse_name,
      w.code as warehouse_code,
      -- For each location, get products as JSON array
      (
        SELECT GROUP_CONCAT(
          json_object(
            'id', p.id,
            'sku', p.sku,
            'name', p.name,
            'quantity', i.quantity
          ),
          '|'
        )
        FROM inventory i2
        JOIN products p ON i2.product_id = p.id
        WHERE i2.location_id = l.id AND i2.warehouse_id = ?
      ) as products_json
    FROM locations l
    LEFT JOIN zones z ON l.zone_id = z.id
    LEFT JOIN sectors s ON l.sector_id = s.id
    LEFT JOIN warehouses w ON l.warehouse_id = w.id
    WHERE l.warehouse_id = ?
    ORDER BY l.code
  `);
    const rows = stmt.all(warehouseId, warehouseId);
    // Parse products_json and calculate KPIs
    const locations = rows.map((row) => ({
        ...row,
        products: row.products_json
            ? row.products_json.split('|').map((jsonStr) => JSON.parse(jsonStr))
            : [],
    }));
    // Calculate KPIs
    const totalLocations = locations.length;
    const availableLocations = locations.filter((l) => l.status === 'available').length;
    const occupiedLocations = locations.filter((l) => l.status === 'occupied').length;
    const blockedLocations = locations.filter((l) => l.status === 'blocked').length;
    const reservedLocations = locations.filter((l) => l.status === 'reserved').length;
    const totalCapacity = locations.reduce((sum, l) => sum + (l.capacity || 0), 0);
    const usedCapacity = locations.reduce((sum, l) => sum + (l.usedCapacity || 0), 0);
    return {
        kpis: {
            totalLocations,
            availableLocations,
            occupiedLocations,
            blockedLocations,
            reservedLocations,
            totalCapacity,
            usedCapacity,
            averageOccupancy: totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0,
        },
        locations,
    };
};
exports.getLocationsByWarehouse = getLocationsByWarehouse;

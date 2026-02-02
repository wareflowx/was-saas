"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardKPIs = exports.getImportHistory = exports.getWarehousesWithKPIs = exports.getSectorsByWarehouse = exports.getZonesByWarehouse = exports.getLocationsByWarehouse = exports.getDeadStock = exports.getProductMovementTotals = exports.getOrdersByWarehouse = exports.getLastMovementDate = exports.getMovementsByWarehouse = exports.getInventoryByWarehouse = exports.getProductBySku = exports.getProductById = exports.getProductsByWarehouse = void 0;
const index_1 = require("./index.cjs");
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
      z.id as zoneId,
      z.name as zoneName,
      z.code as zoneCode,
      s.id as sectorId,
      s.name as sectorName,
      s.code as sectorCode,
      w.id as warehouseId,
      w.name as warehouseName,
      w.code as warehouseCode,
      -- For each location, get products as JSON array
      (
        SELECT GROUP_CONCAT(
          json_object(
            'id', p.id,
            'sku', p.sku,
            'name', p.name,
            'quantity', i2.quantity
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
// ============================================================================
// ZONES
// ============================================================================
/**
 * Get all zones for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Zones data with KPIs calculated
 */
const getZonesByWarehouse = (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    SELECT DISTINCT
      z.id,
      z.code,
      z.name,
      z.type,
      z.surface,
      z.capacity,
      z.used_capacity as usedCapacity,
      z.sector_count as sectorCount,
      z.location_count as locationCount,
      z.picker_count as pickerCount,
      z.temperature_min as temperatureMin,
      z.temperature_max as temperatureMax,
      z.status,
      z.updated_at as lastUpdated,
      w.id as warehouseId,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM zones z
    LEFT JOIN warehouses w ON z.warehouse_id = w.id
    WHERE z.warehouse_id = ?
    ORDER BY z.code
  `);
    const rows = stmt.all(warehouseId);
    // Calculate KPIs
    const totalZones = rows.length;
    const activeZones = rows.filter((r) => r.status === 'active').length;
    const totalSurface = rows.reduce((sum, r) => sum + (r.surface || 0), 0);
    const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0);
    const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    // Count zones by type
    const zoneTypes = {};
    rows.forEach((r) => {
        zoneTypes[r.type] = (zoneTypes[r.type] || 0) + 1;
    });
    return {
        kpis: {
            totalZones,
            activeZones,
            totalSurface,
            totalCapacity,
            usedCapacity,
            averageOccupancy,
            zoneTypes,
        },
        zones: rows,
    };
};
exports.getZonesByWarehouse = getZonesByWarehouse;
// ============================================================================
// SECTORS
// ============================================================================
/**
 * Get all sectors for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Sectors data with KPIs calculated
 */
const getSectorsByWarehouse = (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    SELECT DISTINCT
      s.id,
      s.code,
      s.name,
      s.type,
      s.capacity,
      s.used_capacity as usedCapacity,
      s.location_count as locationCount,
      s.picker_count as pickerCount,
      s.aisle,
      s.level,
      s.position,
      s.status,
      s.updated_at as lastUpdated,
      z.id as zoneId,
      z.name as zoneName,
      z.code as zoneCode,
      w.id as warehouseId,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM sectors s
    LEFT JOIN zones z ON s.zone_id = z.id
    LEFT JOIN warehouses w ON s.warehouse_id = w.id
    WHERE s.warehouse_id = ?
    ORDER BY s.code
  `);
    const rows = stmt.all(warehouseId);
    // Calculate KPIs
    const totalSectors = rows.length;
    const activeSectors = rows.filter((r) => r.status === 'active').length;
    const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0);
    const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    // Count sectors by type
    const sectorTypes = {};
    rows.forEach((r) => {
        sectorTypes[r.type] = (sectorTypes[r.type] || 0) + 1;
    });
    return {
        kpis: {
            totalSectors,
            activeSectors,
            totalCapacity,
            usedCapacity,
            averageOccupancy,
            sectorTypes,
        },
        sectors: rows,
    };
};
exports.getSectorsByWarehouse = getSectorsByWarehouse;
// ============================================================================
// WAREHOUSES
// ============================================================================
/**
 * Get all warehouses with KPIs calculated
 * @returns Warehouses data with KPIs calculated
 */
const getWarehousesWithKPIs = () => {
    const db = (0, index_1.getDatabase)();
    const stmt = db.prepare(`
    SELECT
      w.id,
      w.code,
      w.name,
      w.city,
      w.country,
      w.surface,
      w.capacity,
      w.used_capacity as usedCapacity,
      w.zone_count as zoneCount,
      w.picker_count as pickerCount,
      w.manager,
      w.email,
      w.phone,
      w.status,
      w.opening_date as openingDate,
      w.updated_at as lastUpdated
    FROM warehouses w
    ORDER BY w.name
  `);
    const rows = stmt.all();
    // Calculate KPIs
    const totalWarehouses = rows.length;
    const activeWarehouses = rows.filter((r) => r.status === 'active').length;
    const totalSurface = rows.reduce((sum, r) => sum + (r.surface || 0), 0);
    const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0);
    const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    const trackedPickers = rows.reduce((sum, r) => sum + (r.pickerCount || 0), 0);
    return {
        kpis: {
            totalWarehouses,
            activeWarehouses,
            totalSurface,
            totalCapacity,
            usedCapacity,
            averageOccupancy,
            trackedPickers,
        },
        warehouses: rows,
    };
};
exports.getWarehousesWithKPIs = getWarehousesWithKPIs;
/**
 * Get import history for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Import history records
 */
const getImportHistory = (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    let stmt;
    if (warehouseId) {
        stmt = db.prepare(`
      SELECT
        ih.id,
        ih.warehouse_id as warehouseId,
        ih.plugin_id as pluginId,
        ih.plugin_version as pluginVersion,
        ih.imported_at as importedAt,
        ih.rows_processed as rowsProcessed,
        ih.status,
        ih.file_name as fileName,
        ih.file_size as fileSize,
        ih.duration_ms as durationMs,
        ih.error_message as errorMessage,
        w.name as warehouseName,
        w.code as warehouseCode
      FROM import_history ih
      LEFT JOIN warehouses w ON ih.warehouse_id = w.id
      WHERE ih.warehouse_id = ?
      ORDER BY ih.imported_at DESC
      LIMIT 50
    `);
        return stmt.all(warehouseId);
    }
    else {
        stmt = db.prepare(`
      SELECT
        ih.id,
        ih.warehouse_id as warehouseId,
        ih.plugin_id as pluginId,
        ih.plugin_version as pluginVersion,
        ih.imported_at as importedAt,
        ih.rows_processed as rowsProcessed,
        ih.status,
        ih.file_name as fileName,
        ih.file_size as fileSize,
        ih.duration_ms as durationMs,
        ih.error_message as errorMessage,
        w.name as warehouseName,
        w.code as warehouseCode
      FROM import_history ih
      LEFT JOIN warehouses w ON ih.warehouse_id = w.id
      ORDER BY ih.imported_at DESC
      LIMIT 50
    `);
        return stmt.all();
    }
};
exports.getImportHistory = getImportHistory;
/**
 * Get dashboard KPIs and summary data
 * @param warehouseId - Warehouse ID (optional, if not provided uses all warehouses)
 * @returns Dashboard data with KPIs, stock evolution, movements by type, top products, low stock alerts, and recent movements
 */
const getDashboardKPIs = (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    // KPIs
    let whereClause = warehouseId ? 'WHERE warehouse_id = ?' : '';
    let whereParams = warehouseId ? [warehouseId] : [];
    // Total products
    const productsStmt = db.prepare(`SELECT COUNT(*) as count FROM products`);
    const totalProducts = productsStmt.get().count;
    // Total locations
    const locationsStmt = db.prepare(`SELECT COUNT(*) as count FROM locations ${warehouseId ? 'WHERE warehouse_id = ?' : ''}`);
    const totalLocations = locationsStmt.get(...whereParams).count;
    // Low stock items (quantity < min_stock)
    const lowStockStmt = db.prepare(`
    SELECT COUNT(DISTINCT p.id) as count
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    ${warehouseId ? 'WHERE i.warehouse_id = ? AND' : 'WHERE'}
      i.quantity < p.min_stock
  `);
    const lowStockItems = lowStockStmt.get(...whereParams).count;
    // Active orders
    const ordersStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM orders
    ${warehouseId ? 'WHERE warehouse_id = ? AND' : 'WHERE'}
      status IN ('pending', 'processing', 'picked')
  `);
    const activeOrders = ordersStmt.get(...whereParams).count;
    // Movements this week (last 7 days)
    const movementsStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ? AND' : 'WHERE'}
      movement_date >= datetime('now', '-7 days')
  `);
    const movementsThisWeek = movementsStmt.get(...whereParams).count;
    // Stock evolution (last 7 days)
    const stockEvolutionStmt = db.prepare(`
    SELECT
      date(movement_date) as date,
      SUM(CASE WHEN type IN ('in', 'receipt') THEN quantity ELSE -quantity END) as stock
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ?' : 'WHERE 1=1'}
      AND movement_date >= datetime('now', '-7 days')
    GROUP BY date(movement_date)
    ORDER BY date
  `);
    const stockEvolutionRows = stockEvolutionStmt.all(...whereParams);
    // Calculate running stock total
    let runningStock = 0;
    const stockEvolution = stockEvolutionRows.map((row) => {
        runningStock += row.stock;
        return {
            date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stock: runningStock,
        };
    });
    // Movements by type
    const movementsByTypeStmt = db.prepare(`
    SELECT
      type as movementType,
      COUNT(*) as movements
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ?' : 'WHERE 1=1'}
      AND movement_date >= datetime('now', '-7 days')
    GROUP BY type
  `);
    const movementsByTypeRows = movementsByTypeStmt.all(...whereParams);
    const typeColors = {
        in: 'hsl(var(--chart))',
        inbound: 'hsl(var(--chart))',
        receipt: 'hsl(var(--chart))',
        out: 'hsl(142, 76%, 36%)',
        outbound: 'hsl(142, 76%, 36%)',
        shipment: 'hsl(142, 76%, 36%)',
        transfer: 'hsl(25, 95%, 53%)',
        adjustment: 'hsl(25, 95%, 53%)',
    };
    const movementsByType = movementsByTypeRows.map((row) => ({
        movementType: row.movementType,
        movements: row.movements,
        fill: typeColors[row.movementType] || 'hsl(var(--muted))',
    }));
    // Top products by movements
    const topProductsStmt = db.prepare(`
    SELECT
      product_name as product,
      COUNT(*) as movements
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ?' : 'WHERE 1=1'}
      AND movement_date >= datetime('now', '-30 days')
    GROUP BY product_name
    ORDER BY movements DESC
    LIMIT 5
  `);
    const topProducts = topProductsStmt.all(...whereParams);
    // Low stock alerts
    const lowStockAlertsStmt = db.prepare(`
    SELECT
      p.id,
      p.name as product,
      i.quantity as currentStock,
      p.min_stock as minStock,
      l.code as location,
      CASE
        WHEN i.quantity = 0 THEN 'critical'
        WHEN i.quantity < p.min_stock * 0.5 THEN 'critical'
        ELSE 'warning'
      END as severity
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    LEFT JOIN locations l ON i.location_id = l.id
    ${warehouseId ? 'WHERE i.warehouse_id = ? AND' : 'WHERE'}
      i.quantity < p.min_stock
    ORDER BY i.quantity ASC
    LIMIT 10
  `);
    const lowStockAlerts = lowStockAlertsStmt.all(...whereParams);
    // Recent movements
    const recentMovementsStmt = db.prepare(`
    SELECT
      id,
      date(movement_date) as date,
      product_name as product,
      type,
      quantity as quantity,
      destination_location_code as "to",
      source_location_code as "from"
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ?' : 'WHERE 1=1'}
    ORDER BY movement_date DESC
    LIMIT 10
  `);
    const recentMovements = recentMovementsStmt.all(...whereParams).map((row) => ({
        ...row,
        type: row.type.toLowerCase(),
    }));
    return {
        kpis: {
            totalProducts,
            totalLocations,
            lowStockItems,
            activeOrders,
            movementsThisWeek,
        },
        stockEvolution,
        movementsByType,
        topProducts,
        lowStockAlerts,
        recentMovements,
    };
};
exports.getDashboardKPIs = getDashboardKPIs;

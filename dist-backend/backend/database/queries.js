"use strict";
/**
 * Drizzle ORM Queries
 * Type-safe database queries using Drizzle ORM query builder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardKPIs = exports.getOrdersByWarehouseWithLines = exports.getRestockingLines = exports.getRestockingsByWarehouse = exports.getReturnLines = exports.getReturnsByWarehouse = exports.getPickingLines = exports.getPickingsByWarehouse = exports.getReceptionLines = exports.getReceptionsByWarehouse = exports.getImportHistory = exports.getWarehousesWithKPIs = exports.getSectorsByWarehouse = exports.getZonesByWarehouse = exports.getLocationsByWarehouse = exports.getDeadStock = exports.getProductMovementTotals = exports.getOrdersByWarehouse = exports.getLastMovementDate = exports.getMovementsByWarehouse = exports.getInventoryByWarehouse = exports.getProductBySku = exports.getProductById = exports.getProductsByWarehouse = void 0;
const index_1 = require("./index");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_schema_1 = require("./drizzle-schema");
// ============================================================================
// PRODUCTS
// ============================================================================
/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
const getProductsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const result = await db
        .select({
        id: drizzle_schema_1.products.id,
        sku: drizzle_schema_1.products.sku,
        name: drizzle_schema_1.products.name,
        description: drizzle_schema_1.products.description,
        category: drizzle_schema_1.products.category,
        subcategory: drizzle_schema_1.products.subcategory,
        brand: drizzle_schema_1.products.brand,
        unit: drizzle_schema_1.products.unit,
        weight: drizzle_schema_1.products.weight,
        volume: drizzle_schema_1.products.volume,
        minStock: drizzle_schema_1.products.minStock,
        maxStock: drizzle_schema_1.products.maxStock,
        reorderPoint: drizzle_schema_1.products.reorderPoint,
        reorderQuantity: drizzle_schema_1.products.reorderQuantity,
        costPrice: drizzle_schema_1.products.costPrice,
        sellingPrice: drizzle_schema_1.products.sellingPrice,
        supplier: drizzle_schema_1.products.supplier,
        status: drizzle_schema_1.products.status,
        currentQuantity: drizzle_schema_1.inventory.quantity,
        availableQuantity: drizzle_schema_1.inventory.availableQuantity,
        reservedQuantity: drizzle_schema_1.inventory.reservedQuantity,
    })
        .from(drizzle_schema_1.products)
        .leftJoin(drizzle_schema_1.inventory, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.productId, drizzle_schema_1.products.id), (0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.warehouseId, warehouseId)))
        .where((0, drizzle_orm_1.sql) `EXISTS (
      SELECT 1 FROM inventory inv
      WHERE inv.product_id = ${drizzle_schema_1.products.id} AND inv.warehouse_id = ${warehouseId}
    )`)
        .orderBy(drizzle_schema_1.products.name);
    return result;
};
exports.getProductsByWarehouse = getProductsByWarehouse;
/**
 * Get a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
const getProductById = async (productId) => {
    const db = (0, index_1.getDatabase)();
    const result = await db
        .select()
        .from(drizzle_schema_1.products)
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.products.id, productId))
        .limit(1);
    return result[0] || null;
};
exports.getProductById = getProductById;
/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
const getProductBySku = async (sku) => {
    const db = (0, index_1.getDatabase)();
    const result = await db
        .select()
        .from(drizzle_schema_1.products)
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.products.sku, sku))
        .limit(1);
    return result[0] || null;
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
const getInventoryByWarehouse = async (filters) => {
    const db = (0, index_1.getDatabase)();
    const conditions = [(0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.warehouseId, filters.warehouseId)];
    if (filters.productId) {
        conditions.push((0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.productId, filters.productId));
    }
    if (filters.locationId) {
        conditions.push((0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.locationId, filters.locationId));
    }
    const result = await db
        .select({
        id: drizzle_schema_1.inventory.id,
        warehouseId: drizzle_schema_1.inventory.warehouseId,
        productId: drizzle_schema_1.inventory.productId,
        productSku: drizzle_schema_1.products.sku,
        productName: drizzle_schema_1.products.name,
        locationId: drizzle_schema_1.inventory.locationId,
        locationCode: drizzle_schema_1.locations.code,
        quantity: drizzle_schema_1.inventory.quantity,
        availableQuantity: drizzle_schema_1.inventory.availableQuantity,
        reservedQuantity: drizzle_schema_1.inventory.reservedQuantity,
        lastReceivedAt: drizzle_schema_1.inventory.lastReceivedAt,
        lastShippedAt: drizzle_schema_1.inventory.lastShippedAt,
    })
        .from(drizzle_schema_1.inventory)
        .innerJoin(drizzle_schema_1.products, (0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.productId, drizzle_schema_1.products.id))
        .leftJoin(drizzle_schema_1.locations, (0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.locationId, drizzle_schema_1.locations.id))
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy(drizzle_schema_1.products.name);
    return result;
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
const getMovementsByWarehouse = async (filters) => {
    const db = (0, index_1.getDatabase)();
    const conditions = [(0, drizzle_orm_1.eq)(drizzle_schema_1.movements.warehouseId, filters.warehouseId)];
    if (filters.productId) {
        conditions.push((0, drizzle_orm_1.eq)(drizzle_schema_1.movements.productId, filters.productId));
    }
    if (filters.type) {
        conditions.push((0, drizzle_orm_1.eq)(drizzle_schema_1.movements.type, filters.type));
    }
    if (filters.dateFrom) {
        conditions.push((0, drizzle_orm_1.gte)(drizzle_schema_1.movements.movementDate, filters.dateFrom));
    }
    if (filters.dateTo) {
        conditions.push((0, drizzle_orm_1.lte)(drizzle_schema_1.movements.movementDate, filters.dateTo));
    }
    const query = db
        .select()
        .from(drizzle_schema_1.movements)
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.movements.movementDate))
        .limit(filters.limit || 1000);
    return await query;
};
exports.getMovementsByWarehouse = getMovementsByWarehouse;
/**
 * Get last movement date for a product in a warehouse
 * @param warehouseId - Warehouse ID
 * @param productId - Product ID
 * @returns Last movement date or null
 */
const getLastMovementDate = async (warehouseId, productId) => {
    const db = (0, index_1.getDatabase)();
    const result = await db
        .select({ lastDate: (0, drizzle_orm_1.sql) `MAX(${drizzle_schema_1.movements.movementDate})` })
        .from(drizzle_schema_1.movements)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(drizzle_schema_1.movements.warehouseId, warehouseId), (0, drizzle_orm_1.eq)(drizzle_schema_1.movements.productId, productId)))
        .limit(1);
    return result[0]?.lastDate || null;
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
const getOrdersByWarehouse = async (filters) => {
    const db = (0, index_1.getDatabase)();
    const conditions = [(0, drizzle_orm_1.eq)(drizzle_schema_1.orders.warehouseId, filters.warehouseId)];
    if (filters.status) {
        conditions.push((0, drizzle_orm_1.eq)(drizzle_schema_1.orders.status, filters.status));
    }
    const query = db
        .select()
        .from(drizzle_schema_1.orders)
        .where((0, drizzle_orm_1.and)(...conditions))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.orders.orderDate))
        .limit(filters.limit || 1000);
    return await query;
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
const getProductMovementTotals = async (warehouseId, type, dateFrom, dateTo) => {
    const db = (0, index_1.getDatabase)();
    const conditions = [
        (0, drizzle_orm_1.eq)(drizzle_schema_1.movements.warehouseId, warehouseId),
        (0, drizzle_orm_1.eq)(drizzle_schema_1.movements.type, type)
    ];
    if (dateFrom) {
        conditions.push((0, drizzle_orm_1.gte)(drizzle_schema_1.movements.movementDate, dateFrom));
    }
    if (dateTo) {
        conditions.push((0, drizzle_orm_1.lte)(drizzle_schema_1.movements.movementDate, dateTo));
    }
    const result = await db
        .select({
        productId: drizzle_schema_1.movements.productId,
        sku: drizzle_schema_1.products.sku,
        name: drizzle_schema_1.products.name,
        totalQuantity: (0, drizzle_orm_1.sum)(drizzle_schema_1.movements.quantity).mapWith(Number),
        movementCount: (0, drizzle_orm_1.count)().mapWith(Number),
    })
        .from(drizzle_schema_1.movements)
        .innerJoin(drizzle_schema_1.products, (0, drizzle_orm_1.eq)(drizzle_schema_1.movements.productId, drizzle_schema_1.products.id))
        .where((0, drizzle_orm_1.and)(...conditions))
        .groupBy(drizzle_schema_1.movements.productId)
        .orderBy((0, drizzle_orm_1.desc)((0, drizzle_orm_1.sum)(drizzle_schema_1.movements.quantity)));
    return result;
};
exports.getProductMovementTotals = getProductMovementTotals;
/**
 * Get dead stock products
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for considering as dead stock
 * @returns Array of products with last movement date and tied capital
 */
const getDeadStock = async (warehouseId, thresholdDays = 90) => {
    const dbRaw = require('./index').getDbRaw();
    // SQLite-specific query with julianday
    const result = dbRaw.prepare(`
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
  `).all(warehouseId, thresholdDays);
    return result;
};
exports.getDeadStock = getDeadStock;
// ============================================================================
// LOCATIONS
// ============================================================================
/**
 * Get all locations for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Locations data with KPIs
 */
const getLocationsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const locationsData = await db
        .select({
        id: drizzle_schema_1.locations.id,
        code: drizzle_schema_1.locations.code,
        type: drizzle_schema_1.locations.type,
        capacity: drizzle_schema_1.locations.capacity,
        usedCapacity: drizzle_schema_1.locations.usedCapacity,
        productCount: drizzle_schema_1.locations.productCount,
        pickerCount: drizzle_schema_1.locations.pickerCount,
        aisle: drizzle_schema_1.locations.aisle,
        level: drizzle_schema_1.locations.level,
        position: drizzle_schema_1.locations.position,
        barcode: drizzle_schema_1.locations.barcode,
        status: drizzle_schema_1.locations.status,
        lastUpdated: drizzle_schema_1.locations.updatedAt,
        zoneId: drizzle_schema_1.zones.id,
        zoneName: drizzle_schema_1.zones.name,
        zoneCode: drizzle_schema_1.zones.code,
        sectorId: drizzle_schema_1.sectors.id,
        sectorName: drizzle_schema_1.sectors.name,
        sectorCode: drizzle_schema_1.sectors.code,
        warehouseId: drizzle_schema_1.warehouses.id,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.locations)
        .leftJoin(drizzle_schema_1.zones, (0, drizzle_orm_1.eq)(drizzle_schema_1.locations.zoneId, drizzle_schema_1.zones.id))
        .leftJoin(drizzle_schema_1.sectors, (0, drizzle_orm_1.eq)(drizzle_schema_1.locations.sectorId, drizzle_schema_1.sectors.id))
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.locations.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.locations.warehouseId, warehouseId))
        .orderBy(drizzle_schema_1.locations.code);
    // Get products for each location
    const locationsWithProducts = await Promise.all(locationsData.map(async (loc) => {
        const locationProducts = await db
            .select({
            id: drizzle_schema_1.products.id,
            sku: drizzle_schema_1.products.sku,
            name: drizzle_schema_1.products.name,
            quantity: drizzle_schema_1.inventory.quantity,
        })
            .from(drizzle_schema_1.inventory)
            .innerJoin(drizzle_schema_1.products, (0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.productId, drizzle_schema_1.products.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.locationId, loc.id), (0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.warehouseId, warehouseId)));
        return {
            ...loc,
            products: locationProducts,
        };
    }));
    // Calculate KPIs
    const totalLocations = locationsWithProducts.length;
    const availableLocations = locationsWithProducts.filter(l => l.status === 'available').length;
    const occupiedLocations = locationsWithProducts.filter(l => l.status === 'occupied').length;
    const blockedLocations = locationsWithProducts.filter(l => l.status === 'blocked').length;
    const reservedLocations = locationsWithProducts.filter(l => l.status === 'reserved').length;
    const totalCapacity = locationsWithProducts.reduce((sum, l) => sum + (l.capacity || 0), 0);
    const usedCapacity = locationsWithProducts.reduce((sum, l) => sum + (l.usedCapacity || 0), 0);
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
        locations: locationsWithProducts,
    };
};
exports.getLocationsByWarehouse = getLocationsByWarehouse;
// ============================================================================
// ZONES
// ============================================================================
/**
 * Get all zones for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Zones data with KPIs
 */
const getZonesByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.zones.id,
        code: drizzle_schema_1.zones.code,
        name: drizzle_schema_1.zones.name,
        type: drizzle_schema_1.zones.type,
        surface: drizzle_schema_1.zones.surface,
        capacity: drizzle_schema_1.zones.capacity,
        usedCapacity: drizzle_schema_1.zones.usedCapacity,
        sectorCount: drizzle_schema_1.zones.sectorCount,
        locationCount: drizzle_schema_1.zones.locationCount,
        pickerCount: drizzle_schema_1.zones.pickerCount,
        temperatureMin: drizzle_schema_1.zones.temperatureMin,
        temperatureMax: drizzle_schema_1.zones.temperatureMax,
        status: drizzle_schema_1.zones.status,
        lastUpdated: drizzle_schema_1.zones.updatedAt,
        warehouseId: drizzle_schema_1.warehouses.id,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.zones)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.zones.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.zones.warehouseId, warehouseId))
        .orderBy(drizzle_schema_1.zones.code);
    // Calculate KPIs
    const totalZones = rows.length;
    const activeZones = rows.filter(r => r.status === 'active').length;
    const totalSurface = rows.reduce((sum, r) => sum + (r.surface || 0), 0);
    const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0);
    const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    // Count zones by type
    const zoneTypes = {};
    rows.forEach(r => {
        if (r.type) {
            zoneTypes[r.type] = (zoneTypes[r.type] || 0) + 1;
        }
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
 * @returns Sectors data with KPIs
 */
const getSectorsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.sectors.id,
        code: drizzle_schema_1.sectors.code,
        name: drizzle_schema_1.sectors.name,
        type: drizzle_schema_1.sectors.type,
        capacity: drizzle_schema_1.sectors.capacity,
        usedCapacity: drizzle_schema_1.sectors.usedCapacity,
        locationCount: drizzle_schema_1.sectors.locationCount,
        pickerCount: drizzle_schema_1.sectors.pickerCount,
        aisle: drizzle_schema_1.sectors.aisle,
        level: drizzle_schema_1.sectors.level,
        position: drizzle_schema_1.sectors.position,
        status: drizzle_schema_1.sectors.status,
        lastUpdated: drizzle_schema_1.sectors.updatedAt,
        zoneId: drizzle_schema_1.zones.id,
        zoneName: drizzle_schema_1.zones.name,
        zoneCode: drizzle_schema_1.zones.code,
        warehouseId: drizzle_schema_1.warehouses.id,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.sectors)
        .leftJoin(drizzle_schema_1.zones, (0, drizzle_orm_1.eq)(drizzle_schema_1.sectors.zoneId, drizzle_schema_1.zones.id))
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.sectors.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.sectors.warehouseId, warehouseId))
        .orderBy(drizzle_schema_1.sectors.code);
    // Calculate KPIs
    const totalSectors = rows.length;
    const activeSectors = rows.filter(r => r.status === 'active').length;
    const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0);
    const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;
    // Count sectors by type
    const sectorTypes = {};
    rows.forEach(r => {
        if (r.type) {
            sectorTypes[r.type] = (sectorTypes[r.type] || 0) + 1;
        }
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
 * Get all warehouses with KPIs
 * @returns Warehouses data with KPIs
 */
const getWarehousesWithKPIs = async () => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select()
        .from(drizzle_schema_1.warehouses)
        .orderBy(drizzle_schema_1.warehouses.name);
    // Calculate KPIs
    const totalWarehouses = rows.length;
    const activeWarehouses = rows.filter(r => r.status === 'active').length;
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
const getImportHistory = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const conditions = warehouseId
        ? [(0, drizzle_orm_1.eq)(drizzle_schema_1.importHistory.warehouseId, warehouseId)]
        : [];
    const result = await db
        .select({
        id: drizzle_schema_1.importHistory.id,
        warehouseId: drizzle_schema_1.importHistory.warehouseId,
        pluginId: drizzle_schema_1.importHistory.pluginId,
        pluginVersion: drizzle_schema_1.importHistory.pluginVersion,
        importedAt: drizzle_schema_1.importHistory.importedAt,
        rowsProcessed: drizzle_schema_1.importHistory.rowsProcessed,
        status: drizzle_schema_1.importHistory.status,
        fileName: drizzle_schema_1.importHistory.fileName,
        fileSize: drizzle_schema_1.importHistory.fileSize,
        durationMs: drizzle_schema_1.importHistory.durationMs,
        errorMessage: drizzle_schema_1.importHistory.errorMessage,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.importHistory)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.importHistory.warehouseId, drizzle_schema_1.warehouses.id))
        .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.importHistory.importedAt))
        .limit(50);
    return result;
};
exports.getImportHistory = getImportHistory;
// ============================================================================
// OPERATIONS - RECEPTIONS
// ============================================================================
/**
 * Get all receptions for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Receptions data with KPIs
 */
const getReceptionsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.receptions.id,
        receptionNumber: drizzle_schema_1.receptions.receptionNumber,
        warehouseId: drizzle_schema_1.receptions.warehouseId,
        supplierId: drizzle_schema_1.receptions.supplierId,
        supplierName: drizzle_schema_1.receptions.supplierName,
        expectedDate: drizzle_schema_1.receptions.expectedDate,
        receivedDate: drizzle_schema_1.receptions.receivedDate,
        status: drizzle_schema_1.receptions.status,
        priority: drizzle_schema_1.receptions.priority,
        totalQuantity: drizzle_schema_1.receptions.totalQuantity,
        receivedQuantity: drizzle_schema_1.receptions.receivedQuantity,
        rejectedQuantity: drizzle_schema_1.receptions.rejectedQuantity,
        totalAmount: drizzle_schema_1.receptions.totalAmount,
        carrier: drizzle_schema_1.receptions.carrier,
        trackingNumber: drizzle_schema_1.receptions.trackingNumber,
        receiver: drizzle_schema_1.receptions.receiver,
        notes: drizzle_schema_1.receptions.notes,
        createdAt: drizzle_schema_1.receptions.createdAt,
        lastUpdated: drizzle_schema_1.receptions.updatedAt,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.receptions)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.receptions.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.receptions.warehouseId, warehouseId))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.receptions.expectedDate));
    // Calculate KPIs
    const totalReceptions = rows.length;
    const pendingReceptions = rows.filter(r => r.status === 'pending').length;
    const inProgressReceptions = rows.filter(r => r.status === 'in_progress').length;
    const completedReceptions = rows.filter(r => r.status === 'completed').length;
    const totalQuantity = rows.reduce((sum, r) => sum + (r.totalQuantity || 0), 0);
    const receivedQuantity = rows.reduce((sum, r) => sum + (r.receivedQuantity || 0), 0);
    const pendingQuantity = totalQuantity - receivedQuantity;
    return {
        kpis: {
            totalReceptions,
            pendingReceptions,
            inProgressReceptions,
            completedReceptions,
            totalQuantity,
            receivedQuantity,
            pendingQuantity,
        },
        receptions: rows,
    };
};
exports.getReceptionsByWarehouse = getReceptionsByWarehouse;
/**
 * Get reception lines for a reception
 * @param receptionId - Reception ID
 * @returns Array of reception lines
 */
const getReceptionLines = async (receptionId) => {
    const db = (0, index_1.getDatabase)();
    return await db
        .select()
        .from(drizzle_schema_1.receptionLines)
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.receptionLines.receptionId, receptionId))
        .orderBy(drizzle_schema_1.receptionLines.createdAt);
};
exports.getReceptionLines = getReceptionLines;
// ============================================================================
// OPERATIONS - PICKINGS
// ============================================================================
/**
 * Get all pickings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Pickings data with KPIs
 */
const getPickingsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.pickings.id,
        pickingNumber: drizzle_schema_1.pickings.pickingNumber,
        warehouseId: drizzle_schema_1.pickings.warehouseId,
        orderId: drizzle_schema_1.pickings.orderId,
        orderNumber: drizzle_schema_1.pickings.orderNumber,
        customerId: drizzle_schema_1.pickings.customerId,
        customerName: drizzle_schema_1.pickings.customerName,
        assignedDate: drizzle_schema_1.pickings.assignedDate,
        startedDate: drizzle_schema_1.pickings.startedDate,
        completedDate: drizzle_schema_1.pickings.completedDate,
        status: drizzle_schema_1.pickings.status,
        priority: drizzle_schema_1.pickings.priority,
        totalQuantity: drizzle_schema_1.pickings.totalQuantity,
        pickedQuantity: drizzle_schema_1.pickings.pickedQuantity,
        remainingQuantity: drizzle_schema_1.pickings.remainingQuantity,
        picker: drizzle_schema_1.pickings.picker,
        pickerId: drizzle_schema_1.pickings.pickerId,
        notes: drizzle_schema_1.pickings.notes,
        createdAt: drizzle_schema_1.pickings.createdAt,
        lastUpdated: drizzle_schema_1.pickings.updatedAt,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.pickings)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.pickings.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.pickings.warehouseId, warehouseId))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.pickings.assignedDate));
    // Calculate KPIs
    const totalPickings = rows.length;
    const pendingPickings = rows.filter(r => r.status === 'pending').length;
    const inProgressPickings = rows.filter(r => r.status === 'in_progress').length;
    const completedPickings = rows.filter(r => r.status === 'completed').length;
    const totalLines = rows.reduce((sum, r) => sum + (r.totalQuantity || 0), 0);
    const pickedLines = rows.reduce((sum, r) => sum + (r.pickedQuantity || 0), 0);
    const completionRate = totalLines > 0 ? Math.round((pickedLines / totalLines) * 100) : 0;
    return {
        kpis: {
            totalPickings,
            pendingPickings,
            inProgressPickings,
            completedPickings,
            totalLines,
            pickedLines,
            completionRate,
        },
        pickings: rows,
    };
};
exports.getPickingsByWarehouse = getPickingsByWarehouse;
/**
 * Get picking lines for a picking
 * @param pickingId - Picking ID
 * @returns Array of picking lines
 */
const getPickingLines = async (pickingId) => {
    const db = (0, index_1.getDatabase)();
    return await db
        .select()
        .from(drizzle_schema_1.pickingLines)
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.pickingLines.pickingId, pickingId))
        .orderBy(drizzle_schema_1.pickingLines.createdAt);
};
exports.getPickingLines = getPickingLines;
// ============================================================================
// OPERATIONS - RETURNS
// ============================================================================
/**
 * Get all returns for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Returns data with KPIs
 */
const getReturnsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.returns.id,
        returnNumber: drizzle_schema_1.returns.returnNumber,
        warehouseId: drizzle_schema_1.returns.warehouseId,
        orderId: drizzle_schema_1.returns.orderId,
        orderNumber: drizzle_schema_1.returns.orderNumber,
        customerId: drizzle_schema_1.returns.customerId,
        customerName: drizzle_schema_1.returns.customerName,
        returnDate: drizzle_schema_1.returns.returnDate,
        type: drizzle_schema_1.returns.type,
        status: drizzle_schema_1.returns.status,
        priority: drizzle_schema_1.returns.priority,
        reason: drizzle_schema_1.returns.reason,
        reasonLabel: drizzle_schema_1.returns.reasonLabel,
        totalQuantity: drizzle_schema_1.returns.totalQuantity,
        totalAmount: drizzle_schema_1.returns.totalAmount,
        refundedAmount: drizzle_schema_1.returns.refundedAmount,
        processor: drizzle_schema_1.returns.processor,
        completedDate: drizzle_schema_1.returns.completedDate,
        createdAt: drizzle_schema_1.returns.createdAt,
        lastUpdated: drizzle_schema_1.returns.updatedAt,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.returns)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.returns.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.returns.warehouseId, warehouseId))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.returns.returnDate));
    // Calculate KPIs
    const totalReturns = rows.length;
    const pendingReturns = rows.filter(r => r.status === 'pending').length;
    const inProgressReturns = rows.filter(r => r.status === 'in_progress').length;
    const completedReturns = rows.filter(r => r.status === 'completed').length;
    const totalQuantity = rows.reduce((sum, r) => sum + (r.totalQuantity || 0), 0);
    const returnedQuantity = rows.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.totalQuantity || 0), 0);
    const pendingQuantity = totalQuantity - returnedQuantity;
    const totalValue = rows.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const refundedValue = rows.reduce((sum, r) => sum + (r.refundedAmount || 0), 0);
    return {
        kpis: {
            totalReturns,
            pendingReturns,
            inProgressReturns,
            completedReturns,
            totalQuantity,
            returnedQuantity,
            pendingQuantity,
            totalValue,
            refundedValue,
        },
        returns: rows,
    };
};
exports.getReturnsByWarehouse = getReturnsByWarehouse;
/**
 * Get return lines for a return
 * @param returnId - Return ID
 * @returns Array of return lines
 */
const getReturnLines = async (returnId) => {
    const db = (0, index_1.getDatabase)();
    return await db
        .select()
        .from(drizzle_schema_1.returnLines)
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.returnLines.returnId, returnId))
        .orderBy(drizzle_schema_1.returnLines.createdAt);
};
exports.getReturnLines = getReturnLines;
// ============================================================================
// OPERATIONS - RESTOCKINGS
// ============================================================================
/**
 * Get all restockings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Restockings data with KPIs
 */
const getRestockingsByWarehouse = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.restockings.id,
        restockingNumber: drizzle_schema_1.restockings.restockingNumber,
        warehouseId: drizzle_schema_1.restockings.warehouseId,
        status: drizzle_schema_1.restockings.status,
        priority: drizzle_schema_1.restockings.priority,
        totalProducts: drizzle_schema_1.restockings.totalProducts,
        restockedProducts: drizzle_schema_1.restockings.restockedProducts,
        requester: drizzle_schema_1.restockings.requester,
        assignedTo: drizzle_schema_1.restockings.assignedTo,
        requestedDate: drizzle_schema_1.restockings.requestedDate,
        startedDate: drizzle_schema_1.restockings.startedDate,
        completedDate: drizzle_schema_1.restockings.completedDate,
        createdAt: drizzle_schema_1.restockings.createdAt,
        lastUpdated: drizzle_schema_1.restockings.updatedAt,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.restockings)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.restockings.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.restockings.warehouseId, warehouseId))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.restockings.requestedDate));
    // Calculate KPIs
    const totalRestockings = rows.length;
    const pendingRestockings = rows.filter(r => r.status === 'pending').length;
    const inProgressRestockings = rows.filter(r => r.status === 'in_progress').length;
    const completedRestockings = rows.filter(r => r.status === 'completed').length;
    const totalProducts = rows.reduce((sum, r) => sum + (r.totalProducts || 0), 0);
    const restockedProducts = rows.reduce((sum, r) => sum + (r.restockedProducts || 0), 0);
    const pendingProducts = totalProducts - restockedProducts;
    return {
        kpis: {
            totalRestockings,
            pendingRestockings,
            inProgressRestockings,
            completedRestockings,
            totalProducts,
            restockedProducts,
            pendingProducts,
        },
        restockings: rows,
    };
};
exports.getRestockingsByWarehouse = getRestockingsByWarehouse;
/**
 * Get restocking lines for a restocking
 * @param restockingId - Restocking ID
 * @returns Array of restocking lines
 */
const getRestockingLines = async (restockingId) => {
    const db = (0, index_1.getDatabase)();
    return await db
        .select()
        .from(drizzle_schema_1.restockingLines)
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.restockingLines.restockingId, restockingId))
        .orderBy(drizzle_schema_1.restockingLines.createdAt);
};
exports.getRestockingLines = getRestockingLines;
// ============================================================================
// OPERATIONS - ORDERS WITH LINES
// ============================================================================
/**
 * Get orders for a warehouse with lines and KPIs
 * @param warehouseId - Warehouse ID
 * @returns Orders data with KPIs
 */
const getOrdersByWarehouseWithLines = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    const rows = await db
        .select({
        id: drizzle_schema_1.orders.id,
        orderNumber: drizzle_schema_1.orders.orderNumber,
        warehouseId: drizzle_schema_1.orders.warehouseId,
        customerId: drizzle_schema_1.orders.customerId,
        customerName: drizzle_schema_1.orders.customerName,
        customerEmail: drizzle_schema_1.orders.customerEmail,
        orderDate: drizzle_schema_1.orders.orderDate,
        requiredDate: drizzle_schema_1.orders.requiredDate,
        promisedDate: drizzle_schema_1.orders.promisedDate,
        shippedDate: drizzle_schema_1.orders.shippedDate,
        deliveredDate: drizzle_schema_1.orders.deliveredDate,
        status: drizzle_schema_1.orders.status,
        priority: drizzle_schema_1.orders.priority,
        totalQuantity: drizzle_schema_1.orders.totalQuantity,
        totalAmount: drizzle_schema_1.orders.totalAmount,
        shippingAddress: drizzle_schema_1.orders.shippingAddress,
        shippingCity: drizzle_schema_1.orders.shippingCity,
        shippingCountry: drizzle_schema_1.orders.shippingCountry,
        trackingNumber: drizzle_schema_1.orders.trackingNumber,
        carrier: drizzle_schema_1.orders.carrier,
        notes: drizzle_schema_1.orders.notes,
        picker: drizzle_schema_1.orders.picker,
        packer: drizzle_schema_1.orders.packer,
        createdAt: drizzle_schema_1.orders.createdAt,
        lastUpdated: drizzle_schema_1.orders.updatedAt,
        warehouseName: drizzle_schema_1.warehouses.name,
        warehouseCode: drizzle_schema_1.warehouses.code,
    })
        .from(drizzle_schema_1.orders)
        .leftJoin(drizzle_schema_1.warehouses, (0, drizzle_orm_1.eq)(drizzle_schema_1.orders.warehouseId, drizzle_schema_1.warehouses.id))
        .where((0, drizzle_orm_1.eq)(drizzle_schema_1.orders.warehouseId, warehouseId))
        .orderBy((0, drizzle_orm_1.desc)(drizzle_schema_1.orders.orderDate));
    // Get lines for each order
    const ordersWithLines = await Promise.all(rows.map(async (row) => {
        const lines = await db
            .select()
            .from(drizzle_schema_1.orderLines)
            .where((0, drizzle_orm_1.eq)(drizzle_schema_1.orderLines.orderId, row.id))
            .orderBy(drizzle_schema_1.orderLines.createdAt);
        return {
            ...row,
            lines,
        };
    }));
    // Calculate KPIs
    const totalOrders = ordersWithLines.length;
    const pendingOrders = ordersWithLines.filter(r => r.status === 'pending').length;
    const inProgressOrders = ordersWithLines.filter(r => r.status === 'processing' || r.status === 'picking').length;
    const shippedOrders = ordersWithLines.filter(r => r.status === 'shipped').length;
    const deliveredOrders = ordersWithLines.filter(r => r.status === 'delivered').length;
    const cancelledOrders = ordersWithLines.filter(r => r.status === 'cancelled').length;
    const totalValue = ordersWithLines.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
    return {
        kpis: {
            totalOrders,
            pendingOrders,
            inProgressOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            totalValue,
            averageOrderValue,
        },
        orders: ordersWithLines,
    };
};
exports.getOrdersByWarehouseWithLines = getOrdersByWarehouseWithLines;
// ============================================================================
// DASHBOARD
// ============================================================================
/**
 * Get dashboard KPIs and summary data
 * @param warehouseId - Warehouse ID (optional)
 * @returns Dashboard data with KPIs, stock evolution, movements, alerts
 */
const getDashboardKPIs = async (warehouseId) => {
    const db = (0, index_1.getDatabase)();
    // Total products
    const productsResult = await db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(drizzle_schema_1.products);
    const totalProducts = productsResult[0]?.count || 0;
    // Total locations
    let totalLocations = 0;
    if (warehouseId) {
        const locResult = await db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(drizzle_schema_1.locations)
            .where((0, drizzle_orm_1.eq)(drizzle_schema_1.locations.warehouseId, warehouseId));
        totalLocations = locResult[0]?.count || 0;
    }
    else {
        const locResult = await db
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(drizzle_schema_1.locations);
        totalLocations = locResult[0]?.count || 0;
    }
    // Low stock items
    const lowStockResult = await db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(drizzle_schema_1.inventory)
        .innerJoin(drizzle_schema_1.products, (0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.productId, drizzle_schema_1.products.id))
        .where((0, drizzle_orm_1.and)(...(warehouseId ? [(0, drizzle_orm_1.eq)(drizzle_schema_1.inventory.warehouseId, warehouseId)] : []), (0, drizzle_orm_1.sql) `inventory.quantity < products.min_stock`));
    const lowStockItems = lowStockResult[0]?.count || 0;
    // Active orders
    const activeOrdersResult = await db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(drizzle_schema_1.orders)
        .where((0, drizzle_orm_1.and)(...(warehouseId ? [(0, drizzle_orm_1.eq)(drizzle_schema_1.orders.warehouseId, warehouseId)] : []), (0, drizzle_orm_1.sql) `status IN ('pending', 'processing', 'picked')`));
    const activeOrders = activeOrdersResult[0]?.count || 0;
    // Movements this week
    const movementsThisWeekResult = await db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(drizzle_schema_1.movements)
        .where((0, drizzle_orm_1.and)(...(warehouseId ? [(0, drizzle_orm_1.eq)(drizzle_schema_1.movements.warehouseId, warehouseId)] : []), (0, drizzle_orm_1.sql) `movement_date >= datetime('now', '-7 days')`));
    const movementsThisWeek = movementsThisWeekResult[0]?.count || 0;
    // Stock evolution (last 7 days) - using raw SQL for complex aggregation
    const stockEvolutionSql = warehouseId
        ? `SELECT date(movement_date) as date, SUM(CASE WHEN type IN ('in', 'receipt') THEN quantity ELSE -quantity END) as stock FROM movements WHERE warehouse_id = ? AND movement_date >= datetime('now', '-7 days') GROUP BY date(movement_date) ORDER BY date`
        : `SELECT date(movement_date) as date, SUM(CASE WHEN type IN ('in', 'receipt') THEN quantity ELSE -quantity END) as stock FROM movements WHERE movement_date >= datetime('now', '-7 days') GROUP BY date(movement_date) ORDER BY date`;
    const stockEvolutionRows = warehouseId
        ? await getDbRaw().prepare(stockEvolutionSql).all(warehouseId)
        : await getDbRaw().prepare(stockEvolutionSql).all();
    let runningStock = 0;
    const stockEvolution = stockEvolutionRows.map((row) => {
        const stock = row.stock || 0;
        runningStock += stock;
        return {
            date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stock: runningStock,
        };
    });
    // Movements by type
    const movementsByTypeSql = warehouseId
        ? `SELECT type as movementType, COUNT(*) as movements FROM movements WHERE warehouse_id = ? AND movement_date >= datetime('now', '-7 days') GROUP BY type`
        : `SELECT type as movementType, COUNT(*) as movements FROM movements WHERE movement_date >= datetime('now', '-7 days') GROUP BY type`;
    const movementsByTypeRows = warehouseId
        ? await getDbRaw().prepare(movementsByTypeSql).all(warehouseId)
        : await getDbRaw().prepare(movementsByTypeSql).all();
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
    // Top products
    const topProductsSql = warehouseId
        ? `SELECT product_name as product, COUNT(*) as movements FROM movements WHERE warehouse_id = ? AND movement_date >= datetime('now', '-30 days') GROUP BY product_name ORDER BY movements DESC LIMIT 5`
        : `SELECT product_name as product, COUNT(*) as movements FROM movements WHERE movement_date >= datetime('now', '-30 days') GROUP BY product_name ORDER BY movements DESC LIMIT 5`;
    const topProducts = warehouseId
        ? await getDbRaw().prepare(topProductsSql).all(warehouseId)
        : await getDbRaw().prepare(topProductsSql).all();
    // Low stock alerts
    const lowStockAlertsSql = warehouseId
        ? `SELECT p.id, p.name as product, i.quantity as currentStock, p.min_stock as minStock, l.code as location, CASE WHEN i.quantity = 0 THEN 'critical' WHEN i.quantity < p.min_stock * 0.5 THEN 'critical' ELSE 'warning' END as severity FROM products p INNER JOIN inventory i ON p.id = i.product_id LEFT JOIN locations l ON i.location_id = l.id WHERE i.warehouse_id = ? AND i.quantity < p.min_stock ORDER BY i.quantity ASC LIMIT 10`
        : `SELECT p.id, p.name as product, i.quantity as currentStock, p.min_stock as minStock, l.code as location, CASE WHEN i.quantity = 0 THEN 'critical' WHEN i.quantity < p.min_stock * 0.5 THEN 'critical' ELSE 'warning' END as severity FROM products p INNER JOIN inventory i ON p.id = i.product_id LEFT JOIN locations l ON i.location_id = l.id WHERE i.quantity < p.min_stock ORDER BY i.quantity ASC LIMIT 10`;
    const lowStockAlerts = warehouseId
        ? await getDbRaw().prepare(lowStockAlertsSql).all(warehouseId)
        : await getDbRaw().prepare(lowStockAlertsSql).all();
    // Recent movements
    const recentMovementsSql = warehouseId
        ? `SELECT id, date(movement_date) as date, product_name as product, type, quantity, destination_location_code as "to", source_location_code as "from" FROM movements WHERE warehouse_id = ? ORDER BY movement_date DESC LIMIT 10`
        : `SELECT id, date(movement_date) as date, product_name as product, type, quantity, destination_location_code as "to", source_location_code as "from" FROM movements ORDER BY movement_date DESC LIMIT 10`;
    const recentMovementsRows = warehouseId
        ? await getDbRaw().prepare(recentMovementsSql).all(warehouseId)
        : await getDbRaw().prepare(recentMovementsSql).all();
    const recentMovements = recentMovementsRows.map((row) => ({
        ...row,
        type: (row.type || '').toLowerCase(),
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
// Helper function to get raw DB for complex queries
function getDbRaw() {
    return require('./index').getDbRaw();
}

/**
 * Drizzle ORM Queries
 * Type-safe database queries using Drizzle ORM query builder
 */

import { getDatabase } from './index'
import { eq, and, or, like, gte, lte, sql, desc, asc, count, sum } from 'drizzle-orm'
import {
  warehouses,
  zones,
  sectors,
  locations,
  products,
  inventory,
  movements,
  orders,
  orderLines,
  pickings,
  pickingLines,
  receptions,
  receptionLines,
  restockings,
  restockingLines,
  returns,
  returnLines,
  importHistory,
  users,
  suppliers,
  customers,
  purchaseOrders,
  purchaseOrderLines,
  shipments,
  shipmentLines,
} from './drizzle-schema'

// ============================================================================
// TYPES
// ============================================================================

export type {
  Warehouse,
  Zone,
  Sector,
  Location,
  Product,
  Inventory,
  Movement,
  Order,
  OrderLine,
  Picking,
  PickingLine,
  Reception,
  ReceptionLine,
  Restocking,
  RestockingLine,
  Return,
  ReturnLine,
} from './drizzle-schema'

// ============================================================================
// PRODUCTS
// ============================================================================

/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
export const getProductsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const result = await db
    .select({
      id: products.id,
      sku: products.sku,
      name: products.name,
      description: products.description,
      category: products.category,
      subcategory: products.subcategory,
      brand: products.brand,
      unit: products.unit,
      weight: products.weight,
      volume: products.volume,
      minStock: products.minStock,
      maxStock: products.maxStock,
      reorderPoint: products.reorderPoint,
      reorderQuantity: products.reorderQuantity,
      costPrice: products.costPrice,
      sellingPrice: products.sellingPrice,
      supplier: products.supplier,
      status: products.status,
      currentQuantity: inventory.quantity,
      availableQuantity: inventory.availableQuantity,
      reservedQuantity: inventory.reservedQuantity,
    })
    .from(products)
    .leftJoin(inventory, and(
      eq(inventory.productId, products.id),
      eq(inventory.warehouseId, warehouseId)
    ))
    .where(sql`EXISTS (
      SELECT 1 FROM inventory inv
      WHERE inv.product_id = ${products.id} AND inv.warehouse_id = ${warehouseId}
    )`)
    .orderBy(products.name)

  return result
}

/**
 * Get a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
export const getProductById = async (productId: string) => {
  const db = getDatabase()

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)

  return result[0] || null
}

/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
export const getProductBySku = async (sku: string) => {
  const db = getDatabase()

  const result = await db
    .select()
    .from(products)
    .where(eq(products.sku, sku))
    .limit(1)

  return result[0] || null
}

// ============================================================================
// INVENTORY
// ============================================================================

/**
 * Get all inventory for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of inventory records
 */
export const getInventoryByWarehouse = async (filters: {
  warehouseId: string
  productId?: string
  locationId?: string
}) => {
  const db = getDatabase()

  const conditions = [eq(inventory.warehouseId, filters.warehouseId)]

  if (filters.productId) {
    conditions.push(eq(inventory.productId, filters.productId))
  }

  if (filters.locationId) {
    conditions.push(eq(inventory.locationId, filters.locationId))
  }

  const result = await db
    .select({
      id: inventory.id,
      warehouseId: inventory.warehouseId,
      productId: inventory.productId,
      productSku: products.sku,
      productName: products.name,
      locationId: inventory.locationId,
      locationCode: locations.code,
      quantity: inventory.quantity,
      availableQuantity: inventory.availableQuantity,
      reservedQuantity: inventory.reservedQuantity,
      lastReceivedAt: inventory.lastReceivedAt,
      lastShippedAt: inventory.lastShippedAt,
    })
    .from(inventory)
    .innerJoin(products, eq(inventory.productId, products.id))
    .leftJoin(locations, eq(inventory.locationId, locations.id))
    .where(and(...conditions))
    .orderBy(products.name)

  return result
}

// ============================================================================
// MOVEMENTS
// ============================================================================

/**
 * Get movements for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of movements
 */
export const getMovementsByWarehouse = async (filters: {
  warehouseId: string
  productId?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}) => {
  const db = getDatabase()

  const conditions: any[] = [eq(movements.warehouseId, filters.warehouseId)]

  if (filters.productId) {
    conditions.push(eq(movements.productId, filters.productId))
  }

  if (filters.type) {
    conditions.push(eq(movements.type, filters.type))
  }

  if (filters.dateFrom) {
    conditions.push(gte(movements.movementDate, filters.dateFrom))
  }

  if (filters.dateTo) {
    conditions.push(lte(movements.movementDate, filters.dateTo))
  }

  let query = db
    .select()
    .from(movements)
    .where(and(...conditions))
    .orderBy(desc(movements.movementDate))

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  return await query
}

/**
 * Get last movement date for a product in a warehouse
 * @param warehouseId - Warehouse ID
 * @param productId - Product ID
 * @returns Last movement date or null
 */
export const getLastMovementDate = async (warehouseId: string, productId: string) => {
  const db = getDatabase()

  const result = await db
    .select({ lastDate: sql<string>`MAX(${movements.movementDate})` })
    .from(movements)
    .where(and(
      eq(movements.warehouseId, warehouseId),
      eq(movements.productId, productId)
    ))
    .limit(1)

  return result[0]?.lastDate || null
}

// ============================================================================
// ORDERS
// ============================================================================

/**
 * Get orders for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of orders
 */
export const getOrdersByWarehouse = async (filters: {
  warehouseId: string
  status?: string
  limit?: number
}) => {
  const db = getDatabase()

  const conditions = [eq(orders.warehouseId, filters.warehouseId)]

  if (filters.status) {
    conditions.push(eq(orders.status, filters.status))
  }

  let query = db
    .select()
    .from(orders)
    .where(and(...conditions))
    .orderBy(desc(orders.orderDate))

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  return await query
}

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
export const getProductMovementTotals = async (
  warehouseId: string,
  type: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const db = getDatabase()

  const conditions: any[] = [
    eq(movements.warehouseId, warehouseId),
    eq(movements.type, type)
  ]

  if (dateFrom) {
    conditions.push(gte(movements.movementDate, dateFrom))
  }

  if (dateTo) {
    conditions.push(lte(movements.movementDate, dateTo))
  }

  const result = await db
    .select({
      productId: movements.productId,
      sku: products.sku,
      name: products.name,
      totalQuantity: sum(movements.quantity).mapWith(Number),
      movementCount: count().mapWith(Number),
    })
    .from(movements)
    .innerJoin(products, eq(movements.productId, products.id))
    .where(and(...conditions))
    .groupBy(movements.productId)
    .orderBy(desc(sum(movements.quantity)))

  return result
}

/**
 * Get dead stock products
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for considering as dead stock
 * @returns Array of products with last movement date and tied capital
 */
export const getDeadStock = async (warehouseId: string, thresholdDays: number = 90) => {
  const db = getDatabase()

  // SQLite-specific query with julianday
  const result = await db.execute(sql`
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
    WHERE i.warehouse_id = ${warehouseId} AND i.quantity > 0
    GROUP BY p.id
    HAVING days_since_last_move >= ${thresholdDays}
    ORDER BY tied_capital DESC
  `)

  return result.rows
}

// ============================================================================
// LOCATIONS
// ============================================================================

/**
 * Get all locations for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Locations data with KPIs
 */
export const getLocationsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const locationsData = await db
    .select({
      id: locations.id,
      code: locations.code,
      type: locations.type,
      capacity: locations.capacity,
      usedCapacity: locations.usedCapacity,
      productCount: locations.productCount,
      pickerCount: locations.pickerCount,
      aisle: locations.aisle,
      level: locations.level,
      position: locations.position,
      barcode: locations.barcode,
      status: locations.status,
      lastUpdated: locations.updatedAt,
      zoneId: zones.id,
      zoneName: zones.name,
      zoneCode: zones.code,
      sectorId: sectors.id,
      sectorName: sectors.name,
      sectorCode: sectors.code,
      warehouseId: warehouses.id,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(locations)
    .leftJoin(zones, eq(locations.zoneId, zones.id))
    .leftJoin(sectors, eq(locations.sectorId, sectors.id))
    .leftJoin(warehouses, eq(locations.warehouseId, warehouses.id))
    .where(eq(locations.warehouseId, warehouseId))
    .orderBy(locations.code)

  // Get products for each location
  const locationsWithProducts = await Promise.all(
    locationsData.map(async (loc) => {
      const products = await db
        .select({
          id: products.id,
          sku: products.sku,
          name: products.name,
          quantity: inventory.quantity,
        })
        .from(inventory)
        .innerJoin(products, eq(inventory.productId, products.id))
        .where(and(
          eq(inventory.locationId, loc.id),
          eq(inventory.warehouseId, warehouseId)
        ))

      return {
        ...loc,
        products,
      }
    })
  )

  // Calculate KPIs
  const totalLocations = locationsWithProducts.length
  const availableLocations = locationsWithProducts.filter(l => l.status === 'available').length
  const occupiedLocations = locationsWithProducts.filter(l => l.status === 'occupied').length
  const blockedLocations = locationsWithProducts.filter(l => l.status === 'blocked').length
  const reservedLocations = locationsWithProducts.filter(l => l.status === 'reserved').length

  const totalCapacity = locationsWithProducts.reduce((sum, l) => sum + (l.capacity || 0), 0)
  const usedCapacity = locationsWithProducts.reduce((sum, l) => sum + (l.usedCapacity || 0), 0)

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
  }
}

// ============================================================================
// ZONES
// ============================================================================

/**
 * Get all zones for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Zones data with KPIs
 */
export const getZonesByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: zones.id,
      code: zones.code,
      name: zones.name,
      type: zones.type,
      surface: zones.surface,
      capacity: zones.capacity,
      usedCapacity: zones.usedCapacity,
      sectorCount: zones.sectorCount,
      locationCount: zones.locationCount,
      pickerCount: zones.pickerCount,
      temperatureMin: zones.temperatureMin,
      temperatureMax: zones.temperatureMax,
      status: zones.status,
      lastUpdated: zones.updatedAt,
      warehouseId: warehouses.id,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(zones)
    .leftJoin(warehouses, eq(zones.warehouseId, warehouses.id))
    .where(eq(zones.warehouseId, warehouseId))
    .orderBy(zones.code)

  // Calculate KPIs
  const totalZones = rows.length
  const activeZones = rows.filter(r => r.status === 'active').length
  const totalSurface = rows.reduce((sum, r) => sum + (r.surface || 0), 0)
  const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0)
  const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0)
  const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0

  // Count zones by type
  const zoneTypes: Record<string, number> = {}
  rows.forEach(r => {
    if (r.type) {
      zoneTypes[r.type] = (zoneTypes[r.type] || 0) + 1
    }
  })

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
  }
}

// ============================================================================
// SECTORS
// ============================================================================

/**
 * Get all sectors for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Sectors data with KPIs
 */
export const getSectorsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: sectors.id,
      code: sectors.code,
      name: sectors.name,
      type: sectors.type,
      capacity: sectors.capacity,
      usedCapacity: sectors.usedCapacity,
      locationCount: sectors.locationCount,
      pickerCount: sectors.pickerCount,
      aisle: sectors.aisle,
      level: sectors.level,
      position: sectors.position,
      status: sectors.status,
      lastUpdated: sectors.updatedAt,
      zoneId: zones.id,
      zoneName: zones.name,
      zoneCode: zones.code,
      warehouseId: warehouses.id,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(sectors)
    .leftJoin(zones, eq(sectors.zoneId, zones.id))
    .leftJoin(warehouses, eq(sectors.warehouseId, warehouses.id))
    .where(eq(sectors.warehouseId, warehouseId))
    .orderBy(sectors.code)

  // Calculate KPIs
  const totalSectors = rows.length
  const activeSectors = rows.filter(r => r.status === 'active').length
  const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0)
  const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0)
  const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0

  // Count sectors by type
  const sectorTypes: Record<string, number> = {}
  rows.forEach(r => {
    if (r.type) {
      sectorTypes[r.type] = (sectorTypes[r.type] || 0) + 1
    }
  })

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
  }
}

// ============================================================================
// WAREHOUSES
// ============================================================================

/**
 * Get all warehouses with KPIs
 * @returns Warehouses data with KPIs
 */
export const getWarehousesWithKPIs = async () => {
  const db = getDatabase()

  const rows = await db
    .select()
    .from(warehouses)
    .orderBy(warehouses.name)

  // Calculate KPIs
  const totalWarehouses = rows.length
  const activeWarehouses = rows.filter(r => r.status === 'active').length
  const totalSurface = rows.reduce((sum, r) => sum + (r.surface || 0), 0)
  const totalCapacity = rows.reduce((sum, r) => sum + (r.capacity || 0), 0)
  const usedCapacity = rows.reduce((sum, r) => sum + (r.usedCapacity || 0), 0)
  const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0
  const trackedPickers = rows.reduce((sum, r) => sum + (r.pickerCount || 0), 0)

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
  }
}

/**
 * Get import history for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Import history records
 */
export const getImportHistory = async (warehouseId?: string) => {
  const db = getDatabase()

  const conditions = warehouseId
    ? [eq(importHistory.warehouseId, warehouseId)]
    : []

  const result = await db
    .select({
      id: importHistory.id,
      warehouseId: importHistory.warehouseId,
      pluginId: importHistory.pluginId,
      pluginVersion: importHistory.pluginVersion,
      importedAt: importHistory.importedAt,
      rowsProcessed: importHistory.rowsProcessed,
      status: importHistory.status,
      fileName: importHistory.fileName,
      fileSize: importHistory.fileSize,
      durationMs: importHistory.durationMs,
      errorMessage: importHistory.errorMessage,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(importHistory)
    .leftJoin(warehouses, eq(importHistory.warehouseId, warehouses.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(importHistory.importedAt))
    .limit(50)

  return result
}

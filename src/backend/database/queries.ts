/**
 * Drizzle ORM Queries
 * Type-safe database queries using Drizzle ORM query builder
 */

import { getDatabase } from './index'
import { eq, and, gte, lte, sql, desc, count, sum } from 'drizzle-orm'
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

  const query = db
    .select()
    .from(movements)
    .where(and(...conditions))
    .orderBy(desc(movements.movementDate))
    .limit(filters.limit || 1000)

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

  const query = db
    .select()
    .from(orders)
    .where(and(...conditions))
    .orderBy(desc(orders.orderDate))
    .limit(filters.limit || 1000)

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
  const dbRaw = require('./index').getDbRaw()

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
  `).all(warehouseId, thresholdDays)

  return result
}

// ============================================================================
// LOCATIONS
// ============================================================================

/**
 * Get all locations for a specific warehouse, or all locations if no warehouse specified
 * @param warehouseId - Warehouse ID filter (optional, returns all if not provided)
 * @returns Locations data with KPIs
 */
export const getLocationsByWarehouse = async (warehouseId?: string) => {
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
    .where(warehouseId ? eq(locations.warehouseId, warehouseId) : undefined)
    .orderBy(locations.code)

  // Get products for each location
  const locationsWithProducts = await Promise.all(
    locationsData.map(async (loc) => {
      const locationProducts = await db
        .select({
          id: products.id,
          sku: products.sku,
          name: products.name,
          quantity: inventory.quantity,
        })
        .from(inventory)
        .innerJoin(products, eq(inventory.productId, products.id))
        .where(warehouseId
          ? and(
              eq(inventory.locationId, loc.id),
              eq(inventory.warehouseId, warehouseId)
            )
          : eq(inventory.locationId, loc.id)
        )

      return {
        ...loc,
        products: locationProducts,
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
 * Get all zones for a specific warehouse, or all zones if no warehouse specified
 * @param warehouseId - Warehouse ID filter (optional, returns all if not provided)
 * @returns Zones data with KPIs
 */
export const getZonesByWarehouse = async (warehouseId?: string) => {
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
    .where(warehouseId ? eq(zones.warehouseId, warehouseId) : undefined)
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
 * Get all sectors for a specific warehouse, or all sectors if no warehouse specified
 * @param warehouseId - Warehouse ID filter (optional, returns all if not provided)
 * @returns Sectors data with KPIs
 */
export const getSectorsByWarehouse = async (warehouseId?: string) => {
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
    .where(warehouseId ? eq(sectors.warehouseId, warehouseId) : undefined)
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

// ============================================================================
// OPERATIONS - RECEPTIONS
// ============================================================================

/**
 * Get all receptions for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Receptions data with KPIs
 */
export const getReceptionsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: receptions.id,
      receptionNumber: receptions.receptionNumber,
      warehouseId: receptions.warehouseId,
      supplierId: receptions.supplierId,
      supplierName: receptions.supplierName,
      expectedDate: receptions.expectedDate,
      receivedDate: receptions.receivedDate,
      status: receptions.status,
      priority: receptions.priority,
      totalQuantity: receptions.totalQuantity,
      receivedQuantity: receptions.receivedQuantity,
      rejectedQuantity: receptions.rejectedQuantity,
      totalAmount: receptions.totalAmount,
      carrier: receptions.carrier,
      trackingNumber: receptions.trackingNumber,
      receiver: receptions.receiver,
      notes: receptions.notes,
      createdAt: receptions.createdAt,
      lastUpdated: receptions.updatedAt,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(receptions)
    .leftJoin(warehouses, eq(receptions.warehouseId, warehouses.id))
    .where(eq(receptions.warehouseId, warehouseId))
    .orderBy(desc(receptions.expectedDate))

  // Calculate KPIs
  const totalReceptions = rows.length
  const pendingReceptions = rows.filter(r => r.status === 'pending').length
  const inProgressReceptions = rows.filter(r => r.status === 'in_progress').length
  const completedReceptions = rows.filter(r => r.status === 'completed').length

  const totalQuantity = rows.reduce((sum, r) => sum + (r.totalQuantity || 0), 0)
  const receivedQuantity = rows.reduce((sum, r) => sum + (r.receivedQuantity || 0), 0)
  const pendingQuantity = totalQuantity - receivedQuantity

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
  }
}

/**
 * Get reception lines for a reception
 * @param receptionId - Reception ID
 * @returns Array of reception lines
 */
export const getReceptionLines = async (receptionId: string) => {
  const db = getDatabase()

  return await db
    .select()
    .from(receptionLines)
    .where(eq(receptionLines.receptionId, receptionId))
    .orderBy(receptionLines.createdAt)
}

// ============================================================================
// OPERATIONS - PICKINGS
// ============================================================================

/**
 * Get all pickings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Pickings data with KPIs
 */
export const getPickingsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: pickings.id,
      pickingNumber: pickings.pickingNumber,
      warehouseId: pickings.warehouseId,
      orderId: pickings.orderId,
      orderNumber: pickings.orderNumber,
      customerId: pickings.customerId,
      customerName: pickings.customerName,
      assignedDate: pickings.assignedDate,
      startedDate: pickings.startedDate,
      completedDate: pickings.completedDate,
      status: pickings.status,
      priority: pickings.priority,
      totalQuantity: pickings.totalQuantity,
      pickedQuantity: pickings.pickedQuantity,
      remainingQuantity: pickings.remainingQuantity,
      picker: pickings.picker,
      pickerId: pickings.pickerId,
      notes: pickings.notes,
      createdAt: pickings.createdAt,
      lastUpdated: pickings.updatedAt,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(pickings)
    .leftJoin(warehouses, eq(pickings.warehouseId, warehouses.id))
    .where(eq(pickings.warehouseId, warehouseId))
    .orderBy(desc(pickings.assignedDate))

  // Calculate KPIs
  const totalPickings = rows.length
  const pendingPickings = rows.filter(r => r.status === 'pending').length
  const inProgressPickings = rows.filter(r => r.status === 'in_progress').length
  const completedPickings = rows.filter(r => r.status === 'completed').length

  const totalLines = rows.reduce((sum, r) => sum + (r.totalQuantity || 0), 0)
  const pickedLines = rows.reduce((sum, r) => sum + (r.pickedQuantity || 0), 0)
  const completionRate = totalLines > 0 ? Math.round((pickedLines / totalLines) * 100) : 0

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
  }
}

/**
 * Get picking lines for a picking
 * @param pickingId - Picking ID
 * @returns Array of picking lines
 */
export const getPickingLines = async (pickingId: string) => {
  const db = getDatabase()

  return await db
    .select()
    .from(pickingLines)
    .where(eq(pickingLines.pickingId, pickingId))
    .orderBy(pickingLines.createdAt)
}

// ============================================================================
// OPERATIONS - RETURNS
// ============================================================================

/**
 * Get all returns for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Returns data with KPIs
 */
export const getReturnsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: returns.id,
      returnNumber: returns.returnNumber,
      warehouseId: returns.warehouseId,
      orderId: returns.orderId,
      orderNumber: returns.orderNumber,
      customerId: returns.customerId,
      customerName: returns.customerName,
      returnDate: returns.returnDate,
      type: returns.type,
      status: returns.status,
      priority: returns.priority,
      reason: returns.reason,
      reasonLabel: returns.reasonLabel,
      totalQuantity: returns.totalQuantity,
      totalAmount: returns.totalAmount,
      refundedAmount: returns.refundedAmount,
      processor: returns.processor,
      completedDate: returns.completedDate,
      createdAt: returns.createdAt,
      lastUpdated: returns.updatedAt,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(returns)
    .leftJoin(warehouses, eq(returns.warehouseId, warehouses.id))
    .where(eq(returns.warehouseId, warehouseId))
    .orderBy(desc(returns.returnDate))

  // Calculate KPIs
  const totalReturns = rows.length
  const pendingReturns = rows.filter(r => r.status === 'pending').length
  const inProgressReturns = rows.filter(r => r.status === 'in_progress').length
  const completedReturns = rows.filter(r => r.status === 'completed').length

  const totalQuantity = rows.reduce((sum, r) => sum + (r.totalQuantity || 0), 0)
  const returnedQuantity = rows.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.totalQuantity || 0), 0)
  const pendingQuantity = totalQuantity - returnedQuantity

  const totalValue = rows.reduce((sum, r) => sum + (r.totalAmount || 0), 0)
  const refundedValue = rows.reduce((sum, r) => sum + (r.refundedAmount || 0), 0)

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
  }
}

/**
 * Get return lines for a return
 * @param returnId - Return ID
 * @returns Array of return lines
 */
export const getReturnLines = async (returnId: string) => {
  const db = getDatabase()

  return await db
    .select()
    .from(returnLines)
    .where(eq(returnLines.returnId, returnId))
    .orderBy(returnLines.createdAt)
}

// ============================================================================
// OPERATIONS - RESTOCKINGS
// ============================================================================

/**
 * Get all restockings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Restockings data with KPIs
 */
export const getRestockingsByWarehouse = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: restockings.id,
      restockingNumber: restockings.restockingNumber,
      warehouseId: restockings.warehouseId,
      status: restockings.status,
      priority: restockings.priority,
      totalProducts: restockings.totalProducts,
      restockedProducts: restockings.restockedProducts,
      requester: restockings.requester,
      assignedTo: restockings.assignedTo,
      requestedDate: restockings.requestedDate,
      startedDate: restockings.startedDate,
      completedDate: restockings.completedDate,
      createdAt: restockings.createdAt,
      lastUpdated: restockings.updatedAt,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(restockings)
    .leftJoin(warehouses, eq(restockings.warehouseId, warehouses.id))
    .where(eq(restockings.warehouseId, warehouseId))
    .orderBy(desc(restockings.requestedDate))

  // Calculate KPIs
  const totalRestockings = rows.length
  const pendingRestockings = rows.filter(r => r.status === 'pending').length
  const inProgressRestockings = rows.filter(r => r.status === 'in_progress').length
  const completedRestockings = rows.filter(r => r.status === 'completed').length

  const totalProducts = rows.reduce((sum, r) => sum + (r.totalProducts || 0), 0)
  const restockedProducts = rows.reduce((sum, r) => sum + (r.restockedProducts || 0), 0)
  const pendingProducts = totalProducts - restockedProducts

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
  }
}

/**
 * Get restocking lines for a restocking
 * @param restockingId - Restocking ID
 * @returns Array of restocking lines
 */
export const getRestockingLines = async (restockingId: string) => {
  const db = getDatabase()

  return await db
    .select()
    .from(restockingLines)
    .where(eq(restockingLines.restockingId, restockingId))
    .orderBy(restockingLines.createdAt)
}

// ============================================================================
// OPERATIONS - ORDERS WITH LINES
// ============================================================================

/**
 * Get orders for a warehouse with lines and KPIs
 * @param warehouseId - Warehouse ID
 * @returns Orders data with KPIs
 */
export const getOrdersByWarehouseWithLines = async (warehouseId: string) => {
  const db = getDatabase()

  const rows = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      warehouseId: orders.warehouseId,
      customerId: orders.customerId,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      orderDate: orders.orderDate,
      requiredDate: orders.requiredDate,
      promisedDate: orders.promisedDate,
      shippedDate: orders.shippedDate,
      deliveredDate: orders.deliveredDate,
      status: orders.status,
      priority: orders.priority,
      totalQuantity: orders.totalQuantity,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      shippingCity: orders.shippingCity,
      shippingCountry: orders.shippingCountry,
      trackingNumber: orders.trackingNumber,
      carrier: orders.carrier,
      notes: orders.notes,
      picker: orders.picker,
      packer: orders.packer,
      createdAt: orders.createdAt,
      lastUpdated: orders.updatedAt,
      warehouseName: warehouses.name,
      warehouseCode: warehouses.code,
    })
    .from(orders)
    .leftJoin(warehouses, eq(orders.warehouseId, warehouses.id))
    .where(eq(orders.warehouseId, warehouseId))
    .orderBy(desc(orders.orderDate))

  // Get lines for each order
  const ordersWithLines = await Promise.all(
    rows.map(async (row) => {
      const lines = await db
        .select()
        .from(orderLines)
        .where(eq(orderLines.orderId, row.id))
        .orderBy(orderLines.createdAt)

      return {
        ...row,
        lines,
      }
    })
  )

  // Calculate KPIs
  const totalOrders = ordersWithLines.length
  const pendingOrders = ordersWithLines.filter(r => r.status === 'pending').length
  const inProgressOrders = ordersWithLines.filter(r => r.status === 'processing' || r.status === 'picking').length
  const shippedOrders = ordersWithLines.filter(r => r.status === 'shipped').length
  const deliveredOrders = ordersWithLines.filter(r => r.status === 'delivered').length
  const cancelledOrders = ordersWithLines.filter(r => r.status === 'cancelled').length

  const totalValue = ordersWithLines.reduce((sum, r) => sum + (r.totalAmount || 0), 0)
  const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0

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
  }
}

// ============================================================================
// DASHBOARD
// ============================================================================

/**
 * Get dashboard KPIs and summary data
 * @param warehouseId - Warehouse ID (optional)
 * @returns Dashboard data with KPIs, stock evolution, movements, alerts
 */
export const getDashboardKPIs = async (warehouseId?: string) => {
  const db = getDatabase()

  // Total products
  const productsResult = await db
    .select({ count: count() })
    .from(products)

  const totalProducts = productsResult[0]?.count || 0

  // Total locations
  let totalLocations = 0
  if (warehouseId) {
    const locResult = await db
      .select({ count: count() })
      .from(locations)
      .where(eq(locations.warehouseId, warehouseId))
    totalLocations = locResult[0]?.count || 0
  } else {
    const locResult = await db
      .select({ count: count() })
      .from(locations)
    totalLocations = locResult[0]?.count || 0
  }

  // Low stock items
  const lowStockResult = await db
    .select({ count: count() })
    .from(inventory)
    .innerJoin(products, eq(inventory.productId, products.id))
    .where(and(
      ...(warehouseId ? [eq(inventory.warehouseId, warehouseId)] : []),
      sql`inventory.quantity < products.min_stock`
    ))
  const lowStockItems = lowStockResult[0]?.count || 0

  // Active orders
  const activeOrdersResult = await db
    .select({ count: count() })
    .from(orders)
    .where(and(
      ...(warehouseId ? [eq(orders.warehouseId, warehouseId)] : []),
      sql`status IN ('pending', 'processing', 'picked')`
    ))
  const activeOrders = activeOrdersResult[0]?.count || 0

  // Movements this week
  const movementsThisWeekResult = await db
    .select({ count: count() })
    .from(movements)
    .where(and(
      ...(warehouseId ? [eq(movements.warehouseId, warehouseId)] : []),
      sql`movement_date >= datetime('now', '-7 days')`
    ))
  const movementsThisWeek = movementsThisWeekResult[0]?.count || 0

  // Stock evolution (last 7 days) - using raw SQL for complex aggregation
  const stockEvolutionSql = warehouseId
    ? `SELECT date(movement_date) as date, SUM(CASE WHEN type IN ('in', 'receipt') THEN quantity ELSE -quantity END) as stock FROM movements WHERE warehouse_id = ? AND movement_date >= datetime('now', '-7 days') GROUP BY date(movement_date) ORDER BY date`
    : `SELECT date(movement_date) as date, SUM(CASE WHEN type IN ('in', 'receipt') THEN quantity ELSE -quantity END) as stock FROM movements WHERE movement_date >= datetime('now', '-7 days') GROUP BY date(movement_date) ORDER BY date`

  const stockEvolutionRows = warehouseId
    ? await getDbRaw().prepare(stockEvolutionSql).all(warehouseId)
    : await getDbRaw().prepare(stockEvolutionSql).all()

  let runningStock = 0
  const stockEvolution = stockEvolutionRows.map((row: any) => {
    const stock = row.stock || 0
    runningStock += stock
    return {
      date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      stock: runningStock,
    }
  })

  // Movements by type
  const movementsByTypeSql = warehouseId
    ? `SELECT type as movementType, COUNT(*) as movements FROM movements WHERE warehouse_id = ? AND movement_date >= datetime('now', '-7 days') GROUP BY type`
    : `SELECT type as movementType, COUNT(*) as movements FROM movements WHERE movement_date >= datetime('now', '-7 days') GROUP BY type`

  const movementsByTypeRows = warehouseId
    ? await getDbRaw().prepare(movementsByTypeSql).all(warehouseId)
    : await getDbRaw().prepare(movementsByTypeSql).all()

  const typeColors: Record<string, string> = {
    in: 'hsl(var(--chart))',
    inbound: 'hsl(var(--chart))',
    receipt: 'hsl(var(--chart))',
    out: 'hsl(142, 76%, 36%)',
    outbound: 'hsl(142, 76%, 36%)',
    shipment: 'hsl(142, 76%, 36%)',
    transfer: 'hsl(25, 95%, 53%)',
    adjustment: 'hsl(25, 95%, 53%)',
  }

  const movementsByType = movementsByTypeRows.map((row: any) => ({
    movementType: row.movementType,
    movements: row.movements,
    fill: typeColors[row.movementType] || 'hsl(var(--muted))',
  }))

  // Top products
  const topProductsSql = warehouseId
    ? `SELECT product_name as product, COUNT(*) as movements FROM movements WHERE warehouse_id = ? AND movement_date >= datetime('now', '-30 days') GROUP BY product_name ORDER BY movements DESC LIMIT 5`
    : `SELECT product_name as product, COUNT(*) as movements FROM movements WHERE movement_date >= datetime('now', '-30 days') GROUP BY product_name ORDER BY movements DESC LIMIT 5`

  const topProducts = warehouseId
    ? await getDbRaw().prepare(topProductsSql).all(warehouseId)
    : await getDbRaw().prepare(topProductsSql).all()

  // Low stock alerts
  const lowStockAlertsSql = warehouseId
    ? `SELECT p.id, p.name as product, i.quantity as currentStock, p.min_stock as minStock, l.code as location, CASE WHEN i.quantity = 0 THEN 'critical' WHEN i.quantity < p.min_stock * 0.5 THEN 'critical' ELSE 'warning' END as severity FROM products p INNER JOIN inventory i ON p.id = i.product_id LEFT JOIN locations l ON i.location_id = l.id WHERE i.warehouse_id = ? AND i.quantity < p.min_stock ORDER BY i.quantity ASC LIMIT 10`
    : `SELECT p.id, p.name as product, i.quantity as currentStock, p.min_stock as minStock, l.code as location, CASE WHEN i.quantity = 0 THEN 'critical' WHEN i.quantity < p.min_stock * 0.5 THEN 'critical' ELSE 'warning' END as severity FROM products p INNER JOIN inventory i ON p.id = i.product_id LEFT JOIN locations l ON i.location_id = l.id WHERE i.quantity < p.min_stock ORDER BY i.quantity ASC LIMIT 10`

  const lowStockAlerts = warehouseId
    ? await getDbRaw().prepare(lowStockAlertsSql).all(warehouseId)
    : await getDbRaw().prepare(lowStockAlertsSql).all()

  // Recent movements
  const recentMovementsSql = warehouseId
    ? `SELECT id, date(movement_date) as date, product_name as product, type, quantity, destination_location_code as "to", source_location_code as "from" FROM movements WHERE warehouse_id = ? ORDER BY movement_date DESC LIMIT 10`
    : `SELECT id, date(movement_date) as date, product_name as product, type, quantity, destination_location_code as "to", source_location_code as "from" FROM movements ORDER BY movement_date DESC LIMIT 10`

  const recentMovementsRows = warehouseId
    ? await getDbRaw().prepare(recentMovementsSql).all(warehouseId)
    : await getDbRaw().prepare(recentMovementsSql).all()

  const recentMovements = recentMovementsRows.map((row: any) => ({
    ...row,
    type: (row.type || '').toLowerCase() as 'in' | 'out' | 'transfer',
  }))

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
  }
}

// Helper function to get raw DB for complex queries
function getDbRaw() {
  return require('./index').getDbRaw()
}

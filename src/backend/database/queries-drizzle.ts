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

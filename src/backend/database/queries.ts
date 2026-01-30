import { getDatabase } from './index'

// ============================================================================
// PRODUCTS
// ============================================================================

/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
export const getProductsByWarehouse = (warehouseId: string) => {
  const db = getDatabase()

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
  `)

  return stmt.all(warehouseId, warehouseId)
}

/**
 * Get a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
export const getProductById = (productId: string) => {
  const db = getDatabase()
  return db.prepare('SELECT * FROM products WHERE id = ?').get(productId)
}

/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
export const getProductBySku = (sku: string) => {
  const db = getDatabase()
  return db.prepare('SELECT * FROM products WHERE sku = ?').get(sku)
}

// ============================================================================
// INVENTORY
// ============================================================================

/**
 * Get all inventory for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of inventory records
 */
export const getInventoryByWarehouse = (filters: {
  warehouseId: string
  productId?: string
  locationId?: string
}) => {
  const db = getDatabase()

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
  `

  const params: any[] = [filters.warehouseId]

  if (filters.productId) {
    sql += ' AND i.product_id = ?'
    params.push(filters.productId)
  }

  if (filters.locationId) {
    sql += ' AND i.location_id = ?'
    params.push(filters.locationId)
  }

  sql += ' ORDER BY p.name'

  const stmt = db.prepare(sql)
  return stmt.all(...params)
}

// ============================================================================
// MOVEMENTS
// ============================================================================

/**
 * Get movements for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of movements
 */
export const getMovementsByWarehouse = (filters: {
  warehouseId: string
  productId?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}) => {
  const db = getDatabase()

  let sql = 'SELECT * FROM movements WHERE warehouse_id = ?'
  const params: any[] = [filters.warehouseId]

  if (filters.productId) {
    sql += ' AND product_id = ?'
    params.push(filters.productId)
  }

  if (filters.type) {
    sql += ' AND type = ?'
    params.push(filters.type)
  }

  if (filters.dateFrom) {
    sql += ' AND movement_date >= ?'
    params.push(filters.dateFrom)
  }

  if (filters.dateTo) {
    sql += ' AND movement_date <= ?'
    params.push(filters.dateTo)
  }

  sql += ' ORDER BY movement_date DESC'

  if (filters.limit) {
    sql += ' LIMIT ?'
    params.push(filters.limit)
  }

  const stmt = db.prepare(sql)
  return stmt.all(...params)
}

/**
 * Get last movement date for a product in a warehouse
 * @param warehouseId - Warehouse ID
 * @param productId - Product ID
 * @returns Last movement date or null
 */
export const getLastMovementDate = (warehouseId: string, productId: string) => {
  const db = getDatabase()

  const result = db
    .prepare(
      'SELECT MAX(movement_date) as last_date FROM movements WHERE warehouse_id = ? AND product_id = ?'
    )
    .get(warehouseId, productId) as { last_date: string | null }

  return result.last_date
}

// ============================================================================
// ORDERS
// ============================================================================

/**
 * Get orders for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of orders
 */
export const getOrdersByWarehouse = (filters: {
  warehouseId: string
  status?: string
  limit?: number
}) => {
  const db = getDatabase()

  let sql = 'SELECT * FROM orders WHERE warehouse_id = ?'
  const params: any[] = [filters.warehouseId]

  if (filters.status) {
    sql += ' AND status = ?'
    params.push(filters.status)
  }

  sql += ' ORDER BY order_date DESC'

  if (filters.limit) {
    sql += ' LIMIT ?'
    params.push(filters.limit)
  }

  const stmt = db.prepare(sql)
  return stmt.all(...params)
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
export const getProductMovementTotals = (
  warehouseId: string,
  type: string,
  dateFrom?: string,
  dateTo?: string
) => {
  const db = getDatabase()

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
  `

  const params: any[] = [warehouseId, type]

  if (dateFrom) {
    sql += ' AND m.movement_date >= ?'
    params.push(dateFrom)
  }

  if (dateTo) {
    sql += ' AND m.movement_date <= ?'
    params.push(dateTo)
  }

  sql += ' GROUP BY m.product_id ORDER BY total_quantity DESC'

  const stmt = db.prepare(sql)
  return stmt.all(...params)
}

/**
 * Get dead stock products
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for considering as dead stock
 * @returns Array of products with last movement date and tied capital
 */
export const getDeadStock = (warehouseId: string, thresholdDays: number = 90) => {
  const db = getDatabase()

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
  `)

  return stmt.all(warehouseId, thresholdDays)
}

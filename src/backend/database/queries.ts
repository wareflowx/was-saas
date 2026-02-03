import { getDbRaw } from './index'

// ============================================================================
// TYPES
// ============================================================================

type DbValue = string | number | null | Buffer
type DbRow = Record<string, DbValue>
type QueryParam = string | number | null | undefined

// ============================================================================
// PRODUCTS
// ============================================================================

/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
export const getProductsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

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
const db = getDbRaw()
  return db.prepare('SELECT * FROM products WHERE id = ?').get(productId)
}

/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
export const getProductBySku = (sku: string) => {
const db = getDbRaw()
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
const db = getDbRaw()

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

  const params: QueryParam[] = [filters.warehouseId]

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
const db = getDbRaw()

  let sql = 'SELECT * FROM movements WHERE warehouse_id = ?'
  const params: QueryParam[] = [filters.warehouseId]

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
const db = getDbRaw()

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
const db = getDbRaw()

  let sql = 'SELECT * FROM orders WHERE warehouse_id = ?'
  const params: QueryParam[] = [filters.warehouseId]

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
const db = getDbRaw()

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

  const params: QueryParam[] = [warehouseId, type]

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
const db = getDbRaw()

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

// ============================================================================
// LOCATIONS
// ============================================================================

/**
 * Get all locations for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of locations with zone, sector, warehouse info and products
 */
export const getLocationsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

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
  `)

  const rows = stmt.all(warehouseId, warehouseId)

  // Parse products_json and calculate KPIs
  const locations = rows.map((row: DbRow) => ({
    ...row,
    products: (row.products_json as string | undefined)
      ? (row.products_json as string).split('|').map((jsonStr: string) => JSON.parse(jsonStr))
      : [],
  }))

  // Calculate KPIs
  const totalLocations = locations.length
  const availableLocations = locations.filter((l: DbRow) => l.status === 'available').length
  const occupiedLocations = locations.filter((l: DbRow) => l.status === 'occupied').length
  const blockedLocations = locations.filter((l: DbRow) => l.status === 'blocked').length
  const reservedLocations = locations.filter((l: DbRow) => l.status === 'reserved').length

  const totalCapacity = locations.reduce((sum: number, l: DbRow) => sum + ((l.capacity as number) || 0), 0)
  const usedCapacity = locations.reduce((sum: number, l: DbRow) => sum + ((l.usedCapacity as number) || 0), 0)

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
  }
}

// ============================================================================
// ZONES
// ============================================================================

/**
 * Get all zones for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Zones data with KPIs calculated
 */
export const getZonesByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

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
  `)

  const rows = stmt.all(warehouseId)

  // Calculate KPIs
  const totalZones = rows.length
  const activeZones = rows.filter((r: DbRow) => r.status === 'active').length
  const totalSurface = rows.reduce((sum: number, r: DbRow) => sum + ((r.surface as number) || 0), 0)
  const totalCapacity = rows.reduce((sum: number, r: DbRow) => sum + ((r.capacity as number) || 0), 0)
  const usedCapacity = rows.reduce((sum: number, r: DbRow) => sum + ((r.usedCapacity as number) || 0), 0)
  const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0

  // Count zones by type
  const zoneTypes: Record<string, number> = {}
  rows.forEach((r: DbRow) => {
    const type = r.type as string
    if (type) {
      zoneTypes[type] = (zoneTypes[type] || 0) + 1
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
 * @returns Sectors data with KPIs calculated
 */
export const getSectorsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

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
  `)

  const rows = stmt.all(warehouseId)

  // Calculate KPIs
  const totalSectors = rows.length
  const activeSectors = rows.filter((r: DbRow) => r.status === 'active').length
  const totalCapacity = rows.reduce((sum: number, r: DbRow) => sum + ((r.capacity as number) || 0), 0)
  const usedCapacity = rows.reduce((sum: number, r: DbRow) => sum + ((r.usedCapacity as number) || 0), 0)
  const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0

  // Count sectors by type
  const sectorTypes: Record<string, number> = {}
  rows.forEach((r: DbRow) => {
    const type = r.type as string
    if (type) {
      sectorTypes[type] = (sectorTypes[type] || 0) + 1
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
 * Get all warehouses with KPIs calculated
 * @returns Warehouses data with KPIs calculated
 */
export const getWarehousesWithKPIs = () => {
const db = getDbRaw()

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
  `)

  const rows = stmt.all()

  // Calculate KPIs
  const totalWarehouses = rows.length
  const activeWarehouses = rows.filter((r: DbRow) => r.status === 'active').length
  const totalSurface = rows.reduce((sum: number, r: DbRow) => sum + ((r.surface as number) || 0), 0)
  const totalCapacity = rows.reduce((sum: number, r: DbRow) => sum + ((r.capacity as number) || 0), 0)
  const usedCapacity = rows.reduce((sum: number, r: DbRow) => sum + ((r.usedCapacity as number) || 0), 0)
  const averageOccupancy = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0
  const trackedPickers = rows.reduce((sum: number, r: DbRow) => sum + ((r.pickerCount as number) || 0), 0)

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
export const getImportHistory = (warehouseId?: string) => {
const db = getDbRaw()

  let stmt
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
    `)
    return stmt.all(warehouseId)
  } else {
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
    `)
    return stmt.all()
  }
}

/**
 * Get dashboard KPIs and summary data
 * @param warehouseId - Warehouse ID (optional, if not provided uses all warehouses)
 * @returns Dashboard data with KPIs, stock evolution, movements by type, top products, low stock alerts, and recent movements
 */
export const getDashboardKPIs = (warehouseId?: string) => {
const db = getDbRaw()

  // KPIs
  let whereParams = warehouseId ? [warehouseId] : []

  // Total products
  const productsStmt = db.prepare(`SELECT COUNT(*) as count FROM products`)
  const totalProducts = productsStmt.get().count

  // Total locations
  const locationsStmt = db.prepare(
    `SELECT COUNT(*) as count FROM locations ${warehouseId ? 'WHERE warehouse_id = ?' : ''}`
  )
  const totalLocations = locationsStmt.get(...whereParams).count

  // Low stock items (quantity < min_stock)
  const lowStockStmt = db.prepare(`
    SELECT COUNT(DISTINCT p.id) as count
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    ${warehouseId ? 'WHERE i.warehouse_id = ? AND' : 'WHERE'}
      i.quantity < p.min_stock
  `)
  const lowStockItems = lowStockStmt.get(...whereParams).count

  // Active orders
  const ordersStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM orders
    ${warehouseId ? 'WHERE warehouse_id = ? AND' : 'WHERE'}
      status IN ('pending', 'processing', 'picked')
  `)
  const activeOrders = ordersStmt.get(...whereParams).count

  // Movements this week (last 7 days)
  const movementsStmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ? AND' : 'WHERE'}
      movement_date >= datetime('now', '-7 days')
  `)
  const movementsThisWeek = movementsStmt.get(...whereParams).count

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
  `)
  const stockEvolutionRows = stockEvolutionStmt.all(...whereParams)

  // Calculate running stock total
  let runningStock = 0
  const stockEvolution = stockEvolutionRows.map((row: DbRow) => {
    const stock = (row.stock as number) || 0
    runningStock += stock
    const dateStr = row.date as string
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      stock: runningStock,
    }
  })

  // Movements by type
  const movementsByTypeStmt = db.prepare(`
    SELECT
      type as movementType,
      COUNT(*) as movements
    FROM movements
    ${warehouseId ? 'WHERE warehouse_id = ?' : 'WHERE 1=1'}
      AND movement_date >= datetime('now', '-7 days')
    GROUP BY type
  `)
  const movementsByTypeRows = movementsByTypeStmt.all(...whereParams)

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

  const movementsByType = movementsByTypeRows.map((row: DbRow) => {
    const movementType = row.movementType as string
    return {
      movementType,
      movements: row.movements,
      fill: typeColors[movementType] || 'hsl(var(--muted))',
    }
  })

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
  `)
  const topProducts = topProductsStmt.all(...whereParams)

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
  `)
  const lowStockAlerts = lowStockAlertsStmt.all(...whereParams)

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
  `)
  const recentMovements = recentMovementsStmt.all(...whereParams).map((row: DbRow) => ({
    ...row,
    type: ((row.type as string) || '').toLowerCase() as 'in' | 'out' | 'transfer',
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

// ============================================================================
// OPERATIONS - RECEIPTS
// ============================================================================

/**
 * Get all receptions for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Receptions data with KPIs calculated
 */
export const getReceptionsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

  // Get receptions with supplier info
  const stmt = db.prepare(`
    SELECT DISTINCT
      r.id,
      r.reception_number as receptionNumber,
      r.warehouse_id as warehouseId,
      r.supplier_id as supplierId,
      r.supplier_name as supplierName,
      r.expected_date as expectedDate,
      r.received_date as receivedDate,
      r.status,
      r.priority,
      r.total_quantity as totalQuantity,
      r.received_quantity as receivedQuantity,
      r.rejected_quantity as rejectedQuantity,
      r.total_amount as totalAmount,
      r.carrier,
      r.tracking_number as trackingNumber,
      r.receiver,
      r.notes,
      r.created_at as createdAt,
      r.updated_at as lastUpdated,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM receptions r
    LEFT JOIN warehouses w ON r.warehouse_id = w.id
    WHERE r.warehouse_id = ?
    ORDER BY r.expected_date DESC
  `)

  const rows = stmt.all(warehouseId)

  // Calculate KPIs
  const totalReceptions = rows.length
  const pendingReceptions = rows.filter((r: DbRow) => r.status === 'pending').length
  const inProgressReceptions = rows.filter((r: DbRow) => r.status === 'in_progress').length
  const completedReceptions = rows.filter((r: DbRow) => r.status === 'completed').length

  const totalQuantity = rows.reduce((sum: number, r: DbRow) => sum + ((r.totalQuantity as number) || 0), 0)
  const receivedQuantity = rows.reduce((sum: number, r: DbRow) => sum + ((r.receivedQuantity as number) || 0), 0)
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
export const getReceptionLines = (receptionId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT
      rl.id,
      rl.product_id as productId,
      rl.product_sku as productSku,
      rl.product_name as productName,
      rl.ordered_quantity as orderedQuantity,
      rl.received_quantity as receivedQuantity,
      rl.rejected_quantity as rejectedQuantity,
      rl.unit_price as unitPrice,
      rl.total_price as totalPrice,
      rl.reason,
      rl.status,
      rl.created_at as createdAt,
      rl.updated_at as lastUpdated
    FROM reception_lines rl
    WHERE rl.reception_id = ?
    ORDER BY rl.created_at
  `)

  return stmt.all(receptionId)
}

// ============================================================================
// OPERATIONS - PICKINGS
// ============================================================================

/**
 * Get all pickings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Pickings data with KPIs calculated
 */
export const getPickingsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT DISTINCT
      p.id,
      p.picking_number as pickingNumber,
      p.warehouse_id as warehouseId,
      p.order_id as orderId,
      p.order_number as orderNumber,
      p.customer_id as customerId,
      p.customer_name as customerName,
      p.assigned_date as assignedDate,
      p.started_date as startedDate,
      p.completed_date as completedDate,
      p.status,
      p.priority,
      p.total_quantity as totalQuantity,
      p.picked_quantity as pickedQuantity,
      p.remaining_quantity as remainingQuantity,
      p.picker,
      p.picker_id as pickerId,
      p.notes,
      p.created_at as createdAt,
      p.updated_at as lastUpdated,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM pickings p
    LEFT JOIN warehouses w ON p.warehouse_id = w.id
    WHERE p.warehouse_id = ?
    ORDER BY p.assigned_date DESC
  `)

  const rows = stmt.all(warehouseId)

  // Calculate KPIs
  const totalPickings = rows.length
  const pendingPickings = rows.filter((r: DbRow) => r.status === 'pending').length
  const inProgressPickings = rows.filter((r: DbRow) => r.status === 'in_progress').length
  const completedPickings = rows.filter((r: DbRow) => r.status === 'completed').length

  const totalLines = rows.reduce((sum: number, r: DbRow) => sum + ((r.totalQuantity as number) || 0), 0)
  const pickedLines = rows.reduce((sum: number, r: DbRow) => sum + ((r.pickedQuantity as number) || 0), 0)
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
export const getPickingLines = (pickingId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT
      pl.id,
      pl.product_id as productId,
      pl.product_sku as productSku,
      pl.product_name as productName,
      pl.location_code as locationCode,
      pl.zone_name as zoneName,
      pl.quantity,
      pl.picked_quantity as pickedQuantity,
      pl.unit,
      pl.status,
      pl.processed_by_user_id as processedByUserId,
      pl.started_at as startedAt,
      pl.completed_at as completedAt,
      pl.duration_ms as durationMs,
      pl.created_at as createdAt,
      pl.updated_at as lastUpdated
    FROM picking_lines pl
    WHERE pl.picking_id = ?
    ORDER BY pl.created_at
  `)

  return stmt.all(pickingId)
}

// ============================================================================
// OPERATIONS - RETURNS
// ============================================================================

/**
 * Get all returns for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Returns data with KPIs calculated
 */
export const getReturnsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT DISTINCT
      r.id,
      r.return_number as returnNumber,
      r.warehouse_id as warehouseId,
      r.order_id as orderId,
      r.order_number as orderNumber,
      r.customer_id as customerId,
      r.customer_name as customerName,
      r.return_date as returnDate,
      r.type,
      r.status,
      r.priority,
      r.reason,
      r.reason_label as reasonLabel,
      r.total_quantity as totalQuantity,
      r.total_amount as totalAmount,
      r.refunded_amount as refundedAmount,
      r.processor,
      r.completed_date as completedDate,
      r.created_at as createdAt,
      r.updated_at as lastUpdated,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM returns r
    LEFT JOIN warehouses w ON r.warehouse_id = w.id
    WHERE r.warehouse_id = ?
    ORDER BY r.return_date DESC
  `)

  const rows = stmt.all(warehouseId)

  // Calculate KPIs
  const totalReturns = rows.length
  const pendingReturns = rows.filter((r: DbRow) => r.status === 'pending').length
  const inProgressReturns = rows.filter((r: DbRow) => r.status === 'in_progress').length
  const completedReturns = rows.filter((r: DbRow) => r.status === 'completed').length

  const totalQuantity = rows.reduce((sum: number, r: DbRow) => sum + ((r.totalQuantity as number) || 0), 0)
  const returnedQuantity = rows.filter((r: DbRow) => r.status === 'completed').reduce(
    (sum: number, r: DbRow) => sum + ((r.totalQuantity as number) || 0),
    0
  )
  const pendingQuantity = totalQuantity - returnedQuantity

  const totalValue = rows.reduce((sum: number, r: DbRow) => sum + ((r.totalAmount as number) || 0), 0)
  const refundedValue = rows.reduce((sum: number, r: DbRow) => sum + ((r.refundedAmount as number) || 0), 0)

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
export const getReturnLines = (returnId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT
      rl.id,
      rl.product_id as productId,
      rl.product_sku as productSku,
      rl.product_name as productName,
      rl.quantity,
      rl.unit_price as unitPrice,
      rl.total_price as totalPrice,
      rl.condition as itemCondition,
      rl.resolution,
      rl.status,
      rl.processed_by_user_id as processedByUserId,
      rl.started_at as startedAt,
      rl.completed_at as completedAt,
      rl.duration_ms as durationMs,
      rl.created_at as createdAt,
      rl.updated_at as lastUpdated
    FROM return_lines rl
    WHERE rl.return_id = ?
    ORDER BY rl.created_at
  `)

  return stmt.all(returnId)
}

// ============================================================================
// OPERATIONS - RESTOCKINGS
// ============================================================================

/**
 * Get all restockings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Restockings data with KPIs calculated
 */
export const getRestockingsByWarehouse = (warehouseId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT DISTINCT
      r.id,
      r.restocking_number as restockingNumber,
      r.warehouse_id as warehouseId,
      r.status,
      r.priority,
      r.total_products as totalProducts,
      r.restocked_products as restockedProducts,
      r.requester,
      r.assigned_to as assignedTo,
      r.requested_date as requestedDate,
      r.started_date as startedDate,
      r.completed_date as completedDate,
      r.created_at as createdAt,
      r.updated_at as lastUpdated,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM restockings r
    LEFT JOIN warehouses w ON r.warehouse_id = w.id
    WHERE r.warehouse_id = ?
    ORDER BY r.requested_date DESC
  `)

  const rows = stmt.all(warehouseId)

  // Calculate KPIs
  const totalRestockings = rows.length
  const pendingRestockings = rows.filter((r: DbRow) => r.status === 'pending').length
  const inProgressRestockings = rows.filter((r: DbRow) => r.status === 'in_progress').length
  const completedRestockings = rows.filter((r: DbRow) => r.status === 'completed').length

  const totalProducts = rows.reduce((sum: number, r: DbRow) => sum + ((r.totalProducts as number) || 0), 0)
  const restockedProducts = rows.reduce((sum: number, r: DbRow) => sum + ((r.restockedProducts as number) || 0), 0)
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
export const getRestockingLines = (restockingId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT
      rl.id,
      rl.product_id as productId,
      rl.product_sku as productSku,
      rl.product_name as productName,
      rl.source_location_id as sourceLocationId,
      rl.destination_location_id as destinationLocationId,
      rl.current_quantity as currentQuantity,
      rl.target_quantity as targetQuantity,
      rl.quantity_to_restock as quantityToRestock,
      rl.unit,
      rl.status,
      rl.processed_by_user_id as processedByUserId,
      rl.started_at as startedAt,
      rl.completed_at as completedAt,
      rl.duration_ms as durationMs,
      rl.created_at as createdAt,
      rl.updated_at as lastUpdated
    FROM restocking_lines rl
    WHERE rl.restocking_id = ?
    ORDER BY rl.created_at
  `)

  return stmt.all(restockingId)
}

// ============================================================================
// OPERATIONS - ORDERS WITH LINES
// ============================================================================

/**
 * Get orders for a warehouse with lines and KPIs
 * @param warehouseId - Warehouse ID
 * @returns Orders data with KPIs calculated
 */
export const getOrdersByWarehouseWithLines = (warehouseId: string) => {
const db = getDbRaw()

  const stmt = db.prepare(`
    SELECT DISTINCT
      o.id,
      o.order_number as orderNumber,
      o.warehouse_id as warehouseId,
      o.customer_id as customerId,
      o.customer_name as customerName,
      o.customer_email as customerEmail,
      o.order_date as orderDate,
      o.required_date as requiredDate,
      o.promised_date as promisedDate,
      o.shipped_date as shippedDate,
      o.delivered_date as deliveredDate,
      o.status,
      o.priority,
      o.total_quantity as totalQuantity,
      o.total_amount as totalAmount,
      o.shipping_address as shippingAddress,
      o.shipping_city as shippingCity,
      o.shipping_country as shippingCountry,
      o.tracking_number as trackingNumber,
      o.carrier,
      o.notes,
      o.picker,
      o.packer,
      o.created_at as createdAt,
      o.updated_at as lastUpdated,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM orders o
    LEFT JOIN warehouses w ON o.warehouse_id = w.id
    WHERE o.warehouse_id = ?
    ORDER BY o.order_date DESC
  `)

  const rows = stmt.all(warehouseId)

  // Get lines for each order
  const ordersWithLines = rows.map((row: DbRow) => {
    const linesStmt = db.prepare(`
      SELECT
        ol.id,
        ol.product_id as productId,
        ol.product_sku as productSku,
        ol.product_name as productName,
        ol.quantity,
        ol.picked_quantity as pickedQuantity,
        ol.unit_price as unitPrice,
        ol.total_price as totalPrice,
        ol.created_at as createdAt,
        ol.updated_at as lastUpdated
      FROM order_lines ol
      WHERE ol.order_id = ?
      ORDER BY ol.created_at
    `)

    const lines = linesStmt.all(row.id as string)

    return {
      ...row,
      lines,
    }
  })

  // Calculate KPIs
  const totalOrders = rows.length
  const pendingOrders = rows.filter((r: DbRow) => r.status === 'pending').length
  const inProgressOrders = rows.filter((r: DbRow) => r.status === 'processing' || r.status === 'picking').length
  const shippedOrders = rows.filter((r: DbRow) => r.status === 'shipped').length
  const deliveredOrders = rows.filter((r: DbRow) => r.status === 'delivered').length
  const cancelledOrders = rows.filter((r: DbRow) => r.status === 'cancelled').length

  const totalValue = rows.reduce((sum: number, r: DbRow) => sum + ((r.totalAmount as number) || 0), 0)
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


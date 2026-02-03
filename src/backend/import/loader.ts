/**
 * Data Loader using Drizzle ORM
 * Handles bulk insertion of normalized data into SQLite database
 */

import type { NormalizedData } from './types'
import { getDatabase, getDbRaw, warehouses as warehousesTable, users as usersTable, suppliers as suppliersTable, customers as customersTable, purchaseOrders as purchaseOrdersTable, purchaseOrderLines as purchaseOrderLinesTable, zones as zonesTable, sectors as sectorsTable, locations as locationsTable, products as productsTable, inventory as inventoryTable, movements as movementsTable, orders as ordersTable, orderLines as orderLinesTable, pickings as pickingsTable, pickingLines as pickingLinesTable, receptions as receptionsTable, receptionLines as receptionLinesTable, restockings as restockingsTable, restockingLines as restockingLinesTable, returns as returnsTable, returnLines as returnLinesTable, shipments as shipmentsTable, shipmentLines as shipmentLinesTable } from '../database/index'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date to ISO string for SQLite storage
 */
function formatDate(date: Date): string {
  return date.toISOString()
}

/**
 * Bulk insert with transaction support
 */
function bulkInsert<T>(
  table: any,
  data: readonly T[],
  transform: (item: T) => any,
  entityName: string
): number {
  if (data.length === 0) return 0

  const db = getDatabase()
  const sqlite = getDbRaw()
  let inserted = 0

  // Use SQLite transaction for better performance
  const insertMany = sqlite.transaction((items: readonly T[]) => {
    for (const item of items) {
      try {
        db.insert(table)
          .values(transform(item))
          .onConflictDoNothing()
          .run()
        inserted++
      } catch (error) {
        console.error(`Error inserting ${entityName}:`, error)
      }
    }
  })

  insertMany(data)
  console.log(`✅ [DB INSERT] ${entityName}:`, { inserted, total: data.length })

  return inserted
}

// ============================================================================
// WAREHOUSE STRUCTURE
// ============================================================================

export const insertWarehouses = (warehouses: readonly any[]): number => {
  return bulkInsert(
    warehousesTable,
    warehouses,
    (w) => ({
      id: w.id,
      code: w.code,
      name: w.name,
      city: w.city,
      country: w.country,
      surface: w.surface,
      capacity: w.capacity,
      manager: w.manager,
      email: w.email,
      phone: w.phone,
      status: w.status,
      openingDate: w.openingDate ? formatDate(w.openingDate) : null,
    }),
    'Warehouses'
  )
}

export const insertUsers = (users: readonly any[]): number => {
  return bulkInsert(
    usersTable,
    users,
    (u) => ({
      id: u.id,
      warehouseId: u.warehouseId,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
    }),
    'Users'
  )
}

export const insertSuppliers = (suppliers: readonly any[]): number => {
  return bulkInsert(
    suppliersTable,
    suppliers,
    (s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      contactPerson: s.contactPerson,
      email: s.email,
      phone: s.phone,
      address: s.address,
      city: s.city,
      country: s.country,
      paymentTerms: s.paymentTerms,
      leadTimeDays: s.leadTimeDays,
      status: s.status,
    }),
    'Suppliers'
  )
}

export const insertCustomers = (customers: readonly any[]): number => {
  return bulkInsert(
    customersTable,
    customers,
    (c) => ({
      id: c.id,
      customerCode: c.customerCode,
      name: c.name,
      email: c.email,
      phone: c.phone,
      billingAddress: c.billingAddress,
      shippingAddress: c.shippingAddress,
      city: c.city,
      country: c.country,
      customerType: c.customerType,
      creditLimit: c.creditLimit,
      status: c.status,
    }),
    'Customers'
  )
}

export const insertPurchaseOrders = (purchaseOrders: readonly any[]): number => {
  return bulkInsert(
    purchaseOrdersTable,
    purchaseOrders,
    (po) => ({
      id: po.id,
      warehouseId: po.warehouseId,
      supplierId: po.supplierId,
      purchaseOrderNumber: po.purchaseOrderNumber,
      orderDate: formatDate(po.orderDate),
      expectedDate: po.expectedDate ? formatDate(po.expectedDate) : null,
      status: po.status,
      requestedBy: po.requestedBy,
      totalAmount: po.totalAmount,
      notes: po.notes,
    }),
    'PurchaseOrders'
  )
}

export const insertPurchaseOrderLines = (purchaseOrderLines: readonly any[]): number => {
  return bulkInsert(
    purchaseOrderLinesTable,
    purchaseOrderLines,
    (line) => ({
      id: line.id,
      purchaseOrderId: line.purchaseOrderId,
      productId: line.productId,
      quantity: line.quantity,
      receivedQuantity: line.receivedQuantity,
      unitPrice: line.unitPrice,
      totalPrice: line.totalPrice,
    }),
    'PurchaseOrderLines'
  )
}

// ============================================================================
// LOCATIONS
// ============================================================================

export const insertZones = (zones: readonly any[]): number => {
  return bulkInsert(
    zonesTable,
    zones,
    (z) => ({
      id: z.id,
      warehouseId: z.warehouseId,
      code: z.code,
      name: z.name,
      type: z.type,
      surface: z.surface,
      capacity: z.capacity,
      status: z.status,
    }),
    'Zones'
  )
}

export const insertSectors = (sectors: readonly any[]): number => {
  return bulkInsert(
    sectorsTable,
    sectors,
    (s) => ({
      id: s.id,
      warehouseId: s.warehouseId,
      zoneId: s.zoneId,
      code: s.code,
      name: s.name,
      type: s.type,
      capacity: s.capacity,
      status: s.status,
    }),
    'Sectors'
  )
}

export const insertLocations = (locations: readonly any[]): number => {
  return bulkInsert(
    locationsTable,
    locations,
    (l) => ({
      id: l.id,
      warehouseId: l.warehouseId,
      zoneId: l.zoneId,
      sectorId: l.sectorId,
      code: l.code,
      type: l.type,
      capacity: l.capacity,
      usedCapacity: l.usedCapacity,
      productCount: l.productCount,
      pickerCount: l.pickerCount,
      aisle: l.aisle,
      level: l.level,
      position: l.position,
      barcode: l.barcode,
      status: l.status,
    }),
    'Locations'
  )
}

// ============================================================================
// PRODUCTS & INVENTORY
// ============================================================================

export const insertProducts = (products: readonly any[]): number => {
  return bulkInsert(
    productsTable,
    products,
    (p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory,
      brand: p.brand,
      unit: p.unit,
      weight: p.weight,
      volume: p.volume,
      minStock: p.minStock,
      maxStock: p.maxStock,
      reorderPoint: p.reorderPoint,
      reorderQuantity: p.reorderQuantity,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      supplier: p.supplier,
      status: p.status,
    }),
    'Products'
  )
}

export const insertInventory = (
  _warehouseId: string,
  inventory: readonly any[]
): number => {
  return bulkInsert(
    inventoryTable,
    inventory,
    (inv) => ({
      id: `${_warehouseId}-${inv.productId}-${inv.locationId || 'default'}`,
      warehouseId: _warehouseId,
      productId: inv.productId,
      locationId: inv.locationId,
      quantity: inv.quantity,
      availableQuantity: inv.availableQuantity,
      reservedQuantity: inv.reservedQuantity,
    }),
    'Inventory'
  )
}

export const insertMovements = (movements: readonly any[]): number => {
  return bulkInsert(
    movementsTable,
    movements,
    (m) => ({
      id: `${m.warehouseId}-${m.productId}-${m.movementDate.getTime()}-${Math.random().toString(36).substring(2, 15)}`,
      warehouseId: m.warehouseId,
      productId: m.productId,
      productSku: m.productSku,
      productName: m.productName,
      type: m.type,
      sourceLocationId: m.sourceLocationId,
      sourceZone: m.sourceZone,
      sourceLocationCode: m.sourceLocationCode,
      destinationLocationId: m.destinationLocationId,
      destinationZone: m.destinationZone,
      destinationLocationCode: m.destinationLocationCode,
      quantity: m.quantity,
      unit: m.unit,
      movementDate: formatDate(m.movementDate),
      user: m.user,
      reason: m.reason,
      lot: m.lot,
      expirationDate: m.expirationDate ? formatDate(m.expirationDate) : null,
      referenceType: m.referenceType,
      referenceId: m.referenceId,
    }),
    'Movements'
  )
}

// ============================================================================
// ORDERS
// ============================================================================

export const insertOrders = (orders: readonly any[], orderLines: readonly any[]): { orders: number, lines: number } => {
  const ordersInserted = bulkInsert(
    ordersTable,
    orders,
    (o) => ({
      id: o.id,
      warehouseId: o.warehouseId,
      orderNumber: o.orderNumber,
      customerId: o.customerId,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      orderDate: formatDate(o.orderDate),
      requiredDate: formatDate(o.requiredDate),
      promisedDate: o.promisedDate ? formatDate(o.promisedDate) : null,
      status: o.status,
      priority: o.priority,
      totalQuantity: o.totalQuantity,
      totalAmount: o.totalAmount,
      shippingAddress: o.shippingAddress,
      shippingCity: o.shippingCity,
      shippingCountry: o.shippingCountry,
    }),
    'Orders'
  )

  const linesInserted = bulkInsert(
    orderLinesTable,
    orderLines,
    (l) => ({
      id: l.id,
      orderId: l.orderId,
      warehouseId: l.warehouseId,
      productId: l.productId,
      productSku: l.productSku,
      productName: l.productName,
      quantity: l.quantity,
      pickedQuantity: l.pickedQuantity,
      unitPrice: l.unitPrice,
      totalPrice: l.totalPrice,
    }),
    'OrderLines'
  )

  return { orders: ordersInserted, lines: linesInserted }
}

// ============================================================================
// PICKING OPERATIONS
// ============================================================================

export const insertPickings = (pickings: readonly any[], pickingLines: readonly any[]): { pickings: number, lines: number } => {
  const pickingsInserted = bulkInsert(
    pickingsTable,
    pickings,
    (p) => ({
      id: p.id,
      warehouseId: p.warehouseId,
      orderId: p.orderId,
      orderNumber: p.orderNumber,
      customerId: p.customerId,
      customerName: p.customerName,
      pickingNumber: p.pickingNumber,
      assignedDate: formatDate(p.assignedDate),
      status: p.status,
      priority: p.priority,
      totalQuantity: p.totalQuantity,
      pickedQuantity: p.pickedQuantity,
      remainingQuantity: p.totalQuantity - p.pickedQuantity,
      picker: p.picker,
    }),
    'Pickings'
  )

  const linesInserted = bulkInsert(
    pickingLinesTable,
    pickingLines,
    (l) => ({
      id: l.id,
      pickingId: l.pickingId,
      warehouseId: l.warehouseId,
      productId: l.productId,
      productSku: l.productSku,
      productName: l.productName,
      locationCode: l.locationCode,
      zoneName: l.zoneName,
      quantity: l.quantity,
      pickedQuantity: l.pickedQuantity,
      unit: l.unit,
      status: l.status,
    }),
    'PickingLines'
  )

  return { pickings: pickingsInserted, lines: linesInserted }
}

// ============================================================================
// RECEPTIONS
// ============================================================================

export const insertReceptions = (receptions: readonly any[], receptionLines: readonly any[]): { receptions: number, lines: number } => {
  const receptionsInserted = bulkInsert(
    receptionsTable,
    receptions,
    (r) => ({
      id: r.id,
      warehouseId: r.warehouseId,
      supplierId: r.supplierId,
      supplierName: r.supplierName,
      receptionNumber: r.receptionNumber,
      expectedDate: formatDate(r.expectedDate),
      receivedDate: r.receivedDate ? formatDate(r.receivedDate) : null,
      status: r.status,
      priority: r.priority,
      totalQuantity: r.totalQuantity,
      receivedQuantity: r.receivedQuantity,
      rejectedQuantity: r.rejectedQuantity || 0,
      totalAmount: r.totalAmount || 0,
    }),
    'Receptions'
  )

  const linesInserted = bulkInsert(
    receptionLinesTable,
    receptionLines,
    (l) => ({
      id: l.id,
      receptionId: l.receptionId,
      warehouseId: l.warehouseId,
      productId: l.productId,
      productSku: l.productSku,
      productName: l.productName,
      orderedQuantity: l.orderedQuantity,
      receivedQuantity: l.receivedQuantity,
      rejectedQuantity: l.rejectedQuantity,
      unitPrice: l.unitPrice,
      totalPrice: l.totalPrice,
    }),
    'ReceptionLines'
  )

  return { receptions: receptionsInserted, lines: linesInserted }
}

// ============================================================================
// RESTOCKING
// ============================================================================

export const insertRestockings = (restockings: readonly any[], restockingLines: readonly any[]): { restockings: number, lines: number } => {
  const restockingsInserted = bulkInsert(
    restockingsTable,
    restockings,
    (r) => ({
      id: r.id,
      warehouseId: r.warehouseId,
      restockingNumber: r.restockingNumber,
      status: r.status,
      priority: r.priority,
      requester: r.requester,
      requestedDate: formatDate(r.requestedDate),
    }),
    'Restockings'
  )

  const linesInserted = bulkInsert(
    restockingLinesTable,
    restockingLines,
    (l) => ({
      id: l.id,
      restockingId: l.restockingId,
      warehouseId: l.warehouseId,
      productId: l.productId,
      productSku: l.productSku,
      productName: l.productName,
      sourceLocationId: l.sourceLocationId,
      destinationLocationId: l.destinationLocationId,
      currentQuantity: l.currentQuantity,
      targetQuantity: l.targetQuantity,
      quantityToRestock: l.quantityToRestock,
      unit: l.unit,
      status: l.status,
    }),
    'RestockingLines'
  )

  return { restockings: restockingsInserted, lines: linesInserted }
}

// ============================================================================
// RETURNS
// ============================================================================

export const insertReturns = (returns: readonly any[], returnLines: readonly any[]): { returns: number, lines: number } => {
  const returnsInserted = bulkInsert(
    returnsTable,
    returns,
    (r) => ({
      id: r.id,
      warehouseId: r.warehouseId,
      orderId: r.orderId,
      orderNumber: r.orderNumber,
      returnNumber: r.returnNumber,
      customerId: r.customerId,
      customerName: r.customerName,
      returnDate: formatDate(r.returnDate),
      type: r.type,
      status: r.status,
      priority: r.priority,
      reason: r.reason,
      reasonLabel: r.reasonLabel,
      totalQuantity: r.totalQuantity,
      totalAmount: r.totalAmount || 0,
      refundedAmount: r.refundedAmount || 0,
      processor: r.processor,
      completedDate: r.completedDate ? formatDate(r.completedDate) : null,
    }),
    'Returns'
  )

  const linesInserted = bulkInsert(
    returnLinesTable,
    returnLines,
    (l) => ({
      id: l.id,
      returnId: l.returnId,
      warehouseId: l.warehouseId,
      productId: l.productId,
      productSku: l.productSku,
      productName: l.productName,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      totalPrice: l.totalPrice,
      condition: l.condition,
      resolution: l.resolution,
    }),
    'ReturnLines'
  )

  return { returns: returnsInserted, lines: linesInserted }
}

// ============================================================================
// SHIPMENTS
// ============================================================================

export const insertShipments = (shipments: readonly any[], shipmentLines: readonly any[]): { shipments: number, lines: number } => {
  const shipmentsInserted = bulkInsert(
    shipmentsTable,
    shipments,
    (s) => ({
      id: s.id,
      warehouseId: s.warehouseId,
      orderId: s.orderId,
      shipmentNumber: s.shipmentNumber,
      shipmentDate: formatDate(s.shipmentDate),
      carrier: s.carrier,
      trackingNumber: s.trackingNumber,
      status: s.status,
      shippingAddress: s.shippingAddress,
      shippingCity: s.shippingCity,
      shippingCountry: s.shippingCountry,
    }),
    'Shipments'
  )

  const linesInserted = bulkInsert(
    shipmentLinesTable,
    shipmentLines,
    (l) => ({
      id: l.id,
      shipmentId: l.shipmentId,
      productId: l.productId,
      quantity: l.quantity,
    }),
    'ShipmentLines'
  )

  return { shipments: shipmentsInserted, lines: linesInserted }
}

// ============================================================================
// MAIN LOADER FUNCTION
// ============================================================================

/**
 * Load normalized data into database
 * @param data - Normalized data from plugin
 * @returns Import statistics
 */
export const loadToDatabase = (data: NormalizedData): {
  productsImported: number
  inventoryImported: number
  movementsImported: number
  warehousesImported?: number
  usersImported?: number
  suppliersImported?: number
  customersImported?: number
  purchaseOrdersImported?: number
  zonesImported?: number
  sectorsImported?: number
  locationsImported?: number
  ordersImported?: number
  pickingsImported?: number
  receptionsImported?: number
  restockingsImported?: number
  returnsImported?: number
  shipmentsImported?: number
} => {
  const stats = {
    productsImported: 0,
    inventoryImported: 0,
    movementsImported: 0,
    warehousesImported: 0,
    usersImported: 0,
    suppliersImported: 0,
    customersImported: 0,
    purchaseOrdersImported: 0,
    zonesImported: 0,
    sectorsImported: 0,
    locationsImported: 0,
    ordersImported: 0,
    pickingsImported: 0,
    receptionsImported: 0,
    restockingsImported: 0,
    returnsImported: 0,
    shipmentsImported: 0,
  }

  // Insert in correct order (respecting foreign keys)

  if (data.warehouses?.length) {
    stats.warehousesImported = insertWarehouses(data.warehouses)
  }

  if (data.users?.length) {
    stats.usersImported = insertUsers(data.users)
  }

  if (data.suppliers?.length) {
    stats.suppliersImported = insertSuppliers(data.suppliers)
  }

  if (data.customers?.length) {
    stats.customersImported = insertCustomers(data.customers)
  }

  if (data.purchaseOrders?.length) {
    stats.purchaseOrdersImported = insertPurchaseOrders(data.purchaseOrders)
  }

  if (data.purchaseOrderLines?.length) {
    insertPurchaseOrderLines(data.purchaseOrderLines)
  }

  if (data.zones?.length) {
    console.log('📍 [DB] Inserting zones...')
    stats.zonesImported = insertZones(data.zones)
  }

  if (data.sectors?.length) {
    console.log('📍 [DB] Inserting sectors...')
    stats.sectorsImported = insertSectors(data.sectors)
  }

  if (data.locations?.length) {
    console.log('📍 [DB] Inserting locations...')
    stats.locationsImported = insertLocations(data.locations)
  }

  if (data.products.length) {
    console.log('📦 [DB] Inserting products...')
    stats.productsImported = insertProducts(data.products)
  }

  if (data.inventory.length) {
    console.log('📊 [DB] Inserting inventory...')
    stats.inventoryImported = insertInventory(data.metadata.warehouseId, data.inventory)
  }

  if (data.movements.length) {
    console.log('🚚 [DB] Inserting movements...')
    stats.movementsImported = insertMovements(data.movements)
  }

  if (data.orders?.length) {
    console.log('📋 [DB] Inserting orders...')
    const results = insertOrders(data.orders, data.orderLines || [])
    stats.ordersImported = results.orders
  }

  if (data.pickings?.length) {
    console.log('📦 [DB] Inserting pickings...')
    const results = insertPickings(data.pickings, data.pickingLines || [])
    stats.pickingsImported = results.pickings
  }

  if (data.receptions?.length) {
    console.log('📥 [DB] Inserting receptions...')
    const results = insertReceptions(data.receptions, data.receptionLines || [])
    stats.receptionsImported = results.receptions
  }

  if (data.restockings?.length) {
    console.log('🔄 [DB] Inserting restockings...')
    const results = insertRestockings(data.restockings, data.restockingLines || [])
    stats.restockingsImported = results.restockings
  }

  if (data.returns?.length) {
    console.log('↩️ [DB] Inserting returns...')
    const results = insertReturns(data.returns, data.returnLines || [])
    stats.returnsImported = results.returns
  }

  if (data.shipments?.length) {
    const results = insertShipments(data.shipments, data.shipmentLines || [])
    stats.shipmentsImported = results.shipments
  }

  return stats
}

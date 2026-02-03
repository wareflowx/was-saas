/**
 * Drizzle ORM Schema for Wareflow
 *
 * This schema defines all database tables using Drizzle ORM.
 * All types are automatically generated from this schema.
 */

import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// ============================================================================
// WAREHOUSE STRUCTURE
// ============================================================================

export const warehouses = sqliteTable('warehouses', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  surface: real('surface'),
  capacity: integer('capacity'),
  usedCapacity: integer('used_capacity').default(0),
  zoneCount: integer('zone_count').default(0),
  pickerCount: integer('picker_count').default(0),
  manager: text('manager'),
  email: text('email'),
  phone: text('phone'),
  status: text('status').notNull(),
  openingDate: text('opening_date'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
})

export const zones = sqliteTable('zones', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  surface: real('surface'),
  capacity: integer('capacity'),
  usedCapacity: integer('used_capacity').default(0),
  sectorCount: integer('sector_count').default(0),
  locationCount: integer('location_count').default(0),
  pickerCount: integer('picker_count').default(0),
  temperatureMin: real('temperature_min'),
  temperatureMax: real('temperature_max'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_zones_warehouse').on(table.warehouseId),
}))

export const sectors = sqliteTable('sectors', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  zoneId: text('zone_id').notNull().references(() => zones.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  capacity: integer('capacity'),
  usedCapacity: integer('used_capacity').default(0),
  locationCount: integer('location_count').default(0),
  pickerCount: integer('picker_count').default(0),
  aisle: text('aisle'),
  level: integer('level'),
  position: text('position'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_sectors_warehouse').on(table.warehouseId),
  zoneIdx: index('idx_sectors_zone').on(table.zoneId),
}))

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  zoneId: text('zone_id').notNull().references(() => zones.id, { onDelete: 'cascade' }),
  sectorId: text('sector_id').notNull().references(() => sectors.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  type: text('type').notNull(),
  capacity: integer('capacity'),
  usedCapacity: integer('used_capacity').default(0),
  productCount: integer('product_count').default(0),
  pickerCount: integer('picker_count').default(0),
  aisle: text('aisle'),
  level: integer('level'),
  position: text('position'),
  barcode: text('barcode'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_locations_warehouse').on(table.warehouseId),
  zoneIdx: index('idx_locations_zone').on(table.zoneId),
  sectorIdx: index('idx_locations_sector').on(table.sectorId),
}))

// ============================================================================
// PRODUCTS & INVENTORY
// ============================================================================

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  brand: text('brand'),
  unit: text('unit').notNull(),
  weight: real('weight'),
  volume: real('volume'),
  minStock: integer('min_stock').default(0),
  maxStock: integer('max_stock'),
  reorderPoint: integer('reorder_point'),
  reorderQuantity: integer('reorder_quantity'),
  costPrice: real('cost_price'),
  sellingPrice: real('selling_price'),
  supplier: text('supplier'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  skuIdx: index('idx_products_sku').on(table.sku),
  categoryIdx: index('idx_products_category').on(table.category),
}))

export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  locationId: text('location_id').references(() => locations.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull().default(0),
  availableQuantity: integer('available_quantity').notNull().default(0),
  reservedQuantity: integer('reserved_quantity').notNull().default(0),
  lastReceivedAt: text('last_received_at'),
  lastShippedAt: text('last_shipped_at'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_inventory_warehouse').on(table.warehouseId),
  productIdx: index('idx_inventory_product').on(table.productId),
  locationIdx: index('idx_inventory_location').on(table.locationId),
  warehouseProductIdx: index('idx_inventory_warehouse_product').on(table.warehouseId, table.productId),
}))

// ============================================================================
// SUPPLIERS
// ============================================================================

export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  country: text('country'),
  paymentTerms: text('payment_terms'),
  leadTimeDays: integer('lead_time_days'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
})

// ============================================================================
// CUSTOMERS
// ============================================================================

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  customerCode: text('customer_code').notNull().unique(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  billingAddress: text('billing_address'),
  shippingAddress: text('shipping_address'),
  city: text('city'),
  country: text('country'),
  customerType: text('customer_type'),
  creditLimit: real('credit_limit'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
})

// ============================================================================
// ORDERS (Sales orders)
// ============================================================================

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  orderNumber: text('order_number').notNull(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  orderDate: text('order_date').notNull(),
  requiredDate: text('required_date').notNull(),
  promisedDate: text('promised_date'),
  shippedDate: text('shipped_date'),
  deliveredDate: text('delivered_date'),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  totalQuantity: integer('total_quantity').default(0),
  totalAmount: real('total_amount').default(0),
  shippingAddress: text('shipping_address'),
  shippingCity: text('shipping_city'),
  shippingCountry: text('shipping_country'),
  trackingNumber: text('tracking_number'),
  carrier: text('carrier'),
  notes: text('notes'),
  picker: text('picker'),
  packer: text('packer'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_orders_warehouse').on(table.warehouseId),
  statusIdx: index('idx_orders_status').on(table.status),
  dateIdx: index('idx_orders_date').on(table.orderDate),
}))

export const orderLines = sqliteTable('order_lines', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  productSku: text('product_sku').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  pickedQuantity: integer('picked_quantity').default(0),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  orderIdx: index('idx_order_lines_order').on(table.orderId),
  productIdx: index('idx_order_lines_product').on(table.productId),
}))

// ============================================================================
// PURCHASE ORDERS
// ============================================================================

export const purchaseOrders = sqliteTable('purchase_orders', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  supplierId: text('supplier_id').notNull().references(() => suppliers.id),
  purchaseOrderNumber: text('purchase_order_number').notNull().unique(),
  orderDate: text('order_date').notNull(),
  expectedDate: text('expected_date'),
  status: text('status').notNull(),
  requestedBy: text('requested_by'),
  totalAmount: real('total_amount').default(0),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
})

export const purchaseOrderLines = sqliteTable('purchase_order_lines', {
  id: text('id').primaryKey(),
  purchaseOrderId: text('purchase_order_id').notNull().references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  receivedQuantity: integer('received_quantity').default(0),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
})

// ============================================================================
// PICKING OPERATIONS
// ============================================================================

export const pickings = sqliteTable('pickings', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  orderNumber: text('order_number').notNull(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  pickingNumber: text('picking_number').notNull(),
  assignedDate: text('assigned_date').notNull(),
  startedDate: text('started_date'),
  completedDate: text('completed_date'),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  totalQuantity: integer('total_quantity').default(0),
  pickedQuantity: integer('picked_quantity').default(0),
  remainingQuantity: integer('remaining_quantity').default(0),
  picker: text('picker'),
  pickerId: text('picker_id'),
  equipment: text('equipment'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_pickings_warehouse').on(table.warehouseId),
  statusIdx: index('idx_pickings_status').on(table.status),
  orderIdx: index('idx_pickings_order').on(table.orderId),
}))

export const pickingLines = sqliteTable('picking_lines', {
  id: text('id').primaryKey(),
  pickingId: text('picking_id').notNull().references(() => pickings.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  productSku: text('product_sku').notNull(),
  productName: text('product_name').notNull(),
  locationCode: text('location_code').notNull(),
  zoneName: text('zone_name'),
  quantity: integer('quantity').notNull(),
  pickedQuantity: integer('picked_quantity').default(0),
  unit: text('unit').notNull(),
  status: text('status').notNull(),
  processedByUserId: text('processed_by_user_id'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  durationMs: integer('duration_ms'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  pickingIdx: index('idx_picking_lines_picking').on(table.pickingId),
  userIdx: index('idx_picking_lines_user').on(table.processedByUserId),
}))

// ============================================================================
// RECEIPTS (Supplier receipts)
// ============================================================================

export const receptions = sqliteTable('receptions', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  supplierId: text('supplier_id').notNull().references(() => suppliers.id),
  supplierName: text('supplier_name').notNull(),
  receptionNumber: text('reception_number').notNull(),
  purchaseOrderNumber: text('purchase_order_number'),
  expectedDate: text('expected_date').notNull(),
  receivedDate: text('received_date'),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  totalQuantity: integer('total_quantity').default(0),
  receivedQuantity: integer('received_quantity').default(0),
  rejectedQuantity: integer('rejected_quantity').default(0),
  totalAmount: real('total_amount').default(0),
  carrier: text('carrier'),
  trackingNumber: text('tracking_number'),
  dockDoor: text('dock_door'),
  receiver: text('receiver'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_receptions_warehouse').on(table.warehouseId),
  statusIdx: index('idx_receptions_status').on(table.status),
}))

export const receptionLines = sqliteTable('reception_lines', {
  id: text('id').primaryKey(),
  receptionId: text('reception_id').notNull().references(() => receptions.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  productSku: text('product_sku').notNull(),
  productName: text('product_name').notNull(),
  orderedQuantity: integer('ordered_quantity').notNull(),
  receivedQuantity: integer('received_quantity').default(0),
  rejectedQuantity: integer('rejected_quantity').default(0),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
  reason: text('reason'),
  processedByUserId: text('processed_by_user_id'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  durationMs: integer('duration_ms'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  receptionIdx: index('idx_reception_lines_reception').on(table.receptionId),
}))

// ============================================================================
// RESTOCKING (Replenishment)
// ============================================================================

export const restockings = sqliteTable('restockings', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  restockingNumber: text('restocking_number').notNull(),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  totalProducts: integer('total_products').default(0),
  restockedProducts: integer('restocked_products').default(0),
  requester: text('requester').notNull(),
  assignedTo: text('assigned_to'),
  requestedDate: text('requested_date').notNull(),
  startedDate: text('started_date'),
  completedDate: text('completed_date'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_restockings_warehouse').on(table.warehouseId),
  statusIdx: index('idx_restockings_status').on(table.status),
}))

export const restockingLines = sqliteTable('restocking_lines', {
  id: text('id').primaryKey(),
  restockingId: text('restocking_id').notNull().references(() => restockings.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  productSku: text('product_sku').notNull(),
  productName: text('product_name').notNull(),
  sourceLocationId: text('source_location_id').references(() => locations.id, { onDelete: 'set null' }),
  destinationLocationId: text('destination_location_id').references(() => locations.id, { onDelete: 'set null' }),
  currentQuantity: integer('current_quantity').notNull(),
  targetQuantity: integer('target_quantity').notNull(),
  quantityToRestock: integer('quantity_to_restock').notNull(),
  unit: text('unit').notNull(),
  status: text('status').notNull(),
  processedByUserId: text('processed_by_user_id'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  durationMs: integer('duration_ms'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  restockingIdx: index('idx_restocking_lines_restocking').on(table.restockingId),
}))

// ============================================================================
// RETURNS
// ============================================================================

export const returns = sqliteTable('returns', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'set null' }),
  orderNumber: text('order_number'),
  returnNumber: text('return_number').notNull(),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  returnDate: text('return_date').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  reason: text('reason').notNull(),
  reasonLabel: text('reason_label').notNull(),
  totalQuantity: integer('total_quantity').default(0),
  totalAmount: real('total_amount').default(0),
  refundedAmount: real('refunded_amount').default(0),
  processor: text('processor'),
  completedDate: text('completed_date'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_returns_warehouse').on(table.warehouseId),
  statusIdx: index('idx_returns_status').on(table.status),
}))

export const returnLines = sqliteTable('return_lines', {
  id: text('id').primaryKey(),
  returnId: text('return_id').notNull().references(() => returns.id, { onDelete: 'cascade' }),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  productSku: text('product_sku').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
  condition: text('condition').notNull(),
  resolution: text('resolution').notNull(),
  processedByUserId: text('processed_by_user_id'),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  durationMs: integer('duration_ms'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  returnIdx: index('idx_return_lines_return').on(table.returnId),
}))

// ============================================================================
// SHIPMENTS
// ============================================================================

export const shipments = sqliteTable('shipments', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  shipmentNumber: text('shipment_number').notNull(),
  shipmentDate: text('shipment_date').notNull(),
  carrier: text('carrier').notNull(),
  trackingNumber: text('tracking_number'),
  status: text('status').notNull(),
  shippingAddress: text('shipping_address'),
  shippingCity: text('shipping_city'),
  shippingCountry: text('shipping_country'),
  estimatedDeliveryDate: text('estimated_delivery_date'),
  actualDeliveryDate: text('actual_delivery_date'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_shipments_warehouse').on(table.warehouseId),
  orderIdx: index('idx_shipments_order').on(table.orderId),
}))

export const shipmentLines = sqliteTable('shipment_lines', {
  id: text('id').primaryKey(),
  shipmentId: text('shipment_id').notNull().references(() => shipments.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
}, (table) => ({
  shipmentIdx: index('idx_shipment_lines_shipment').on(table.shipmentId),
}))

// ============================================================================
// MOVEMENTS (Historical stock movements)
// ============================================================================

export const movements = sqliteTable('movements', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  productSku: text('product_sku').notNull(),
  productName: text('product_name').notNull(),
  type: text('type').notNull(),
  sourceLocationId: text('source_location_id').references(() => locations.id, { onDelete: 'set null' }),
  sourceZone: text('source_zone'),
  sourceLocationCode: text('source_location_code'),
  destinationLocationId: text('destination_location_id').references(() => locations.id, { onDelete: 'set null' }),
  destinationZone: text('destination_zone'),
  destinationLocationCode: text('destination_location_code'),
  quantity: integer('quantity').notNull(),
  unit: text('unit').notNull(),
  movementDate: text('movement_date').notNull(),
  user: text('user'),
  reason: text('reason'),
  lot: text('lot'),
  expirationDate: text('expiration_date'),
  referenceType: text('reference_type'),
  referenceId: text('reference_id'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_movements_warehouse').on(table.warehouseId),
  productIdx: index('idx_movements_product').on(table.productId),
  dateIdx: index('idx_movements_date').on(table.movementDate),
  typeIdx: index('idx_movements_type').on(table.type),
  warehouseProductIdx: index('idx_movements_warehouse_product').on(table.warehouseId, table.productId),
  warehouseDateIdx: index('idx_movements_warehouse_date').on(table.warehouseId, table.movementDate),
}))

// ============================================================================
// USERS (Warehouse operators)
// ============================================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  username: text('username').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').unique(),
  role: text('role').notNull(),
  status: text('status').notNull(),
  lastLoginAt: text('last_login_at'),
  createdAt: text('created_at').notNull().default(sql`datetime('now')`),
  updatedAt: text('updated_at').notNull().default(sql`datetime('now')`),
}, (table) => ({
  warehouseIdx: index('idx_users_warehouse').on(table.warehouseId),
  usernameIdx: index('idx_users_username').on(table.username),
}))

// ============================================================================
// IMPORT HISTORY
// ============================================================================

export const importHistory = sqliteTable('import_history', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  warehouseId: text('warehouse_id').notNull().references(() => warehouses.id, { onDelete: 'cascade' }),
  pluginId: text('plugin_id').notNull(),
  pluginVersion: text('plugin_version').notNull(),
  importedAt: text('imported_at').notNull().default(sql`datetime('now')`),
  rowsProcessed: integer('rows_processed').notNull(),
  status: text('status').notNull(),
  fileName: text('file_name'),
  fileSize: integer('file_size'),
  durationMs: integer('duration_ms'),
  errorMessage: text('error_message'),
}, (table) => ({
  warehouseIdx: index('idx_import_history_warehouse').on(table.warehouseId),
  dateIdx: index('idx_import_history_date').on(table.importedAt),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Warehouse = typeof warehouses.$inferSelect
export type NewWarehouse = typeof warehouses.$inferInsert

export type Zone = typeof zones.$inferSelect
export type NewZone = typeof zones.$inferInsert

export type Sector = typeof sectors.$inferSelect
export type NewSector = typeof sectors.$inferInsert

export type Location = typeof locations.$inferSelect
export type NewLocation = typeof locations.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type Inventory = typeof inventory.$inferSelect
export type NewInventory = typeof inventory.$inferInsert

export type Supplier = typeof suppliers.$inferSelect
export type NewSupplier = typeof suppliers.$inferInsert

export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export type OrderLine = typeof orderLines.$inferSelect
export type NewOrderLine = typeof orderLines.$inferInsert

export type PurchaseOrder = typeof purchaseOrders.$inferSelect
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert

export type PurchaseOrderLine = typeof purchaseOrderLines.$inferSelect
export type NewPurchaseOrderLine = typeof purchaseOrderLines.$inferInsert

export type Picking = typeof pickings.$inferSelect
export type NewPicking = typeof pickings.$inferInsert

export type PickingLine = typeof pickingLines.$inferSelect
export type NewPickingLine = typeof pickingLines.$inferInsert

export type Reception = typeof receptions.$inferSelect
export type NewReception = typeof receptions.$inferInsert

export type ReceptionLine = typeof receptionLines.$inferSelect
export type NewReceptionLine = typeof receptionLines.$inferInsert

export type Restocking = typeof restockings.$inferSelect
export type NewRestocking = typeof restockings.$inferInsert

export type RestockingLine = typeof restockingLines.$inferSelect
export type NewRestockingLine = typeof restockingLines.$inferInsert

export type Return = typeof returns.$inferSelect
export type NewReturn = typeof returns.$inferInsert

export type ReturnLine = typeof returnLines.$inferSelect
export type NewReturnLine = typeof returnLines.$inferInsert

export type Shipment = typeof shipments.$inferSelect
export type NewShipment = typeof shipments.$inferInsert

export type ShipmentLine = typeof shipmentLines.$inferSelect
export type NewShipmentLine = typeof shipmentLines.$inferInsert

export type Movement = typeof movements.$inferSelect
export type NewMovement = typeof movements.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type ImportHistory = typeof importHistory.$inferSelect
export type NewImportHistory = typeof importHistory.$inferInsert

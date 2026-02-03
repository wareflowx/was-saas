"use strict";
/**
 * Drizzle ORM Schema for Wareflow
 *
 * This schema defines all database tables using Drizzle ORM.
 * All types are automatically generated from this schema.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.importHistory = exports.users = exports.movements = exports.shipmentLines = exports.shipments = exports.returnLines = exports.returns = exports.restockingLines = exports.restockings = exports.receptionLines = exports.receptions = exports.pickingLines = exports.pickings = exports.purchaseOrderLines = exports.purchaseOrders = exports.orderLines = exports.orders = exports.customers = exports.suppliers = exports.inventory = exports.products = exports.locations = exports.sectors = exports.zones = exports.warehouses = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
// ============================================================================
// WAREHOUSE STRUCTURE
// ============================================================================
exports.warehouses = (0, sqlite_core_1.sqliteTable)('warehouses', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    code: (0, sqlite_core_1.text)('code').notNull().unique(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    city: (0, sqlite_core_1.text)('city').notNull(),
    country: (0, sqlite_core_1.text)('country').notNull(),
    surface: (0, sqlite_core_1.real)('surface'),
    capacity: (0, sqlite_core_1.integer)('capacity'),
    usedCapacity: (0, sqlite_core_1.integer)('used_capacity').default(0),
    zoneCount: (0, sqlite_core_1.integer)('zone_count').default(0),
    pickerCount: (0, sqlite_core_1.integer)('picker_count').default(0),
    manager: (0, sqlite_core_1.text)('manager'),
    email: (0, sqlite_core_1.text)('email'),
    phone: (0, sqlite_core_1.text)('phone'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    openingDate: (0, sqlite_core_1.text)('opening_date'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
});
exports.zones = (0, sqlite_core_1.sqliteTable)('zones', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    code: (0, sqlite_core_1.text)('code').notNull(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    surface: (0, sqlite_core_1.real)('surface'),
    capacity: (0, sqlite_core_1.integer)('capacity'),
    usedCapacity: (0, sqlite_core_1.integer)('used_capacity').default(0),
    sectorCount: (0, sqlite_core_1.integer)('sector_count').default(0),
    locationCount: (0, sqlite_core_1.integer)('location_count').default(0),
    pickerCount: (0, sqlite_core_1.integer)('picker_count').default(0),
    temperatureMin: (0, sqlite_core_1.real)('temperature_min'),
    temperatureMax: (0, sqlite_core_1.real)('temperature_max'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_zones_warehouse').on(table.warehouseId),
}));
exports.sectors = (0, sqlite_core_1.sqliteTable)('sectors', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    zoneId: (0, sqlite_core_1.text)('zone_id').notNull().references(() => exports.zones.id, { onDelete: 'cascade' }),
    code: (0, sqlite_core_1.text)('code').notNull(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    capacity: (0, sqlite_core_1.integer)('capacity'),
    usedCapacity: (0, sqlite_core_1.integer)('used_capacity').default(0),
    locationCount: (0, sqlite_core_1.integer)('location_count').default(0),
    pickerCount: (0, sqlite_core_1.integer)('picker_count').default(0),
    aisle: (0, sqlite_core_1.text)('aisle'),
    level: (0, sqlite_core_1.integer)('level'),
    position: (0, sqlite_core_1.text)('position'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_sectors_warehouse').on(table.warehouseId),
    zoneIdx: (0, sqlite_core_1.index)('idx_sectors_zone').on(table.zoneId),
}));
exports.locations = (0, sqlite_core_1.sqliteTable)('locations', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    zoneId: (0, sqlite_core_1.text)('zone_id').notNull().references(() => exports.zones.id, { onDelete: 'cascade' }),
    sectorId: (0, sqlite_core_1.text)('sector_id').notNull().references(() => exports.sectors.id, { onDelete: 'cascade' }),
    code: (0, sqlite_core_1.text)('code').notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    capacity: (0, sqlite_core_1.integer)('capacity'),
    usedCapacity: (0, sqlite_core_1.integer)('used_capacity').default(0),
    productCount: (0, sqlite_core_1.integer)('product_count').default(0),
    pickerCount: (0, sqlite_core_1.integer)('picker_count').default(0),
    aisle: (0, sqlite_core_1.text)('aisle'),
    level: (0, sqlite_core_1.integer)('level'),
    position: (0, sqlite_core_1.text)('position'),
    barcode: (0, sqlite_core_1.text)('barcode'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_locations_warehouse').on(table.warehouseId),
    zoneIdx: (0, sqlite_core_1.index)('idx_locations_zone').on(table.zoneId),
    sectorIdx: (0, sqlite_core_1.index)('idx_locations_sector').on(table.sectorId),
}));
// ============================================================================
// PRODUCTS & INVENTORY
// ============================================================================
exports.products = (0, sqlite_core_1.sqliteTable)('products', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    sku: (0, sqlite_core_1.text)('sku').notNull().unique(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    description: (0, sqlite_core_1.text)('description'),
    category: (0, sqlite_core_1.text)('category').notNull(),
    subcategory: (0, sqlite_core_1.text)('subcategory'),
    brand: (0, sqlite_core_1.text)('brand'),
    unit: (0, sqlite_core_1.text)('unit').notNull(),
    weight: (0, sqlite_core_1.real)('weight'),
    volume: (0, sqlite_core_1.real)('volume'),
    minStock: (0, sqlite_core_1.integer)('min_stock').default(0),
    maxStock: (0, sqlite_core_1.integer)('max_stock'),
    reorderPoint: (0, sqlite_core_1.integer)('reorder_point'),
    reorderQuantity: (0, sqlite_core_1.integer)('reorder_quantity'),
    costPrice: (0, sqlite_core_1.real)('cost_price'),
    sellingPrice: (0, sqlite_core_1.real)('selling_price'),
    supplier: (0, sqlite_core_1.text)('supplier'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    skuIdx: (0, sqlite_core_1.index)('idx_products_sku').on(table.sku),
    categoryIdx: (0, sqlite_core_1.index)('idx_products_category').on(table.category),
}));
exports.inventory = (0, sqlite_core_1.sqliteTable)('inventory', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id, { onDelete: 'cascade' }),
    locationId: (0, sqlite_core_1.text)('location_id').references(() => exports.locations.id, { onDelete: 'set null' }),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull().default(0),
    availableQuantity: (0, sqlite_core_1.integer)('available_quantity').notNull().default(0),
    reservedQuantity: (0, sqlite_core_1.integer)('reserved_quantity').notNull().default(0),
    lastReceivedAt: (0, sqlite_core_1.text)('last_received_at'),
    lastShippedAt: (0, sqlite_core_1.text)('last_shipped_at'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_inventory_warehouse').on(table.warehouseId),
    productIdx: (0, sqlite_core_1.index)('idx_inventory_product').on(table.productId),
    locationIdx: (0, sqlite_core_1.index)('idx_inventory_location').on(table.locationId),
    warehouseProductIdx: (0, sqlite_core_1.index)('idx_inventory_warehouse_product').on(table.warehouseId, table.productId),
}));
// ============================================================================
// SUPPLIERS
// ============================================================================
exports.suppliers = (0, sqlite_core_1.sqliteTable)('suppliers', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    code: (0, sqlite_core_1.text)('code').notNull().unique(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    contactPerson: (0, sqlite_core_1.text)('contact_person'),
    email: (0, sqlite_core_1.text)('email'),
    phone: (0, sqlite_core_1.text)('phone'),
    address: (0, sqlite_core_1.text)('address'),
    city: (0, sqlite_core_1.text)('city'),
    country: (0, sqlite_core_1.text)('country'),
    paymentTerms: (0, sqlite_core_1.text)('payment_terms'),
    leadTimeDays: (0, sqlite_core_1.integer)('lead_time_days'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
});
// ============================================================================
// CUSTOMERS
// ============================================================================
exports.customers = (0, sqlite_core_1.sqliteTable)('customers', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    customerCode: (0, sqlite_core_1.text)('customer_code').notNull().unique(),
    name: (0, sqlite_core_1.text)('name').notNull(),
    email: (0, sqlite_core_1.text)('email'),
    phone: (0, sqlite_core_1.text)('phone'),
    billingAddress: (0, sqlite_core_1.text)('billing_address'),
    shippingAddress: (0, sqlite_core_1.text)('shipping_address'),
    city: (0, sqlite_core_1.text)('city'),
    country: (0, sqlite_core_1.text)('country'),
    customerType: (0, sqlite_core_1.text)('customer_type'),
    creditLimit: (0, sqlite_core_1.real)('credit_limit'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
});
// ============================================================================
// ORDERS (Sales orders)
// ============================================================================
exports.orders = (0, sqlite_core_1.sqliteTable)('orders', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    orderNumber: (0, sqlite_core_1.text)('order_number').notNull(),
    customerId: (0, sqlite_core_1.text)('customer_id').notNull(),
    customerName: (0, sqlite_core_1.text)('customer_name').notNull(),
    customerEmail: (0, sqlite_core_1.text)('customer_email'),
    orderDate: (0, sqlite_core_1.text)('order_date').notNull(),
    requiredDate: (0, sqlite_core_1.text)('required_date').notNull(),
    promisedDate: (0, sqlite_core_1.text)('promised_date'),
    shippedDate: (0, sqlite_core_1.text)('shipped_date'),
    deliveredDate: (0, sqlite_core_1.text)('delivered_date'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    priority: (0, sqlite_core_1.text)('priority').notNull(),
    totalQuantity: (0, sqlite_core_1.integer)('total_quantity').default(0),
    totalAmount: (0, sqlite_core_1.real)('total_amount').default(0),
    shippingAddress: (0, sqlite_core_1.text)('shipping_address'),
    shippingCity: (0, sqlite_core_1.text)('shipping_city'),
    shippingCountry: (0, sqlite_core_1.text)('shipping_country'),
    trackingNumber: (0, sqlite_core_1.text)('tracking_number'),
    carrier: (0, sqlite_core_1.text)('carrier'),
    notes: (0, sqlite_core_1.text)('notes'),
    picker: (0, sqlite_core_1.text)('picker'),
    packer: (0, sqlite_core_1.text)('packer'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_orders_warehouse').on(table.warehouseId),
    statusIdx: (0, sqlite_core_1.index)('idx_orders_status').on(table.status),
    dateIdx: (0, sqlite_core_1.index)('idx_orders_date').on(table.orderDate),
}));
exports.orderLines = (0, sqlite_core_1.sqliteTable)('order_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    orderId: (0, sqlite_core_1.text)('order_id').notNull().references(() => exports.orders.id, { onDelete: 'cascade' }),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    productSku: (0, sqlite_core_1.text)('product_sku').notNull(),
    productName: (0, sqlite_core_1.text)('product_name').notNull(),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull(),
    pickedQuantity: (0, sqlite_core_1.integer)('picked_quantity').default(0),
    unitPrice: (0, sqlite_core_1.real)('unit_price').notNull(),
    totalPrice: (0, sqlite_core_1.real)('total_price').notNull(),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    orderIdx: (0, sqlite_core_1.index)('idx_order_lines_order').on(table.orderId),
    productIdx: (0, sqlite_core_1.index)('idx_order_lines_product').on(table.productId),
}));
// ============================================================================
// PURCHASE ORDERS
// ============================================================================
exports.purchaseOrders = (0, sqlite_core_1.sqliteTable)('purchase_orders', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    supplierId: (0, sqlite_core_1.text)('supplier_id').notNull().references(() => exports.suppliers.id),
    purchaseOrderNumber: (0, sqlite_core_1.text)('purchase_order_number').notNull().unique(),
    orderDate: (0, sqlite_core_1.text)('order_date').notNull(),
    expectedDate: (0, sqlite_core_1.text)('expected_date'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    requestedBy: (0, sqlite_core_1.text)('requested_by'),
    totalAmount: (0, sqlite_core_1.real)('total_amount').default(0),
    notes: (0, sqlite_core_1.text)('notes'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
});
exports.purchaseOrderLines = (0, sqlite_core_1.sqliteTable)('purchase_order_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    purchaseOrderId: (0, sqlite_core_1.text)('purchase_order_id').notNull().references(() => exports.purchaseOrders.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull(),
    receivedQuantity: (0, sqlite_core_1.integer)('received_quantity').default(0),
    unitPrice: (0, sqlite_core_1.real)('unit_price').notNull(),
    totalPrice: (0, sqlite_core_1.real)('total_price').notNull(),
});
// ============================================================================
// PICKING OPERATIONS
// ============================================================================
exports.pickings = (0, sqlite_core_1.sqliteTable)('pickings', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    orderId: (0, sqlite_core_1.text)('order_id').notNull().references(() => exports.orders.id, { onDelete: 'cascade' }),
    orderNumber: (0, sqlite_core_1.text)('order_number').notNull(),
    customerId: (0, sqlite_core_1.text)('customer_id').notNull(),
    customerName: (0, sqlite_core_1.text)('customer_name').notNull(),
    pickingNumber: (0, sqlite_core_1.text)('picking_number').notNull(),
    assignedDate: (0, sqlite_core_1.text)('assigned_date').notNull(),
    startedDate: (0, sqlite_core_1.text)('started_date'),
    completedDate: (0, sqlite_core_1.text)('completed_date'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    priority: (0, sqlite_core_1.text)('priority').notNull(),
    totalQuantity: (0, sqlite_core_1.integer)('total_quantity').default(0),
    pickedQuantity: (0, sqlite_core_1.integer)('picked_quantity').default(0),
    remainingQuantity: (0, sqlite_core_1.integer)('remaining_quantity').default(0),
    picker: (0, sqlite_core_1.text)('picker'),
    pickerId: (0, sqlite_core_1.text)('picker_id'),
    equipment: (0, sqlite_core_1.text)('equipment'),
    notes: (0, sqlite_core_1.text)('notes'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_pickings_warehouse').on(table.warehouseId),
    statusIdx: (0, sqlite_core_1.index)('idx_pickings_status').on(table.status),
    orderIdx: (0, sqlite_core_1.index)('idx_pickings_order').on(table.orderId),
}));
exports.pickingLines = (0, sqlite_core_1.sqliteTable)('picking_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    pickingId: (0, sqlite_core_1.text)('picking_id').notNull().references(() => exports.pickings.id, { onDelete: 'cascade' }),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    productSku: (0, sqlite_core_1.text)('product_sku').notNull(),
    productName: (0, sqlite_core_1.text)('product_name').notNull(),
    locationCode: (0, sqlite_core_1.text)('location_code').notNull(),
    zoneName: (0, sqlite_core_1.text)('zone_name'),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull(),
    pickedQuantity: (0, sqlite_core_1.integer)('picked_quantity').default(0),
    unit: (0, sqlite_core_1.text)('unit').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(),
    processedByUserId: (0, sqlite_core_1.text)('processed_by_user_id'),
    startedAt: (0, sqlite_core_1.text)('started_at'),
    completedAt: (0, sqlite_core_1.text)('completed_at'),
    durationMs: (0, sqlite_core_1.integer)('duration_ms'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    pickingIdx: (0, sqlite_core_1.index)('idx_picking_lines_picking').on(table.pickingId),
    userIdx: (0, sqlite_core_1.index)('idx_picking_lines_user').on(table.processedByUserId),
}));
// ============================================================================
// RECEIPTS (Supplier receipts)
// ============================================================================
exports.receptions = (0, sqlite_core_1.sqliteTable)('receptions', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    supplierId: (0, sqlite_core_1.text)('supplier_id').notNull().references(() => exports.suppliers.id),
    supplierName: (0, sqlite_core_1.text)('supplier_name').notNull(),
    receptionNumber: (0, sqlite_core_1.text)('reception_number').notNull(),
    purchaseOrderNumber: (0, sqlite_core_1.text)('purchase_order_number'),
    expectedDate: (0, sqlite_core_1.text)('expected_date').notNull(),
    receivedDate: (0, sqlite_core_1.text)('received_date'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    priority: (0, sqlite_core_1.text)('priority').notNull(),
    totalQuantity: (0, sqlite_core_1.integer)('total_quantity').default(0),
    receivedQuantity: (0, sqlite_core_1.integer)('received_quantity').default(0),
    rejectedQuantity: (0, sqlite_core_1.integer)('rejected_quantity').default(0),
    totalAmount: (0, sqlite_core_1.real)('total_amount').default(0),
    carrier: (0, sqlite_core_1.text)('carrier'),
    trackingNumber: (0, sqlite_core_1.text)('tracking_number'),
    dockDoor: (0, sqlite_core_1.text)('dock_door'),
    receiver: (0, sqlite_core_1.text)('receiver'),
    notes: (0, sqlite_core_1.text)('notes'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_receptions_warehouse').on(table.warehouseId),
    statusIdx: (0, sqlite_core_1.index)('idx_receptions_status').on(table.status),
}));
exports.receptionLines = (0, sqlite_core_1.sqliteTable)('reception_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    receptionId: (0, sqlite_core_1.text)('reception_id').notNull().references(() => exports.receptions.id, { onDelete: 'cascade' }),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    productSku: (0, sqlite_core_1.text)('product_sku').notNull(),
    productName: (0, sqlite_core_1.text)('product_name').notNull(),
    orderedQuantity: (0, sqlite_core_1.integer)('ordered_quantity').notNull(),
    receivedQuantity: (0, sqlite_core_1.integer)('received_quantity').default(0),
    rejectedQuantity: (0, sqlite_core_1.integer)('rejected_quantity').default(0),
    unitPrice: (0, sqlite_core_1.real)('unit_price').notNull(),
    totalPrice: (0, sqlite_core_1.real)('total_price').notNull(),
    reason: (0, sqlite_core_1.text)('reason'),
    processedByUserId: (0, sqlite_core_1.text)('processed_by_user_id'),
    startedAt: (0, sqlite_core_1.text)('started_at'),
    completedAt: (0, sqlite_core_1.text)('completed_at'),
    durationMs: (0, sqlite_core_1.integer)('duration_ms'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    receptionIdx: (0, sqlite_core_1.index)('idx_reception_lines_reception').on(table.receptionId),
}));
// ============================================================================
// RESTOCKING (Replenishment)
// ============================================================================
exports.restockings = (0, sqlite_core_1.sqliteTable)('restockings', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    restockingNumber: (0, sqlite_core_1.text)('restocking_number').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(),
    priority: (0, sqlite_core_1.text)('priority').notNull(),
    totalProducts: (0, sqlite_core_1.integer)('total_products').default(0),
    restockedProducts: (0, sqlite_core_1.integer)('restocked_products').default(0),
    requester: (0, sqlite_core_1.text)('requester').notNull(),
    assignedTo: (0, sqlite_core_1.text)('assigned_to'),
    requestedDate: (0, sqlite_core_1.text)('requested_date').notNull(),
    startedDate: (0, sqlite_core_1.text)('started_date'),
    completedDate: (0, sqlite_core_1.text)('completed_date'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_restockings_warehouse').on(table.warehouseId),
    statusIdx: (0, sqlite_core_1.index)('idx_restockings_status').on(table.status),
}));
exports.restockingLines = (0, sqlite_core_1.sqliteTable)('restocking_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    restockingId: (0, sqlite_core_1.text)('restocking_id').notNull().references(() => exports.restockings.id, { onDelete: 'cascade' }),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    productSku: (0, sqlite_core_1.text)('product_sku').notNull(),
    productName: (0, sqlite_core_1.text)('product_name').notNull(),
    sourceLocationId: (0, sqlite_core_1.text)('source_location_id').references(() => exports.locations.id, { onDelete: 'set null' }),
    destinationLocationId: (0, sqlite_core_1.text)('destination_location_id').references(() => exports.locations.id, { onDelete: 'set null' }),
    currentQuantity: (0, sqlite_core_1.integer)('current_quantity').notNull(),
    targetQuantity: (0, sqlite_core_1.integer)('target_quantity').notNull(),
    quantityToRestock: (0, sqlite_core_1.integer)('quantity_to_restock').notNull(),
    unit: (0, sqlite_core_1.text)('unit').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(),
    processedByUserId: (0, sqlite_core_1.text)('processed_by_user_id'),
    startedAt: (0, sqlite_core_1.text)('started_at'),
    completedAt: (0, sqlite_core_1.text)('completed_at'),
    durationMs: (0, sqlite_core_1.integer)('duration_ms'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    restockingIdx: (0, sqlite_core_1.index)('idx_restocking_lines_restocking').on(table.restockingId),
}));
// ============================================================================
// RETURNS
// ============================================================================
exports.returns = (0, sqlite_core_1.sqliteTable)('returns', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    orderId: (0, sqlite_core_1.text)('order_id').references(() => exports.orders.id, { onDelete: 'set null' }),
    orderNumber: (0, sqlite_core_1.text)('order_number'),
    returnNumber: (0, sqlite_core_1.text)('return_number').notNull(),
    customerId: (0, sqlite_core_1.text)('customer_id').notNull(),
    customerName: (0, sqlite_core_1.text)('customer_name').notNull(),
    returnDate: (0, sqlite_core_1.text)('return_date').notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(),
    priority: (0, sqlite_core_1.text)('priority').notNull(),
    reason: (0, sqlite_core_1.text)('reason').notNull(),
    reasonLabel: (0, sqlite_core_1.text)('reason_label').notNull(),
    totalQuantity: (0, sqlite_core_1.integer)('total_quantity').default(0),
    totalAmount: (0, sqlite_core_1.real)('total_amount').default(0),
    refundedAmount: (0, sqlite_core_1.real)('refunded_amount').default(0),
    processor: (0, sqlite_core_1.text)('processor'),
    completedDate: (0, sqlite_core_1.text)('completed_date'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_returns_warehouse').on(table.warehouseId),
    statusIdx: (0, sqlite_core_1.index)('idx_returns_status').on(table.status),
}));
exports.returnLines = (0, sqlite_core_1.sqliteTable)('return_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    returnId: (0, sqlite_core_1.text)('return_id').notNull().references(() => exports.returns.id, { onDelete: 'cascade' }),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    productSku: (0, sqlite_core_1.text)('product_sku').notNull(),
    productName: (0, sqlite_core_1.text)('product_name').notNull(),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull(),
    unitPrice: (0, sqlite_core_1.real)('unit_price').notNull(),
    totalPrice: (0, sqlite_core_1.real)('total_price').notNull(),
    condition: (0, sqlite_core_1.text)('condition').notNull(),
    resolution: (0, sqlite_core_1.text)('resolution').notNull(),
    processedByUserId: (0, sqlite_core_1.text)('processed_by_user_id'),
    startedAt: (0, sqlite_core_1.text)('started_at'),
    completedAt: (0, sqlite_core_1.text)('completed_at'),
    durationMs: (0, sqlite_core_1.integer)('duration_ms'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    returnIdx: (0, sqlite_core_1.index)('idx_return_lines_return').on(table.returnId),
}));
// ============================================================================
// SHIPMENTS
// ============================================================================
exports.shipments = (0, sqlite_core_1.sqliteTable)('shipments', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    orderId: (0, sqlite_core_1.text)('order_id').notNull().references(() => exports.orders.id, { onDelete: 'cascade' }),
    shipmentNumber: (0, sqlite_core_1.text)('shipment_number').notNull(),
    shipmentDate: (0, sqlite_core_1.text)('shipment_date').notNull(),
    carrier: (0, sqlite_core_1.text)('carrier').notNull(),
    trackingNumber: (0, sqlite_core_1.text)('tracking_number'),
    status: (0, sqlite_core_1.text)('status').notNull(),
    shippingAddress: (0, sqlite_core_1.text)('shipping_address'),
    shippingCity: (0, sqlite_core_1.text)('shipping_city'),
    shippingCountry: (0, sqlite_core_1.text)('shipping_country'),
    estimatedDeliveryDate: (0, sqlite_core_1.text)('estimated_delivery_date'),
    actualDeliveryDate: (0, sqlite_core_1.text)('actual_delivery_date'),
    notes: (0, sqlite_core_1.text)('notes'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_shipments_warehouse').on(table.warehouseId),
    orderIdx: (0, sqlite_core_1.index)('idx_shipments_order').on(table.orderId),
}));
exports.shipmentLines = (0, sqlite_core_1.sqliteTable)('shipment_lines', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    shipmentId: (0, sqlite_core_1.text)('shipment_id').notNull().references(() => exports.shipments.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull(),
}, (table) => ({
    shipmentIdx: (0, sqlite_core_1.index)('idx_shipment_lines_shipment').on(table.shipmentId),
}));
// ============================================================================
// MOVEMENTS (Historical stock movements)
// ============================================================================
exports.movements = (0, sqlite_core_1.sqliteTable)('movements', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    productId: (0, sqlite_core_1.text)('product_id').notNull().references(() => exports.products.id),
    productSku: (0, sqlite_core_1.text)('product_sku').notNull(),
    productName: (0, sqlite_core_1.text)('product_name').notNull(),
    type: (0, sqlite_core_1.text)('type').notNull(),
    sourceLocationId: (0, sqlite_core_1.text)('source_location_id').references(() => exports.locations.id, { onDelete: 'set null' }),
    sourceZone: (0, sqlite_core_1.text)('source_zone'),
    sourceLocationCode: (0, sqlite_core_1.text)('source_location_code'),
    destinationLocationId: (0, sqlite_core_1.text)('destination_location_id').references(() => exports.locations.id, { onDelete: 'set null' }),
    destinationZone: (0, sqlite_core_1.text)('destination_zone'),
    destinationLocationCode: (0, sqlite_core_1.text)('destination_location_code'),
    quantity: (0, sqlite_core_1.integer)('quantity').notNull(),
    unit: (0, sqlite_core_1.text)('unit').notNull(),
    movementDate: (0, sqlite_core_1.text)('movement_date').notNull(),
    user: (0, sqlite_core_1.text)('user'),
    reason: (0, sqlite_core_1.text)('reason'),
    lot: (0, sqlite_core_1.text)('lot'),
    expirationDate: (0, sqlite_core_1.text)('expiration_date'),
    referenceType: (0, sqlite_core_1.text)('reference_type'),
    referenceId: (0, sqlite_core_1.text)('reference_id'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_movements_warehouse').on(table.warehouseId),
    productIdx: (0, sqlite_core_1.index)('idx_movements_product').on(table.productId),
    dateIdx: (0, sqlite_core_1.index)('idx_movements_date').on(table.movementDate),
    typeIdx: (0, sqlite_core_1.index)('idx_movements_type').on(table.type),
    warehouseProductIdx: (0, sqlite_core_1.index)('idx_movements_warehouse_product').on(table.warehouseId, table.productId),
    warehouseDateIdx: (0, sqlite_core_1.index)('idx_movements_warehouse_date').on(table.warehouseId, table.movementDate),
}));
// ============================================================================
// USERS (Warehouse operators)
// ============================================================================
exports.users = (0, sqlite_core_1.sqliteTable)('users', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    username: (0, sqlite_core_1.text)('username').notNull().unique(),
    fullName: (0, sqlite_core_1.text)('full_name').notNull(),
    email: (0, sqlite_core_1.text)('email').unique(),
    role: (0, sqlite_core_1.text)('role').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(),
    lastLoginAt: (0, sqlite_core_1.text)('last_login_at'),
    createdAt: (0, sqlite_core_1.text)('created_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    updatedAt: (0, sqlite_core_1.text)('updated_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_users_warehouse').on(table.warehouseId),
    usernameIdx: (0, sqlite_core_1.index)('idx_users_username').on(table.username),
}));
// ============================================================================
// IMPORT HISTORY
// ============================================================================
exports.importHistory = (0, sqlite_core_1.sqliteTable)('import_history', {
    id: (0, sqlite_core_1.integer)('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    warehouseId: (0, sqlite_core_1.text)('warehouse_id').notNull().references(() => exports.warehouses.id, { onDelete: 'cascade' }),
    pluginId: (0, sqlite_core_1.text)('plugin_id').notNull(),
    pluginVersion: (0, sqlite_core_1.text)('plugin_version').notNull(),
    importedAt: (0, sqlite_core_1.text)('imported_at').notNull().default((0, drizzle_orm_1.sql) `datetime('now')`),
    rowsProcessed: (0, sqlite_core_1.integer)('rows_processed').notNull(),
    status: (0, sqlite_core_1.text)('status').notNull(),
    fileName: (0, sqlite_core_1.text)('file_name'),
    fileSize: (0, sqlite_core_1.integer)('file_size'),
    durationMs: (0, sqlite_core_1.integer)('duration_ms'),
    errorMessage: (0, sqlite_core_1.text)('error_message'),
}, (table) => ({
    warehouseIdx: (0, sqlite_core_1.index)('idx_import_history_warehouse').on(table.warehouseId),
    dateIdx: (0, sqlite_core_1.index)('idx_import_history_date').on(table.importedAt),
}));

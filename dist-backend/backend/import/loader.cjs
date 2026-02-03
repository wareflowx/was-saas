"use strict";
/**
 * Data Loader using Drizzle ORM
 * Handles bulk insertion of normalized data into SQLite database
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadToDatabase = exports.insertShipments = exports.insertReturns = exports.insertRestockings = exports.insertReceptions = exports.insertPickings = exports.insertOrders = exports.insertMovements = exports.insertInventory = exports.insertProducts = exports.insertLocations = exports.insertSectors = exports.insertZones = exports.insertPurchaseOrderLines = exports.insertPurchaseOrders = exports.insertCustomers = exports.insertSuppliers = exports.insertUsers = exports.insertWarehouses = void 0;
const index_1 = require('../database/index.cjs');
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Format date to ISO string for SQLite storage
 */
function formatDate(date) {
    return date.toISOString();
}
/**
 * Bulk insert with transaction support
 */
function bulkInsert(table, data, transform, entityName) {
    if (data.length === 0)
        return 0;
    const db = (0, index_1.getDatabase)();
    const sqlite = (0, index_1.getDbRaw)();
    let inserted = 0;
    // Use SQLite transaction for better performance
    const insertMany = sqlite.transaction((items) => {
        for (const item of items) {
            try {
                db.insert(table)
                    .values(transform(item))
                    .onConflictDoNothing()
                    .run();
                inserted++;
            }
            catch (error) {
                console.error(`Error inserting ${entityName}:`, error);
            }
        }
    });
    insertMany(data);
    console.log(`✅ [DB INSERT] ${entityName}:`, { inserted, total: data.length });
    return inserted;
}
// ============================================================================
// WAREHOUSE STRUCTURE
// ============================================================================
const insertWarehouses = (warehouses) => {
    return bulkInsert(index_1.warehouses, warehouses, (w) => ({
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
    }), 'Warehouses');
};
exports.insertWarehouses = insertWarehouses;
const insertUsers = (users) => {
    return bulkInsert(index_1.users, users, (u) => ({
        id: u.id,
        warehouseId: u.warehouseId,
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        status: u.status,
    }), 'Users');
};
exports.insertUsers = insertUsers;
const insertSuppliers = (suppliers) => {
    return bulkInsert(index_1.suppliers, suppliers, (s) => ({
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
    }), 'Suppliers');
};
exports.insertSuppliers = insertSuppliers;
const insertCustomers = (customers) => {
    return bulkInsert(index_1.customers, customers, (c) => ({
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
    }), 'Customers');
};
exports.insertCustomers = insertCustomers;
const insertPurchaseOrders = (purchaseOrders) => {
    return bulkInsert(index_1.purchaseOrders, purchaseOrders, (po) => ({
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
    }), 'PurchaseOrders');
};
exports.insertPurchaseOrders = insertPurchaseOrders;
const insertPurchaseOrderLines = (purchaseOrderLines) => {
    return bulkInsert(index_1.purchaseOrderLines, purchaseOrderLines, (line) => ({
        id: line.id,
        purchaseOrderId: line.purchaseOrderId,
        productId: line.productId,
        quantity: line.quantity,
        receivedQuantity: line.receivedQuantity,
        unitPrice: line.unitPrice,
        totalPrice: line.totalPrice,
    }), 'PurchaseOrderLines');
};
exports.insertPurchaseOrderLines = insertPurchaseOrderLines;
// ============================================================================
// LOCATIONS
// ============================================================================
const insertZones = (zones) => {
    return bulkInsert(index_1.zones, zones, (z) => ({
        id: z.id,
        warehouseId: z.warehouseId,
        code: z.code,
        name: z.name,
        type: z.type,
        surface: z.surface,
        capacity: z.capacity,
        status: z.status,
    }), 'Zones');
};
exports.insertZones = insertZones;
const insertSectors = (sectors) => {
    return bulkInsert(index_1.sectors, sectors, (s) => ({
        id: s.id,
        warehouseId: s.warehouseId,
        zoneId: s.zoneId,
        code: s.code,
        name: s.name,
        type: s.type,
        capacity: s.capacity,
        status: s.status,
    }), 'Sectors');
};
exports.insertSectors = insertSectors;
const insertLocations = (locations) => {
    return bulkInsert(index_1.locations, locations, (l) => ({
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
    }), 'Locations');
};
exports.insertLocations = insertLocations;
// ============================================================================
// PRODUCTS & INVENTORY
// ============================================================================
const insertProducts = (products) => {
    return bulkInsert(index_1.products, products, (p) => ({
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
    }), 'Products');
};
exports.insertProducts = insertProducts;
const insertInventory = (_warehouseId, inventory) => {
    return bulkInsert(index_1.inventory, inventory, (inv) => ({
        id: `${_warehouseId}-${inv.productId}-${inv.locationId || 'default'}`,
        warehouseId: _warehouseId,
        productId: inv.productId,
        locationId: inv.locationId,
        quantity: inv.quantity,
        availableQuantity: inv.availableQuantity,
        reservedQuantity: inv.reservedQuantity,
    }), 'Inventory');
};
exports.insertInventory = insertInventory;
const insertMovements = (movements) => {
    return bulkInsert(index_1.movements, movements, (m) => ({
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
    }), 'Movements');
};
exports.insertMovements = insertMovements;
// ============================================================================
// ORDERS
// ============================================================================
const insertOrders = (orders, orderLines) => {
    const ordersInserted = bulkInsert(index_1.orders, orders, (o) => ({
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
    }), 'Orders');
    const linesInserted = bulkInsert(index_1.orderLines, orderLines, (l) => ({
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
    }), 'OrderLines');
    return { orders: ordersInserted, lines: linesInserted };
};
exports.insertOrders = insertOrders;
// ============================================================================
// PICKING OPERATIONS
// ============================================================================
const insertPickings = (pickings, pickingLines) => {
    const pickingsInserted = bulkInsert(index_1.pickings, pickings, (p) => ({
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
    }), 'Pickings');
    const linesInserted = bulkInsert(index_1.pickingLines, pickingLines, (l) => ({
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
    }), 'PickingLines');
    return { pickings: pickingsInserted, lines: linesInserted };
};
exports.insertPickings = insertPickings;
// ============================================================================
// RECEPTIONS
// ============================================================================
const insertReceptions = (receptions, receptionLines) => {
    const receptionsInserted = bulkInsert(index_1.receptions, receptions, (r) => ({
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
    }), 'Receptions');
    const linesInserted = bulkInsert(index_1.receptionLines, receptionLines, (l) => ({
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
    }), 'ReceptionLines');
    return { receptions: receptionsInserted, lines: linesInserted };
};
exports.insertReceptions = insertReceptions;
// ============================================================================
// RESTOCKING
// ============================================================================
const insertRestockings = (restockings, restockingLines) => {
    const restockingsInserted = bulkInsert(index_1.restockings, restockings, (r) => ({
        id: r.id,
        warehouseId: r.warehouseId,
        restockingNumber: r.restockingNumber,
        status: r.status,
        priority: r.priority,
        requester: r.requester,
        requestedDate: formatDate(r.requestedDate),
    }), 'Restockings');
    const linesInserted = bulkInsert(index_1.restockingLines, restockingLines, (l) => ({
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
    }), 'RestockingLines');
    return { restockings: restockingsInserted, lines: linesInserted };
};
exports.insertRestockings = insertRestockings;
// ============================================================================
// RETURNS
// ============================================================================
const insertReturns = (returns, returnLines) => {
    const returnsInserted = bulkInsert(index_1.returns, returns, (r) => ({
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
    }), 'Returns');
    const linesInserted = bulkInsert(index_1.returnLines, returnLines, (l) => ({
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
    }), 'ReturnLines');
    return { returns: returnsInserted, lines: linesInserted };
};
exports.insertReturns = insertReturns;
// ============================================================================
// SHIPMENTS
// ============================================================================
const insertShipments = (shipments, shipmentLines) => {
    const shipmentsInserted = bulkInsert(index_1.shipments, shipments, (s) => ({
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
    }), 'Shipments');
    const linesInserted = bulkInsert(index_1.shipmentLines, shipmentLines, (l) => ({
        id: l.id,
        shipmentId: l.shipmentId,
        productId: l.productId,
        quantity: l.quantity,
    }), 'ShipmentLines');
    return { shipments: shipmentsInserted, lines: linesInserted };
};
exports.insertShipments = insertShipments;
// ============================================================================
// MAIN LOADER FUNCTION
// ============================================================================
/**
 * Load normalized data into database
 * @param data - Normalized data from plugin
 * @returns Import statistics
 */
const loadToDatabase = (data) => {
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
    };
    // Insert in correct order (respecting foreign keys)
    if (data.warehouses?.length) {
        stats.warehousesImported = (0, exports.insertWarehouses)(data.warehouses);
    }
    if (data.users?.length) {
        stats.usersImported = (0, exports.insertUsers)(data.users);
    }
    if (data.suppliers?.length) {
        stats.suppliersImported = (0, exports.insertSuppliers)(data.suppliers);
    }
    if (data.customers?.length) {
        stats.customersImported = (0, exports.insertCustomers)(data.customers);
    }
    if (data.purchaseOrders?.length) {
        stats.purchaseOrdersImported = (0, exports.insertPurchaseOrders)(data.purchaseOrders);
    }
    if (data.purchaseOrderLines?.length) {
        (0, exports.insertPurchaseOrderLines)(data.purchaseOrderLines);
    }
    if (data.zones?.length) {
        console.log('📍 [DB] Inserting zones...');
        stats.zonesImported = (0, exports.insertZones)(data.zones);
    }
    if (data.sectors?.length) {
        console.log('📍 [DB] Inserting sectors...');
        stats.sectorsImported = (0, exports.insertSectors)(data.sectors);
    }
    if (data.locations?.length) {
        console.log('📍 [DB] Inserting locations...');
        stats.locationsImported = (0, exports.insertLocations)(data.locations);
    }
    if (data.products.length) {
        console.log('📦 [DB] Inserting products...');
        stats.productsImported = (0, exports.insertProducts)(data.products);
    }
    if (data.inventory.length) {
        console.log('📊 [DB] Inserting inventory...');
        stats.inventoryImported = (0, exports.insertInventory)(data.metadata.warehouseId, data.inventory);
    }
    if (data.movements.length) {
        console.log('🚚 [DB] Inserting movements...');
        stats.movementsImported = (0, exports.insertMovements)(data.movements);
    }
    if (data.orders?.length) {
        console.log('📋 [DB] Inserting orders...');
        const results = (0, exports.insertOrders)(data.orders, data.orderLines || []);
        stats.ordersImported = results.orders;
    }
    if (data.pickings?.length) {
        console.log('📦 [DB] Inserting pickings...');
        const results = (0, exports.insertPickings)(data.pickings, data.pickingLines || []);
        stats.pickingsImported = results.pickings;
    }
    if (data.receptions?.length) {
        console.log('📥 [DB] Inserting receptions...');
        const results = (0, exports.insertReceptions)(data.receptions, data.receptionLines || []);
        stats.receptionsImported = results.receptions;
    }
    if (data.restockings?.length) {
        console.log('🔄 [DB] Inserting restockings...');
        const results = (0, exports.insertRestockings)(data.restockings, data.restockingLines || []);
        stats.restockingsImported = results.restockings;
    }
    if (data.returns?.length) {
        console.log('↩️ [DB] Inserting returns...');
        const results = (0, exports.insertReturns)(data.returns, data.returnLines || []);
        stats.returnsImported = results.returns;
    }
    if (data.shipments?.length) {
        const results = (0, exports.insertShipments)(data.shipments, data.shipmentLines || []);
        stats.shipmentsImported = results.shipments;
    }
    return stats;
};
exports.loadToDatabase = loadToDatabase;

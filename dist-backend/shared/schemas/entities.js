"use strict";
/**
 * Zod Schemas - Runtime validation for all entities
 *
 * All data entering/exiting the application must be validated with these schemas.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deadStockAnalysisResultSchema = exports.deadStockProductSchema = exports.abcAnalysisResultSchema = exports.abcProductSchema = exports.ordersDataSchema = exports.orderSchema = exports.orderLineSchema = exports.restockingsDataSchema = exports.restockingSchema = exports.returnsDataSchema = exports.returnSchema = exports.pickingsDataSchema = exports.pickingSchema = exports.receptionsDataSchema = exports.receptionSchema = exports.importHistoryEntrySchema = exports.dashboardDataSchema = exports.recentMovementSchema = exports.lowStockAlertSchema = exports.topProductSchema = exports.movementByTypeSchema = exports.stockEvolutionPointSchema = exports.dashboardKpiSchema = exports.productsDataSchema = exports.warehousesDataSchema = exports.sectorsDataSchema = exports.zonesDataSchema = exports.locationsDataSchema = exports.sectorKpiSchema = exports.zoneKpiSchema = exports.locationKpiSchema = exports.inventorySchema = exports.productSchema = exports.locationSchema = exports.sectorSchema = exports.zoneSchema = exports.warehouseSchema = exports.prioritySchema = exports.statusSchema = void 0;
const zod_1 = require("zod");
// ============================================================================
// SHARED SCHEMAS
// ============================================================================
/**
 * Common status type
 */
exports.statusSchema = zod_1.z.enum(['active', 'inactive', 'pending', 'blocked', 'archived']);
/**
 * Common priority type
 */
exports.prioritySchema = zod_1.z.enum(['low', 'normal', 'high', 'urgent']);
// ============================================================================
// WAREHOUSE SCHEMAS
// ============================================================================
exports.warehouseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    code: zod_1.z.string(),
    name: zod_1.z.string(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    surface: zod_1.z.number().nullable(),
    capacity: zod_1.z.number().nullable(),
    usedCapacity: zod_1.z.number().nullable(),
    zoneCount: zod_1.z.number().nullable(),
    pickerCount: zod_1.z.number().nullable(),
    manager: zod_1.z.string().nullable(),
    email: zod_1.z.string().email().nullable(),
    phone: zod_1.z.string().nullable(),
    status: exports.statusSchema,
    openingDate: zod_1.z.string().datetime().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// ============================================================================
// ZONE SCHEMAS
// ============================================================================
exports.zoneSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    code: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    surface: zod_1.z.number().nullable(),
    capacity: zod_1.z.number().nullable(),
    usedCapacity: zod_1.z.number().nullable(),
    sectorCount: zod_1.z.number().nullable(),
    locationCount: zod_1.z.number().nullable(),
    pickerCount: zod_1.z.number().nullable(),
    temperatureMin: zod_1.z.number().nullable(),
    temperatureMax: zod_1.z.number().nullable(),
    status: exports.statusSchema,
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    warehouseName: zod_1.z.string().nullable(),
    warehouseCode: zod_1.z.string().nullable(),
});
// ============================================================================
// SECTOR SCHEMAS
// ============================================================================
exports.sectorSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    zoneId: zod_1.z.string(),
    code: zod_1.z.string(),
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    capacity: zod_1.z.number().nullable(),
    usedCapacity: zod_1.z.number().nullable(),
    locationCount: zod_1.z.number().nullable(),
    pickerCount: zod_1.z.number().nullable(),
    aisle: zod_1.z.string().nullable(),
    level: zod_1.z.number().nullable(),
    position: zod_1.z.string().nullable(),
    status: exports.statusSchema,
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    zoneName: zod_1.z.string().nullable(),
    zoneCode: zod_1.z.string().nullable(),
    warehouseName: zod_1.z.string().nullable(),
    warehouseCode: zod_1.z.string().nullable(),
});
// ============================================================================
// LOCATION SCHEMAS
// ============================================================================
exports.locationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    zoneId: zod_1.z.string(),
    sectorId: zod_1.z.string(),
    code: zod_1.z.string(),
    type: zod_1.z.string(),
    capacity: zod_1.z.number().nullable(),
    usedCapacity: zod_1.z.number().nullable(),
    productCount: zod_1.z.number().nullable(),
    pickerCount: zod_1.z.number().nullable(),
    aisle: zod_1.z.string().nullable(),
    level: zod_1.z.number().nullable(),
    position: zod_1.z.string().nullable(),
    barcode: zod_1.z.string().nullable(),
    status: exports.statusSchema,
    updatedAt: zod_1.z.string().datetime().nullable(),
    zoneName: zod_1.z.string().nullable(),
    zoneCode: zod_1.z.string().nullable(),
    sectorName: zod_1.z.string().nullable(),
    sectorCode: zod_1.z.string().nullable(),
    warehouseName: zod_1.z.string().nullable(),
    warehouseCode: zod_1.z.string().nullable(),
    products: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        sku: zod_1.z.string(),
        name: zod_1.z.string(),
        quantity: zod_1.z.number(),
    })).optional(),
});
// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================
exports.productSchema = zod_1.z.object({
    id: zod_1.z.string(),
    sku: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    category: zod_1.z.string(),
    subcategory: zod_1.z.string().nullable(),
    brand: zod_1.z.string().nullable(),
    unit: zod_1.z.string(),
    weight: zod_1.z.number().nullable(),
    volume: zod_1.z.number().nullable(),
    minStock: zod_1.z.number().nullable(),
    maxStock: zod_1.z.number().nullable(),
    reorderPoint: zod_1.z.number().nullable(),
    reorderQuantity: zod_1.z.number().nullable(),
    costPrice: zod_1.z.number().nullable(),
    sellingPrice: zod_1.z.number().nullable(),
    supplier: zod_1.z.string().nullable(),
    status: exports.statusSchema,
    currentQuantity: zod_1.z.number().nullable(),
    availableQuantity: zod_1.z.number().nullable(),
    reservedQuantity: zod_1.z.number().nullable(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
// ============================================================================
// INVENTORY SCHEMAS
// ============================================================================
exports.inventorySchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    productId: zod_1.z.string(),
    productSku: zod_1.z.string(),
    productName: zod_1.z.string(),
    locationId: zod_1.z.string().nullable(),
    locationCode: zod_1.z.string().nullable(),
    quantity: zod_1.z.number(),
    availableQuantity: zod_1.z.number(),
    reservedQuantity: zod_1.z.number(),
    lastReceivedAt: zod_1.z.string().datetime().nullable(),
    lastShippedAt: zod_1.z.string().datetime().nullable(),
});
// ============================================================================
// KPI SCHEMAS
// ============================================================================
exports.locationKpiSchema = zod_1.z.object({
    totalLocations: zod_1.z.number(),
    availableLocations: zod_1.z.number(),
    occupiedLocations: zod_1.z.number(),
    blockedLocations: zod_1.z.number(),
    reservedLocations: zod_1.z.number(),
    totalCapacity: zod_1.z.number(),
    usedCapacity: zod_1.z.number(),
    averageOccupancy: zod_1.z.number(),
});
exports.zoneKpiSchema = zod_1.z.object({
    totalZones: zod_1.z.number(),
    activeZones: zod_1.z.number(),
    totalSurface: zod_1.z.number(),
    totalCapacity: zod_1.z.number(),
    usedCapacity: zod_1.z.number(),
    averageOccupancy: zod_1.z.number(),
    zoneTypes: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
});
exports.sectorKpiSchema = zod_1.z.object({
    totalSectors: zod_1.z.number(),
    activeSectors: zod_1.z.number(),
    totalCapacity: zod_1.z.number(),
    usedCapacity: zod_1.z.number(),
    averageOccupancy: zod_1.z.number(),
    sectorTypes: zod_1.z.record(zod_1.z.string(), zod_1.z.number()),
});
// ============================================================================
// DATA RESPONSE SCHEMAS
// ============================================================================
exports.locationsDataSchema = zod_1.z.object({
    kpis: exports.locationKpiSchema,
    locations: zod_1.z.array(exports.locationSchema),
});
exports.zonesDataSchema = zod_1.z.object({
    kpis: exports.zoneKpiSchema,
    zones: zod_1.z.array(exports.zoneSchema),
});
exports.sectorsDataSchema = zod_1.z.object({
    kpis: exports.sectorKpiSchema,
    sectors: zod_1.z.array(exports.sectorSchema),
});
exports.warehousesDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalWarehouses: zod_1.z.number(),
        activeWarehouses: zod_1.z.number(),
        totalSurface: zod_1.z.number(),
        totalCapacity: zod_1.z.number(),
        usedCapacity: zod_1.z.number(),
        averageOccupancy: zod_1.z.number(),
        trackedPickers: zod_1.z.number(),
    }),
    warehouses: zod_1.z.array(exports.warehouseSchema),
});
// ============================================================================
// PRODUCTS DATA SCHEMA
// ============================================================================
exports.productsDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalProducts: zod_1.z.number(),
        inStock: zod_1.z.number(),
        lowStock: zod_1.z.number(),
        outOfStock: zod_1.z.number(),
        totalQuantity: zod_1.z.number(),
        totalValue: zod_1.z.number(),
        categories: zod_1.z.number(),
    }),
    products: zod_1.z.array(exports.productSchema),
});
// ============================================================================
// DASHBOARD SCHEMAS
// ============================================================================
exports.dashboardKpiSchema = zod_1.z.object({
    totalProducts: zod_1.z.number(),
    totalLocations: zod_1.z.number(),
    lowStockItems: zod_1.z.number(),
    activeOrders: zod_1.z.number(),
    movementsThisWeek: zod_1.z.number(),
});
exports.stockEvolutionPointSchema = zod_1.z.object({
    date: zod_1.z.string(),
    quantity: zod_1.z.number(),
    value: zod_1.z.number(),
});
exports.movementByTypeSchema = zod_1.z.object({
    type: zod_1.z.string(),
    count: zod_1.z.number(),
    quantity: zod_1.z.number(),
});
exports.topProductSchema = zod_1.z.object({
    sku: zod_1.z.string(),
    name: zod_1.z.string(),
    totalMovements: zod_1.z.number(),
    totalQuantity: zod_1.z.number(),
});
exports.lowStockAlertSchema = zod_1.z.object({
    sku: zod_1.z.string(),
    name: zod_1.z.string(),
    currentQuantity: zod_1.z.number(),
    minStock: zod_1.z.number(),
    shortage: zod_1.z.number(),
});
exports.recentMovementSchema = zod_1.z.object({
    id: zod_1.z.string(),
    date: zod_1.z.string(),
    type: zod_1.z.string(),
    productSku: zod_1.z.string(),
    productName: zod_1.z.string(),
    quantity: zod_1.z.number(),
    locationCode: zod_1.z.string().nullable(),
});
exports.dashboardDataSchema = zod_1.z.object({
    kpis: exports.dashboardKpiSchema,
    stockEvolution: zod_1.z.array(exports.stockEvolutionPointSchema),
    movementsByType: zod_1.z.array(exports.movementByTypeSchema),
    topProducts: zod_1.z.array(exports.topProductSchema),
    lowStockAlerts: zod_1.z.array(exports.lowStockAlertSchema),
    recentMovements: zod_1.z.array(exports.recentMovementSchema),
});
// ============================================================================
// IMPORT HISTORY SCHEMA
// ============================================================================
exports.importHistoryEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    pluginId: zod_1.z.string(),
    pluginName: zod_1.z.string(),
    status: zod_1.z.enum(['success', 'partial', 'failed']),
    rowsProcessed: zod_1.z.number(),
    productsImported: zod_1.z.number(),
    inventoryImported: zod_1.z.number(),
    movementsImported: zod_1.z.number(),
    duration: zod_1.z.number(),
    createdAt: zod_1.z.string().datetime(),
});
// ============================================================================
// RECEPTION SCHEMAS
// ============================================================================
exports.receptionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    receptionNumber: zod_1.z.string(),
    supplierName: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    totalQuantity: zod_1.z.number(),
    receivedQuantity: zod_1.z.number(),
    pendingQuantity: zod_1.z.number(),
    receptionDate: zod_1.z.string().datetime(),
    createdAt: zod_1.z.string().datetime(),
});
exports.receptionsDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalReceptions: zod_1.z.number(),
        pendingReceptions: zod_1.z.number(),
        inProgressReceptions: zod_1.z.number(),
        completedReceptions: zod_1.z.number(),
        totalQuantity: zod_1.z.number(),
        receivedQuantity: zod_1.z.number(),
        pendingQuantity: zod_1.z.number(),
    }),
    receptions: zod_1.z.array(exports.receptionSchema),
});
// ============================================================================
// PICKING SCHEMAS
// ============================================================================
exports.pickingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    pickingNumber: zod_1.z.string(),
    customerName: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    totalLines: zod_1.z.number(),
    pickedLines: zod_1.z.number(),
    totalQuantity: zod_1.z.number(),
    pickedQuantity: zod_1.z.number(),
    pickingDate: zod_1.z.string().datetime(),
    createdAt: zod_1.z.string().datetime(),
});
exports.pickingsDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalPickings: zod_1.z.number(),
        pendingPickings: zod_1.z.number(),
        inProgressPickings: zod_1.z.number(),
        completedPickings: zod_1.z.number(),
        totalLines: zod_1.z.number(),
        pickedLines: zod_1.z.number(),
        completionRate: zod_1.z.number(),
    }),
    pickings: zod_1.z.array(exports.pickingSchema),
});
// ============================================================================
// RETURN SCHEMAS
// ============================================================================
exports.returnSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    returnNumber: zod_1.z.string(),
    customerName: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    totalQuantity: zod_1.z.number(),
    returnedQuantity: zod_1.z.number(),
    pendingQuantity: zod_1.z.number(),
    totalValue: zod_1.z.number(),
    refundedValue: zod_1.z.number(),
    returnDate: zod_1.z.string().datetime(),
    createdAt: zod_1.z.string().datetime(),
});
exports.returnsDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalReturns: zod_1.z.number(),
        pendingReturns: zod_1.z.number(),
        inProgressReturns: zod_1.z.number(),
        completedReturns: zod_1.z.number(),
        totalQuantity: zod_1.z.number(),
        returnedQuantity: zod_1.z.number(),
        pendingQuantity: zod_1.z.number(),
        totalValue: zod_1.z.number(),
        refundedValue: zod_1.z.number(),
    }),
    returns: zod_1.z.array(exports.returnSchema),
});
// ============================================================================
// RESTOCKING SCHEMAS
// ============================================================================
exports.restockingSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    restockingNumber: zod_1.z.string(),
    requester: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    totalProducts: zod_1.z.number(),
    restockedProducts: zod_1.z.number(),
    pendingProducts: zod_1.z.number(),
    restockingDate: zod_1.z.string().datetime(),
    createdAt: zod_1.z.string().datetime(),
});
exports.restockingsDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalRestockings: zod_1.z.number(),
        pendingRestockings: zod_1.z.number(),
        inProgressRestockings: zod_1.z.number(),
        completedRestockings: zod_1.z.number(),
        totalProducts: zod_1.z.number(),
        restockedProducts: zod_1.z.number(),
        pendingProducts: zod_1.z.number(),
    }),
    restockings: zod_1.z.array(exports.restockingSchema),
});
// ============================================================================
// ORDER SCHEMAS
// ============================================================================
exports.orderLineSchema = zod_1.z.object({
    id: zod_1.z.string(),
    productId: zod_1.z.string(),
    productSku: zod_1.z.string(),
    productName: zod_1.z.string(),
    quantity: zod_1.z.number(),
    price: zod_1.z.number(),
});
exports.orderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    warehouseId: zod_1.z.string(),
    orderNumber: zod_1.z.string(),
    customerName: zod_1.z.string(),
    status: zod_1.z.enum(['pending', 'confirmed', 'in_progress', 'shipped', 'delivered', 'cancelled']),
    totalLines: zod_1.z.number(),
    totalValue: zod_1.z.number(),
    orderDate: zod_1.z.string().datetime(),
    lines: zod_1.z.array(exports.orderLineSchema),
});
exports.ordersDataSchema = zod_1.z.object({
    kpis: zod_1.z.object({
        totalOrders: zod_1.z.number(),
        pendingOrders: zod_1.z.number(),
        inProgressOrders: zod_1.z.number(),
        shippedOrders: zod_1.z.number(),
        deliveredOrders: zod_1.z.number(),
        cancelledOrders: zod_1.z.number(),
        totalValue: zod_1.z.number(),
        averageOrderValue: zod_1.z.number(),
    }),
    orders: zod_1.z.array(exports.orderSchema),
});
// ============================================================================
// ANALYSIS SCHEMAS
// ============================================================================
exports.abcProductSchema = zod_1.z.object({
    sku: zod_1.z.string(),
    name: zod_1.z.string(),
    totalQuantity: zod_1.z.number(),
    totalValue: zod_1.z.number(),
    movementCount: zod_1.z.number(),
    contribution: zod_1.z.number(),
    abcClass: zod_1.z.enum(['A', 'B', 'C']),
});
exports.abcAnalysisResultSchema = zod_1.z.object({
    products: zod_1.z.array(exports.abcProductSchema),
    summary: zod_1.z.object({
        totalProducts: zod_1.z.number(),
        classA: zod_1.z.object({
            count: zod_1.z.number(),
            contribution: zod_1.z.number(),
        }),
        classB: zod_1.z.object({
            count: zod_1.z.number(),
            contribution: zod_1.z.number(),
        }),
        classC: zod_1.z.object({
            count: zod_1.z.number(),
            contribution: zod_1.z.number(),
        }),
    }),
    totalQuantity: zod_1.z.number(),
    totalValue: zod_1.z.number(),
    analysisDate: zod_1.z.string().datetime(),
    parameters: zod_1.z.object({
        warehouseId: zod_1.z.string(),
        dateFrom: zod_1.z.string().optional(),
        dateTo: zod_1.z.string().optional(),
    }),
});
exports.deadStockProductSchema = zod_1.z.object({
    sku: zod_1.z.string(),
    name: zod_1.z.string(),
    currentQuantity: zod_1.z.number(),
    lastMovementDate: zod_1.z.string().datetime(),
    daysSinceLastMovement: zod_1.z.number(),
    value: zod_1.z.number(),
    category: zod_1.z.string(),
    level: zod_1.z.enum(['critical', 'warning', 'monitor']),
});
exports.deadStockAnalysisResultSchema = zod_1.z.object({
    products: zod_1.z.array(exports.deadStockProductSchema),
    summary: zod_1.z.object({
        totalProducts: zod_1.z.number(),
        deadStockProducts: zod_1.z.number(),
        totalTiedCapital: zod_1.z.number(),
        criticalLevel: zod_1.z.object({
            count: zod_1.z.number(),
            tiedCapital: zod_1.z.number(),
        }),
        warningLevel: zod_1.z.object({
            count: zod_1.z.number(),
            tiedCapital: zod_1.z.number(),
        }),
        monitorLevel: zod_1.z.object({
            count: zod_1.z.number(),
            tiedCapital: zod_1.z.number(),
        }),
    }),
    analysisDate: zod_1.z.string().datetime(),
    parameters: zod_1.z.object({
        warehouseId: zod_1.z.string(),
        thresholdDays: zod_1.z.number(),
        criticalThreshold: zod_1.z.number(),
        warningThreshold: zod_1.z.number(),
    }),
});

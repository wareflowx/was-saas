/**
 * Zod Schemas - Runtime validation for all entities
 *
 * All data entering/exiting the application must be validated with these schemas.
 */
import { z } from 'zod';
/**
 * Common status type
 */
export declare const statusSchema: z.ZodEnum<{
    active: "active";
    blocked: "blocked";
    pending: "pending";
    inactive: "inactive";
    archived: "archived";
}>;
/**
 * Common priority type
 */
export declare const prioritySchema: z.ZodEnum<{
    low: "low";
    normal: "normal";
    high: "high";
    urgent: "urgent";
}>;
export declare const warehouseSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    city: z.ZodString;
    country: z.ZodString;
    surface: z.ZodNullable<z.ZodNumber>;
    capacity: z.ZodNullable<z.ZodNumber>;
    usedCapacity: z.ZodNullable<z.ZodNumber>;
    zoneCount: z.ZodNullable<z.ZodNumber>;
    pickerCount: z.ZodNullable<z.ZodNumber>;
    manager: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        active: "active";
        blocked: "blocked";
        pending: "pending";
        inactive: "inactive";
        archived: "archived";
    }>;
    openingDate: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Warehouse = z.infer<typeof warehouseSchema>;
export declare const zoneSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    surface: z.ZodNullable<z.ZodNumber>;
    capacity: z.ZodNullable<z.ZodNumber>;
    usedCapacity: z.ZodNullable<z.ZodNumber>;
    sectorCount: z.ZodNullable<z.ZodNumber>;
    locationCount: z.ZodNullable<z.ZodNumber>;
    pickerCount: z.ZodNullable<z.ZodNumber>;
    temperatureMin: z.ZodNullable<z.ZodNumber>;
    temperatureMax: z.ZodNullable<z.ZodNumber>;
    status: z.ZodEnum<{
        active: "active";
        blocked: "blocked";
        pending: "pending";
        inactive: "inactive";
        archived: "archived";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    warehouseName: z.ZodNullable<z.ZodString>;
    warehouseCode: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type Zone = z.infer<typeof zoneSchema>;
export declare const sectorSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    zoneId: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    capacity: z.ZodNullable<z.ZodNumber>;
    usedCapacity: z.ZodNullable<z.ZodNumber>;
    locationCount: z.ZodNullable<z.ZodNumber>;
    pickerCount: z.ZodNullable<z.ZodNumber>;
    aisle: z.ZodNullable<z.ZodString>;
    level: z.ZodNullable<z.ZodNumber>;
    position: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        active: "active";
        blocked: "blocked";
        pending: "pending";
        inactive: "inactive";
        archived: "archived";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    zoneName: z.ZodNullable<z.ZodString>;
    zoneCode: z.ZodNullable<z.ZodString>;
    warehouseName: z.ZodNullable<z.ZodString>;
    warehouseCode: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type Sector = z.infer<typeof sectorSchema>;
export declare const locationSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    zoneId: z.ZodString;
    sectorId: z.ZodString;
    code: z.ZodString;
    type: z.ZodString;
    capacity: z.ZodNullable<z.ZodNumber>;
    usedCapacity: z.ZodNullable<z.ZodNumber>;
    productCount: z.ZodNullable<z.ZodNumber>;
    pickerCount: z.ZodNullable<z.ZodNumber>;
    aisle: z.ZodNullable<z.ZodString>;
    level: z.ZodNullable<z.ZodNumber>;
    position: z.ZodNullable<z.ZodString>;
    barcode: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        active: "active";
        blocked: "blocked";
        pending: "pending";
        inactive: "inactive";
        archived: "archived";
    }>;
    updatedAt: z.ZodNullable<z.ZodString>;
    zoneName: z.ZodNullable<z.ZodString>;
    zoneCode: z.ZodNullable<z.ZodString>;
    sectorName: z.ZodNullable<z.ZodString>;
    sectorCode: z.ZodNullable<z.ZodString>;
    warehouseName: z.ZodNullable<z.ZodString>;
    warehouseCode: z.ZodNullable<z.ZodString>;
    products: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sku: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type Location = z.infer<typeof locationSchema>;
export declare const productSchema: z.ZodObject<{
    id: z.ZodString;
    sku: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    category: z.ZodString;
    subcategory: z.ZodNullable<z.ZodString>;
    brand: z.ZodNullable<z.ZodString>;
    unit: z.ZodString;
    weight: z.ZodNullable<z.ZodNumber>;
    volume: z.ZodNullable<z.ZodNumber>;
    minStock: z.ZodNullable<z.ZodNumber>;
    maxStock: z.ZodNullable<z.ZodNumber>;
    reorderPoint: z.ZodNullable<z.ZodNumber>;
    reorderQuantity: z.ZodNullable<z.ZodNumber>;
    costPrice: z.ZodNullable<z.ZodNumber>;
    sellingPrice: z.ZodNullable<z.ZodNumber>;
    supplier: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        active: "active";
        blocked: "blocked";
        pending: "pending";
        inactive: "inactive";
        archived: "archived";
    }>;
    currentQuantity: z.ZodNullable<z.ZodNumber>;
    availableQuantity: z.ZodNullable<z.ZodNumber>;
    reservedQuantity: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Product = z.infer<typeof productSchema>;
export declare const inventorySchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    productId: z.ZodString;
    productSku: z.ZodString;
    productName: z.ZodString;
    locationId: z.ZodNullable<z.ZodString>;
    locationCode: z.ZodNullable<z.ZodString>;
    quantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    reservedQuantity: z.ZodNumber;
    lastReceivedAt: z.ZodNullable<z.ZodString>;
    lastShippedAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type Inventory = z.infer<typeof inventorySchema>;
export declare const locationKpiSchema: z.ZodObject<{
    totalLocations: z.ZodNumber;
    availableLocations: z.ZodNumber;
    occupiedLocations: z.ZodNumber;
    blockedLocations: z.ZodNumber;
    reservedLocations: z.ZodNumber;
    totalCapacity: z.ZodNumber;
    usedCapacity: z.ZodNumber;
    averageOccupancy: z.ZodNumber;
}, z.core.$strip>;
export type LocationKpi = z.infer<typeof locationKpiSchema>;
export declare const zoneKpiSchema: z.ZodObject<{
    totalZones: z.ZodNumber;
    activeZones: z.ZodNumber;
    totalSurface: z.ZodNumber;
    totalCapacity: z.ZodNumber;
    usedCapacity: z.ZodNumber;
    averageOccupancy: z.ZodNumber;
    zoneTypes: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
export type ZoneKpi = z.infer<typeof zoneKpiSchema>;
export declare const sectorKpiSchema: z.ZodObject<{
    totalSectors: z.ZodNumber;
    activeSectors: z.ZodNumber;
    totalCapacity: z.ZodNumber;
    usedCapacity: z.ZodNumber;
    averageOccupancy: z.ZodNumber;
    sectorTypes: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
export type SectorKpi = z.infer<typeof sectorKpiSchema>;
export declare const locationsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalLocations: z.ZodNumber;
        availableLocations: z.ZodNumber;
        occupiedLocations: z.ZodNumber;
        blockedLocations: z.ZodNumber;
        reservedLocations: z.ZodNumber;
        totalCapacity: z.ZodNumber;
        usedCapacity: z.ZodNumber;
        averageOccupancy: z.ZodNumber;
    }, z.core.$strip>;
    locations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        zoneId: z.ZodString;
        sectorId: z.ZodString;
        code: z.ZodString;
        type: z.ZodString;
        capacity: z.ZodNullable<z.ZodNumber>;
        usedCapacity: z.ZodNullable<z.ZodNumber>;
        productCount: z.ZodNullable<z.ZodNumber>;
        pickerCount: z.ZodNullable<z.ZodNumber>;
        aisle: z.ZodNullable<z.ZodString>;
        level: z.ZodNullable<z.ZodNumber>;
        position: z.ZodNullable<z.ZodString>;
        barcode: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            active: "active";
            blocked: "blocked";
            pending: "pending";
            inactive: "inactive";
            archived: "archived";
        }>;
        updatedAt: z.ZodNullable<z.ZodString>;
        zoneName: z.ZodNullable<z.ZodString>;
        zoneCode: z.ZodNullable<z.ZodString>;
        sectorName: z.ZodNullable<z.ZodString>;
        sectorCode: z.ZodNullable<z.ZodString>;
        warehouseName: z.ZodNullable<z.ZodString>;
        warehouseCode: z.ZodNullable<z.ZodString>;
        products: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            sku: z.ZodString;
            name: z.ZodString;
            quantity: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LocationsData = z.infer<typeof locationsDataSchema>;
export declare const zonesDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalZones: z.ZodNumber;
        activeZones: z.ZodNumber;
        totalSurface: z.ZodNumber;
        totalCapacity: z.ZodNumber;
        usedCapacity: z.ZodNumber;
        averageOccupancy: z.ZodNumber;
        zoneTypes: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, z.core.$strip>;
    zones: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        surface: z.ZodNullable<z.ZodNumber>;
        capacity: z.ZodNullable<z.ZodNumber>;
        usedCapacity: z.ZodNullable<z.ZodNumber>;
        sectorCount: z.ZodNullable<z.ZodNumber>;
        locationCount: z.ZodNullable<z.ZodNumber>;
        pickerCount: z.ZodNullable<z.ZodNumber>;
        temperatureMin: z.ZodNullable<z.ZodNumber>;
        temperatureMax: z.ZodNullable<z.ZodNumber>;
        status: z.ZodEnum<{
            active: "active";
            blocked: "blocked";
            pending: "pending";
            inactive: "inactive";
            archived: "archived";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        warehouseName: z.ZodNullable<z.ZodString>;
        warehouseCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ZonesData = z.infer<typeof zonesDataSchema>;
export declare const sectorsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalSectors: z.ZodNumber;
        activeSectors: z.ZodNumber;
        totalCapacity: z.ZodNumber;
        usedCapacity: z.ZodNumber;
        averageOccupancy: z.ZodNumber;
        sectorTypes: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, z.core.$strip>;
    sectors: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        zoneId: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        capacity: z.ZodNullable<z.ZodNumber>;
        usedCapacity: z.ZodNullable<z.ZodNumber>;
        locationCount: z.ZodNullable<z.ZodNumber>;
        pickerCount: z.ZodNullable<z.ZodNumber>;
        aisle: z.ZodNullable<z.ZodString>;
        level: z.ZodNullable<z.ZodNumber>;
        position: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            active: "active";
            blocked: "blocked";
            pending: "pending";
            inactive: "inactive";
            archived: "archived";
        }>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        zoneName: z.ZodNullable<z.ZodString>;
        zoneCode: z.ZodNullable<z.ZodString>;
        warehouseName: z.ZodNullable<z.ZodString>;
        warehouseCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SectorsData = z.infer<typeof sectorsDataSchema>;
export declare const warehousesDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalWarehouses: z.ZodNumber;
        activeWarehouses: z.ZodNumber;
        totalSurface: z.ZodNumber;
        totalCapacity: z.ZodNumber;
        usedCapacity: z.ZodNumber;
        averageOccupancy: z.ZodNumber;
        trackedPickers: z.ZodNumber;
    }, z.core.$strip>;
    warehouses: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        city: z.ZodString;
        country: z.ZodString;
        surface: z.ZodNullable<z.ZodNumber>;
        capacity: z.ZodNullable<z.ZodNumber>;
        usedCapacity: z.ZodNullable<z.ZodNumber>;
        zoneCount: z.ZodNullable<z.ZodNumber>;
        pickerCount: z.ZodNullable<z.ZodNumber>;
        manager: z.ZodNullable<z.ZodString>;
        email: z.ZodNullable<z.ZodString>;
        phone: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            active: "active";
            blocked: "blocked";
            pending: "pending";
            inactive: "inactive";
            archived: "archived";
        }>;
        openingDate: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WarehousesData = z.infer<typeof warehousesDataSchema>;
export declare const productsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalProducts: z.ZodNumber;
        inStock: z.ZodNumber;
        lowStock: z.ZodNumber;
        outOfStock: z.ZodNumber;
        totalQuantity: z.ZodNumber;
        totalValue: z.ZodNumber;
        categories: z.ZodNumber;
    }, z.core.$strip>;
    products: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sku: z.ZodString;
        name: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        category: z.ZodString;
        subcategory: z.ZodNullable<z.ZodString>;
        brand: z.ZodNullable<z.ZodString>;
        unit: z.ZodString;
        weight: z.ZodNullable<z.ZodNumber>;
        volume: z.ZodNullable<z.ZodNumber>;
        minStock: z.ZodNullable<z.ZodNumber>;
        maxStock: z.ZodNullable<z.ZodNumber>;
        reorderPoint: z.ZodNullable<z.ZodNumber>;
        reorderQuantity: z.ZodNullable<z.ZodNumber>;
        costPrice: z.ZodNullable<z.ZodNumber>;
        sellingPrice: z.ZodNullable<z.ZodNumber>;
        supplier: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            active: "active";
            blocked: "blocked";
            pending: "pending";
            inactive: "inactive";
            archived: "archived";
        }>;
        currentQuantity: z.ZodNullable<z.ZodNumber>;
        availableQuantity: z.ZodNullable<z.ZodNumber>;
        reservedQuantity: z.ZodNullable<z.ZodNumber>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ProductsData = z.infer<typeof productsDataSchema>;
export declare const dashboardKpiSchema: z.ZodObject<{
    totalProducts: z.ZodNumber;
    totalLocations: z.ZodNumber;
    lowStockItems: z.ZodNumber;
    activeOrders: z.ZodNumber;
    movementsThisWeek: z.ZodNumber;
}, z.core.$strip>;
export declare const stockEvolutionPointSchema: z.ZodObject<{
    date: z.ZodString;
    quantity: z.ZodNumber;
    value: z.ZodNumber;
}, z.core.$strip>;
export declare const movementByTypeSchema: z.ZodObject<{
    type: z.ZodString;
    count: z.ZodNumber;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const topProductSchema: z.ZodObject<{
    sku: z.ZodString;
    name: z.ZodString;
    totalMovements: z.ZodNumber;
    totalQuantity: z.ZodNumber;
}, z.core.$strip>;
export declare const lowStockAlertSchema: z.ZodObject<{
    sku: z.ZodString;
    name: z.ZodString;
    currentQuantity: z.ZodNumber;
    minStock: z.ZodNumber;
    shortage: z.ZodNumber;
}, z.core.$strip>;
export declare const recentMovementSchema: z.ZodObject<{
    id: z.ZodString;
    date: z.ZodString;
    type: z.ZodString;
    productSku: z.ZodString;
    productName: z.ZodString;
    quantity: z.ZodNumber;
    locationCode: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const dashboardDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalProducts: z.ZodNumber;
        totalLocations: z.ZodNumber;
        lowStockItems: z.ZodNumber;
        activeOrders: z.ZodNumber;
        movementsThisWeek: z.ZodNumber;
    }, z.core.$strip>;
    stockEvolution: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        quantity: z.ZodNumber;
        value: z.ZodNumber;
    }, z.core.$strip>>;
    movementsByType: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        count: z.ZodNumber;
        quantity: z.ZodNumber;
    }, z.core.$strip>>;
    topProducts: z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        name: z.ZodString;
        totalMovements: z.ZodNumber;
        totalQuantity: z.ZodNumber;
    }, z.core.$strip>>;
    lowStockAlerts: z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        name: z.ZodString;
        currentQuantity: z.ZodNumber;
        minStock: z.ZodNumber;
        shortage: z.ZodNumber;
    }, z.core.$strip>>;
    recentMovements: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        date: z.ZodString;
        type: z.ZodString;
        productSku: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        locationCode: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DashboardData = z.infer<typeof dashboardDataSchema>;
export declare const importHistoryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    pluginId: z.ZodString;
    pluginName: z.ZodString;
    status: z.ZodEnum<{
        partial: "partial";
        success: "success";
        failed: "failed";
    }>;
    rowsProcessed: z.ZodNumber;
    productsImported: z.ZodNumber;
    inventoryImported: z.ZodNumber;
    movementsImported: z.ZodNumber;
    duration: z.ZodNumber;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type ImportHistoryEntry = z.infer<typeof importHistoryEntrySchema>;
export declare const receptionSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    receptionNumber: z.ZodString;
    supplierName: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    totalQuantity: z.ZodNumber;
    receivedQuantity: z.ZodNumber;
    pendingQuantity: z.ZodNumber;
    receptionDate: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Reception = z.infer<typeof receptionSchema>;
export declare const receptionsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalReceptions: z.ZodNumber;
        pendingReceptions: z.ZodNumber;
        inProgressReceptions: z.ZodNumber;
        completedReceptions: z.ZodNumber;
        totalQuantity: z.ZodNumber;
        receivedQuantity: z.ZodNumber;
        pendingQuantity: z.ZodNumber;
    }, z.core.$strip>;
    receptions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        receptionNumber: z.ZodString;
        supplierName: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            in_progress: "in_progress";
            completed: "completed";
            cancelled: "cancelled";
        }>;
        totalQuantity: z.ZodNumber;
        receivedQuantity: z.ZodNumber;
        pendingQuantity: z.ZodNumber;
        receptionDate: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ReceptionsData = z.infer<typeof receptionsDataSchema>;
export declare const pickingSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    pickingNumber: z.ZodString;
    customerName: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    totalLines: z.ZodNumber;
    pickedLines: z.ZodNumber;
    totalQuantity: z.ZodNumber;
    pickedQuantity: z.ZodNumber;
    pickingDate: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Picking = z.infer<typeof pickingSchema>;
export declare const pickingsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalPickings: z.ZodNumber;
        pendingPickings: z.ZodNumber;
        inProgressPickings: z.ZodNumber;
        completedPickings: z.ZodNumber;
        totalLines: z.ZodNumber;
        pickedLines: z.ZodNumber;
        completionRate: z.ZodNumber;
    }, z.core.$strip>;
    pickings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        pickingNumber: z.ZodString;
        customerName: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            in_progress: "in_progress";
            completed: "completed";
            cancelled: "cancelled";
        }>;
        totalLines: z.ZodNumber;
        pickedLines: z.ZodNumber;
        totalQuantity: z.ZodNumber;
        pickedQuantity: z.ZodNumber;
        pickingDate: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type PickingsData = z.infer<typeof pickingsDataSchema>;
export declare const returnSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    returnNumber: z.ZodString;
    customerName: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    totalQuantity: z.ZodNumber;
    returnedQuantity: z.ZodNumber;
    pendingQuantity: z.ZodNumber;
    totalValue: z.ZodNumber;
    refundedValue: z.ZodNumber;
    returnDate: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Return = z.infer<typeof returnSchema>;
export declare const returnsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalReturns: z.ZodNumber;
        pendingReturns: z.ZodNumber;
        inProgressReturns: z.ZodNumber;
        completedReturns: z.ZodNumber;
        totalQuantity: z.ZodNumber;
        returnedQuantity: z.ZodNumber;
        pendingQuantity: z.ZodNumber;
        totalValue: z.ZodNumber;
        refundedValue: z.ZodNumber;
    }, z.core.$strip>;
    returns: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        returnNumber: z.ZodString;
        customerName: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            in_progress: "in_progress";
            completed: "completed";
            cancelled: "cancelled";
        }>;
        totalQuantity: z.ZodNumber;
        returnedQuantity: z.ZodNumber;
        pendingQuantity: z.ZodNumber;
        totalValue: z.ZodNumber;
        refundedValue: z.ZodNumber;
        returnDate: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ReturnsData = z.infer<typeof returnsDataSchema>;
export declare const restockingSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    restockingNumber: z.ZodString;
    requester: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    totalProducts: z.ZodNumber;
    restockedProducts: z.ZodNumber;
    pendingProducts: z.ZodNumber;
    restockingDate: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Restocking = z.infer<typeof restockingSchema>;
export declare const restockingsDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalRestockings: z.ZodNumber;
        pendingRestockings: z.ZodNumber;
        inProgressRestockings: z.ZodNumber;
        completedRestockings: z.ZodNumber;
        totalProducts: z.ZodNumber;
        restockedProducts: z.ZodNumber;
        pendingProducts: z.ZodNumber;
    }, z.core.$strip>;
    restockings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        restockingNumber: z.ZodString;
        requester: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            in_progress: "in_progress";
            completed: "completed";
            cancelled: "cancelled";
        }>;
        totalProducts: z.ZodNumber;
        restockedProducts: z.ZodNumber;
        pendingProducts: z.ZodNumber;
        restockingDate: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RestockingsData = z.infer<typeof restockingsDataSchema>;
export declare const orderLineSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    productSku: z.ZodString;
    productName: z.ZodString;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
}, z.core.$strip>;
export type OrderLine = z.infer<typeof orderLineSchema>;
export declare const orderSchema: z.ZodObject<{
    id: z.ZodString;
    warehouseId: z.ZodString;
    orderNumber: z.ZodString;
    customerName: z.ZodString;
    status: z.ZodEnum<{
        pending: "pending";
        in_progress: "in_progress";
        shipped: "shipped";
        delivered: "delivered";
        cancelled: "cancelled";
        confirmed: "confirmed";
    }>;
    totalLines: z.ZodNumber;
    totalValue: z.ZodNumber;
    orderDate: z.ZodString;
    lines: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productId: z.ZodString;
        productSku: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Order = z.infer<typeof orderSchema>;
export declare const ordersDataSchema: z.ZodObject<{
    kpis: z.ZodObject<{
        totalOrders: z.ZodNumber;
        pendingOrders: z.ZodNumber;
        inProgressOrders: z.ZodNumber;
        shippedOrders: z.ZodNumber;
        deliveredOrders: z.ZodNumber;
        cancelledOrders: z.ZodNumber;
        totalValue: z.ZodNumber;
        averageOrderValue: z.ZodNumber;
    }, z.core.$strip>;
    orders: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        warehouseId: z.ZodString;
        orderNumber: z.ZodString;
        customerName: z.ZodString;
        status: z.ZodEnum<{
            pending: "pending";
            in_progress: "in_progress";
            shipped: "shipped";
            delivered: "delivered";
            cancelled: "cancelled";
            confirmed: "confirmed";
        }>;
        totalLines: z.ZodNumber;
        totalValue: z.ZodNumber;
        orderDate: z.ZodString;
        lines: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            productId: z.ZodString;
            productSku: z.ZodString;
            productName: z.ZodString;
            quantity: z.ZodNumber;
            price: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OrdersData = z.infer<typeof ordersDataSchema>;
export declare const abcProductSchema: z.ZodObject<{
    sku: z.ZodString;
    name: z.ZodString;
    totalQuantity: z.ZodNumber;
    totalValue: z.ZodNumber;
    movementCount: z.ZodNumber;
    contribution: z.ZodNumber;
    abcClass: z.ZodEnum<{
        A: "A";
        B: "B";
        C: "C";
    }>;
}, z.core.$strip>;
export type ABCProduct = z.infer<typeof abcProductSchema>;
export declare const abcAnalysisResultSchema: z.ZodObject<{
    products: z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        name: z.ZodString;
        totalQuantity: z.ZodNumber;
        totalValue: z.ZodNumber;
        movementCount: z.ZodNumber;
        contribution: z.ZodNumber;
        abcClass: z.ZodEnum<{
            A: "A";
            B: "B";
            C: "C";
        }>;
    }, z.core.$strip>>;
    summary: z.ZodObject<{
        totalProducts: z.ZodNumber;
        classA: z.ZodObject<{
            count: z.ZodNumber;
            contribution: z.ZodNumber;
        }, z.core.$strip>;
        classB: z.ZodObject<{
            count: z.ZodNumber;
            contribution: z.ZodNumber;
        }, z.core.$strip>;
        classC: z.ZodObject<{
            count: z.ZodNumber;
            contribution: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    totalQuantity: z.ZodNumber;
    totalValue: z.ZodNumber;
    analysisDate: z.ZodString;
    parameters: z.ZodObject<{
        warehouseId: z.ZodString;
        dateFrom: z.ZodOptional<z.ZodString>;
        dateTo: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ABCAnalysisResult = z.infer<typeof abcAnalysisResultSchema>;
export declare const deadStockProductSchema: z.ZodObject<{
    sku: z.ZodString;
    name: z.ZodString;
    currentQuantity: z.ZodNumber;
    lastMovementDate: z.ZodString;
    daysSinceLastMovement: z.ZodNumber;
    value: z.ZodNumber;
    category: z.ZodString;
    level: z.ZodEnum<{
        critical: "critical";
        warning: "warning";
        monitor: "monitor";
    }>;
}, z.core.$strip>;
export type DeadStockProduct = z.infer<typeof deadStockProductSchema>;
export declare const deadStockAnalysisResultSchema: z.ZodObject<{
    products: z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        name: z.ZodString;
        currentQuantity: z.ZodNumber;
        lastMovementDate: z.ZodString;
        daysSinceLastMovement: z.ZodNumber;
        value: z.ZodNumber;
        category: z.ZodString;
        level: z.ZodEnum<{
            critical: "critical";
            warning: "warning";
            monitor: "monitor";
        }>;
    }, z.core.$strip>>;
    summary: z.ZodObject<{
        totalProducts: z.ZodNumber;
        deadStockProducts: z.ZodNumber;
        totalTiedCapital: z.ZodNumber;
        criticalLevel: z.ZodObject<{
            count: z.ZodNumber;
            tiedCapital: z.ZodNumber;
        }, z.core.$strip>;
        warningLevel: z.ZodObject<{
            count: z.ZodNumber;
            tiedCapital: z.ZodNumber;
        }, z.core.$strip>;
        monitorLevel: z.ZodObject<{
            count: z.ZodNumber;
            tiedCapital: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    analysisDate: z.ZodString;
    parameters: z.ZodObject<{
        warehouseId: z.ZodString;
        thresholdDays: z.ZodNumber;
        criticalThreshold: z.ZodNumber;
        warningThreshold: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DeadStockAnalysisResult = z.infer<typeof deadStockAnalysisResultSchema>;

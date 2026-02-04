/**
 * Drizzle ORM Queries
 * Type-safe database queries using Drizzle ORM query builder
 */
export type { Warehouse, Zone, Sector, Location, Product, Inventory, Movement, Order, OrderLine, Picking, PickingLine, Reception, ReceptionLine, Restocking, RestockingLine, Return, ReturnLine, } from './drizzle-schema';
/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
export declare const getProductsByWarehouse: (warehouseId: string) => Promise<{
    id: string;
    sku: string;
    name: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    brand: string | null;
    unit: string;
    weight: number | null;
    volume: number | null;
    minStock: number | null;
    maxStock: number | null;
    reorderPoint: number | null;
    reorderQuantity: number | null;
    costPrice: number | null;
    sellingPrice: number | null;
    supplier: string | null;
    status: string;
    currentQuantity: number | null;
    availableQuantity: number | null;
    reservedQuantity: number | null;
}[]>;
/**
 * Get a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
export declare const getProductById: (productId: string) => Promise<{
    id: string;
    sku: string;
    name: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    brand: string | null;
    unit: string;
    weight: number | null;
    volume: number | null;
    minStock: number | null;
    maxStock: number | null;
    reorderPoint: number | null;
    reorderQuantity: number | null;
    costPrice: number | null;
    sellingPrice: number | null;
    supplier: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}>;
/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
export declare const getProductBySku: (sku: string) => Promise<{
    id: string;
    sku: string;
    name: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    brand: string | null;
    unit: string;
    weight: number | null;
    volume: number | null;
    minStock: number | null;
    maxStock: number | null;
    reorderPoint: number | null;
    reorderQuantity: number | null;
    costPrice: number | null;
    sellingPrice: number | null;
    supplier: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}>;
/**
 * Get all inventory for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of inventory records
 */
export declare const getInventoryByWarehouse: (filters: {
    warehouseId: string;
    productId?: string;
    locationId?: string;
}) => Promise<{
    id: string;
    warehouseId: string;
    productId: string;
    productSku: string;
    productName: string;
    locationId: string | null;
    locationCode: string | null;
    quantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    lastReceivedAt: string | null;
    lastShippedAt: string | null;
}[]>;
/**
 * Get movements for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of movements
 */
export declare const getMovementsByWarehouse: (filters: {
    warehouseId: string;
    productId?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
}) => Promise<{
    id: string;
    warehouseId: string;
    productId: string;
    productSku: string;
    productName: string;
    type: string;
    sourceLocationId: string | null;
    sourceZone: string | null;
    sourceLocationCode: string | null;
    destinationLocationId: string | null;
    destinationZone: string | null;
    destinationLocationCode: string | null;
    quantity: number;
    unit: string;
    movementDate: string;
    user: string | null;
    reason: string | null;
    lot: string | null;
    expirationDate: string | null;
    referenceType: string | null;
    referenceId: string | null;
    createdAt: string;
}[]>;
/**
 * Get last movement date for a product in a warehouse
 * @param warehouseId - Warehouse ID
 * @param productId - Product ID
 * @returns Last movement date or null
 */
export declare const getLastMovementDate: (warehouseId: string, productId: string) => Promise<string | null>;
/**
 * Get orders for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of orders
 */
export declare const getOrdersByWarehouse: (filters: {
    warehouseId: string;
    status?: string;
    limit?: number;
}) => Promise<{
    id: string;
    warehouseId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    customerEmail: string | null;
    orderDate: string;
    requiredDate: string;
    promisedDate: string | null;
    shippedDate: string | null;
    deliveredDate: string | null;
    status: string;
    priority: string;
    totalQuantity: number | null;
    totalAmount: number | null;
    shippingAddress: string | null;
    shippingCity: string | null;
    shippingCountry: string | null;
    trackingNumber: string | null;
    carrier: string | null;
    notes: string | null;
    picker: string | null;
    packer: string | null;
    createdAt: string;
    updatedAt: string;
}[]>;
/**
 * Get product movement totals for ABC analysis
 * @param warehouseId - Warehouse ID
 * @param type - Movement type (typically 'outbound')
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns Array of products with movement totals
 */
export declare const getProductMovementTotals: (warehouseId: string, type: string, dateFrom?: string, dateTo?: string) => Promise<{
    productId: string;
    sku: string;
    name: string;
    totalQuantity: number;
    movementCount: number;
}[]>;
/**
 * Get dead stock products
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for considering as dead stock
 * @returns Array of products with last movement date and tied capital
 */
export declare const getDeadStock: (warehouseId: string, thresholdDays?: number) => Promise<any>;
/**
 * Get all locations for a specific warehouse, or all locations if no warehouse specified
 * @param warehouseId - Warehouse ID filter (optional, returns all if not provided)
 * @returns Locations data with KPIs
 */
export declare const getLocationsByWarehouse: (warehouseId?: string) => Promise<{
    kpis: {
        totalLocations: number;
        availableLocations: number;
        occupiedLocations: number;
        blockedLocations: number;
        reservedLocations: number;
        totalCapacity: number;
        usedCapacity: number;
        averageOccupancy: number;
    };
    locations: {
        products: {
            id: string;
            sku: string;
            name: string;
            quantity: number;
        }[];
        id: string;
        code: string;
        type: string;
        capacity: number | null;
        usedCapacity: number | null;
        productCount: number | null;
        pickerCount: number | null;
        aisle: string | null;
        level: number | null;
        position: string | null;
        barcode: string | null;
        status: string;
        updatedAt: string;
        zoneId: string | null;
        zoneName: string | null;
        zoneCode: string | null;
        sectorId: string | null;
        sectorName: string | null;
        sectorCode: string | null;
        warehouseId: string | null;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get all zones for a specific warehouse, or all zones if no warehouse specified
 * @param warehouseId - Warehouse ID filter (optional, returns all if not provided)
 * @returns Zones data with KPIs
 */
export declare const getZonesByWarehouse: (warehouseId?: string) => Promise<{
    kpis: {
        totalZones: number;
        activeZones: number;
        totalSurface: number;
        totalCapacity: number;
        usedCapacity: number;
        averageOccupancy: number;
        zoneTypes: Record<string, number>;
    };
    zones: {
        id: string;
        code: string;
        name: string;
        type: string;
        surface: number | null;
        capacity: number | null;
        usedCapacity: number | null;
        sectorCount: number | null;
        locationCount: number | null;
        pickerCount: number | null;
        temperatureMin: number | null;
        temperatureMax: number | null;
        status: string;
        updatedAt: string;
        warehouseId: string | null;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get all sectors for a specific warehouse, or all sectors if no warehouse specified
 * @param warehouseId - Warehouse ID filter (optional, returns all if not provided)
 * @returns Sectors data with KPIs
 */
export declare const getSectorsByWarehouse: (warehouseId?: string) => Promise<{
    kpis: {
        totalSectors: number;
        activeSectors: number;
        totalCapacity: number;
        usedCapacity: number;
        averageOccupancy: number;
        sectorTypes: Record<string, number>;
    };
    sectors: {
        id: string;
        code: string;
        name: string;
        type: string;
        capacity: number | null;
        usedCapacity: number | null;
        locationCount: number | null;
        pickerCount: number | null;
        aisle: string | null;
        level: number | null;
        position: string | null;
        status: string;
        updatedAt: string;
        zoneId: string | null;
        zoneName: string | null;
        zoneCode: string | null;
        warehouseId: string | null;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get all warehouses with KPIs
 * @returns Warehouses data with KPIs
 */
export declare const getWarehousesWithKPIs: () => Promise<{
    kpis: {
        totalWarehouses: number;
        activeWarehouses: number;
        totalSurface: number;
        totalCapacity: number;
        usedCapacity: number;
        averageOccupancy: number;
        trackedPickers: number;
    };
    warehouses: {
        id: string;
        code: string;
        name: string;
        city: string;
        country: string;
        surface: number | null;
        capacity: number | null;
        usedCapacity: number | null;
        zoneCount: number | null;
        pickerCount: number | null;
        manager: string | null;
        email: string | null;
        phone: string | null;
        status: string;
        openingDate: string | null;
        createdAt: string;
        updatedAt: string;
    }[];
}>;
/**
 * Get import history for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Import history records
 */
export declare const getImportHistory: (warehouseId?: string) => Promise<{
    id: number;
    warehouseId: string;
    pluginId: string;
    pluginVersion: string;
    importedAt: string;
    rowsProcessed: number;
    status: string;
    fileName: string | null;
    fileSize: number | null;
    durationMs: number | null;
    errorMessage: string | null;
    warehouseName: string | null;
    warehouseCode: string | null;
}[]>;
/**
 * Get all receptions for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Receptions data with KPIs
 */
export declare const getReceptionsByWarehouse: (warehouseId: string) => Promise<{
    kpis: {
        totalReceptions: number;
        pendingReceptions: number;
        inProgressReceptions: number;
        completedReceptions: number;
        totalQuantity: number;
        receivedQuantity: number;
        pendingQuantity: number;
    };
    receptions: {
        id: string;
        receptionNumber: string;
        warehouseId: string;
        supplierId: string;
        supplierName: string;
        expectedDate: string;
        receivedDate: string | null;
        status: string;
        priority: string;
        totalQuantity: number | null;
        receivedQuantity: number | null;
        rejectedQuantity: number | null;
        totalAmount: number | null;
        carrier: string | null;
        trackingNumber: string | null;
        receiver: string | null;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get reception lines for a reception
 * @param receptionId - Reception ID
 * @returns Array of reception lines
 */
export declare const getReceptionLines: (receptionId: string) => Promise<{
    id: string;
    receptionId: string;
    warehouseId: string;
    productId: string;
    productSku: string;
    productName: string;
    orderedQuantity: number;
    receivedQuantity: number | null;
    rejectedQuantity: number | null;
    unitPrice: number;
    totalPrice: number;
    reason: string | null;
    processedByUserId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    createdAt: string;
    updatedAt: string;
}[]>;
/**
 * Get all pickings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Pickings data with KPIs
 */
export declare const getPickingsByWarehouse: (warehouseId: string) => Promise<{
    kpis: {
        totalPickings: number;
        pendingPickings: number;
        inProgressPickings: number;
        completedPickings: number;
        totalLines: number;
        pickedLines: number;
        completionRate: number;
    };
    pickings: {
        id: string;
        pickingNumber: string;
        warehouseId: string;
        orderId: string;
        orderNumber: string;
        customerId: string;
        customerName: string;
        assignedDate: string;
        startedDate: string | null;
        completedDate: string | null;
        status: string;
        priority: string;
        totalQuantity: number | null;
        pickedQuantity: number | null;
        remainingQuantity: number | null;
        picker: string | null;
        pickerId: string | null;
        notes: string | null;
        createdAt: string;
        updatedAt: string;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get picking lines for a picking
 * @param pickingId - Picking ID
 * @returns Array of picking lines
 */
export declare const getPickingLines: (pickingId: string) => Promise<{
    id: string;
    pickingId: string;
    warehouseId: string;
    productId: string;
    productSku: string;
    productName: string;
    locationCode: string;
    zoneName: string | null;
    quantity: number;
    pickedQuantity: number | null;
    unit: string;
    status: string;
    processedByUserId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    createdAt: string;
    updatedAt: string;
}[]>;
/**
 * Get all returns for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Returns data with KPIs
 */
export declare const getReturnsByWarehouse: (warehouseId: string) => Promise<{
    kpis: {
        totalReturns: number;
        pendingReturns: number;
        inProgressReturns: number;
        completedReturns: number;
        totalQuantity: number;
        returnedQuantity: number;
        pendingQuantity: number;
        totalValue: number;
        refundedValue: number;
    };
    returns: {
        id: string;
        returnNumber: string;
        warehouseId: string;
        orderId: string | null;
        orderNumber: string | null;
        customerId: string;
        customerName: string;
        returnDate: string;
        type: string;
        status: string;
        priority: string;
        reason: string;
        reasonLabel: string;
        totalQuantity: number | null;
        totalAmount: number | null;
        refundedAmount: number | null;
        processor: string | null;
        completedDate: string | null;
        createdAt: string;
        updatedAt: string;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get return lines for a return
 * @param returnId - Return ID
 * @returns Array of return lines
 */
export declare const getReturnLines: (returnId: string) => Promise<{
    id: string;
    returnId: string;
    warehouseId: string;
    productId: string;
    productSku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    condition: string;
    resolution: string;
    processedByUserId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    createdAt: string;
    updatedAt: string;
}[]>;
/**
 * Get all restockings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Restockings data with KPIs
 */
export declare const getRestockingsByWarehouse: (warehouseId: string) => Promise<{
    kpis: {
        totalRestockings: number;
        pendingRestockings: number;
        inProgressRestockings: number;
        completedRestockings: number;
        totalProducts: number;
        restockedProducts: number;
        pendingProducts: number;
    };
    restockings: {
        id: string;
        restockingNumber: string;
        warehouseId: string;
        status: string;
        priority: string;
        totalProducts: number | null;
        restockedProducts: number | null;
        requester: string;
        assignedTo: string | null;
        requestedDate: string;
        startedDate: string | null;
        completedDate: string | null;
        createdAt: string;
        updatedAt: string;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get restocking lines for a restocking
 * @param restockingId - Restocking ID
 * @returns Array of restocking lines
 */
export declare const getRestockingLines: (restockingId: string) => Promise<{
    id: string;
    restockingId: string;
    warehouseId: string;
    productId: string;
    productSku: string;
    productName: string;
    sourceLocationId: string | null;
    destinationLocationId: string | null;
    currentQuantity: number;
    targetQuantity: number;
    quantityToRestock: number;
    unit: string;
    status: string;
    processedByUserId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    createdAt: string;
    updatedAt: string;
}[]>;
/**
 * Get orders for a warehouse with lines and KPIs
 * @param warehouseId - Warehouse ID
 * @returns Orders data with KPIs
 */
export declare const getOrdersByWarehouseWithLines: (warehouseId: string) => Promise<{
    kpis: {
        totalOrders: number;
        pendingOrders: number;
        inProgressOrders: number;
        shippedOrders: number;
        deliveredOrders: number;
        cancelledOrders: number;
        totalValue: number;
        averageOrderValue: number;
    };
    orders: {
        lines: {
            id: string;
            orderId: string;
            warehouseId: string;
            productId: string;
            productSku: string;
            productName: string;
            quantity: number;
            pickedQuantity: number | null;
            unitPrice: number;
            totalPrice: number;
            createdAt: string;
            updatedAt: string;
        }[];
        id: string;
        orderNumber: string;
        warehouseId: string;
        customerId: string;
        customerName: string;
        customerEmail: string | null;
        orderDate: string;
        requiredDate: string;
        promisedDate: string | null;
        shippedDate: string | null;
        deliveredDate: string | null;
        status: string;
        priority: string;
        totalQuantity: number | null;
        totalAmount: number | null;
        shippingAddress: string | null;
        shippingCity: string | null;
        shippingCountry: string | null;
        trackingNumber: string | null;
        carrier: string | null;
        notes: string | null;
        picker: string | null;
        packer: string | null;
        createdAt: string;
        updatedAt: string;
        warehouseName: string | null;
        warehouseCode: string | null;
    }[];
}>;
/**
 * Get dashboard KPIs and summary data
 * @param warehouseId - Warehouse ID (optional)
 * @returns Dashboard data with KPIs, stock evolution, movements, alerts
 */
export declare const getDashboardKPIs: (warehouseId?: string) => Promise<{
    kpis: {
        totalProducts: number;
        totalLocations: number;
        lowStockItems: number;
        activeOrders: number;
        movementsThisWeek: number;
    };
    stockEvolution: any;
    movementsByType: any;
    topProducts: any;
    lowStockAlerts: any;
    recentMovements: any;
}>;

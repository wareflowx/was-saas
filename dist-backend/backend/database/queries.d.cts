/**
 * Get all products for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of products with inventory for this warehouse
 */
export declare const getProductsByWarehouse: (warehouseId: string) => any;
/**
 * Get a single product by ID
 * @param productId - Product ID
 * @returns Product or null
 */
export declare const getProductById: (productId: string) => any;
/**
 * Get product by SKU
 * @param sku - Product SKU
 * @returns Product or null
 */
export declare const getProductBySku: (sku: string) => any;
/**
 * Get all inventory for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of inventory records
 */
export declare const getInventoryByWarehouse: (filters: {
    warehouseId: string;
    productId?: string;
    locationId?: string;
}) => any;
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
}) => any;
/**
 * Get last movement date for a product in a warehouse
 * @param warehouseId - Warehouse ID
 * @param productId - Product ID
 * @returns Last movement date or null
 */
export declare const getLastMovementDate: (warehouseId: string, productId: string) => string | null;
/**
 * Get orders for a warehouse
 * @param filters - Filters including warehouseId (REQUIRED)
 * @returns Array of orders
 */
export declare const getOrdersByWarehouse: (filters: {
    warehouseId: string;
    status?: string;
    limit?: number;
}) => any;
/**
 * Get product movement totals for ABC analysis
 * @param warehouseId - Warehouse ID
 * @param type - Movement type (typically 'outbound')
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns Array of products with movement totals
 */
export declare const getProductMovementTotals: (warehouseId: string, type: string, dateFrom?: string, dateTo?: string) => any;
/**
 * Get dead stock products
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for considering as dead stock
 * @returns Array of products with last movement date and tied capital
 */
export declare const getDeadStock: (warehouseId: string, thresholdDays?: number) => any;
/**
 * Get all locations for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Array of locations with zone, sector, warehouse info and products
 */
export declare const getLocationsByWarehouse: (warehouseId: string) => {
    kpis: {
        totalLocations: any;
        availableLocations: any;
        occupiedLocations: any;
        blockedLocations: any;
        reservedLocations: any;
        totalCapacity: any;
        usedCapacity: any;
        averageOccupancy: number;
    };
    locations: any;
};
/**
 * Get all zones for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Zones data with KPIs calculated
 */
export declare const getZonesByWarehouse: (warehouseId: string) => {
    kpis: {
        totalZones: any;
        activeZones: any;
        totalSurface: any;
        totalCapacity: any;
        usedCapacity: any;
        averageOccupancy: number;
        zoneTypes: Record<string, number>;
    };
    zones: any;
};
/**
 * Get all sectors for a specific warehouse
 * @param warehouseId - Warehouse ID filter (REQUIRED)
 * @returns Sectors data with KPIs calculated
 */
export declare const getSectorsByWarehouse: (warehouseId: string) => {
    kpis: {
        totalSectors: any;
        activeSectors: any;
        totalCapacity: any;
        usedCapacity: any;
        averageOccupancy: number;
        sectorTypes: Record<string, number>;
    };
    sectors: any;
};
/**
 * Get all warehouses with KPIs calculated
 * @returns Warehouses data with KPIs calculated
 */
export declare const getWarehousesWithKPIs: () => {
    kpis: {
        totalWarehouses: any;
        activeWarehouses: any;
        totalSurface: any;
        totalCapacity: any;
        usedCapacity: any;
        averageOccupancy: number;
        trackedPickers: any;
    };
    warehouses: any;
};
/**
 * Get import history for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Import history records
 */
export declare const getImportHistory: (warehouseId?: string) => any;
/**
 * Get dashboard KPIs and summary data
 * @param warehouseId - Warehouse ID (optional, if not provided uses all warehouses)
 * @returns Dashboard data with KPIs, stock evolution, movements by type, top products, low stock alerts, and recent movements
 */
export declare const getDashboardKPIs: (warehouseId?: string) => {
    kpis: {
        totalProducts: any;
        totalLocations: any;
        lowStockItems: any;
        activeOrders: any;
        movementsThisWeek: any;
    };
    stockEvolution: any;
    movementsByType: any;
    topProducts: any;
    lowStockAlerts: any;
    recentMovements: any;
};
/**
 * Get all receptions for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Receptions data with KPIs calculated
 */
export declare const getReceptionsByWarehouse: (warehouseId: string) => {
    kpis: {
        totalReceptions: any;
        pendingReceptions: any;
        inProgressReceptions: any;
        completedReceptions: any;
        totalQuantity: any;
        receivedQuantity: any;
        pendingQuantity: number;
    };
    receptions: any;
};
/**
 * Get reception lines for a reception
 * @param receptionId - Reception ID
 * @returns Array of reception lines
 */
export declare const getReceptionLines: (receptionId: string) => any;
/**
 * Get all pickings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Pickings data with KPIs calculated
 */
export declare const getPickingsByWarehouse: (warehouseId: string) => {
    kpis: {
        totalPickings: any;
        pendingPickings: any;
        inProgressPickings: any;
        completedPickings: any;
        totalLines: any;
        pickedLines: any;
        completionRate: number;
    };
    pickings: any;
};
/**
 * Get picking lines for a picking
 * @param pickingId - Picking ID
 * @returns Array of picking lines
 */
export declare const getPickingLines: (pickingId: string) => any;
/**
 * Get all returns for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Returns data with KPIs calculated
 */
export declare const getReturnsByWarehouse: (warehouseId: string) => {
    kpis: {
        totalReturns: any;
        pendingReturns: any;
        inProgressReturns: any;
        completedReturns: any;
        totalQuantity: any;
        returnedQuantity: any;
        pendingQuantity: number;
        totalValue: any;
        refundedValue: any;
    };
    returns: any;
};
/**
 * Get return lines for a return
 * @param returnId - Return ID
 * @returns Array of return lines
 */
export declare const getReturnLines: (returnId: string) => any;
/**
 * Get all restockings for a warehouse with KPIs
 * @param warehouseId - Warehouse ID
 * @returns Restockings data with KPIs calculated
 */
export declare const getRestockingsByWarehouse: (warehouseId: string) => {
    kpis: {
        totalRestockings: any;
        pendingRestockings: any;
        inProgressRestockings: any;
        completedRestockings: any;
        totalProducts: any;
        restockedProducts: any;
        pendingProducts: number;
    };
    restockings: any;
};
/**
 * Get restocking lines for a restocking
 * @param restockingId - Restocking ID
 * @returns Array of restocking lines
 */
export declare const getRestockingLines: (restockingId: string) => any;
/**
 * Get orders for a warehouse with lines and KPIs
 * @param warehouseId - Warehouse ID
 * @returns Orders data with KPIs calculated
 */
export declare const getOrdersByWarehouseWithLines: (warehouseId: string) => {
    kpis: {
        totalOrders: any;
        pendingOrders: any;
        inProgressOrders: any;
        shippedOrders: any;
        deliveredOrders: any;
        cancelledOrders: any;
        totalValue: any;
        averageOrderValue: number;
    };
    orders: any;
};

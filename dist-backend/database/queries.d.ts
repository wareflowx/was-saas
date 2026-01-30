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
//# sourceMappingURL=queries.d.ts.map
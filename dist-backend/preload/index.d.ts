/**
 * Plugin information
 */
type PluginInfo = {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly wmsSystem: string;
    readonly supportedFormats: readonly string[];
};
/**
 * Validation result
 */
type ImportValidationResult = {
    readonly valid: boolean;
    readonly errors: readonly {
        readonly severity: 'error' | 'warning' | 'info';
        readonly message: string;
        readonly suggestion?: string;
    }[];
};
/**
 * Import statistics
 */
type ImportStats = {
    readonly rowsProcessed: number;
    readonly productsImported: number;
    readonly inventoryImported: number;
    readonly movementsImported: number;
    readonly ordersImported?: number;
    readonly pickingsImported?: number;
    readonly receptionsImported?: number;
    readonly restockingsImported?: number;
    readonly returnsImported?: number;
};
/**
 * Import result
 */
type ImportResult = {
    readonly status: 'success' | 'partial' | 'failed';
    readonly stats: ImportStats;
    readonly duration: number;
    readonly errors: readonly {
        readonly severity: 'error' | 'warning' | 'info';
        readonly message: string;
        readonly suggestion?: string;
    }[];
};
declare const electronAPI: {
    /**
     * List all available import plugins
     */
    listPlugins: () => Promise<readonly PluginInfo[]>;
    /**
     * Get a specific plugin by ID
     */
    getPlugin: (pluginId: string) => Promise<PluginInfo | null>;
    /**
     * Validate file with selected plugin
     */
    validateFile: (filePath: string, pluginId: string) => Promise<ImportValidationResult>;
    /**
     * Execute import
     */
    executeImport: (filePath: string, warehouseId: string, pluginId: string) => Promise<ImportResult>;
    /**
     * Generate mock data for testing
     */
    generateMockData: (warehouseId: string, onProgress?: (progress: number, message: string) => void) => Promise<ImportResult>;
    /**
     * Get products for a warehouse
     */
    getProducts: (filters: {
        warehouseId: string;
    }) => Promise<readonly unknown[]>;
    /**
     * Get inventory for a warehouse
     */
    getInventory: (filters: {
        warehouseId: string;
        productId?: string;
        locationId?: string;
    }) => Promise<readonly unknown[]>;
    /**
     * Get movements for a warehouse
     */
    getMovements: (filters: {
        warehouseId: string;
        productId?: string;
        type?: string;
        dateFrom?: string;
        dateTo?: string;
        limit?: number;
    }) => Promise<readonly unknown[]>;
    /**
     * Get orders for a warehouse
     */
    getOrders: (filters: {
        warehouseId: string;
        status?: string;
        limit?: number;
    }) => Promise<readonly unknown[]>;
    /**
     * Get locations for a warehouse
     */
    getLocations: (filters: {
        warehouseId: string;
    }) => Promise<unknown>;
    /**
     * Get all warehouses
     */
    getWarehouses: () => Promise<readonly unknown[]>;
    /**
     * Check if warehouse exists
     */
    warehouseExists: (warehouseId: string) => Promise<boolean>;
    /**
     * Create a new warehouse
     */
    createWarehouse: (warehouse: {
        id: string;
        code: string;
        name: string;
        city: string;
        country: string;
        surface?: number;
        capacity?: number;
        manager?: string;
        email?: string;
        phone?: string;
    }) => Promise<unknown>;
    /**
     * Run ABC analysis
     */
    runABCAnalysis: (params: {
        warehouseId: string;
        dateFrom?: string;
        dateTo?: string;
    }) => Promise<unknown>;
    /**
     * Run Dead Stock analysis
     */
    runDeadStockAnalysis: (params: {
        warehouseId: string;
        thresholdDays?: number;
    }) => Promise<unknown>;
    /**
     * Get application version
     */
    getAppVersion: () => Promise<{
        version: string;
    }>;
    /**
     * Get database statistics
     */
    getDatabaseStats: () => Promise<{
        tables: number;
        sizeBytes: number;
        sizeMB: number;
    }>;
};
declare global {
    interface Window {
        electronAPI: typeof electronAPI;
    }
}
export {};

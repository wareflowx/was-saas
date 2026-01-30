import { contextBridge, ipcRenderer } from 'electron';
// ============================================================================
// ELECTRON API EXPOSED TO RENDERER PROCESS
// All functions are async (invoke) for security
// ============================================================================
const electronAPI = {
    // ==========================================================================
    // PLUGINS
    // ===========================================================================
    /**
     * List all available import plugins
     */
    listPlugins: () => ipcRenderer.invoke('plugins:list'),
    /**
     * Get a specific plugin by ID
     */
    getPlugin: (pluginId) => ipcRenderer.invoke('plugins:get', pluginId),
    // ==========================================================================
    // IMPORT WORKFLOW
    // ===========================================================================
    /**
     * Validate file with selected plugin
     */
    validateFile: (filePath, pluginId) => ipcRenderer.invoke('import:validate', filePath, pluginId),
    /**
     * Execute import
     */
    executeImport: (filePath, warehouseId, pluginId) => ipcRenderer.invoke('import:execute', filePath, warehouseId, pluginId),
    /**
     * Generate mock data for testing
     */
    generateMockData: (warehouseId, onProgress) => ipcRenderer.invoke('import:generate-mock-data', warehouseId, onProgress),
    // ==========================================================================
    // DATABASE QUERIES (all require explicit filters)
    // ===========================================================================
    /**
     * Get products for a warehouse
     */
    getProducts: (filters) => ipcRenderer.invoke('db:get-products', filters),
    /**
     * Get inventory for a warehouse
     */
    getInventory: (filters) => ipcRenderer.invoke('db:get-inventory', filters),
    /**
     * Get movements for a warehouse
     */
    getMovements: (filters) => ipcRenderer.invoke('db:get-movements', filters),
    /**
     * Get orders for a warehouse
     */
    getOrders: (filters) => ipcRenderer.invoke('db:get-orders', filters),
    /**
     * Get locations for a warehouse
     */
    getLocations: (filters) => ipcRenderer.invoke('db:get-locations', filters),
    // ==========================================================================
    // WAREHOUSE MANAGEMENT
    // ===========================================================================
    /**
     * Get all warehouses
     */
    getWarehouses: () => ipcRenderer.invoke('warehouse:getAll'),
    /**
     * Check if warehouse exists
     */
    warehouseExists: (warehouseId) => ipcRenderer.invoke('warehouse:exists', warehouseId),
    /**
     * Create a new warehouse
     */
    createWarehouse: (warehouse) => ipcRenderer.invoke('warehouse:create', warehouse),
    // ==========================================================================
    // ANALYTICS
    // ===========================================================================
    /**
     * Run ABC analysis
     */
    runABCAnalysis: (params) => ipcRenderer.invoke('analysis:abc', params),
    /**
     * Run Dead Stock analysis
     */
    runDeadStockAnalysis: (params) => ipcRenderer.invoke('analysis:dead-stock', params),
    // ==========================================================================
    // UTILITIES
    // ===========================================================================
    /**
     * Get application version
     */
    getAppVersion: () => ipcRenderer.invoke('app:get-version'),
    /**
     * Get database statistics
     */
    getDatabaseStats: () => ipcRenderer.invoke('db:get-stats'),
};
// ============================================================================
// EXPOSE API TO RENDERER PROCESS
// ============================================================================
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

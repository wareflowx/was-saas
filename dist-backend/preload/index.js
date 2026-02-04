"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
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
    listPlugins: () => electron_1.ipcRenderer.invoke('plugins:list'),
    /**
     * Get a specific plugin by ID
     */
    getPlugin: (pluginId) => electron_1.ipcRenderer.invoke('plugins:get', pluginId),
    // ==========================================================================
    // IMPORT WORKFLOW
    // ===========================================================================
    /**
     * Validate file with selected plugin
     */
    validateFile: (filePath, pluginId) => electron_1.ipcRenderer.invoke('import:validate', filePath, pluginId),
    /**
     * Execute import
     */
    executeImport: (filePath, warehouseId, pluginId) => electron_1.ipcRenderer.invoke('import:execute', filePath, warehouseId, pluginId),
    /**
     * Generate mock data for testing
     */
    generateMockData: (warehouseId) => electron_1.ipcRenderer.invoke('import:generate-mock-data', warehouseId),
    // ==========================================================================
    // DATABASE QUERIES (all require explicit filters)
    // ===========================================================================
    /**
     * Get products for a warehouse
     */
    getProducts: (filters) => electron_1.ipcRenderer.invoke('db:get-products', filters),
    /**
     * Get inventory for a warehouse
     */
    getInventory: (filters) => electron_1.ipcRenderer.invoke('db:get-inventory', filters),
    /**
     * Get movements for a warehouse
     */
    getMovements: (filters) => electron_1.ipcRenderer.invoke('db:get-movements', filters),
    /**
     * Get orders for a warehouse
     */
    getOrders: (filters) => electron_1.ipcRenderer.invoke('db:get-orders', filters),
    /**
     * Get locations for a warehouse
     */
    getLocations: (filters) => electron_1.ipcRenderer.invoke('db:get-locations', filters),
    /**
     * Get zones for a warehouse
     */
    getZones: (filters) => electron_1.ipcRenderer.invoke('db:get-zones', filters),
    /**
     * Get sectors for a warehouse
     */
    getSectors: (filters) => electron_1.ipcRenderer.invoke('db:get-sectors', filters),
    /**
     * Get receptions for a warehouse
     */
    getReceptions: (filters) => electron_1.ipcRenderer.invoke('db:get-receptions', filters),
    /**
     * Get reception lines
     */
    getReceptionLines: (receptionId) => electron_1.ipcRenderer.invoke('db:get-reception-lines', receptionId),
    /**
     * Get pickings for a warehouse
     */
    getPickings: (filters) => electron_1.ipcRenderer.invoke('db:get-pickings', filters),
    /**
     * Get picking lines
     */
    getPickingLines: (pickingId) => electron_1.ipcRenderer.invoke('db:get-picking-lines', pickingId),
    /**
     * Get returns for a warehouse
     */
    getReturns: (filters) => electron_1.ipcRenderer.invoke('db:get-returns', filters),
    /**
     * Get return lines
     */
    getReturnLines: (returnId) => electron_1.ipcRenderer.invoke('db:get-return-lines', returnId),
    /**
     * Get restockings for a warehouse
     */
    getRestockings: (filters) => electron_1.ipcRenderer.invoke('db:get-restockings', filters),
    /**
     * Get restocking lines
     */
    getRestockingLines: (restockingId) => electron_1.ipcRenderer.invoke('db:get-restocking-lines', restockingId),
    /**
     * Get orders with lines for a warehouse
     */
    getOrdersWithLines: (filters) => electron_1.ipcRenderer.invoke('db:get-orders-with-lines', filters),
    /**
     * Get import history
     */
    getImportHistory: (warehouseId) => electron_1.ipcRenderer.invoke('db:get-import-history', warehouseId),
    /**
     * Get dashboard KPIs
     */
    getDashboardKPIs: (warehouseId) => electron_1.ipcRenderer.invoke('db:get-dashboard-kpis', warehouseId),
    /**
     * Get warehouses with KPIs
     */
    getWarehousesWithKPIs: () => electron_1.ipcRenderer.invoke('warehouse:get-all-with-kpis'),
    // ==========================================================================
    // WAREHOUSE MANAGEMENT
    // ===========================================================================
    /**
     * Get all warehouses
     */
    getWarehouses: () => electron_1.ipcRenderer.invoke('warehouse:getAll'),
    /**
     * Check if warehouse exists
     */
    warehouseExists: (warehouseId) => electron_1.ipcRenderer.invoke('warehouse:exists', warehouseId),
    /**
     * Create a new warehouse
     */
    createWarehouse: (warehouse) => electron_1.ipcRenderer.invoke('warehouse:create', warehouse),
    // ==========================================================================
    // ANALYTICS
    // ===========================================================================
    /**
     * Run ABC analysis
     */
    runABCAnalysis: (params) => electron_1.ipcRenderer.invoke('analysis:abc', params),
    /**
     * Run Dead Stock analysis
     */
    runDeadStockAnalysis: (params) => electron_1.ipcRenderer.invoke('analysis:dead-stock', params),
    // ==========================================================================
    // UTILITIES
    // ===========================================================================
    /**
     * Get application version
     */
    getAppVersion: () => electron_1.ipcRenderer.invoke('app:get-version'),
    /**
     * Get database statistics
     */
    getDatabaseStats: () => electron_1.ipcRenderer.invoke('db:get-stats'),
};
// ============================================================================
// EXPOSE API TO RENDERER PROCESS
// ============================================================================
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
// ============================================================================
// TYPED IPC (NEW - MIGRATE TO THIS)
// ============================================================================
/**
 * Typed IPC - Type-safe communication with Result<T, AppError>
 * This is the new pattern that should be used for all new IPC calls
 */
const typedElectronAPI = {
    warehouses: {
        getAll: () => electron_1.ipcRenderer.invoke('warehouses:getAll'),
        getWithKPIs: () => electron_1.ipcRenderer.invoke('warehouses:getWithKPIs'),
    },
    locations: {
        getAll: (params) => electron_1.ipcRenderer.invoke('locations:getAll', params),
    },
    zones: {
        getAll: (params) => electron_1.ipcRenderer.invoke('zones:getAll', params),
    },
    sectors: {
        getAll: (params) => electron_1.ipcRenderer.invoke('sectors:getAll', params),
    },
    products: {
        getAll: (params) => electron_1.ipcRenderer.invoke('products:getAll', params),
    },
    dashboard: {
        getKPIs: (params) => electron_1.ipcRenderer.invoke('dashboard:getKPIs', params),
    },
    importHistory: {
        getAll: (params) => electron_1.ipcRenderer.invoke('importHistory:getAll', params),
    },
    import: {
        generateMockData: (warehouseId) => electron_1.ipcRenderer.invoke('import:generate-mock-data', warehouseId),
    },
    receptions: {
        getAll: (params) => electron_1.ipcRenderer.invoke('receptions:getAll', params),
    },
    pickings: {
        getAll: (params) => electron_1.ipcRenderer.invoke('pickings:getAll', params),
    },
    returns: {
        getAll: (params) => electron_1.ipcRenderer.invoke('returns:getAll', params),
    },
    restockings: {
        getAll: (params) => electron_1.ipcRenderer.invoke('restockings:getAll', params),
    },
    orders: {
        getWithLines: (params) => electron_1.ipcRenderer.invoke('orders:getWithLines', params),
    },
    analysis: {
        abc: (params) => electron_1.ipcRenderer.invoke('analysis:abc', params),
        deadStock: (params) => electron_1.ipcRenderer.invoke('analysis:deadStock', params),
    },
};
electron_1.contextBridge.exposeInMainWorld('typedElectronAPI', typedElectronAPI);

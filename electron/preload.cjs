const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  // ==========================================================================
  // PLUGINS
  // ==========================================================================

  listPlugins: () => ipcRenderer.invoke('plugins:list'),

  getPlugin: (pluginId) => ipcRenderer.invoke('plugins:get', pluginId),

  // ==========================================================================
  // WAREHOUSE MANAGEMENT
  // ==========================================================================

  getWarehouses: () => ipcRenderer.invoke('warehouse:getAll'),

  getWarehousesWithKPIs: () => ipcRenderer.invoke('warehouse:getAllWithKPIs'),

  warehouseExists: (warehouseId) => ipcRenderer.invoke('warehouse:exists', warehouseId),

  createWarehouse: (warehouse) => ipcRenderer.invoke('warehouse:create', warehouse),

  // ==========================================================================
  // IMPORT WORKFLOW
  // ==========================================================================

  validateFile: (filePath, pluginId) => ipcRenderer.invoke('import:validate', filePath, pluginId),

  executeImport: (filePath, warehouseId, pluginId, onProgress) => {
    return ipcRenderer.invoke('import:execute', filePath, warehouseId, pluginId)
  },

  // ==========================================================================
  // MOCK DATA GENERATION
  // ==========================================================================

  generateMockData: (warehouseId, onProgress) => {
    // Note: onProgress callback is not passed through IPC as functions cannot be serialized
    // Progress updates would need to be implemented via IPC messaging if needed
    return ipcRenderer.invoke('import:generate-mock-data', warehouseId)
  },

  // ==========================================================================
  // DATABASE QUERIES
  // ==========================================================================

  getLocations: (filters) => ipcRenderer.invoke('db:get-locations', filters),

  getZones: (filters) => ipcRenderer.invoke('db:get-zones', filters),

  getSectors: (filters) => ipcRenderer.invoke('db:get-sectors', filters),

  getProducts: (filters) => ipcRenderer.invoke('db:get-products', filters),

  getInventory: (filters) => ipcRenderer.invoke('db:get-inventory', filters),

  getMovements: (filters) => ipcRenderer.invoke('db:get-movements', filters),

  getOrders: (filters) => ipcRenderer.invoke('db:get-orders', filters),

  getReceptions: (filters) => ipcRenderer.invoke('db:get-receptions', filters),

  getReceptionLines: (receptionId) => ipcRenderer.invoke('db:get-reception-lines', receptionId),

  getPickings: (filters) => ipcRenderer.invoke('db:get-pickings', filters),

  getPickingLines: (pickingId) => ipcRenderer.invoke('db:get-picking-lines', pickingId),

  getReturns: (filters) => ipcRenderer.invoke('db:get-returns', filters),

  getReturnLines: (returnId) => ipcRenderer.invoke('db:get-return-lines', returnId),

  getRestockings: (filters) => ipcRenderer.invoke('db:get-restockings', filters),

  getRestockingLines: (restockingId) => ipcRenderer.invoke('db:get-restocking-lines', restockingId),

  getOrdersWithLines: (filters) => ipcRenderer.invoke('db:get-orders-with-lines', filters),

  getDatabaseStats: () => ipcRenderer.invoke('db:get-stats'),

  getImportHistory: (warehouseId) => ipcRenderer.invoke('db:get-import-history', warehouseId),

  getDashboardKPIs: (warehouseId) => ipcRenderer.invoke('db:get-dashboard-kpis', warehouseId),

  // ==========================================================================
  // ANALYTICS
  // ==========================================================================

  runABCAnalysis: (params) => ipcRenderer.invoke('analysis:run-abc', params),

  runDeadStockAnalysis: (params) => ipcRenderer.invoke('analysis:run-dead-stock', params),

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
})

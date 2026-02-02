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
    return ipcRenderer.invoke('import:generate-mock-data', warehouseId, onProgress)
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

  getDatabaseStats: () => ipcRenderer.invoke('db:get-stats'),

  getImportHistory: (warehouseId) => ipcRenderer.invoke('db:get-import-history', warehouseId),

  getDashboardKPIs: (warehouseId) => ipcRenderer.invoke('db:get-dashboard-kpis', warehouseId),

  // ==========================================================================
  // ANALYTICS
  // ==========================================================================

  runABCAnalysis: (params) => ipcRenderer.invoke('analysis:abc', params),

  runDeadStockAnalysis: (params) => ipcRenderer.invoke('analysis:dead-stock', params),

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
})

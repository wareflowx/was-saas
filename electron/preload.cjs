const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  // ==========================================================================
  // PLUGINS
  // ==========================================================================

  listPlugins: () => ipcRenderer.invoke('plugins:list'),

  getPlugin: (pluginId) => ipcRenderer.invoke('plugins:get', pluginId),

  // ==========================================================================
  // IMPORT WORKFLOW
  // ==========================================================================

  validateFile: (filePath, pluginId) => ipcRenderer.invoke('import:validate', filePath, pluginId),

  executeImport: (filePath, warehouseId, pluginId) => ipcRenderer.invoke('import:execute', filePath, warehouseId, pluginId),

  // ==========================================================================
  // MOCK DATA GENERATION
  // ==========================================================================

  generateMockData: (warehouseId) => ipcRenderer.invoke('import:generate-mock-data', warehouseId),

  // ==========================================================================
  // DATABASE QUERIES (all require explicit filters)
  // ==========================================================================

  getProducts: (filters) => ipcRenderer.invoke('products:getAll', filters),

  getInventory: (filters) => ipcRenderer.invoke('db:get-inventory', filters),

  getMovements: (filters) => ipcRenderer.invoke('db:get-movements', filters),

  getOrders: (filters) => ipcRenderer.invoke('db:get-orders', filters),

  getLocations: (filters) => ipcRenderer.invoke('locations:getAll', filters),

  getZones: (filters) => ipcRenderer.invoke('zones:getAll', filters),

  getSectors: (filters) => ipcRenderer.invoke('sectors:getAll', filters),

  getReceptions: (filters) => ipcRenderer.invoke('receptions:getAll', filters),

  getReceptionLines: (receptionId) => ipcRenderer.invoke('db:get-reception-lines', receptionId),

  getPickings: (filters) => ipcRenderer.invoke('pickings:getAll', filters),

  getPickingLines: (pickingId) => ipcRenderer.invoke('db:get-picking-lines', pickingId),

  getReturns: (filters) => ipcRenderer.invoke('returns:getAll', filters),

  getReturnLines: (returnId) => ipcRenderer.invoke('db:get-return-lines', returnId),

  getRestockings: (filters) => ipcRenderer.invoke('restockings:getAll', filters),

  getRestockingLines: (restockingId) => ipcRenderer.invoke('db:get-restocking-lines', restockingId),

  getOrdersWithLines: (filters) => ipcRenderer.invoke('orders:getWithLines', filters),

  getImportHistory: (filters) => ipcRenderer.invoke('importHistory:getAll', filters),

  getDashboardKPIs: (filters) => ipcRenderer.invoke('dashboard:getKPIs', filters),

  getWarehousesWithKPIs: () => ipcRenderer.invoke('warehouses:getWithKPIs'),

  // ==========================================================================
  // WAREHOUSE MANAGEMENT
  // ==========================================================================

  getWarehouses: () => ipcRenderer.invoke('warehouses:getAll'),

  warehouseExists: (warehouseId) => ipcRenderer.invoke('warehouse:exists', warehouseId),

  createWarehouse: (warehouse) => ipcRenderer.invoke('warehouse:create', warehouse),

  // ==========================================================================
  // ANALYTICS
  // ==========================================================================

  runABCAnalysis: (params) => ipcRenderer.invoke('analysis:abc', params),

  runDeadStockAnalysis: (params) => ipcRenderer.invoke('analysis:deadStock', params),

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  getAppVersion: () => ipcRenderer.invoke('app:get-version'),

  getDatabaseStats: () => ipcRenderer.invoke('db:get-stats'),
})

// ============================================================================
// TYPED IPC (NEW - MIGRATE TO THIS)
// ============================================================================

const typedElectronAPI = {
  warehouses: {
    getAll: () => ipcRenderer.invoke('warehouses:getAll'),
    getWithKPIs: () => ipcRenderer.invoke('warehouses:getWithKPIs'),
  },

  locations: {
    getAll: (params) => ipcRenderer.invoke('locations:getAll', params),
  },

  zones: {
    getAll: (params) => ipcRenderer.invoke('zones:getAll', params),
  },

  sectors: {
    getAll: (params) => ipcRenderer.invoke('sectors:getAll', params),
  },

  products: {
    getAll: (params) => ipcRenderer.invoke('products:getAll', params),
  },

  dashboard: {
    getKPIs: (params) => ipcRenderer.invoke('dashboard:getKPIs', params),
  },

  importHistory: {
    getAll: (params) => ipcRenderer.invoke('importHistory:getAll', params),
  },

  import: {
    generateMockData: (warehouseId) => ipcRenderer.invoke('import:generate-mock-data', warehouseId),
  },

  receptions: {
    getAll: (params) => ipcRenderer.invoke('receptions:getAll', params),
  },

  pickings: {
    getAll: (params) => ipcRenderer.invoke('pickings:getAll', params),
  },

  returns: {
    getAll: (params) => ipcRenderer.invoke('returns:getAll', params),
  },

  restockings: {
    getAll: (params) => ipcRenderer.invoke('restockings:getAll', params),
  },

  orders: {
    getWithLines: (params) => ipcRenderer.invoke('orders:getWithLines', params),
  },

  analysis: {
    abc: (params) => ipcRenderer.invoke('analysis:abc', params),
    deadStock: (params) => ipcRenderer.invoke('analysis:deadStock', params),
  },
}

contextBridge.exposeInMainWorld('typedElectronAPI', typedElectronAPI)

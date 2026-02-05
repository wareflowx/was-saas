import { contextBridge, ipcRenderer } from 'electron'

// ============================================================================
// TYPES FOR IPC API
// ============================================================================

/**
 * Plugin information
 */
type PluginInfo = {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly description: string
  readonly wmsSystem: string
  readonly supportedFormats: readonly string[]
}

/**
 * Validation result
 */
type ImportValidationResult = {
  readonly valid: boolean
  readonly errors: readonly {
    readonly severity: 'error' | 'warning' | 'info'
    readonly message: string
    readonly suggestion?: string
  }[]
}

/**
 * Import statistics
 */
type ImportStats = {
  readonly rowsProcessed: number
  readonly productsImported: number
  readonly inventoryImported: number
  readonly movementsImported: number
  readonly ordersImported?: number
  readonly pickingsImported?: number
  readonly receptionsImported?: number
  readonly restockingsImported?: number
  readonly returnsImported?: number
}

/**
 * Import result
 */
type ImportResult = {
  readonly status: 'success' | 'partial' | 'failed'
  readonly stats: ImportStats
  readonly duration: number
  readonly errors: readonly {
    readonly severity: 'error' | 'warning' | 'info'
    readonly message: string
    readonly suggestion?: string
  }[]
}

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
  listPlugins: (): Promise<readonly PluginInfo[]> =>
    ipcRenderer.invoke('plugins:list'),

  /**
   * Get a specific plugin by ID
   */
  getPlugin: (pluginId: string): Promise<PluginInfo | null> =>
    ipcRenderer.invoke('plugins:get', pluginId),

  // ==========================================================================
  // IMPORT WORKFLOW
  // ===========================================================================

  /**
   * Validate file with selected plugin
   */
  validateFile: (
    filePath: string,
    pluginId: string
  ): Promise<ImportValidationResult> =>
    ipcRenderer.invoke('import:validate', filePath, pluginId),

  /**
   * Execute import
   */
  executeImport: (
    filePath: string,
    warehouseId: string,
    pluginId: string
  ): Promise<ImportResult> =>
    ipcRenderer.invoke('import:execute', filePath, warehouseId, pluginId),

  /**
   * Generate mock data for testing
   */
  generateMockData: (
    warehouseId: string
  ): Promise<ImportResult> =>
    ipcRenderer.invoke('import:generate-mock-data', warehouseId),

  // ==========================================================================
  // DATABASE QUERIES (all require explicit filters)
  // ===========================================================================

  /**
   * Get products for a warehouse
   */
  getProducts: (filters: { warehouseId: string }): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-products', filters),

  /**
   * Get inventory for a warehouse
   */
  getInventory: (filters: {
    warehouseId: string
    productId?: string
    locationId?: string
  }): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-inventory', filters),

  /**
   * Get movements for a warehouse
   */
  getMovements: (filters: {
    warehouseId: string
    productId?: string
    type?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
  }): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-movements', filters),

  /**
   * Get orders for a warehouse
   */
  getOrders: (filters: {
    warehouseId: string
    status?: string
    limit?: number
  }): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-orders', filters),

  /**
   * Get locations for a warehouse
   */
  getLocations: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-locations', filters),

  /**
   * Get zones for a warehouse
   */
  getZones: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-zones', filters),

  /**
   * Get sectors for a warehouse
   */
  getSectors: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-sectors', filters),

  /**
   * Get receptions for a warehouse
   */
  getReceptions: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-receptions', filters),

  /**
   * Get reception lines
   */
  getReceptionLines: (receptionId: string): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-reception-lines', receptionId),

  /**
   * Get pickings for a warehouse
   */
  getPickings: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-pickings', filters),

  /**
   * Get picking lines
   */
  getPickingLines: (pickingId: string): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-picking-lines', pickingId),

  /**
   * Get returns for a warehouse
   */
  getReturns: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-returns', filters),

  /**
   * Get return lines
   */
  getReturnLines: (returnId: string): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-return-lines', returnId),

  /**
   * Get restockings for a warehouse
   */
  getRestockings: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-restockings', filters),

  /**
   * Get restocking lines
   */
  getRestockingLines: (restockingId: string): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-restocking-lines', restockingId),

  /**
   * Get orders with lines for a warehouse
   */
  getOrdersWithLines: (filters: {
    warehouseId: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('db:get-orders-with-lines', filters),

  /**
   * Get import history
   */
  getImportHistory: (warehouseId?: string): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('db:get-import-history', warehouseId),

  /**
   * Get dashboard KPIs
   */
  getDashboardKPIs: (warehouseId?: string): Promise<unknown> =>
    ipcRenderer.invoke('db:get-dashboard-kpis', warehouseId),

  /**
   * Get warehouses with KPIs
   */
  getWarehousesWithKPIs: (): Promise<unknown> =>
    ipcRenderer.invoke('warehouse:get-all-with-kpis'),

  // ==========================================================================
  // WAREHOUSE MANAGEMENT
  // ===========================================================================

  /**
   * Get all warehouses
   */
  getWarehouses: (): Promise<readonly unknown[]> =>
    ipcRenderer.invoke('warehouse:getAll'),

  /**
   * Check if warehouse exists
   */
  warehouseExists: (warehouseId: string): Promise<boolean> =>
    ipcRenderer.invoke('warehouse:exists', warehouseId),

  /**
   * Create a new warehouse
   */
  createWarehouse: (warehouse: {
    id: string
    code: string
    name: string
    city: string
    country: string
    surface?: number
    capacity?: number
    manager?: string
    email?: string
    phone?: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('warehouse:create', warehouse),

  // ==========================================================================
  // ANALYTICS
  // ===========================================================================

  /**
   * Run ABC analysis
   */
  runABCAnalysis: (params: {
    warehouseId: string
    dateFrom?: string
    dateTo?: string
  }): Promise<unknown> =>
    ipcRenderer.invoke('analysis:abc', params),

  /**
   * Run Dead Stock analysis
   */
  runDeadStockAnalysis: (params: {
    warehouseId: string
    thresholdDays?: number
  }): Promise<unknown> =>
    ipcRenderer.invoke('analysis:dead-stock', params),

  // ==========================================================================
  // UTILITIES
  // ===========================================================================

  /**
   * Get application version
   */
  getAppVersion: (): Promise<{ version: string }> =>
    ipcRenderer.invoke('app:get-version'),

  /**
   * Get database statistics
   */
  getDatabaseStats: (): Promise<{
    tables: number
    sizeBytes: number
    sizeMB: number
  }> =>
    ipcRenderer.invoke('db:get-stats'),
}

// ============================================================================
// EXPOSE API TO RENDERER PROCESS
// ============================================================================

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// ============================================================================
// TYPED IPC (NEW - MIGRATE TO THIS)
// ============================================================================

/**
 * Typed IPC - Type-safe communication with Result<T, AppError>
 * This is the new pattern that should be used for all new IPC calls
 */
const typedElectronAPI = {
  warehouses: {
    getAll: () => ipcRenderer.invoke('warehouses:getAll'),
    getWithKPIs: () => ipcRenderer.invoke('warehouses:getWithKPIs'),
  },

  locations: {
    getAll: (params?: { warehouseId?: string }) =>
      ipcRenderer.invoke('locations:getAll', params),
  },

  zones: {
    getAll: (params?: { warehouseId?: string }) =>
      ipcRenderer.invoke('zones:getAll', params),
  },

  sectors: {
    getAll: (params?: { warehouseId?: string }) =>
      ipcRenderer.invoke('sectors:getAll', params),
  },

  products: {
    getAll: (params: { warehouseId: string }) =>
      ipcRenderer.invoke('products:getAll', params),
  },

  dashboard: {
    getKPIs: (params: { warehouseId?: string }) =>
      ipcRenderer.invoke('dashboard:getKPIs', params),
  },

  importHistory: {
    getAll: (params?: { warehouseId?: string }) =>
      ipcRenderer.invoke('importHistory:getAll', params),
  },

  import: {
    generateMockData: (warehouseId: string) =>
      ipcRenderer.invoke('import:generate-mock-data', warehouseId),
  },

  receptions: {
    getAll: (params: { warehouseId: string }) =>
      ipcRenderer.invoke('receptions:getAll', params),
  },

  pickings: {
    getAll: (params: { warehouseId: string }) =>
      ipcRenderer.invoke('pickings:getAll', params),
  },

  returns: {
    getAll: (params: { warehouseId: string }) =>
      ipcRenderer.invoke('returns:getAll', params),
  },

  restockings: {
    getAll: (params: { warehouseId: string }) =>
      ipcRenderer.invoke('restockings:getAll', params),
  },

  orders: {
    getWithLines: (params: { warehouseId: string }) =>
      ipcRenderer.invoke('orders:getWithLines', params),
  },

  analysis: {
    abc: (params: { warehouseId: string; dateFrom?: string; dateTo?: string }) =>
      ipcRenderer.invoke('analysis:abc', params),
    deadStock: (params: {
      warehouseId: string
      thresholdDays?: number
      criticalThreshold?: number
      warningThreshold?: number
    }) =>
      ipcRenderer.invoke('analysis:deadStock', params),
  },

  users: {
    getAll: (params?: { warehouseId?: string }) =>
      ipcRenderer.invoke('users:getAll', params),
  },
}

contextBridge.exposeInMainWorld('typedElectronAPI', typedElectronAPI)

// Type definitions are in separate .d.ts files:
// - index.d.ts: Legacy electronAPI (deprecated)
// - typed-api.d.ts: Modern typedElectronAPI with proper types
export type { TypedElectronAPI } from '../types/typed-electron-api'

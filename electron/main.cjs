const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')

// ============================================================================
// IPC HANDLERS (Backend services)
// ============================================================================

const { initializeDatabase, getDatabase, closeDatabase, getAllWarehouses, createWarehouse, warehouseExists, getDatabaseFilePath } = require('../dist-backend/backend/database/index.cjs')
const queries = require('../dist-backend/backend/database/queries.cjs')
const { registry, initializeDefaultPlugins } = require('../dist-backend/backend/import/plugins/registry.cjs')
const importService = require('../dist-backend/backend/services/import-service.cjs')
const pluginService = require('../dist-backend/backend/services/plugin-service.cjs')
const analysis = require('../dist-backend/backend/analysis/index.cjs')

// Register default plugins when app starts
initializeDefaultPlugins()

// Initialize database on app startup
initializeDatabase()
console.log('Database initialized at:', getDatabaseFilePath())

// ==========================================================================
// MOCK DATA GENERATION
// ==========================================================================

ipcMain.handle('import:generate-mock-data', async (event, warehouseId) => {
  console.log('🎯 [MAIN] IPC handler "import:generate-mock-data" called')
  console.log('🎯 [MAIN] warehouseId:', warehouseId)
  console.log('🎯 [MAIN] event:', event)

  initializeDatabase()
  console.log('🎯 [MAIN] Database initialized')

  const plugin = pluginService.getPlugin('mock-data-generator')
  console.log('🎯 [MAIN] Plugin found:', plugin ? 'YES' : 'NO')
  console.log('🎯 [MAIN] Plugin details:', plugin)

  if (!plugin) {
    console.error('❌ [MAIN] Mock data generator plugin not found')
    throw new Error('Mock data generator plugin not found')
  }

  console.log('🎯 [MAIN] About to call importService.generateMockData')
  try {
    const result = await importService.generateMockData(warehouseId, plugin)
    console.log('✅ [MAIN] importService.generateMockData completed')
    console.log('✅ [MAIN] Result:', result)
    return result
  } catch (error) {
    console.error('❌ [MAIN] Error in importService.generateMockData:', error)
    throw error
  }
})

// ==========================================================================
// PLUGINS
// ==========================================================================

ipcMain.handle('plugins:list', () => {
  return pluginService.listPlugins()
})

ipcMain.handle('plugins:get', (event, pluginId) => {
  return pluginService.getPlugin(pluginId)
})

// ==========================================================================
// IMPORT WORKFLOW
// ==========================================================================

ipcMain.handle('import:validate', async (event, filePath, pluginId) => {
  const plugin = pluginService.getPlugin(pluginId)
  if (!plugin) {
    throw new Error(`Plugin not found: ${pluginId}`)
  }

  return importService.validateImportFile(filePath, plugin)
})

ipcMain.handle('import:execute', async (event, filePath, warehouseId, pluginId, onProgress) => {
  const plugin = pluginService.getPlugin(pluginId)
  if (!plugin) {
    throw new Error(`Plugin not found: ${pluginId}`)
  }

  return importService.executeImport(filePath, warehouseId, plugin, onProgress)
})

// ==========================================================================
// DATABASE QUERIES
// ==========================================================================

ipcMain.handle('db:get-products', async (event, filters) => {
  initializeDatabase()
  return queries.getProductsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-inventory', async (event, filters) => {
  initializeDatabase()
  return queries.getInventoryByWarehouse(filters)
})

ipcMain.handle('db:get-movements', async (event, filters) => {
  initializeDatabase()
  return queries.getMovementsByWarehouse(filters)
})

ipcMain.handle('db:get-orders', async (event, filters) => {
  initializeDatabase()
  return queries.getOrdersByWarehouse(filters)
})

ipcMain.handle('db:get-locations', async (event, filters) => {
  initializeDatabase()
  return queries.getLocationsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-zones', async (event, filters) => {
  initializeDatabase()
  return queries.getZonesByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-sectors', async (event, filters) => {
  initializeDatabase()
  return queries.getSectorsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-stats', async () => {
  initializeDatabase()
  return queries.getDatabaseStats()
})

// ==========================================================================
// WAREHOUSE MANAGEMENT
// ==========================================================================

ipcMain.handle('warehouse:getAll', async () => {
  initializeDatabase()
  return getAllWarehouses()
})

ipcMain.handle('warehouse:getAllWithKPIs', async () => {
  initializeDatabase()
  return queries.getWarehousesWithKPIs()
})

ipcMain.handle('warehouse:exists', async (event, warehouseId) => {
  initializeDatabase()
  return warehouseExists(warehouseId)
})

ipcMain.handle('warehouse:create', async (event, warehouse) => {
  initializeDatabase()

  // Check if warehouse already exists
  if (warehouseExists(warehouse.id)) {
    const db = getDatabase()
    return db.prepare('SELECT * FROM warehouses WHERE id = ?').get(warehouse.id)
  }

  return createWarehouse(warehouse)
})

ipcMain.handle('db:get-import-history', async (event, warehouseId) => {
  initializeDatabase()
  return queries.getImportHistory(warehouseId)
})

ipcMain.handle('db:get-dashboard-kpis', async (event, warehouseId) => {
  initializeDatabase()
  return queries.getDashboardKPIs(warehouseId)
})

// ==========================================================================
// OPERATIONS - RECEIPTS
// ==========================================================================

ipcMain.handle('db:get-receptions', async (event, filters) => {
  initializeDatabase()
  return queries.getReceptionsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-reception-lines', async (event, receptionId) => {
  initializeDatabase()
  return queries.getReceptionLines(receptionId)
})

// ==========================================================================
// OPERATIONS - PICKINGS
// ==========================================================================

ipcMain.handle('db:get-pickings', async (event, filters) => {
  initializeDatabase()
  return queries.getPickingsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-picking-lines', async (event, pickingId) => {
  initializeDatabase()
  return queries.getPickingLines(pickingId)
})

// ==========================================================================
// OPERATIONS - RETURNS
// ==========================================================================

ipcMain.handle('db:get-returns', async (event, filters) => {
  initializeDatabase()
  return queries.getReturnsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-return-lines', async (event, returnId) => {
  initializeDatabase()
  return queries.getReturnLines(returnId)
})

// ==========================================================================
// OPERATIONS - RESTOCKINGS
// ==========================================================================

ipcMain.handle('db:get-restockings', async (event, filters) => {
  initializeDatabase()
  return queries.getRestockingsByWarehouse(filters.warehouseId)
})

ipcMain.handle('db:get-restocking-lines', async (event, restockingId) => {
  initializeDatabase()
  return queries.getRestockingLines(restockingId)
})

// ==========================================================================
// OPERATIONS - ORDERS WITH LINES
// ==========================================================================

ipcMain.handle('db:get-orders-with-lines', async (event, filters) => {
  initializeDatabase()
  return queries.getOrdersByWarehouseWithLines(filters.warehouseId)
})

// ==========================================================================
// ANALYTICS
// ==========================================================================

ipcMain.handle('analysis:run-abc', async (event, params) => {
  initializeDatabase()
  const { warehouseId, dateFrom, dateTo } = params
  return analysis.runABCAnalysis(warehouseId, dateFrom, dateTo)
})

ipcMain.handle('analysis:run-dead-stock', async (event, params) => {
  initializeDatabase()
  const { warehouseId, thresholdDays, criticalThreshold, warningThreshold } = params
  return analysis.runDeadStockAnalysis(
    warehouseId,
    thresholdDays || 90,
    criticalThreshold || 180,
    warningThreshold || 90
  )
})

// ==========================================================================
// UTILITIES
// ==========================================================================

ipcMain.handle('app:get-version', () => {
  return { version: app.getVersion() }
})

// ==========================================================================
// HELPER FOR TYPED API HANDLERS
// Wraps responses in Result<T, AppError> format
// ==========================================================================

const wrapResult = (data) => ({ success: true, data })
const wrapError = (message) => ({ success: false, error: { message, domain: 'DATABASE', code: 'QUERY_FAILED', timestamp: new Date(), recoverable: true } })

const handleAsync = async (fn) => {
  try {
    initializeDatabase()
    const result = await fn()
    if (result?.success !== undefined) {
      return result
    }
    return result ? wrapResult(result) : wrapError('No data returned')
  } catch (error) {
    return wrapError(error.message)
  }
}

// ==========================================================================
// ALIAS FOR NEW TYPED API
// These alias the old db:* handlers to the new names used by typedElectronAPI
// ==========================================================================

// Warehouses
ipcMain.handle('warehouses:getAll', () => handleAsync(() => getAllWarehouses()))

ipcMain.handle('warehouses:getWithKPIs', () => handleAsync(() => queries.getWarehousesWithKPIs()))

// Locations
ipcMain.handle('locations:getAll', (event, params) => handleAsync(() => queries.getLocationsByWarehouse(params?.warehouseId)))

// Zones
ipcMain.handle('zones:getAll', (event, params) => handleAsync(() => queries.getZonesByWarehouse(params?.warehouseId)))

// Sectors
ipcMain.handle('sectors:getAll', (event, params) => handleAsync(() => queries.getSectorsByWarehouse(params?.warehouseId)))

// Products
ipcMain.handle('products:getAll', (event, params) => handleAsync(() => queries.getProductsByWarehouse(params.warehouseId)))

// Dashboard
ipcMain.handle('dashboard:getKPIs', (event, params) => handleAsync(() => queries.getDashboardKPIs(params?.warehouseId)))

// Import History
ipcMain.handle('importHistory:getAll', (event, params) => handleAsync(() => queries.getImportHistory(params?.warehouseId)))

// Receptions
ipcMain.handle('receptions:getAll', (event, params) => handleAsync(() => queries.getReceptionsByWarehouse(params.warehouseId)))

// Pickings
ipcMain.handle('pickings:getAll', (event, params) => handleAsync(() => queries.getPickingsByWarehouse(params.warehouseId)))

// Returns
ipcMain.handle('returns:getAll', (event, params) => handleAsync(() => queries.getReturnsByWarehouse(params.warehouseId)))

// Restockings
ipcMain.handle('restockings:getAll', (event, params) => handleAsync(() => queries.getRestockingsByWarehouse(params.warehouseId)))

// Orders
ipcMain.handle('orders:getWithLines', (event, params) => handleAsync(() => queries.getOrdersByWarehouseWithLines(params.warehouseId)))

// Analysis
ipcMain.handle('analysis:abc', (event, params) => handleAsync(() => analysis.runABCAnalysis(params)))

ipcMain.handle('analysis:deadStock', (event, params) => handleAsync(() => analysis.runDeadStockAnalysis(params.warehouseId, params.thresholdDays)))

// Users
ipcMain.handle('users:getAll', (event, params) => handleAsync(() => queries.getUsersByWarehouse(params?.warehouseId)))

// ==========================================================================
// CLEANUP
// ==========================================================================

app.on('before-quit', () => {
  console.log('App quitting, closing database...')
  closeDatabase()
})

function createWindow() {
  const preloadPath = path.join(__dirname, '..', 'dist-electron', 'preload.cjs')

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Gestion des erreurs de chargement
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL)
    dialog.showErrorBox('Failed to load', `Failed to load: ${errorDescription}`)
  })

  // Gestion des erreurs de rendu
  win.webContents.on('render-process-gone', (event, details) => {
    console.error('Render process gone:', details)
    dialog.showErrorBox('Renderer process crashed', `Reason: ${details.reason}`)
  })

  // En dev : charge le serveur Vite
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading dev server at http://127.0.0.1:3001')
    win.loadURL('http://127.0.0.1:3001')
    win.webContents.openDevTools()
  } else {
    // En prod : charge les fichiers build
    const indexPath = path.join(__dirname, '../dist/index.html')
    console.log('Loading production build:', indexPath)
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err)
      dialog.showErrorBox('Error', `Failed to load index.html: ${err.message}`)
    })
    // Ouvre les DevTools en prod pour le debug
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()
}).catch(err => {
  console.error('Failed to initialize app:', err)
  dialog.showErrorBox('Initialization Error', err.message)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err)
  dialog.showErrorBox('Uncaught Exception', err.message)
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err)
})

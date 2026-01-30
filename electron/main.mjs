import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============================================================================
// IPC HANDLERS (Backend services)
// ============================================================================

import { initializeDatabase, getDatabase, closeDatabase, getAllWarehouses, createWarehouse, warehouseExists, getDatabaseFilePath } from '../dist-backend/database/index.js'
import * as queries from '../dist-backend/database/queries.js'
import { registry, initializeDefaultPlugins } from '../dist-backend/import/plugins/registry.js'
import * as importService from '../dist-backend/services/import-service.js'
import * as pluginService from '../dist-backend/services/plugin-service.js'
import * as analysis from '../dist-backend/analysis/index.js'

// Register default plugins when app starts
initializeDefaultPlugins()

// Initialize database on app startup
initializeDatabase()
console.log('Database initialized at:', getDatabaseFilePath())

// ==========================================================================
// MOCK DATA GENERATION
// ==========================================================================

ipcMain.handle('import:generate-mock-data', async (event, warehouseId, onProgress) => {
  console.log('Generating mock data for warehouse:', warehouseId)
  initializeDatabase()
  const plugin = pluginService.getPlugin('mock-data-generator')
  if (!plugin) {
    throw new Error('Mock data generator plugin not found')
  }
  console.log('Plugin found, starting generation...')
  const result = await importService.generateMockData(warehouseId, plugin, onProgress)
  console.log('Mock data generation result:', result)
  return result
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

ipcMain.handle('import:execute', async (event, filePath, warehouseId, pluginId) => {
  const plugin = pluginService.getPlugin(pluginId)
  if (!plugin) {
    throw new Error(`Plugin not found: ${pluginId}`)
  }

  return importService.executeImport(filePath, warehouseId, plugin)
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

ipcMain.handle('db:get-stats', async () => {
  initializeDatabase()
  return queries.getDatabaseStats()
})

// ==========================================================================
// WAREHOUSE MANAGEMENT
// ==========================================================================

ipcMain.handle('warehouse:getAll', async () => {
  initializeDatabase()
  const db = getDatabase()
  const count = db.prepare('SELECT COUNT(*) as count FROM warehouses').get()
  console.log('Warehouse count in DB:', count)
  const warehouses = getAllWarehouses()
  console.log('getAllWarehouses returned:', warehouses)
  return warehouses
})

ipcMain.handle('warehouse:create', async (event, warehouse) => {
  initializeDatabase()
  console.log('Creating warehouse:', warehouse)
  const result = createWarehouse(warehouse)
  console.log('Warehouse created:', result)
  return result
})

// ==========================================================================
// ANALYTICS
// ==========================================================================

ipcMain.handle('analysis:abc', async (event, params) => {
  initializeDatabase()
  const { warehouseId, dateFrom, dateTo } = params
  return analysis.runABCAnalysis(warehouseId, dateFrom, dateTo)
})

ipcMain.handle('analysis:dead-stock', async (event, params) => {
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
// CLEANUP
// ==========================================================================

app.on('before-quit', () => {
  console.log('App quitting, closing database...')
  closeDatabase()
})

function createWindow() {
  console.log('Creating window...')
  console.log('__dirname:', __dirname)

  const preloadPath = path.join(__dirname, '..', 'dist-electron', 'preload', 'index.js')
  console.log('Preload path:', preloadPath)

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
    console.log('Loading dev server at http://127.0.0.1:3000')
    win.loadURL('http://127.0.0.1:3000')
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

  win.on('closed', () => {
    console.log('Window closed')
  })
}

app.whenReady().then(() => {
  console.log('App is ready, creating window...')
  createWindow()
}).catch(err => {
  console.error('Failed to initialize app:', err)
  dialog.showErrorBox('Initialization Error', err.message)
})

app.on('window-all-closed', () => {
  console.log('All windows closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    console.log('Activating app, creating window...')
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

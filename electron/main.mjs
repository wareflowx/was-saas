import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============================================================================
// IPC HANDLERS (Backend services)
// ============================================================================

import { initializeDatabase, getDatabase, closeDatabase } from '../dist-backend/database/index.js'
import * as queries from '../dist-backend/database/queries.js'
import { registry, initializeDefaultPlugins } from '../dist-backend/import/plugins/registry.js'

// Register default plugins when app starts
initializeDefaultPlugins()

// ==========================================================================
// PLUGINS
// ==========================================================================

ipcMain.handle('plugins:list', () => {
  const plugins = Object.values(registry).map(plugin => ({
    id: plugin.id,
    name: plugin.name,
    version: plugin.version,
    description: plugin.description,
    wmsSystem: plugin.wmsSystem,
    supportedFormats: plugin.supportedFormats,
  }))
  return plugins
})

ipcMain.handle('plugins:get', (event, pluginId) => {
  const plugin = registry[pluginId]
  if (!plugin) {
    return null
  }
  return {
    id: plugin.id,
    name: plugin.name,
    version: plugin.version,
    description: plugin.description,
    wmsSystem: plugin.wmsSystem,
    supportedFormats: plugin.supportedFormats,
  }
})

// ==========================================================================
// IMPORT WORKFLOW
// ==========================================================================

ipcMain.handle('import:validate', async (event, filePath, pluginId) => {
  // TODO: Implement file validation
  return { valid: true, errors: [] }
})

ipcMain.handle('import:execute', async (event, filePath, warehouseId, pluginId) => {
  // TODO: Implement import execution
  return {
    status: 'success',
    stats: {
      rowsProcessed: 0,
      productsImported: 0,
      inventoryImported: 0,
      movementsImported: 0,
    },
    duration: 0,
    errors: [],
  }
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

ipcMain.handle('db:get-stats', async () => {
  initializeDatabase()
  return queries.getDatabaseStats()
})

// ==========================================================================
// WAREHOUSE MANAGEMENT
// ==========================================================================

ipcMain.handle('warehouse:getAll', async () => {
  initializeDatabase()
  return queries.getAllWarehouses()
})

ipcMain.handle('warehouse:exists', async (event, warehouseId) => {
  initializeDatabase()
  return queries.warehouseExists(warehouseId)
})

ipcMain.handle('warehouse:create', async (event, warehouse) => {
  initializeDatabase()
  return queries.createWarehouse(warehouse)
})

// ==========================================================================
// ANALYTICS
// ==========================================================================

ipcMain.handle('analysis:abc', async (event, params) => {
  initializeDatabase()
  // TODO: Implement ABC analysis
  return {}
})

ipcMain.handle('analysis:dead-stock', async (event, params) => {
  initializeDatabase()
  // TODO: Implement dead stock analysis
  return {}
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

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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

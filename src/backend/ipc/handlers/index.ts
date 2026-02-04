/**
 * IPC Handlers - Main Process
 *
 * Type-safe IPC handlers using the contract definitions.
 * All handlers validate input/output and return Result<T, AppError>.
 */

import { ipcMain } from 'electron'
import type { Result, AppError } from '../../../shared/types'
import { success, failure, ipcError } from '../../../shared/types'
import {
  getLocationsByWarehouse,
  getZonesByWarehouse,
  getSectorsByWarehouse,
  getProductsByWarehouse,
  getWarehousesWithKPIs,
  getImportHistory,
  getReceptionsByWarehouse,
  getPickingsByWarehouse,
  getReturnsByWarehouse,
  getRestockingsByWarehouse,
  getOrdersByWarehouseWithLines,
  getDashboardKPIs,
} from '../../database/queries'
import { runABCAnalysis } from '../../analysis/abc-analysis'
import { runDeadStockAnalysis } from '../../analysis/dead-stock-analysis'

/**
 * Register all IPC handlers
 */
export const registerIpcHandlers = (): void => {
  // Warehouses
  ipcMain.handle('warehouses:getAll', handleWarehousesGetAll)
  ipcMain.handle('warehouses:getWithKPIs', handleWarehousesGetWithKPIs)

  // Locations
  ipcMain.handle('locations:getAll', handleLocationsGetAll)

  // Zones
  ipcMain.handle('zones:getAll', handleZonesGetAll)

  // Sectors
  ipcMain.handle('sectors:getAll', handleSectorsGetAll)

  // Products
  ipcMain.handle('products:getAll', handleProductsGetAll)

  // Dashboard
  ipcMain.handle('dashboard:getKPIs', handleDashboardGetKPIs)

  // Import
  ipcMain.handle('importHistory:getAll', handleImportHistoryGetAll)

  // Operations - Receptions
  ipcMain.handle('receptions:getAll', handleReceptionsGetAll)

  // Operations - Pickings
  ipcMain.handle('pickings:getAll', handlePickingsGetAll)

  // Operations - Returns
  ipcMain.handle('returns:getAll', handleReturnsGetAll)

  // Operations - Restockings
  ipcMain.handle('restockings:getAll', handleRestockingsGetAll)

  // Operations - Orders
  ipcMain.handle('orders:getWithLines', handleOrdersGetWithLines)

  // Analysis
  ipcMain.handle('analysis:abc', handleAnalysisABC)
  ipcMain.handle('analysis:deadStock', handleAnalysisDeadStock)
}

/**
 * Warehouses handlers
 */
const handleWarehousesGetAll = async (): Promise<Result<any, AppError>> => {
  try {
    const data = await getAllWarehouses()

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch warehouses',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    // TODO: Wrap in proper schema validation
    return success(data)
  } catch (error) {
    return failure(ipcError('warehouses:getAll', error))
  }
}

/**
 * Locations handlers
 */
const handleLocationsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const data = await getLocationsByWarehouse(
      (input as { warehouseId?: string })?.warehouseId
    )

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch locations',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('locations:getAll', error))
  }
}

/**
 * Zones handlers
 */
const handleZonesGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const data = await getZonesByWarehouse(
      (input as { warehouseId?: string })?.warehouseId
    )

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch zones',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('zones:getAll', error))
  }
}

/**
 * Sectors handlers
 */
const handleSectorsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const data = await getSectorsByWarehouse(
      (input as { warehouseId?: string })?.warehouseId
    )

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch sectors',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('sectors:getAll', error))
  }
}

/**
 * Warehouses with KPIs handler
 */
const handleWarehousesGetWithKPIs = async (): Promise<Result<any, AppError>> => {
  try {
    const data = await getWarehousesWithKPIs()

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch warehouses with KPIs',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('warehouses:getWithKPIs', error))
  }
}

/**
 * Products handler
 */
const handleProductsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId: string }

    if (!warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const products = await getProductsByWarehouse(warehouseId)

    if (!products) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch products',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    // TODO: Calculate KPIs and wrap in proper schema validation
    return success({
      kpis: {
        totalProducts: products.length,
        inStock: products.filter((p: any) => p.currentQuantity && p.currentQuantity > 0).length,
        lowStock: products.filter((p: any) => p.minStock && p.currentQuantity && p.currentQuantity < p.minStock).length,
        outOfStock: products.filter((p: any) => !p.currentQuantity || p.currentQuantity === 0).length,
        totalQuantity: products.reduce((sum: number, p: any) => sum + (p.currentQuantity || 0), 0),
        totalValue: 0,
        categories: new Set(products.map((p: any) => p.category)).size,
      },
      products,
    })
  } catch (error) {
    return failure(ipcError('products:getAll', error))
  }
}

/**
 * Dashboard KPIs handler
 */
const handleDashboardGetKPIs = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId?: string }
    const data = await getDashboardKPIs(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch dashboard KPIs',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('dashboard:getKPIs', error))
  }
}

/**
 * Import history handler
 */
const handleImportHistoryGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId?: string }
    const data = await getImportHistory(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch import history',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('importHistory:getAll', error))
  }
}

/**
 * Receptions handler
 */
const handleReceptionsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId: string }

    if (!warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await getReceptionsByWarehouse(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch receptions',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('receptions:getAll', error))
  }
}

/**
 * Pickings handler
 */
const handlePickingsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId: string }

    if (!warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await getPickingsByWarehouse(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch pickings',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('pickings:getAll', error))
  }
}

/**
 * Returns handler
 */
const handleReturnsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId: string }

    if (!warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await getReturnsByWarehouse(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch returns',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('returns:getAll', error))
  }
}

/**
 * Restockings handler
 */
const handleRestockingsGetAll = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId: string }

    if (!warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await getRestockingsByWarehouse(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch restockings',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('restockings:getAll', error))
  }
}

/**
 * Orders with lines handler
 */
const handleOrdersGetWithLines = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const { warehouseId } = input as { warehouseId: string }

    if (!warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await getOrdersByWarehouseWithLines(warehouseId)

    if (!data) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch orders',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('orders:getWithLines', error))
  }
}

/**
 * ABC Analysis handler
 */
const handleAnalysisABC = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const params = input as {
      warehouseId: string
      dateFrom?: string
      dateTo?: string
    }

    if (!params.warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await runABCAnalysis(params)

    if (!data) {
      return failure({
        domain: 'BUSINESS',
        code: 'ANALYSIS_FAILED',
        message: 'ABC analysis failed',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('analysis:abc', error))
  }
}

/**
 * Dead Stock Analysis handler
 */
const handleAnalysisDeadStock = async (
  _event: Electron.IpcMainInvokeEvent,
  input: unknown
): Promise<Result<any, AppError>> => {
  try {
    const params = input as {
      warehouseId: string
      thresholdDays?: number
      criticalThreshold?: number
      warningThreshold?: number
    }

    if (!params.warehouseId) {
      return failure({
        domain: 'VALIDATION',
        code: 'MISSING_PARAMETER',
        message: 'warehouseId is required',
        timestamp: new Date(),
        recoverable: false,
      })
    }

    const data = await runDeadStockAnalysis(
      params.warehouseId,
      params.thresholdDays
    )

    if (!data) {
      return failure({
        domain: 'BUSINESS',
        code: 'ANALYSIS_FAILED',
        message: 'Dead stock analysis failed',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    return success(data)
  } catch (error) {
    return failure(ipcError('analysis:deadStock', error))
  }
}

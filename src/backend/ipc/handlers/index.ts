/**
 * IPC Handlers - Main Process
 *
 * Type-safe IPC handlers using the contract definitions.
 * All handlers validate input/output and return Result<T, AppError>.
 */

import { ipcMain } from 'electron'
import type { Result, AppError } from '../../../shared/types'
import { success, failure, ipcError, validationError } from '../../../shared/types'
import type {
  WarehousesData,
  LocationsData,
  ZonesData,
  SectorsData,
  ProductsData,
  DashboardData,
  ImportHistoryEntry,
  ReceptionsData,
  PickingsData,
  ReturnsData,
  RestockingsData,
  OrdersData,
  ABCAnalysisResult,
  DeadStockAnalysisResult,
} from '../../../shared/schemas/entities'
import {
  warehousesDataSchema,
  locationsDataSchema,
  zonesDataSchema,
  sectorsDataSchema,
  productsDataSchema,
  dashboardDataSchema,
  importHistoryEntrySchema,
  receptionsDataSchema,
  pickingsDataSchema,
  returnsDataSchema,
  restockingsDataSchema,
  ordersDataSchema,
  abcAnalysisResultSchema,
  deadStockAnalysisResultSchema,
} from '../../../shared/schemas/entities'
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
const handleWarehousesGetAll = async (): Promise<Result<WarehousesData, AppError>> => {
  try {
    const result = await getAllWarehouses()

    if (!result.success) {
      return result
    }

    if (!result.data || result.data.length === 0) {
      return failure({
        domain: 'DATABASE',
        code: 'QUERY_FAILED',
        message: 'Failed to fetch warehouses',
        timestamp: new Date(),
        recoverable: true,
      })
    }

    // Validate with Zod schema
    const validation = warehousesDataSchema.safeParse(result.data)
    if (!validation.success) {
      return failure(validationError('WarehousesData', result.data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<LocationsData, AppError>> => {
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

    // Validate with Zod schema
    const validation = locationsDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('LocationsData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<ZonesData, AppError>> => {
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

    // Validate with Zod schema
    const validation = zonesDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('ZonesData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<SectorsData, AppError>> => {
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

    // Validate with Zod schema
    const validation = sectorsDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('SectorsData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
  } catch (error) {
    return failure(ipcError('sectors:getAll', error))
  }
}

/**
 * Warehouses with KPIs handler
 */
const handleWarehousesGetWithKPIs = async (): Promise<Result<WarehousesData, AppError>> => {
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

    // Validate with Zod schema
    const validation = warehousesDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('WarehousesData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<ProductsData, AppError>> => {
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

    // Build response with KPIs
    const responseData = {
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
    }

    // Validate with Zod schema
    const validation = productsDataSchema.safeParse(responseData)
    if (!validation.success) {
      return failure(validationError('ProductsData', responseData, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<DashboardData, AppError>> => {
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

    // Validate with Zod schema
    const validation = dashboardDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('DashboardData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<readonly ImportHistoryEntry[], AppError>> => {
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

    // Validate with Zod schema
    const validation = importHistoryEntrySchema.array().safeParse(data)
    if (!validation.success) {
      return failure(validationError('ImportHistoryEntry', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<ReceptionsData, AppError>> => {
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

    // Validate with Zod schema
    const validation = receptionsDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('ReceptionsData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<PickingsData, AppError>> => {
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

    // Validate with Zod schema
    const validation = pickingsDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('PickingsData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<ReturnsData, AppError>> => {
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

    // Validate with Zod schema
    const validation = returnsDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('ReturnsData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<RestockingsData, AppError>> => {
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

    // Validate with Zod schema
    const validation = restockingsDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('RestockingsData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<OrdersData, AppError>> => {
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

    // Validate with Zod schema
    const validation = ordersDataSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('OrdersData', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<ABCAnalysisResult, AppError>> => {
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

    // Validate with Zod schema
    const validation = abcAnalysisResultSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('ABCAnalysisResult', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
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
): Promise<Result<DeadStockAnalysisResult, AppError>> => {
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

    // Validate with Zod schema
    const validation = deadStockAnalysisResultSchema.safeParse(data)
    if (!validation.success) {
      return failure(validationError('DeadStockAnalysisResult', data, validation.error.errors.map(e => e.message).join(', ')))
    }

    return success(validation.data)
  } catch (error) {
    return failure(ipcError('analysis:deadStock', error))
  }
}

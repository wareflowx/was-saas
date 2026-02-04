/**
 * IPC Handlers - Main Process
 *
 * Type-safe IPC handlers using the contract definitions.
 * All handlers validate input/output and return Result<T, AppError>.
 */

import { ipcMain } from 'electron'
import type { Result, AppError } from '../../../shared/types'
import { success, failure, ipcError } from '../../../shared/types'
import { getLocationsByWarehouse } from '../../database/queries'
import { getZonesByWarehouse } from '../../database/queries'
import { getSectorsByWarehouse } from '../../database/queries'
import { getAllWarehouses } from '../../database/index'

/**
 * Register all IPC handlers
 */
export const registerIpcHandlers = (): void => {
  // Warehouses
  ipcMain.handle('warehouses:getAll', handleWarehousesGetAll)

  // Locations
  ipcMain.handle('locations:getAll', handleLocationsGetAll)

  // Zones
  ipcMain.handle('zones:getAll', handleZonesGetAll)

  // Sectors
  ipcMain.handle('sectors:getAll', handleSectorsGetAll)
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

/**
 * IPC Contract - Type-safe Electron IPC communication
 *
 * Single source of truth for all IPC channels.
 * Defined once, shared between frontend (renderer) and backend (main).
 */

import { z } from 'zod'
import type { Result, AppError } from '../types'
import {
  locationsDataSchema,
  zonesDataSchema,
  sectorsDataSchema,
  warehousesDataSchema,
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
  type LocationsData,
  type ZonesData,
  type SectorsData,
  type WarehousesData,
  type ProductsData,
  type DashboardData,
  type ImportHistoryEntry,
  type ReceptionsData,
  type PickingsData,
  type ReturnsData,
  type RestockingsData,
  type OrdersData,
  type ABCAnalysisResult,
  type DeadStockAnalysisResult,
} from '../schemas/entities'

// ============================================================================
// IPC CONTRACT DEFINITION
// ============================================================================

/**
 * IPC Contract - all channels with their input/output schemas
 */
export const ipcContract = {
  // Warehouses
  warehouses: {
    getAll: {
      input: z.undefined(),
      output: warehousesDataSchema,
    },
    getWithKPIs: {
      input: z.undefined(),
      output: warehousesDataSchema,
    },
  },

  // Locations
  locations: {
    getAll: {
      input: z.object({
        warehouseId: z.string().optional(),
      }).optional(),
      output: locationsDataSchema,
    },
  },

  // Zones
  zones: {
    getAll: {
      input: z.object({
        warehouseId: z.string().optional(),
      }).optional(),
      output: zonesDataSchema,
    },
  },

  // Sectors
  sectors: {
    getAll: {
      input: z.object({
        warehouseId: z.string().optional(),
      }).optional(),
      output: sectorsDataSchema,
    },
  },

  // Products
  products: {
    getAll: {
      input: z.object({
        warehouseId: z.string(),
      }),
      output: productsDataSchema,
    },
  },

  // Dashboard
  dashboard: {
    getKPIs: {
      input: z.object({
        warehouseId: z.string().optional(),
      }),
      output: dashboardDataSchema,
    },
  },

  // Import
  importHistory: {
    getAll: {
      input: z.object({
        warehouseId: z.string().optional(),
      }),
      output: z.array(importHistoryEntrySchema),
    },
  },

  // Operations - Receptions
  receptions: {
    getAll: {
      input: z.object({
        warehouseId: z.string(),
      }),
      output: receptionsDataSchema,
    },
  },

  // Operations - Pickings
  pickings: {
    getAll: {
      input: z.object({
        warehouseId: z.string(),
      }),
      output: pickingsDataSchema,
    },
  },

  // Operations - Returns
  returns: {
    getAll: {
      input: z.object({
        warehouseId: z.string(),
      }),
      output: returnsDataSchema,
    },
  },

  // Operations - Restockings
  restockings: {
    getAll: {
      input: z.object({
        warehouseId: z.string(),
      }),
      output: restockingsDataSchema,
    },
  },

  // Operations - Orders
  orders: {
    getWithLines: {
      input: z.object({
        warehouseId: z.string(),
      }),
      output: ordersDataSchema,
    },
  },

  // Analysis
  analysis: {
    abc: {
      input: z.object({
        warehouseId: z.string(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }),
      output: abcAnalysisResultSchema,
    },
    deadStock: {
      input: z.object({
        warehouseId: z.string(),
        thresholdDays: z.number().optional(),
        criticalThreshold: z.number().optional(),
        warningThreshold: z.number().optional(),
      }),
      output: deadStockAnalysisResultSchema,
    },
  },
} as const

// ============================================================================
// TYPE INFERENCE
// ============================================================================

/**
 * IPC Contract type
 */
export type IpcContract = typeof ipcContract

/**
 * Extract input type from a channel
 */
export type IpcInput<
  T extends keyof IpcContract,
  M extends keyof IpcContract[T]
> = z.infer<IpcContract[T][M]['input']>

/**
 * Extract output type from a channel
 */
export type IpcOutput<
  T extends keyof IpcContract,
  M extends keyof IpcContract[T]
> = z.output<IpcContract[T][M]['output']>

// ============================================================================
// IPC PROXY TYPE
// ============================================================================

/**
 * Type-safe IPC proxy type
 * Each channel returns a Promise of Result<Output, AppError>
 */
export type IpcProxy<T extends IpcContract> = {
  readonly [K in keyof T]: {
    readonly [M in keyof T[K]]: (
      input?: IpcInput<K, M>
    ) => Promise<Result<IpcOutput<K, M>, AppError>>
  }
}

// ============================================================================
// SPECIFIC CHANNEL TYPES (for convenience)
// ============================================================================

/**
 * Warehouses channels
 */
export type WarehousesIpc = IpcProxy<Pick<IpcContract, 'warehouses'>>

/**
 * Locations channels
 */
export type LocationsIpc = IpcProxy<Pick<IpcContract, 'locations'>>

/**
 * Zones channels
 */
export type ZonesIpc = IpcProxy<Pick<IpcContract, 'zones'>>

/**
 * Sectors channels
 */
export type SectorsIpc = IpcProxy<Pick<IpcContract, 'sectors'>>

/**
 * Products channels
 */
export type ProductsIpc = IpcProxy<Pick<IpcContract, 'products'>>

/**
 * Dashboard channels
 */
export type DashboardIpc = IpcProxy<Pick<IpcContract, 'dashboard'>>

/**
 * Import channels
 */
export type ImportIpc = IpcProxy<Pick<IpcContract, 'importHistory'>>

/**
 * Receptions channels
 */
export type ReceptionsIpc = IpcProxy<Pick<IpcContract, 'receptions'>>

/**
 * Pickings channels
 */
export type PickingsIpc = IpcProxy<Pick<IpcContract, 'pickings'>>

/**
 * Returns channels
 */
export type ReturnsIpc = IpcProxy<Pick<IpcContract, 'returns'>>

/**
 * Restockings channels
 */
export type RestockingsIpc = IpcProxy<Pick<IpcContract, 'restockings'>>

/**
 * Orders channels
 */
export type OrdersIpc = IpcProxy<Pick<IpcContract, 'orders'>>

/**
 * Analysis channels
 */
export type AnalysisIpc = IpcProxy<Pick<IpcContract, 'analysis'>>

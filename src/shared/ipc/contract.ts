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
  type LocationsData,
  type ZonesData,
  type SectorsData,
  type WarehousesData,
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
export type WarehousesIpc = IpcProxy<'warehouses'>

/**
 * Locations channels
 */
export type LocationsIpc = IpcProxy<'locations'>

/**
 * Zones channels
 */
export type ZonesIpc = IpcProxy<'zones'>

/**
 * Sectors channels
 */
export type SectorsIpc = IpcProxy<'sectors'>

/**
 * Typed Electron API Declarations
 *
 * Type-safe IPC communication using Result<T, AppError> pattern.
 * This replaces the legacy electronAPI with proper TypeScript types.
 *
 * @see src/types/typed-electron-api.ts for the interface definition
 * @see src/preload/index.ts for the implementation
 */

import type { Result, AppError } from '../shared/types'
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
  UsersData,
} from '../shared/schemas/entities'
import type { ImportResult } from '../backend/import/types'

// ============================================================================
// TYPED ELECTRON API
// ============================================================================

declare const typedElectronAPI: {
  warehouses: {
    getAll: () => Promise<Result<WarehousesData, AppError>>
    getWithKPIs: () => Promise<Result<WarehousesData, AppError>>
  }

  locations: {
    getAll: (params?: { warehouseId?: string }) => Promise<Result<LocationsData, AppError>>
  }

  zones: {
    getAll: (params?: { warehouseId?: string }) => Promise<Result<ZonesData, AppError>>
  }

  sectors: {
    getAll: (params?: { warehouseId?: string }) => Promise<Result<SectorsData, AppError>>
  }

  products: {
    getAll: (params: { warehouseId: string }) => Promise<Result<ProductsData, AppError>>
  }

  dashboard: {
    getKPIs: (params?: { warehouseId?: string }) => Promise<Result<DashboardData, AppError>>
  }

  importHistory: {
    getAll: (params?: { warehouseId?: string }) => Promise<Result<readonly ImportHistoryEntry[], AppError>>
  }

  import: {
    generateMockData: (warehouseId: string) => Promise<ImportResult>
  }

  receptions: {
    getAll: (params: { warehouseId: string }) => Promise<Result<ReceptionsData, AppError>>
  }

  pickings: {
    getAll: (params: { warehouseId: string }) => Promise<Result<PickingsData, AppError>>
  }

  returns: {
    getAll: (params: { warehouseId: string }) => Promise<Result<ReturnsData, AppError>>
  }

  restockings: {
    getAll: (params: { warehouseId: string }) => Promise<Result<RestockingsData, AppError>>
  }

  orders: {
    getWithLines: (params: { warehouseId: string }) => Promise<Result<OrdersData, AppError>>
  }

  analysis: {
    abc: (params: {
      warehouseId: string
      dateFrom?: string
      dateTo?: string
    }) => Promise<Result<ABCAnalysisResult, AppError>>

    deadStock: (params: {
      warehouseId: string
      thresholdDays?: number
      criticalThreshold?: number
      warningThreshold?: number
    }) => Promise<Result<DeadStockAnalysisResult, AppError>>
  }

  users: {
    getAll: (params?: { warehouseId?: string }) => Promise<Result<UsersData, AppError>>
  }
}

declare global {
  interface Window {
    typedElectronAPI: typeof typedElectronAPI
  }
}

export {}

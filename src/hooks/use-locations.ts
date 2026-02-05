/**
 * TanStack Query hooks for locations and warehouses
 *
 * These hooks provide automatic caching, loading states, and error handling
 * for backend data fetching. They use typed IPC with Result<T, E> error handling.
 */

import { useQuery } from '@tanstack/react-query'
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

/**
 * Fetch locations for a warehouse
 * @param warehouseId - Warehouse ID (optional, undefined = all warehouses)
 * @returns Query result with data, isLoading, error, refetch
 */
export function useLocations(warehouseId?: string) {
  return useQuery<LocationsData>({
    queryKey: ['locations', warehouseId],

    queryFn: async (): Promise<LocationsData> => {
      const result = await window.typedElectronAPI.locations
        .getAll({ warehouseId })

      // Handle Result<T, E> - throw error for React Query to catch
      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch all warehouses
 * @returns Query result with warehouses array
 */
export function useWarehouses() {
  return useQuery<WarehousesData>({
    queryKey: ['warehouses'],

    queryFn: async (): Promise<WarehousesData> => {
      const result = await window.typedElectronAPI.warehouses.getAll()

      // Handle Result<T, E> - throw error for React Query to catch
      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch warehouses with KPIs
 * @returns Query result with warehouses data and calculated KPIs
 */
export function useWarehousesWithKPIs() {
  return useQuery<WarehousesData>({
    queryKey: ['warehouses', 'kpis'],

    queryFn: async (): Promise<WarehousesData> => {
      const result = await window.typedElectronAPI.warehouses.getWithKPIs()

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch ABC analysis for a warehouse
 * @param warehouseId - Warehouse ID
 * @param params - Optional date range parameters
 * @returns Query result with ABC analysis data
 */
export function useABCAnalysis(
  warehouseId: string,
  params?: {
    dateFrom?: string
    dateTo?: string
  }
) {
  return useQuery<ABCAnalysisResult>({
    queryKey: ['analysis', 'abc', warehouseId, params],

    queryFn: async (): Promise<ABCAnalysisResult> => {
      const result = await window.typedElectronAPI.analysis.abc({
        warehouseId,
        ...params,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch Dead Stock analysis for a warehouse
 * @param warehouseId - Warehouse ID
 * @param params - Optional threshold parameters
 * @returns Query result with Dead Stock analysis data
 */
export function useDeadStockAnalysis(
  warehouseId: string,
  params?: {
    thresholdDays?: number
    criticalThreshold?: number
    warningThreshold?: number
  }
) {
  return useQuery<DeadStockAnalysisResult>({
    queryKey: ['analysis', 'dead-stock', warehouseId, params],

    queryFn: async (): Promise<DeadStockAnalysisResult> => {
      const result = await window.typedElectronAPI.analysis.deadStock({
        warehouseId,
        ...params,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch zones for a warehouse
 * @param warehouseId - Warehouse ID (optional, undefined = all warehouses)
 * @returns Query result with zones data
 */
export function useZones(warehouseId?: string) {
  return useQuery<ZonesData>({
    queryKey: ['zones', warehouseId],

    queryFn: async (): Promise<ZonesData> => {
      const result = await window.typedElectronAPI.zones
        .getAll({ warehouseId })

      // Handle Result<T, E> - throw error for React Query to catch
      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch sectors for a warehouse
 * @param warehouseId - Warehouse ID (optional, undefined = all warehouses)
 * @returns Query result with sectors data
 */
export function useSectors(warehouseId?: string) {
  return useQuery<SectorsData>({
    queryKey: ['sectors', warehouseId],

    queryFn: async (): Promise<SectorsData> => {
      const result = await window.typedElectronAPI.sectors
        .getAll({ warehouseId })

      // Handle Result<T, E> - throw error for React Query to catch
      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch import history
 * @param warehouseId - Warehouse ID (optional, if not provided returns all imports)
 * @returns Query result with import history data
 */
export function useImportHistory(warehouseId?: string) {
  return useQuery<readonly ImportHistoryEntry[]>({
    queryKey: ['import-history', warehouseId],

    queryFn: async (): Promise<readonly ImportHistoryEntry[]> => {
      const result = await window.typedElectronAPI.importHistory.getAll({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch dashboard KPIs and metrics
 * @param warehouseId - Warehouse ID (optional, if not provided returns aggregate data)
 * @returns Query result with dashboard KPIs and summary data
 */
export function useDashboardKPIs(warehouseId?: string) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'kpis', warehouseId],

    queryFn: async (): Promise<DashboardData> => {
      const result = await window.typedElectronAPI.dashboard.getKPIs({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Fetch receptions for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with receptions data
 */
export function useReceptions(warehouseId?: string) {
  return useQuery<ReceptionsData>({
    queryKey: ['receptions', warehouseId],

    queryFn: async (): Promise<ReceptionsData> => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await window.typedElectronAPI.receptions.getAll({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch pickings for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with pickings data
 */
export function usePickings(warehouseId?: string) {
  return useQuery<PickingsData>({
    queryKey: ['pickings', warehouseId],

    queryFn: async (): Promise<PickingsData> => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await window.typedElectronAPI.pickings.getAll({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch returns for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with returns data
 */
export function useReturns(warehouseId?: string) {
  return useQuery<ReturnsData>({
    queryKey: ['returns', warehouseId],

    queryFn: async (): Promise<ReturnsData> => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await window.typedElectronAPI.returns.getAll({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch restockings for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with restockings data
 */
export function useRestockings(warehouseId?: string) {
  return useQuery<RestockingsData>({
    queryKey: ['restockings', warehouseId],

    queryFn: async (): Promise<RestockingsData> => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await window.typedElectronAPI.restockings.getAll({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch orders with lines for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with orders data including lines
 */
export function useOrdersWithLines(warehouseId?: string) {
  return useQuery<OrdersData>({
    queryKey: ['orders', 'with-lines', warehouseId],

    queryFn: async (): Promise<OrdersData> => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await window.typedElectronAPI.orders.getWithLines({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch products for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with products data
 */
export function useProducts(warehouseId?: string) {
  return useQuery<ProductsData>({
    queryKey: ['products', warehouseId],

    queryFn: async (): Promise<ProductsData> => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await window.typedElectronAPI.products.getAll({
        warehouseId,
      })

      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },

    enabled: !!warehouseId,
  })
}

/**
 * Fetch users for a warehouse
 * @param warehouseId - Warehouse ID (optional, undefined = all warehouses)
 * @returns Query result with users data
 */
export function useUsers(warehouseId?: string) {
  return useQuery<UsersData>({
    queryKey: ['users', warehouseId],

    queryFn: async (): Promise<UsersData> => {
      const result = await window.typedElectronAPI.users
        .getAll({ warehouseId })

      // Handle Result<T, E> - throw error for React Query to catch
      if (result.success) {
        return result.data
      }

      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

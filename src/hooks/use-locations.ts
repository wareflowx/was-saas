/**
 * TanStack Query hooks for locations and warehouses
 *
 * These hooks provide automatic caching, loading states, and error handling
 * for backend data fetching. They use typed IPC with Result<T, E> error handling.
 */

import { useQuery } from '@tanstack/react-query'
import type { Result } from '../../shared/types'

/**
 * Fetch locations for a warehouse
 * @param warehouseId - Warehouse ID (optional, undefined = all warehouses)
 * @returns Query result with data, isLoading, error, refetch
 */
export function useLocations(warehouseId?: string) {
  return useQuery({
    queryKey: ['locations', warehouseId],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.locations
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
  return useQuery({
    queryKey: ['warehouses'],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.warehouses.getAll()

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
  return useQuery({
    queryKey: ['warehouses', 'kpis'],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.warehouses.getWithKPIs()

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
  return useQuery({
    queryKey: ['analysis', 'abc', warehouseId, params],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.analysis.abc({
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
  return useQuery({
    queryKey: ['analysis', 'dead-stock', warehouseId, params],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.analysis.deadStock({
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
  return useQuery({
    queryKey: ['zones', warehouseId],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.zones
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
  return useQuery({
    queryKey: ['sectors', warehouseId],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.sectors
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
  return useQuery({
    queryKey: ['import-history', warehouseId],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.importHistory.getAll({
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
  return useQuery({
    queryKey: ['dashboard', 'kpis', warehouseId],

    queryFn: async () => {
      const result = await (window as any).typedElectronAPI.dashboard.getKPIs({
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
  return useQuery({
    queryKey: ['receptions', warehouseId],

    queryFn: async () => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await (window as any).typedElectronAPI.receptions.getAll({
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
  return useQuery({
    queryKey: ['pickings', warehouseId],

    queryFn: async () => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await (window as any).typedElectronAPI.pickings.getAll({
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
  return useQuery({
    queryKey: ['returns', warehouseId],

    queryFn: async () => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await (window as any).typedElectronAPI.returns.getAll({
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
  return useQuery({
    queryKey: ['restockings', warehouseId],

    queryFn: async () => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await (window as any).typedElectronAPI.restockings.getAll({
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
  return useQuery({
    queryKey: ['orders', 'with-lines', warehouseId],

    queryFn: async () => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await (window as any).typedElectronAPI.orders.getWithLines({
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
  return useQuery({
    queryKey: ['products', warehouseId],

    queryFn: async () => {
      if (!warehouseId) {
        throw new Error('warehouseId is required')
      }

      const result = await (window as any).typedElectronAPI.products.getAll({
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

/**
 * TanStack Query hooks for locations and warehouses
 *
 * These hooks provide automatic caching, loading states, and error handling
 * for backend data fetching. They use the useBackend hook to communicate
 * with the Electron main process via IPC.
 */

import { useQuery } from '@tanstack/react-query'
import { useBackend } from './use-backend'

/**
 * Fetch locations for a warehouse
 * @param warehouseId - Warehouse ID (optional, uses first warehouse if not provided)
 * @returns Query result with data, isLoading, error, refetch
 */
export function useLocations(warehouseId?: string) {
  const backend = useBackend()

  return useQuery({
    // Unique query key for cache
    queryKey: ['locations', warehouseId],

    // Query function
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      return await backend.getLocations({
        warehouseId: warehouseId || firstWarehouse.id
      })
    },

    // Only run query if warehouseId is provided or we have warehouses
    enabled: !!warehouseId,
  })
}

/**
 * Fetch all warehouses
 * @returns Query result with warehouses array
 */
export function useWarehouses() {
  const backend = useBackend()

  return useQuery({
    queryKey: ['warehouses'],
    queryFn: () => backend.getAllWarehouses(),
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['analysis', 'abc', warehouseId, params],
    queryFn: () => backend.runABCAnalysis({ warehouseId, ...params }),
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['analysis', 'dead-stock', warehouseId, params],
    queryFn: () => backend.runDeadStockAnalysis({ warehouseId, ...params }),
    enabled: !!warehouseId,
  })
}

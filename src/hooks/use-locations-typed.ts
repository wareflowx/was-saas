/**
 * Typed data fetching hook - demonstrates new pattern
 *
 * This hook shows how to use the typed IPC with proper error handling.
 * Replace use-locations.ts with this pattern for all hooks.
 */

import { useQuery } from '@tanstack/react-query'
import type { Result } from '../../shared/types'
import { isSuccess, unwrap } from '../../shared/types'

/**
 * Fetch locations using typed IPC
 * @param warehouseId - Warehouse ID (optional, undefined = all warehouses)
 * @returns Query result
 */
export function useLocationsTyped(warehouseId?: string) {
  return useQuery({
    queryKey: ['locations', warehouseId],

    queryFn: async (): Promise<{
      locations: unknown[]
      kpis: unknown
    }> => {
      // Use typed IPC instead of useBackend
      const result = await (window as any).typedElectronAPI.locations
        .getAll({ warehouseId })

      // Handle Result<T, E>
      if (result.success) {
        return result.data
      }

      // For React Query, throw the error so it can be caught in error boundary
      throw new Error(result.error.message, { cause: result.error })
    },
  })
}

/**
 * Hook to demonstrate Result type handling in components
 * @param warehouseId - Warehouse ID
 * @returns Result with locations data or error
 */
export function useLocationsResult(warehouseId?: string): Result<{
  locations: unknown[]
  kpis: unknown
}, Error> {
  const { data } = useQuery({
    queryKey: ['locations', warehouseId],

    queryFn: async (): Promise<{
      locations: unknown[]
      kpis: unknown
    }> => {
      const result = await (window as any).typedElectronAPI.locations
        .getAll({ warehouseId })

      // Return Result directly - let caller handle it
      return result as unknown as Result<{
        locations: unknown[]
        kpis: unknown
      }, Error>
    },
  })

  // Transform React Query data to Result
  if (data && isSuccess(data as Result<unknown, Error>)) {
    return data
  }

  return {
    success: false,
    error: new Error('Data not loaded'),
  } as const
}

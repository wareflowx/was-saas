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

      const locations = await backend.getLocations({
        warehouseId: warehouseId || firstWarehouse.id
      })

      console.log('📍 [DB] Locations loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: locations?.length || 0,
        sample: locations?.slice(0, 2).map((l: any) => ({ id: l.id, code: l.code, zone: l.zone_name }))
      })

      return locations
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
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()

      console.log('🏢 [DB] Warehouses loaded:', {
        count: warehouses?.length || 0,
        warehouses: warehouses?.map((w: any) => ({ id: w.id, code: w.code, name: w.name, city: w.city }))
      })

      return warehouses
    },
  })
}

/**
 * Fetch warehouses with KPIs
 * @returns Query result with warehouses data and calculated KPIs
 */
export function useWarehousesWithKPIs() {
  const backend = useBackend()

  return useQuery({
    queryKey: ['warehouses', 'kpis'],
    queryFn: async () => {
      const data = await backend.getWarehousesWithKPIs()

      console.log('📊 [DB] Warehouses with KPIs loaded:', {
        count: data?.warehouses?.length || 0,
        sample: data?.warehouses?.slice(0, 2).map((w: any) => ({
          id: w.id,
          name: w.name,
          totalProducts: w.total_products,
          totalMovements: w.total_movements,
          locations: w.total_locations
        }))
      })

      return data
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['analysis', 'abc', warehouseId, params],
    queryFn: async () => {
      const analysis = await backend.runABCAnalysis({ warehouseId, ...params })

      console.log('🔤 [DB] ABC Analysis loaded:', {
        warehouseId,
        products: analysis?.products?.length || 0,
        categories: analysis?.products?.slice(0, 3).map((p: any) => ({ sku: p.sku, abc: p.abc_class }))
      })

      return analysis
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['analysis', 'dead-stock', warehouseId, params],
    queryFn: async () => {
      const analysis = await backend.runDeadStockAnalysis({ warehouseId, ...params })

      console.log('💀 [DB] Dead Stock Analysis loaded:', {
        warehouseId,
        deadStockProducts: analysis?.dead_stock?.length || 0,
        sample: analysis?.dead_stock?.slice(0, 2).map((p: any) => ({ sku: p.sku, daysSinceMovement: p.days_since_last_movement }))
      })

      return analysis
    },
    enabled: !!warehouseId,
  })
}

/**
 * Fetch zones for a warehouse
 * @param warehouseId - Warehouse ID (optional, uses first warehouse if not provided)
 * @returns Query result with zones data
 */
export function useZones(warehouseId?: string) {
  const backend = useBackend()

  return useQuery({
    queryKey: ['zones', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const zones = await backend.getZones({
        warehouseId: warehouseId || firstWarehouse.id
      })

      console.log('🗺️ [DB] Zones loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: zones?.length || 0,
        sample: zones?.slice(0, 3).map((z: any) => ({ id: z.id, name: z.name, type: z.type }))
      })

      return zones
    },
    enabled: !!warehouseId,
  })
}

/**
 * Fetch sectors for a warehouse
 * @param warehouseId - Warehouse ID (optional, uses first warehouse if not provided)
 * @returns Query result with sectors data
 */
export function useSectors(warehouseId?: string) {
  const backend = useBackend()

  return useQuery({
    queryKey: ['sectors', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const sectors = await backend.getSectors({
        warehouseId: warehouseId || firstWarehouse.id
      })

      console.log('🏗️ [DB] Sectors loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: sectors?.length || 0,
        sample: sectors?.slice(0, 3).map((s: any) => ({ id: s.id, zone: s.zone_name, type: s.type }))
      })

      return sectors
    },
    enabled: !!warehouseId,
  })
}

/**
 * Fetch import history
 * @param warehouseId - Warehouse ID (optional, if not provided returns all imports)
 * @returns Query result with import history data
 */
export function useImportHistory(warehouseId?: string) {
  const backend = useBackend()

  return useQuery({
    queryKey: ['import-history', warehouseId],
    queryFn: async () => {
      const history = await backend.getImportHistory(warehouseId)

      console.log('📥 [DB] Import History loaded:', {
        warehouseId: warehouseId || 'all',
        count: history?.length || 0,
        imports: history?.slice(0, 3).map((h: any) => ({
          id: h.id,
          pluginId: h.plugin_id,
          status: h.status,
          rowsProcessed: h.rows_processed
        }))
      })

      return history
    },
  })
}

/**
 * Fetch dashboard KPIs and metrics
 * @param warehouseId - Warehouse ID (optional, if not provided returns aggregate data)
 * @returns Query result with dashboard KPIs and summary data
 */
export function useDashboardKPIs(warehouseId?: string) {
  const backend = useBackend()

  return useQuery({
    queryKey: ['dashboard', 'kpis', warehouseId],
    queryFn: async () => {
      const kpis = await backend.getDashboardKPIs(warehouseId)

      console.log('📈 [DB] Dashboard KPIs loaded:', {
        warehouseId: warehouseId || 'all',
        totalProducts: kpis?.total_products || 0,
        totalWarehouses: kpis?.total_warehouses || 0,
        totalMovements: kpis?.total_movements || 0
      })

      return kpis
    },
  })
}

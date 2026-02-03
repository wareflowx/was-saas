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

      const data = await backend.getLocations({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const locations = data?.locations || []

      console.log('📍 [DB] Locations loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: locations?.length || 0,
        sample: locations?.slice(0, 2).map((l: any) => ({ id: l.id, code: l.code, zone: l.zone_name }))
      })

      return data
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
      const products = analysis?.products || []

      console.log('🔤 [DB] ABC Analysis loaded:', {
        warehouseId,
        products: products?.length || 0,
        categories: products?.slice(0, 3).map((p: any) => ({ sku: p.sku, abc: p.abc_class }))
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
      const deadStock = analysis?.dead_stock || []

      console.log('💀 [DB] Dead Stock Analysis loaded:', {
        warehouseId,
        deadStockProducts: deadStock?.length || 0,
        sample: deadStock?.slice(0, 2).map((p: any) => ({ sku: p.sku, daysSinceMovement: p.days_since_last_movement }))
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

      const data = await backend.getZones({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const zones = data?.zones || []

      console.log('🗺️ [DB] Zones loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: zones?.length || 0,
        sample: zones?.slice(0, 3).map((z: any) => ({ id: z.id, name: z.name, type: z.type }))
      })

      return data
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

      const data = await backend.getSectors({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const sectors = data?.sectors || []

      console.log('🏗️ [DB] Sectors loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: sectors?.length || 0,
        sample: sectors?.slice(0, 3).map((s: any) => ({ id: s.id, zone: s.zone_name, type: s.type }))
      })

      return data
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
        kpis: kpis?.kpis || {},
        hasKpis: !!kpis?.kpis,
        stockEvolutionPoints: kpis?.stockEvolution?.length || 0,
        movementsByTypePoints: kpis?.movementsByType?.length || 0,
        topProductsCount: kpis?.topProducts?.length || 0,
        lowStockAlertsCount: kpis?.lowStockAlerts?.length || 0,
      })

      return kpis
    },
  })
}

/**
 * Fetch receptions for a warehouse
 * @param warehouseId - Warehouse ID
 * @returns Query result with receptions data
 */
export function useReceptions(warehouseId?: string) {
  const backend = useBackend()

  return useQuery({
    queryKey: ['receptions', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const data = await backend.getReceptions({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const receptions = data?.receptions || []

      console.log('📥 [DB] Receptions loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: receptions?.length || 0,
        sample: receptions?.slice(0, 2).map((r: any) => ({
          id: r.id,
          receptionNumber: r.receptionNumber,
          supplierName: r.supplierName,
          status: r.status
        }))
      })

      return data
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['pickings', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const data = await backend.getPickings({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const pickings = data?.pickings || []

      console.log('📦 [DB] Pickings loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: pickings?.length || 0,
        sample: pickings?.slice(0, 2).map((p: any) => ({
          id: p.id,
          pickingNumber: p.pickingNumber,
          customerName: p.customerName,
          status: p.status
        }))
      })

      return data
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['returns', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const data = await backend.getReturns({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const returns = data?.returns || []

      console.log('🔄 [DB] Returns loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: returns?.length || 0,
        sample: returns?.slice(0, 2).map((r: any) => ({
          id: r.id,
          returnNumber: r.returnNumber,
          customerName: r.customerName,
          status: r.status
        }))
      })

      return data
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['restockings', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const data = await backend.getRestockings({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const restockings = data?.restockings || []

      console.log('🔁 [DB] Restockings loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: restockings?.length || 0,
        sample: restockings?.slice(0, 2).map((r: any) => ({
          id: r.id,
          restockingNumber: r.restockingNumber,
          requester: r.requester,
          status: r.status
        }))
      })

      return data
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
  const backend = useBackend()

  return useQuery({
    queryKey: ['orders', 'with-lines', warehouseId],
    queryFn: async () => {
      const warehouses = await backend.getAllWarehouses()
      const firstWarehouse = warehouses[0] as any

      if (!firstWarehouse) {
        throw new Error('No warehouse found')
      }

      const data = await backend.getOrdersWithLines({
        warehouseId: warehouseId || firstWarehouse.id
      })

      const orders = data?.orders || []

      console.log('📋 [DB] Orders with lines loaded:', {
        warehouseId: warehouseId || firstWarehouse.id,
        count: orders?.length || 0,
        sample: orders?.slice(0, 2).map((o: any) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          status: o.status,
          linesCount: o.lines?.length || 0
        }))
      })

      return data
    },
    enabled: !!warehouseId,
  })
}

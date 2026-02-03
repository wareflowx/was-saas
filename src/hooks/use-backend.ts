/**
 * Backend IPC Hook
 * Provides access to backend services via Electron IPC
 */

import type { ABCAnalysisResult, DeadStockAnalysisResult } from '@/backend/analysis/types'
import type { ImportPlugin, ImportResult, ValidationResult } from '@/backend/import/types'
import type {
  DashboardData,
  ImportHistoryEntry,
  Warehouse,
  WarehousesData,
  LocationsData,
  ZonesData,
  SectorsData,
  ReceptionsData,
  PickingsData,
  ReturnsData,
  RestockingsData,
  OrdersData,
} from '@/types/entities'

// ============================================================================
// TYPES
// ============================================================================

type PluginInfo = {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly description: string
  readonly author: string
  readonly wmsSystem: string
  readonly supportedFormats: readonly string[]
}

type ImportValidationResult = {
  readonly valid: boolean
  readonly errors: readonly ValidationResult[]
}

type DatabaseStats = {
  readonly tables: number
  readonly sizeBytes: number
  readonly sizeMB: number
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Helper function to safely execute IPC calls with error handling
 */
async function safeIpcCall<T>(
  isElectron: boolean,
  call: () => Promise<T>,
  fallback: T,
  context: string
): Promise<T> {
  if (!isElectron) {
    return fallback
  }

  try {
    return await call()
  } catch (error) {
    console.error(`IPC call failed [${context}]:`, error)
    throw error
  }
}

/**
 * Access backend services through Electron IPC
 * Only works in Electron environment, returns mock functions in web
 */
export function useBackend() {
  const isElectron = typeof window !== 'undefined' && 'electronAPI' in window

  return {
    isElectron,

    // ==========================================================================
    // PLUGINS
    // ==========================================================================

    listPlugins: async (): Promise<readonly PluginInfo[]> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.listPlugins(),
        [],
        'listPlugins'
      )
    },

    getPlugin: async (pluginId: string): Promise<ImportPlugin | null> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getPlugin(pluginId),
        null,
        'getPlugin'
      )
    },

    // ==========================================================================
    // WAREHOUSE MANAGEMENT
    // ==========================================================================

    getAllWarehouses: async (): Promise<readonly Warehouse[]> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getWarehouses(),
        [],
        'getAllWarehouses'
      )
    },

    getWarehousesWithKPIs: async (): Promise<WarehousesData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getWarehousesWithKPIs(),
        { kpis: { totalWarehouses: 0, activeWarehouses: 0, totalSurface: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0, trackedPickers: 0 }, warehouses: [] },
        'getWarehousesWithKPIs'
      )
    },

    createWarehouse: async (warehouse: {
      id: string
      code: string
      name: string
      city: string
      country: string
      surface?: number
      capacity?: number
      manager?: string
      email?: string
      phone?: string
    }): Promise<Warehouse> => {
      const fallbackWarehouse: Warehouse = {
        ...warehouse,
        surface: warehouse.surface ?? 0,
        capacity: warehouse.capacity ?? 0,
        usedCapacity: 0,
        zoneCount: 0,
        pickerCount: 0,
        manager: warehouse.manager ?? '',
        email: warehouse.email ?? '',
        phone: warehouse.phone ?? '',
        status: 'active',
        openingDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }

      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.createWarehouse(warehouse),
        fallbackWarehouse,
        'createWarehouse'
      )
    },

    // ==========================================================================
    // IMPORT WORKFLOW
    // ==========================================================================

    validateFile: async (
      filePath: string,
      pluginId: string
    ): Promise<ImportValidationResult> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.validateFile(filePath, pluginId),
        { valid: false, errors: [] },
        'validateFile'
      )
    },

    executeImport: async (
      filePath: string,
      warehouseId: string,
      pluginId: string,
      onProgress?: (progress: number, message: string) => void
    ): Promise<ImportResult> => {
      const fallbackResult: ImportResult = {
        status: 'success',
        warehouseId,
        pluginId: pluginId,
        stats: {
          rowsProcessed: 415,
          productsImported: 50,
          inventoryImported: 100,
          movementsImported: 200,
          zonesImported: 5,
          sectorsImported: 10,
          locationsImported: 50,
        },
        duration: 1000,
        errors: [],
        warnings: [],
      }

      if (!isElectron) {
        onProgress?.(100, 'Import completed (web mode)')
        return fallbackResult
      }

      try {
        return await (window as any).electronAPI.executeImport(
          filePath,
          warehouseId,
          pluginId,
          onProgress
        )
      } catch (error) {
        console.error('IPC call failed [executeImport]:', error)
        throw error
      }
    },

    // ==========================================================================
    // MOCK DATA GENERATION
    // ==========================================================================

    generateMockData: async (
      warehouseId: string,
      onProgress?: (progress: number, message: string) => void
    ): Promise<ImportResult> => {
      const fallbackResult: ImportResult = {
        status: 'success',
        warehouseId,
        pluginId: 'mock-data-generator',
        stats: {
          rowsProcessed: 415,
          productsImported: 50,
          inventoryImported: 100,
          movementsImported: 200,
          zonesImported: 5,
          sectorsImported: 10,
          locationsImported: 50,
        },
        duration: 1000,
        errors: [],
        warnings: [],
      }

      if (!isElectron) {
        onProgress?.(100, 'Mock data generated (web mode)')
        return fallbackResult
      }

      try {
        return await (window as any).electronAPI.generateMockData(
          warehouseId,
          onProgress
        )
      } catch (error) {
        console.error('IPC call failed [generateMockData]:', error)
        throw error
      }
    },

    getLocations: async (filters: {
      warehouseId: string
    }): Promise<LocationsData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getLocations(filters),
        {
          kpis: { totalLocations: 0, availableLocations: 0, occupiedLocations: 0, blockedLocations: 0, reservedLocations: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0 },
          locations: []
        },
        'getLocations'
      )
    },

    getZones: async (filters: {
      warehouseId: string
    }): Promise<ZonesData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getZones(filters),
        {
          kpis: { totalZones: 0, activeZones: 0, totalSurface: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0, zoneTypes: { storage: 0, receiving: 0, shipping: 0, picking: 0, packing: 0, cold_storage: 0, hazardous: 0 } },
          zones: []
        },
        'getZones'
      )
    },

    getSectors: async (filters: {
      warehouseId: string
    }): Promise<SectorsData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getSectors(filters),
        {
          kpis: { totalSectors: 0, activeSectors: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0, sectorTypes: { rack: 0, shelf: 0, floor: 0, bin: 0, mezzanine: 0 } },
          sectors: []
        },
        'getSectors'
      )
    },

    // ==========================================================================
    // ANALYTICS
    // ==========================================================================

    runABCAnalysis: async (
      params: {
        warehouseId: string
        dateFrom?: string
        dateTo?: string
      }
    ): Promise<ABCAnalysisResult> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.runABCAnalysis(params),
        {
          products: [],
          summary: {
            totalProducts: 0,
            classA: { count: 0, contribution: 0 },
            classB: { count: 0, contribution: 0 },
            classC: { count: 0, contribution: 0 },
          },
          totalQuantity: 0,
          analysisDate: new Date(),
          parameters: { warehouseId: params.warehouseId, dateFrom: params.dateFrom, dateTo: params.dateTo },
        },
        'runABCAnalysis'
      )
    },

    runDeadStockAnalysis: async (
      params: {
        warehouseId: string
        thresholdDays?: number
        criticalThreshold?: number
        warningThreshold?: number
      }
    ): Promise<DeadStockAnalysisResult> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.runDeadStockAnalysis(params),
        {
          products: [],
          summary: {
            totalProducts: 0,
            deadStockProducts: 0,
            totalTiedCapital: 0,
            criticalLevel: { count: 0, tiedCapital: 0 },
            warningLevel: { count: 0, tiedCapital: 0 },
            monitorLevel: { count: 0, tiedCapital: 0 },
          },
          analysisDate: new Date(),
          parameters: {
            warehouseId: params.warehouseId,
            thresholdDays: params.thresholdDays || 90,
            criticalThreshold: params.criticalThreshold || 180,
            warningThreshold: params.warningThreshold || 90,
          },
        },
        'runDeadStockAnalysis'
      )
    },

    // ==========================================================================
    // DATABASE
    // ==========================================================================

    getDatabaseStats: async (): Promise<DatabaseStats> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getDatabaseStats(),
        { tables: 0, sizeBytes: 0, sizeMB: 0 },
        'getDatabaseStats'
      )
    },

    getImportHistory: async (warehouseId?: string): Promise<readonly ImportHistoryEntry[]> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getImportHistory(warehouseId),
        [],
        'getImportHistory'
      )
    },

    getDashboardKPIs: async (warehouseId?: string): Promise<DashboardData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getDashboardKPIs(warehouseId),
        {
          kpis: {
            totalProducts: 0,
            totalLocations: 0,
            lowStockItems: 0,
            activeOrders: 0,
            movementsThisWeek: 0,
          },
          stockEvolution: [],
          movementsByType: [],
          topProducts: [],
          lowStockAlerts: [],
          recentMovements: [],
        },
        'getDashboardKPIs'
      )
    },

    // ==========================================================================
    // OPERATIONS - RECEPTIONS
    // ==========================================================================

    getReceptions: async (filters: { warehouseId: string }): Promise<ReceptionsData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getReceptions(filters),
        {
          kpis: {
            totalReceptions: 0,
            pendingReceptions: 0,
            inProgressReceptions: 0,
            completedReceptions: 0,
            totalQuantity: 0,
            receivedQuantity: 0,
            pendingQuantity: 0,
          },
          receptions: [],
        },
        'getReceptions'
      )
    },

    // ==========================================================================
    // OPERATIONS - PICKINGS
    // ==========================================================================

    getPickings: async (filters: { warehouseId: string }): Promise<PickingsData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getPickings(filters),
        {
          kpis: {
            totalPickings: 0,
            pendingPickings: 0,
            inProgressPickings: 0,
            completedPickings: 0,
            totalLines: 0,
            pickedLines: 0,
            completionRate: 0,
          },
          pickings: [],
        },
        'getPickings'
      )
    },

    // ==========================================================================
    // OPERATIONS - RETURNS
    // ==========================================================================

    getReturns: async (filters: { warehouseId: string }): Promise<ReturnsData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getReturns(filters),
        {
          kpis: {
            totalReturns: 0,
            pendingReturns: 0,
            inProgressReturns: 0,
            completedReturns: 0,
            totalQuantity: 0,
            returnedQuantity: 0,
            pendingQuantity: 0,
            totalValue: 0,
            refundedValue: 0,
          },
          returns: [],
        },
        'getReturns'
      )
    },

    // ==========================================================================
    // OPERATIONS - RESTOCKINGS
    // ==========================================================================

    getRestockings: async (filters: { warehouseId: string }): Promise<RestockingsData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getRestockings(filters),
        {
          kpis: {
            totalRestockings: 0,
            pendingRestockings: 0,
            inProgressRestockings: 0,
            completedRestockings: 0,
            totalProducts: 0,
            restockedProducts: 0,
            pendingProducts: 0,
          },
          restockings: [],
        },
        'getRestockings'
      )
    },

    // ==========================================================================
    // OPERATIONS - ORDERS WITH LINES
    // ==========================================================================

    getOrdersWithLines: async (filters: { warehouseId: string }): Promise<OrdersData> => {
      return safeIpcCall(
        isElectron,
        () => (window as any).electronAPI.getOrdersWithLines(filters),
        {
          kpis: {
            totalOrders: 0,
            pendingOrders: 0,
            inProgressOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
            totalValue: 0,
            averageOrderValue: 0,
          },
          orders: [],
        },
        'getOrdersWithLines'
      )
    },
  }
}

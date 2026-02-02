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
        stats: {
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
        stats: {
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
          summary: { totalProducts: 0, A: 0, B: 0, C: 0 },
        } as ABCAnalysisResult,
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
          summary: { totalProducts: 0, critical: 0, warning: 0, healthy: 0 },
        } as DeadStockAnalysisResult,
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
  }
}

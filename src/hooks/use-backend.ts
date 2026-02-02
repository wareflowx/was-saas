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
      if (!isElectron) return []
      return await (window as any).electronAPI.listPlugins()
    },

    getPlugin: async (pluginId: string): Promise<ImportPlugin | null> => {
      if (!isElectron) return null
      return await (window as any).electronAPI.getPlugin(pluginId)
    },

    // ==========================================================================
    // WAREHOUSE MANAGEMENT
    // ==========================================================================

    getAllWarehouses: async (): Promise<readonly Warehouse[]> => {
      if (!isElectron) return []
      return await (window as any).electronAPI.getWarehouses()
    },

    getWarehousesWithKPIs: async (): Promise<WarehousesData> => {
      if (!isElectron) {
        return { kpis: { totalWarehouses: 0, activeWarehouses: 0, totalSurface: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0, trackedPickers: 0 }, warehouses: [] }
      }
      return await (window as any).electronAPI.getWarehousesWithKPIs()
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
      if (!isElectron) {
        console.warn('createWarehouse: Not in Electron environment, returning mock')
        return {
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
      }
      return await (window as any).electronAPI.createWarehouse(warehouse)
    },

    // ==========================================================================
    // IMPORT WORKFLOW
    // ==========================================================================

    validateFile: async (
      filePath: string,
      pluginId: string
    ): Promise<ImportValidationResult> => {
      if (!isElectron) return { valid: false, errors: [] }
      return await (window as any).electronAPI.validateFile(filePath, pluginId)
    },

    executeImport: async (
      filePath: string,
      warehouseId: string,
      pluginId: string,
      onProgress?: (progress: number, message: string) => void
    ): Promise<ImportResult> => {
      if (!isElectron) {
        console.warn('executeImport: Not in Electron environment, returning mock')
        onProgress?.(100, 'Import completed (web mode)')
        return {
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
      }
      return await (window as any).electronAPI.executeImport(
        filePath,
        warehouseId,
        pluginId,
        onProgress
      )
    },

    // ==========================================================================
    // MOCK DATA GENERATION
    // ==========================================================================

    generateMockData: async (
      warehouseId: string,
      onProgress?: (progress: number, message: string) => void
    ): Promise<ImportResult> => {
      if (!isElectron) {
        console.warn('generateMockData: Not in Electron environment, returning mock')
        onProgress?.(100, 'Mock data generated (web mode)')
        return {
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
      }

      // Generate mock data using dedicated endpoint
      return await (window as any).electronAPI.generateMockData(
        warehouseId,
        onProgress
      )
    },

    getLocations: async (filters: {
      warehouseId: string
    }): Promise<LocationsData> => {
      if (!isElectron) {
        return {
          kpis: { totalLocations: 0, availableLocations: 0, occupiedLocations: 0, blockedLocations: 0, reservedLocations: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0 },
          locations: []
        }
      }
      return await (window as any).electronAPI.getLocations(filters)
    },

    getZones: async (filters: {
      warehouseId: string
    }): Promise<ZonesData> => {
      if (!isElectron) {
        return {
          kpis: { totalZones: 0, activeZones: 0, totalSurface: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0, zoneTypes: { storage: 0, receiving: 0, shipping: 0, picking: 0, packing: 0, cold_storage: 0, hazardous: 0 } },
          zones: []
        }
      }
      return await (window as any).electronAPI.getZones(filters)
    },

    getSectors: async (filters: {
      warehouseId: string
    }): Promise<SectorsData> => {
      if (!isElectron) {
        return {
          kpis: { totalSectors: 0, activeSectors: 0, totalCapacity: 0, usedCapacity: 0, averageOccupancy: 0, sectorTypes: { rack: 0, shelf: 0, floor: 0, bin: 0, mezzanine: 0 } },
          sectors: []
        }
      }
      return await (window as any).electronAPI.getSectors(filters)
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
      if (!isElectron) {
        return {
          products: [],
          summary: { totalProducts: 0, A: 0, B: 0, C: 0 },
        } as ABCAnalysisResult
      }
      return await (window as any).electronAPI.runABCAnalysis(params)
    },

    runDeadStockAnalysis: async (
      params: {
        warehouseId: string
        thresholdDays?: number
        criticalThreshold?: number
        warningThreshold?: number
      }
    ): Promise<DeadStockAnalysisResult> => {
      if (!isElectron) {
        return {
          products: [],
          summary: { totalProducts: 0, critical: 0, warning: 0, healthy: 0 },
        } as DeadStockAnalysisResult
      }
      return await (window as any).electronAPI.runDeadStockAnalysis(params)
    },

    // ==========================================================================
    // DATABASE
    // ==========================================================================

    getDatabaseStats: async (): Promise<DatabaseStats> => {
      if (!isElectron) {
        return { tables: 0, sizeBytes: 0, sizeMB: 0 }
      }
      return await (window as any).electronAPI.getDatabaseStats()
    },

    getImportHistory: async (warehouseId?: string): Promise<readonly ImportHistoryEntry[]> => {
      if (!isElectron) {
        return []
      }
      return await (window as any).electronAPI.getImportHistory(warehouseId)
    },

    getDashboardKPIs: async (warehouseId?: string): Promise<DashboardData> => {
      if (!isElectron) {
        return {
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
        }
      }
      return await (window as any).electronAPI.getDashboardKPIs(warehouseId)
    },
  }
}

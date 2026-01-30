/**
 * Backend IPC Hook
 * Provides access to backend services via Electron IPC
 */

import type { ABCAnalysisResult, DeadStockAnalysisResult } from '@/backend/analysis/types'
import type { ImportPlugin, ImportResult, ValidationResult } from '@/backend/import/types'

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

    getAllWarehouses: async (): Promise<readonly unknown[]> => {
      if (!isElectron) return []
      return await (window as any).electronAPI.getWarehouses()
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
    }): Promise<unknown> => {
      if (!isElectron) throw new Error('Not in Electron environment')
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
        throw new Error('Not in Electron environment')
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
        throw new Error('Not in Electron environment')
      }

      // Generate mock data using dedicated endpoint
      return await (window as any).electronAPI.generateMockData(
        warehouseId,
        onProgress
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
      if (!isElectron) {
        throw new Error('Not in Electron environment')
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
        throw new Error('Not in Electron environment')
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
  }
}

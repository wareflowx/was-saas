/**
 * Analysis Service
 *
 * Provides high-level analysis functions for warehouse data.
 * These are the main entry points for all analyses.
 */

import { runABCAnalysis } from '../analysis/abc-analysis'
import { runDeadStockAnalysis } from '../analysis/dead-stock-analysis'
import type { ABCAnalysisResult, DeadStockAnalysisResult } from '../analysis/types'

// ============================================================================
// ABC ANALYSIS
// ============================================================================

/**
 * Run ABC Analysis on warehouse movements
 * @param warehouseId - Warehouse ID
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns ABC analysis result
 */
export const performABCAnalysis = (
  warehouseId: string,
  dateFrom?: string,
  dateTo?: string
): ABCAnalysisResult => {
  return runABCAnalysis(warehouseId, dateFrom, dateTo)
}

// ============================================================================
// DEAD STOCK ANALYSIS
// ============================================================================

/**
 * Run Dead Stock Analysis on warehouse inventory
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for dead stock (default: 90)
 * @param criticalThreshold - Days for critical level (default: 180)
 * @param warningThreshold - Days for warning level (default: 90)
 * @returns Dead stock analysis result
 */
export const performDeadStockAnalysis = (
  warehouseId: string,
  thresholdDays: number = 90,
  criticalThreshold: number = 180,
  warningThreshold: number = 90
): DeadStockAnalysisResult => {
  return runDeadStockAnalysis(warehouseId, thresholdDays, criticalThreshold, warningThreshold)
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  ABCAnalysisResult,
  ABCProduct,
  ABCClass,
  DeadStockAnalysisResult,
  DeadStockProduct,
  DeadStockLevel,
} from '../analysis/types'

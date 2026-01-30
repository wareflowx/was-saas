/**
 * Analysis Service
 *
 * Provides high-level analysis functions for warehouse data.
 * These are the main entry points for all analyses.
 */
import type { ABCAnalysisResult, DeadStockAnalysisResult } from '../analysis/types';
/**
 * Run ABC Analysis on warehouse movements
 * @param warehouseId - Warehouse ID
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns ABC analysis result
 */
export declare const performABCAnalysis: (warehouseId: string, dateFrom?: string, dateTo?: string) => ABCAnalysisResult;
/**
 * Run Dead Stock Analysis on warehouse inventory
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for dead stock (default: 90)
 * @param criticalThreshold - Days for critical level (default: 180)
 * @param warningThreshold - Days for warning level (default: 90)
 * @returns Dead stock analysis result
 */
export declare const performDeadStockAnalysis: (warehouseId: string, thresholdDays?: number, criticalThreshold?: number, warningThreshold?: number) => DeadStockAnalysisResult;
export type { ABCAnalysisResult, ABCProduct, ABCClass, DeadStockAnalysisResult, DeadStockProduct, DeadStockLevel, } from '../analysis/types';

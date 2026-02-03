import type { DeadStockAnalysisResult } from './types';
/**
 * Run Dead Stock Analysis on warehouse inventory
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for dead stock classification (default: 90)
 * @param criticalThreshold - Days for critical level (default: 180)
 * @param warningThreshold - Days for warning level (default: 90)
 * @returns Dead stock analysis result
 */
export declare const runDeadStockAnalysis: (warehouseId: string, thresholdDays?: number, criticalThreshold?: number, warningThreshold?: number) => DeadStockAnalysisResult;
export type { DeadStockAnalysisResult, DeadStockProduct, DeadStockLevel } from './types';

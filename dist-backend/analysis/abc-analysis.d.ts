import type { ABCAnalysisResult } from './types';
/**
 * Run ABC Analysis on warehouse movements
 * @param warehouseId - Warehouse ID
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns ABC analysis result
 */
export declare const runABCAnalysis: (warehouseId: string, dateFrom?: string, dateTo?: string) => ABCAnalysisResult;
export type { ABCAnalysisResult, ABCProduct, ABCClass } from './types';
//# sourceMappingURL=abc-analysis.d.ts.map
"use strict";
/**
 * Analysis Service
 *
 * Provides high-level analysis functions for warehouse data.
 * These are the main entry points for all analyses.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.performDeadStockAnalysis = exports.performABCAnalysis = void 0;
const abc_analysis_1 = require("../analysis/abc-analysis");
const dead_stock_analysis_1 = require("../analysis/dead-stock-analysis");
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
const performABCAnalysis = (warehouseId, dateFrom, dateTo) => {
    return (0, abc_analysis_1.runABCAnalysis)(warehouseId, dateFrom, dateTo);
};
exports.performABCAnalysis = performABCAnalysis;
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
const performDeadStockAnalysis = (warehouseId, thresholdDays = 90, criticalThreshold = 180, warningThreshold = 90) => {
    return (0, dead_stock_analysis_1.runDeadStockAnalysis)(warehouseId, thresholdDays, criticalThreshold, warningThreshold);
};
exports.performDeadStockAnalysis = performDeadStockAnalysis;

"use strict";
/**
 * Analysis module
 *
 * Provides various warehouse analysis functions:
 * - ABC Analysis: Pareto classification for inventory management
 * - Dead Stock Analysis: Identify non-moving inventory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDeadStockAnalysis = exports.runABCAnalysis = void 0;
var abc_analysis_1 = require('./abc-analysis.cjs');
Object.defineProperty(exports, "runABCAnalysis", { enumerable: true, get: function () { return abc_analysis_1.runABCAnalysis; } });
var dead_stock_analysis_1 = require('./dead-stock-analysis.cjs');
Object.defineProperty(exports, "runDeadStockAnalysis", { enumerable: true, get: function () { return dead_stock_analysis_1.runDeadStockAnalysis; } });

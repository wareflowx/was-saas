"use strict";
/**
 * IPC Handlers - Main Process
 *
 * Type-safe IPC handlers using the contract definitions.
 * All handlers validate input/output and return Result<T, AppError>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIpcHandlers = void 0;
const electron_1 = require("electron");
const types_1 = require("../../../shared/types");
const entities_1 = require("../../../shared/schemas/entities");
const queries_1 = require("../../database/queries");
const abc_analysis_1 = require("../../analysis/abc-analysis");
const dead_stock_analysis_1 = require("../../analysis/dead-stock-analysis");
/**
 * Register all IPC handlers
 */
const registerIpcHandlers = () => {
    // Warehouses
    electron_1.ipcMain.handle('warehouses:getAll', handleWarehousesGetAll);
    electron_1.ipcMain.handle('warehouses:getWithKPIs', handleWarehousesGetWithKPIs);
    // Locations
    electron_1.ipcMain.handle('locations:getAll', handleLocationsGetAll);
    // Zones
    electron_1.ipcMain.handle('zones:getAll', handleZonesGetAll);
    // Sectors
    electron_1.ipcMain.handle('sectors:getAll', handleSectorsGetAll);
    // Products
    electron_1.ipcMain.handle('products:getAll', handleProductsGetAll);
    // Dashboard
    electron_1.ipcMain.handle('dashboard:getKPIs', handleDashboardGetKPIs);
    // Import
    electron_1.ipcMain.handle('importHistory:getAll', handleImportHistoryGetAll);
    // Operations - Receptions
    electron_1.ipcMain.handle('receptions:getAll', handleReceptionsGetAll);
    // Operations - Pickings
    electron_1.ipcMain.handle('pickings:getAll', handlePickingsGetAll);
    // Operations - Returns
    electron_1.ipcMain.handle('returns:getAll', handleReturnsGetAll);
    // Operations - Restockings
    electron_1.ipcMain.handle('restockings:getAll', handleRestockingsGetAll);
    // Operations - Orders
    electron_1.ipcMain.handle('orders:getWithLines', handleOrdersGetWithLines);
    // Analysis
    electron_1.ipcMain.handle('analysis:abc', handleAnalysisABC);
    electron_1.ipcMain.handle('analysis:deadStock', handleAnalysisDeadStock);
};
exports.registerIpcHandlers = registerIpcHandlers;
/**
 * Warehouses handlers
 */
const handleWarehousesGetAll = async () => {
    try {
        const result = await getAllWarehouses();
        if (!result.success) {
            return result;
        }
        if (!result.data || result.data.length === 0) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch warehouses',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.warehousesDataSchema.safeParse(result.data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('WarehousesData', result.data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('warehouses:getAll', error));
    }
};
/**
 * Locations handlers
 */
const handleLocationsGetAll = async (_event, input) => {
    try {
        const data = await (0, queries_1.getLocationsByWarehouse)(input?.warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch locations',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.locationsDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('LocationsData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('locations:getAll', error));
    }
};
/**
 * Zones handlers
 */
const handleZonesGetAll = async (_event, input) => {
    try {
        const data = await (0, queries_1.getZonesByWarehouse)(input?.warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch zones',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.zonesDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('ZonesData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('zones:getAll', error));
    }
};
/**
 * Sectors handlers
 */
const handleSectorsGetAll = async (_event, input) => {
    try {
        const data = await (0, queries_1.getSectorsByWarehouse)(input?.warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch sectors',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.sectorsDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('SectorsData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('sectors:getAll', error));
    }
};
/**
 * Warehouses with KPIs handler
 */
const handleWarehousesGetWithKPIs = async () => {
    try {
        const data = await (0, queries_1.getWarehousesWithKPIs)();
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch warehouses with KPIs',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.warehousesDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('WarehousesData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('warehouses:getWithKPIs', error));
    }
};
/**
 * Products handler
 */
const handleProductsGetAll = async (_event, input) => {
    try {
        const { warehouseId } = input;
        if (!warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const products = await (0, queries_1.getProductsByWarehouse)(warehouseId);
        if (!products) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch products',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Build response with KPIs
        const responseData = {
            kpis: {
                totalProducts: products.length,
                inStock: products.filter((p) => p.currentQuantity && p.currentQuantity > 0).length,
                lowStock: products.filter((p) => p.minStock && p.currentQuantity && p.currentQuantity < p.minStock).length,
                outOfStock: products.filter((p) => !p.currentQuantity || p.currentQuantity === 0).length,
                totalQuantity: products.reduce((sum, p) => sum + (p.currentQuantity || 0), 0),
                totalValue: 0,
                categories: new Set(products.map((p) => p.category)).size,
            },
            products,
        };
        // Validate with Zod schema
        const validation = entities_1.productsDataSchema.safeParse(responseData);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('ProductsData', responseData, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('products:getAll', error));
    }
};
/**
 * Dashboard KPIs handler
 */
const handleDashboardGetKPIs = async (_event, input) => {
    try {
        const { warehouseId } = input;
        const data = await (0, queries_1.getDashboardKPIs)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch dashboard KPIs',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.dashboardDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('DashboardData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('dashboard:getKPIs', error));
    }
};
/**
 * Import history handler
 */
const handleImportHistoryGetAll = async (_event, input) => {
    try {
        const { warehouseId } = input;
        const data = await (0, queries_1.getImportHistory)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch import history',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.importHistoryEntrySchema.array().safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('ImportHistoryEntry', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('importHistory:getAll', error));
    }
};
/**
 * Receptions handler
 */
const handleReceptionsGetAll = async (_event, input) => {
    try {
        const { warehouseId } = input;
        if (!warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, queries_1.getReceptionsByWarehouse)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch receptions',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.receptionsDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('ReceptionsData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('receptions:getAll', error));
    }
};
/**
 * Pickings handler
 */
const handlePickingsGetAll = async (_event, input) => {
    try {
        const { warehouseId } = input;
        if (!warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, queries_1.getPickingsByWarehouse)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch pickings',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.pickingsDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('PickingsData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('pickings:getAll', error));
    }
};
/**
 * Returns handler
 */
const handleReturnsGetAll = async (_event, input) => {
    try {
        const { warehouseId } = input;
        if (!warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, queries_1.getReturnsByWarehouse)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch returns',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.returnsDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('ReturnsData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('returns:getAll', error));
    }
};
/**
 * Restockings handler
 */
const handleRestockingsGetAll = async (_event, input) => {
    try {
        const { warehouseId } = input;
        if (!warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, queries_1.getRestockingsByWarehouse)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch restockings',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.restockingsDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('RestockingsData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('restockings:getAll', error));
    }
};
/**
 * Orders with lines handler
 */
const handleOrdersGetWithLines = async (_event, input) => {
    try {
        const { warehouseId } = input;
        if (!warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, queries_1.getOrdersByWarehouseWithLines)(warehouseId);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'DATABASE',
                code: 'QUERY_FAILED',
                message: 'Failed to fetch orders',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.ordersDataSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('OrdersData', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('orders:getWithLines', error));
    }
};
/**
 * ABC Analysis handler
 */
const handleAnalysisABC = async (_event, input) => {
    try {
        const params = input;
        if (!params.warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, abc_analysis_1.runABCAnalysis)(params);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'BUSINESS',
                code: 'ANALYSIS_FAILED',
                message: 'ABC analysis failed',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.abcAnalysisResultSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('ABCAnalysisResult', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('analysis:abc', error));
    }
};
/**
 * Dead Stock Analysis handler
 */
const handleAnalysisDeadStock = async (_event, input) => {
    try {
        const params = input;
        if (!params.warehouseId) {
            return (0, types_1.failure)({
                domain: 'VALIDATION',
                code: 'MISSING_PARAMETER',
                message: 'warehouseId is required',
                timestamp: new Date(),
                recoverable: false,
            });
        }
        const data = await (0, dead_stock_analysis_1.runDeadStockAnalysis)(params.warehouseId, params.thresholdDays);
        if (!data) {
            return (0, types_1.failure)({
                domain: 'BUSINESS',
                code: 'ANALYSIS_FAILED',
                message: 'Dead stock analysis failed',
                timestamp: new Date(),
                recoverable: true,
            });
        }
        // Validate with Zod schema
        const validation = entities_1.deadStockAnalysisResultSchema.safeParse(data);
        if (!validation.success) {
            return (0, types_1.failure)((0, types_1.validationError)('DeadStockAnalysisResult', data, validation.error.errors.map(e => e.message).join(', ')));
        }
        return (0, types_1.success)(validation.data);
    }
    catch (error) {
        return (0, types_1.failure)((0, types_1.ipcError)('analysis:deadStock', error));
    }
};

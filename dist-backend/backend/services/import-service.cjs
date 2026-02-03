"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockData = exports.executeImport = exports.validateImportFile = void 0;
const fs = __importStar(require("fs"));
const parser_1 = require('../import/parser.cjs');
/**
 * Validate file with selected plugin
 * @param filePath - Path to Excel file
 * @param plugin - Import plugin to use
 * @returns Validation result
 */
const validateImportFile = async (filePath, plugin) => {
    const errors = [];
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        errors.push({
            severity: 'error',
            message: 'File not found',
            suggestion: 'Please check the file path',
            canContinue: false,
        });
        return { valid: errors.length === 0, errors };
    }
    // Check file format
    if (!(0, parser_1.isValidExcelFile)(filePath)) {
        errors.push({
            severity: 'error',
            message: 'Invalid file format',
            suggestion: 'Please provide an Excel file (.xlsx, .xls, .csv)',
            canContinue: false,
        });
        return { valid: errors.length === 0, errors };
    }
    // Parse file
    let inputData;
    try {
        inputData = await (0, parser_1.parseExcelFile)(filePath);
    }
    catch (error) {
        errors.push({
            severity: 'error',
            message: `Failed to parse Excel file: ${error}`,
            suggestion: 'Ensure the file is a valid Excel file',
            canContinue: false,
        });
        return { valid: errors.length === 0, errors };
    }
    // Validate with plugin
    const pluginErrors = plugin.validate(inputData);
    errors.push(...pluginErrors);
    return {
        valid: errors.filter(e => e.severity === 'error').length === 0,
        errors,
    };
};
exports.validateImportFile = validateImportFile;
/**
 * Execute complete import workflow
 * @param filePath - Path to Excel file
 * @param warehouseId - Target warehouse ID
 * @param plugin - Import plugin to use
 * @param onProgress - Optional progress callback
 * @returns Import result
 */
const executeImport = async (filePath, warehouseId, plugin, onProgress) => {
    const startTime = Date.now();
    let totalRows = 0;
    const warnings = [];
    try {
        // Step 1: Parse file
        onProgress?.(10, 'Parsing Excel file...');
        const inputData = await (0, parser_1.parseExcelFile)(filePath);
        totalRows = Object.values(inputData.sheets).reduce((sum, sheet) => sum + sheet.rows.length, 0);
        onProgress?.(20, 'Transforming data...');
        // Step 2: Transform data
        const context = {
            warehouseId,
            pluginId: plugin.id,
            onProgress: (progress, message) => {
                onProgress?.(20 + progress * 0.6, message);
            },
        };
        const normalizedData = plugin.transform(inputData, context);
        onProgress?.(80, 'Loading data into database...');
        // Import loader function
        const { loadToDatabase } = await Promise.resolve().then(() => __importStar(require('../import/loader.cjs')));
        // Step 3: Load to database
        const stats = loadToDatabase(normalizedData);
        onProgress?.(100, 'Import completed!');
        const duration = Date.now() - startTime;
        return {
            status: 'success',
            warehouseId,
            pluginId: plugin.id,
            stats: {
                rowsProcessed: totalRows,
                productsImported: stats.productsImported,
                inventoryImported: stats.inventoryImported,
                movementsImported: stats.movementsImported,
                zonesImported: stats.zonesImported,
                sectorsImported: stats.sectorsImported,
                locationsImported: stats.locationsImported,
            },
            duration,
            errors: [],
            warnings,
        };
    }
    catch (error) {
        const duration = Date.now() - startTime;
        return {
            status: 'failed',
            warehouseId,
            pluginId: plugin.id,
            stats: {
                rowsProcessed: totalRows,
                productsImported: 0,
                inventoryImported: 0,
                movementsImported: 0,
                zonesImported: 0,
                sectorsImported: 0,
                locationsImported: 0,
            },
            duration,
            errors: [
                {
                    severity: 'error',
                    message: `Import failed: ${error}`,
                    suggestion: 'Check the error details and try again',
                    canContinue: false,
                },
            ],
            warnings,
        };
    }
};
exports.executeImport = executeImport;
/**
 * Generate mock data for testing
 * @param warehouseId - Target warehouse ID
 * @param plugin - Mock data generator plugin
 * @returns Import result
 */
const generateMockData = async (warehouseId, plugin) => {
    const startTime = Date.now();
    const warnings = [];
    console.log('🎲 [MOCK DATA] Starting generation for warehouse:', warehouseId);
    try {
        // Step 1: Generate mock data
        console.log('🎲 [MOCK DATA] Generating mock data...');
        const context = {
            warehouseId,
            pluginId: plugin.id,
            onProgress: undefined, // No progress callback in IPC mode
        };
        // Mock data generator doesn't need input data, provide empty WMSInputData
        const emptyInput = {
            sheets: {},
            metadata: {
                filename: 'mock-data',
                fileSize: 0,
                uploadedAt: new Date(),
            },
        };
        const normalizedData = plugin.transform(emptyInput, context);
        console.log('📦 [MOCK DATA] Data transformed:', {
            warehouses: normalizedData.warehouses?.length || 0,
            users: normalizedData.users?.length || 0,
            suppliers: normalizedData.suppliers?.length || 0,
            customers: normalizedData.customers?.length || 0,
            products: normalizedData.products?.length || 0,
            inventory: normalizedData.inventory?.length || 0,
            movements: normalizedData.movements?.length || 0,
            zones: normalizedData.zones?.length || 0,
            sectors: normalizedData.sectors?.length || 0,
            locations: normalizedData.locations?.length || 0,
            purchaseOrders: normalizedData.purchaseOrders?.length || 0,
            receptions: normalizedData.receptions?.length || 0,
            orders: normalizedData.orders?.length || 0,
            pickings: normalizedData.pickings?.length || 0,
            shipments: normalizedData.shipments?.length || 0,
            returns: normalizedData.returns?.length || 0,
            restockings: normalizedData.restockings?.length || 0,
        });
        console.log('🎲 [MOCK DATA] Loading data into database...');
        // Import loader function
        const { loadToDatabase } = await Promise.resolve().then(() => __importStar(require('../import/loader.cjs')));
        // Step 2: Load to database
        const stats = loadToDatabase(normalizedData);
        console.log('💾 [MOCK DATA] Data loaded to database:', {
            warehousesImported: stats.warehousesImported || 0,
            usersImported: stats.usersImported || 0,
            suppliersImported: stats.suppliersImported || 0,
            customersImported: stats.customersImported || 0,
            productsImported: stats.productsImported || 0,
            inventoryImported: stats.inventoryImported || 0,
            movementsImported: stats.movementsImported || 0,
            zonesImported: stats.zonesImported || 0,
            sectorsImported: stats.sectorsImported || 0,
            locationsImported: stats.locationsImported || 0,
            purchaseOrdersImported: stats.purchaseOrdersImported || 0,
            receptionsImported: stats.receptionsImported || 0,
            ordersImported: stats.ordersImported || 0,
            pickingsImported: stats.pickingsImported || 0,
            returnsImported: stats.returnsImported || 0,
            restockingsImported: stats.restockingsImported || 0,
            shipmentsImported: stats.shipmentsImported || 0,
        });
        const duration = Date.now() - startTime;
        console.log('✅ [MOCK DATA] Generation completed in', duration, 'ms');
        return {
            status: 'success',
            warehouseId,
            pluginId: plugin.id,
            stats: {
                rowsProcessed: 0, // Not applicable for mock data
                productsImported: stats.productsImported,
                inventoryImported: stats.inventoryImported,
                movementsImported: stats.movementsImported,
                zonesImported: stats.zonesImported,
                sectorsImported: stats.sectorsImported,
                locationsImported: stats.locationsImported,
            },
            duration,
            errors: [],
            warnings,
        };
    }
    catch (error) {
        const duration = Date.now() - startTime;
        console.error('❌ [MOCK DATA] Generation failed:', error);
        return {
            status: 'failed',
            warehouseId,
            pluginId: plugin.id,
            stats: {
                rowsProcessed: 0,
                productsImported: 0,
                inventoryImported: 0,
                movementsImported: 0,
                zonesImported: 0,
                sectorsImported: 0,
                locationsImported: 0,
            },
            duration,
            errors: [
                {
                    severity: 'error',
                    message: `Mock data generation failed: ${error}`,
                    suggestion: 'Check the error details and try again',
                    canContinue: false,
                },
            ],
            warnings,
        };
    }
};
exports.generateMockData = generateMockData;

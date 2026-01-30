import * as fs from 'fs';
import { parseExcelFile, isValidExcelFile } from '../import/parser';
/**
 * Validate file with selected plugin
 * @param filePath - Path to Excel file
 * @param plugin - Import plugin to use
 * @returns Validation result
 */
export const validateImportFile = async (filePath, plugin) => {
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
    if (!isValidExcelFile(filePath)) {
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
        inputData = await parseExcelFile(filePath);
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
/**
 * Execute complete import workflow
 * @param filePath - Path to Excel file
 * @param warehouseId - Target warehouse ID
 * @param plugin - Import plugin to use
 * @param onProgress - Optional progress callback
 * @returns Import result
 */
export const executeImport = async (filePath, warehouseId, plugin, onProgress) => {
    const startTime = Date.now();
    let totalRows = 0;
    const warnings = [];
    try {
        // Step 1: Parse file
        onProgress?.(10, 'Parsing Excel file...');
        const inputData = await parseExcelFile(filePath);
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
        const { loadToDatabase } = await import('../import/loader');
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
/**
 * Generate mock data for testing
 * @param warehouseId - Target warehouse ID
 * @param plugin - Mock data generator plugin
 * @param onProgress - Optional progress callback
 * @returns Import result
 */
export const generateMockData = async (warehouseId, plugin, onProgress) => {
    const startTime = Date.now();
    const warnings = [];
    try {
        // Step 1: Generate mock data
        onProgress?.(10, 'Generating mock data...');
        const context = {
            warehouseId,
            pluginId: plugin.id,
            onProgress: (progress, message) => {
                onProgress?.(20 + progress * 0.6, message);
            },
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
        onProgress?.(80, 'Loading data into database...');
        // Import loader function
        const { loadToDatabase } = await import('../import/loader');
        // Step 2: Load to database
        const stats = loadToDatabase(normalizedData);
        onProgress?.(100, 'Mock data generated successfully!');
        const duration = Date.now() - startTime;
        return {
            status: 'success',
            warehouseId,
            pluginId: plugin.id,
            stats: {
                rowsProcessed: 0, // Not applicable for mock data
                productsImported: stats.productsImported,
                inventoryImported: stats.inventoryImported,
                movementsImported: stats.movementsImported,
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
                rowsProcessed: 0,
                productsImported: 0,
                inventoryImported: 0,
                movementsImported: 0,
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

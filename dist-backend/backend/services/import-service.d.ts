import type { ImportPlugin, ImportResult, ValidationResult } from '../import/types';
/**
 * Validate file with selected plugin
 * @param filePath - Path to Excel file
 * @param plugin - Import plugin to use
 * @returns Validation result
 */
export declare const validateImportFile: (filePath: string, plugin: ImportPlugin) => Promise<{
    valid: boolean;
    errors: readonly ValidationResult[];
}>;
/**
 * Execute complete import workflow
 * @param filePath - Path to Excel file
 * @param warehouseId - Target warehouse ID
 * @param plugin - Import plugin to use
 * @param onProgress - Optional progress callback
 * @returns Import result
 */
export declare const executeImport: (filePath: string, warehouseId: string, plugin: ImportPlugin, onProgress?: (progress: number, message: string) => void) => Promise<ImportResult>;
/**
 * Generate mock data for testing
 * @param warehouseId - Target warehouse ID
 * @param plugin - Mock data generator plugin
 * @param onProgress - Optional progress callback
 * @returns Import result
 */
export declare const generateMockData: (warehouseId: string, plugin: ImportPlugin, onProgress?: (progress: number, message: string) => void) => Promise<ImportResult>;

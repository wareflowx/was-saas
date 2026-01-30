import type { ImportPlugin, ImportResult, ValidationResult } from '../types';
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
//# sourceMappingURL=import-service.d.ts.map
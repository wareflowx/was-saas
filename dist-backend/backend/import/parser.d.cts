import type { WMSInputData, WMSSheet } from './types';
/**
 * Parse Excel file and extract sheets
 * @param filePath - Path to Excel file
 * @returns Parsed Excel data with sheets
 */
export declare const parseExcelFile: (filePath: string) => Promise<WMSInputData>;
/**
 * Get sheet names from Excel file
 * @param filePath - Path to Excel file
 * @returns Array of sheet names
 */
export declare const getSheetNames: (filePath: string) => readonly string[];
/**
 * Validate Excel file format
 * @param filePath - Path to file
 * @returns True if file is valid Excel format
 */
export declare const isValidExcelFile: (filePath: string) => boolean;
/**
 * Read specific sheet from Excel file
 * @param filePath - Path to Excel file
 * @param sheetName - Name of sheet to read
 * @returns Sheet data or null
 */
export declare const readSheet: (filePath: string, sheetName: string) => WMSSheet | null;

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
exports.readSheet = exports.isValidExcelFile = exports.getSheetNames = exports.parseExcelFile = void 0;
const XLSX = __importStar(require("xlsx"));
/**
 * Parse Excel file and extract sheets
 * @param filePath - Path to Excel file
 * @returns Parsed Excel data with sheets
 */
const parseExcelFile = async (filePath) => {
    // Read file as ArrayBuffer
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    // Parse Excel workbook
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    // Extract all sheets
    const sheets = {};
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        // Convert to array of arrays
        const data = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // Use first row as header
            raw: false, // Get formatted values
            defval: null, // Use null for empty cells
        });
        if (data.length > 0) {
            const headers = data[0];
            const rows = data.slice(1).map(row => {
                const record = [];
                headers.forEach((_, index) => {
                    record.push(row[index]);
                });
                return record;
            });
            sheets[sheetName] = {
                headers,
                rows,
            };
        }
    });
    // Get file stats
    const fs = require('fs');
    const stats = fs.statSync(filePath);
    return {
        sheets,
        metadata: {
            filename: require('path').basename(filePath),
            fileSize: stats.size,
            uploadedAt: new Date(),
        },
    };
};
exports.parseExcelFile = parseExcelFile;
/**
 * Get sheet names from Excel file
 * @param filePath - Path to Excel file
 * @returns Array of sheet names
 */
const getSheetNames = (filePath) => {
    const fs = require('fs');
    const arrayBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    return workbook.SheetNames;
};
exports.getSheetNames = getSheetNames;
/**
 * Validate Excel file format
 * @param filePath - Path to file
 * @returns True if file is valid Excel format
 */
const isValidExcelFile = (filePath) => {
    const ext = filePath.toLowerCase().split('.').pop();
    return ['xlsx', 'xls', 'csv'].includes(ext || '');
};
exports.isValidExcelFile = isValidExcelFile;
/**
 * Read specific sheet from Excel file
 * @param filePath - Path to Excel file
 * @param sheetName - Name of sheet to read
 * @returns Sheet data or null
 */
const readSheet = (filePath, sheetName) => {
    const fs = require('fs');
    const arrayBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    if (!workbook.SheetNames.includes(sheetName)) {
        return null;
    }
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
        defval: null,
    });
    if (data.length === 0) {
        return null;
    }
    const headers = data[0];
    const rows = data.slice(1).map(row => {
        const record = [];
        headers.forEach((_, index) => {
            record.push(row[index]);
        });
        return record;
    });
    return {
        headers,
        rows,
    };
};
exports.readSheet = readSheet;

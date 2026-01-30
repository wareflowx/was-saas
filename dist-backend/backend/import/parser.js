import * as XLSX from 'xlsx';
/**
 * Parse Excel file and extract sheets
 * @param filePath - Path to Excel file
 * @returns Parsed Excel data with sheets
 */
export const parseExcelFile = async (filePath) => {
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
/**
 * Get sheet names from Excel file
 * @param filePath - Path to Excel file
 * @returns Array of sheet names
 */
export const getSheetNames = (filePath) => {
    const fs = require('fs');
    const arrayBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    return workbook.SheetNames;
};
/**
 * Validate Excel file format
 * @param filePath - Path to file
 * @returns True if file is valid Excel format
 */
export const isValidExcelFile = (filePath) => {
    const ext = filePath.toLowerCase().split('.').pop();
    return ['xlsx', 'xls', 'csv'].includes(ext || '');
};
/**
 * Read specific sheet from Excel file
 * @param filePath - Path to Excel file
 * @param sheetName - Name of sheet to read
 * @returns Sheet data or null
 */
export const readSheet = (filePath, sheetName) => {
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

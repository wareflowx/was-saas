// ============================================================================
// GENERIC EXCEL PLUGIN DEFINITION
// ============================================================================
export const genericExcelPlugin = {
    // Identification
    id: 'generic-excel',
    name: 'Generic Excel Plugin',
    version: '1.0.0',
    description: 'Flexible import from any Excel format with manual column mapping',
    author: 'Wareflow',
    // WMS compatibility
    wmsSystem: 'Generic',
    supportedFormats: ['xlsx', 'xls', 'csv'],
    // Input schema - user defines this
    inputSchema: {
        sheets: [
            {
                name: 'Products',
                required: false,
                description: 'Product catalog data',
                columns: [
                    {
                        name: 'id',
                        type: 'string',
                        required: true,
                        description: 'Product unique identifier',
                    },
                    {
                        name: 'sku',
                        type: 'string',
                        required: true,
                        description: 'Product SKU',
                    },
                    {
                        name: 'name',
                        type: 'string',
                        required: true,
                        description: 'Product name',
                    },
                    {
                        name: 'category',
                        type: 'string',
                        required: false,
                        description: 'Product category',
                    },
                    {
                        name: 'unit',
                        type: 'string',
                        required: false,
                        description: 'Unit of measure',
                    },
                ],
            },
            {
                name: 'Inventory',
                required: false,
                description: 'Current inventory levels',
                columns: [
                    {
                        name: 'product_id',
                        type: 'string',
                        required: true,
                        description: 'Product ID',
                    },
                    {
                        name: 'quantity',
                        type: 'number',
                        required: true,
                        description: 'Stock quantity',
                    },
                ],
            },
            {
                name: 'Movements',
                required: false,
                description: 'Stock movements history',
                columns: [
                    {
                        name: 'product_id',
                        type: 'string',
                        required: true,
                        description: 'Product ID',
                    },
                    {
                        name: 'type',
                        type: 'string',
                        required: true,
                        description: 'Movement type (inbound/outbound/transfer/adjustment)',
                    },
                    {
                        name: 'quantity',
                        type: 'number',
                        required: true,
                        description: 'Movement quantity',
                    },
                    {
                        name: 'date',
                        type: 'date',
                        required: true,
                        description: 'Movement date',
                    },
                ],
            },
        ],
    },
    /**
     * Validate WMS input data
     * Checks if required sheets exist and have valid structure
     */
    validate: (input) => {
        const errors = [];
        // Check if file has any sheets
        if (Object.keys(input.sheets).length === 0) {
            errors.push({
                severity: 'error',
                message: 'No sheets found in Excel file',
                suggestion: 'Ensure your Excel file contains at least one data sheet',
                canContinue: false,
            });
            return errors;
        }
        // For generic plugin, we accept any structure
        // Validation will happen during column mapping phase
        return errors;
    },
    /**
     * Transform WMS input data to normalized format
     * Generic implementation - user provides column mappings
     */
    transform: (input, context) => {
        const { warehouseId } = context;
        // Extract products from 'Products' sheet if exists
        const productsSheet = input.sheets['Products'];
        const products = [];
        if (productsSheet) {
            const { headers, rows } = productsSheet;
            const headerMap = new Map(headers.map((h, i) => [h, i]));
            for (const row of rows) {
                products.push({
                    id: getString(row, headerMap.get('id') || 0),
                    sku: getString(row, headerMap.get('sku') || 1),
                    name: getString(row, headerMap.get('name') || 2),
                    description: getString(row, headerMap.get('description') || 3),
                    category: getString(row, headerMap.get('category') || 4),
                    subcategory: getString(row, headerMap.get('subcategory') || 5),
                    brand: getString(row, headerMap.get('brand') || 6),
                    unit: getString(row, headerMap.get('unit') || 7),
                    weight: getNumber(row, headerMap.get('weight') || 8),
                    volume: getNumber(row, headerMap.get('volume') || 9),
                    minStock: getNumber(row, headerMap.get('min_stock') || 10),
                    maxStock: getNumber(row, headerMap.get('max_stock') || 11),
                    reorderPoint: getNumber(row, headerMap.get('reorder_point') || 12),
                    reorderQuantity: getNumber(row, headerMap.get('reorder_quantity') || 13),
                    costPrice: getNumber(row, headerMap.get('cost_price') || 14),
                    sellingPrice: getNumber(row, headerMap.get('selling_price') || 15),
                    supplier: getString(row, headerMap.get('supplier') || 16),
                    status: (getString(row, headerMap.get('status') || 17) || 'in_stock'),
                });
            }
        }
        // Extract inventory from 'Inventory' sheet if exists
        const inventorySheet = input.sheets['Inventory'];
        const inventory = [];
        if (inventorySheet) {
            const { headers, rows } = inventorySheet;
            const headerMap = new Map(headers.map((h, i) => [h, i]));
            for (const row of rows) {
                const productId = getString(row, headerMap.get('product_id') || 0);
                if (productId) {
                    inventory.push({
                        warehouseId,
                        productId,
                        locationId: getString(row, headerMap.get('location_id') || 1),
                        quantity: getNumber(row, headerMap.get('quantity') || 2) || 0,
                        availableQuantity: getNumber(row, headerMap.get('available_quantity') || 3) || 0,
                        reservedQuantity: getNumber(row, headerMap.get('reserved_quantity') || 4) || 0,
                    });
                }
            }
        }
        // Extract movements from 'Movements' sheet if exists
        const movementsSheet = input.sheets['Movements'];
        const movements = [];
        if (movementsSheet) {
            const { headers, rows } = movementsSheet;
            const headerMap = new Map(headers.map((h, i) => [h, i]));
            for (const row of rows) {
                const movementDate = getDate(row, headerMap.get('date') || 3);
                movements.push({
                    warehouseId,
                    productId: getString(row, headerMap.get('product_id') || 0),
                    productSku: '',
                    productName: '',
                    type: getString(row, headerMap.get('type') || 1),
                    sourceLocationId: getString(row, headerMap.get('source_location_id') || 4),
                    sourceZone: getString(row, headerMap.get('source_zone') || 5),
                    sourceLocationCode: getString(row, headerMap.get('source_location_code') || 6),
                    destinationLocationId: getString(row, headerMap.get('destination_location_id') || 7),
                    destinationZone: getString(row, headerMap.get('destination_zone') || 8),
                    destinationLocationCode: getString(row, headerMap.get('destination_location_code') || 9),
                    quantity: getNumber(row, headerMap.get('quantity') || 2) || 0,
                    unit: 'ea',
                    movementDate: movementDate || new Date(),
                    user: getString(row, headerMap.get('user') || 10),
                    reason: getString(row, headerMap.get('reason') || 11),
                });
            }
        }
        // Return normalized data
        return {
            metadata: {
                warehouseId,
                importDate: new Date(),
                pluginId: 'generic-excel',
                pluginVersion: '1.0.0',
                wmsSystem: 'Generic',
            },
            products,
            inventory,
            movements,
        };
    },
};
// ============================================================================
// HELPER FUNCTIONS FOR DATA EXTRACTION
// ============================================================================
/**
 * Safely get string value from row by column index
 */
function getString(row, index) {
    const value = row[index];
    return value ? String(value) : '';
}
/**
 * Safely get number value from row by column index
 */
function getNumber(row, index) {
    const value = row[index];
    if (value === null || value === undefined) {
        return undefined;
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num;
}
/**
 * Safely get date value from row by column index
 */
function getDate(row, index) {
    const value = row[index];
    if (value === null || value === undefined) {
        return undefined;
    }
    if (value instanceof Date) {
        return value;
    }
    const str = String(value);
    const date = new Date(str);
    return isNaN(date.getTime()) ? undefined : date;
}
//# sourceMappingURL=index.js.map
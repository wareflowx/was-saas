// ============================================================================
// GENERIC EXCEL PLUGIN
// Allows manual column mapping from any Excel format
// ============================================================================
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
                const rowArray = row;
                products.push({
                    id: getValueByIndex(rowArray, headerMap.get('id'), ''),
                    sku: getValueByIndex(rowArray, headerMap.get('sku'), ''),
                    name: getValueByIndex(rowArray, headerMap.get('name'), ''),
                    description: getValueByIndex(rowArray, headerMap.get('description'), ''),
                    category: getValueByIndex(rowArray, headerMap.get('category'), ''),
                    subcategory: getValueByIndex(rowArray, headerMap.get('subcategory'), ''),
                    brand: getValueByIndex(rowArray, headerMap.get('brand'), ''),
                    unit: getValueByIndex(rowArray, headerMap.get('unit'), 'ea'),
                    weight: getNumberByIndex(rowArray, headerMap.get('weight')),
                    volume: getNumberByIndex(rowArray, headerMap.get('volume')),
                    minStock: getNumberByIndex(rowArray, headerMap.get('min_stock')),
                    maxStock: getNumberByIndex(rowArray, headerMap.get('max_stock')),
                    reorderPoint: getNumberByIndex(rowArray, headerMap.get('reorder_point')),
                    reorderQuantity: getNumberByIndex(rowArray, headerMap.get('reorder_quantity')),
                    costPrice: getNumberByIndex(rowArray, headerMap.get('cost_price')),
                    sellingPrice: getNumberByIndex(rowArray, headerMap.get('selling_price')),
                    supplier: getValueByIndex(rowArray, headerMap.get('supplier'), ''),
                    status: (getValueByIndex(rowArray, headerMap.get('status'), '') || 'in_stock'),
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
                const rowArray = row;
                const productId = getValueByIndex(rowArray, headerMap.get('product_id'), '');
                if (productId) {
                    inventory.push({
                        warehouseId,
                        productId,
                        locationId: getValueByIndex(rowArray, headerMap.get('location_id'), ''),
                        quantity: getNumberByIndex(rowArray, headerMap.get('quantity')) || 0,
                        availableQuantity: getNumberByIndex(rowArray, headerMap.get('available_quantity')) || 0,
                        reservedQuantity: getNumberByIndex(rowArray, headerMap.get('reserved_quantity')) || 0,
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
                const rowArray = row;
                const movementDate = getDateByIndex(rowArray, headerMap.get('date'));
                movements.push({
                    warehouseId,
                    productId: getValueByIndex(rowArray, headerMap.get('product_id'), ''),
                    productSku: '',
                    productName: '',
                    type: getValueByIndex(rowArray, headerMap.get('type'), ''),
                    sourceLocationId: getValueByIndex(rowArray, headerMap.get('source_location_id'), ''),
                    sourceZone: getValueByIndex(rowArray, headerMap.get('source_zone'), ''),
                    sourceLocationCode: getValueByIndex(rowArray, headerMap.get('source_location_code'), ''),
                    destinationLocationId: getValueByIndex(rowArray, headerMap.get('destination_location_id'), ''),
                    destinationZone: getValueByIndex(rowArray, headerMap.get('destination_zone'), ''),
                    destinationLocationCode: getValueByIndex(rowArray, headerMap.get('destination_location_code'), ''),
                    quantity: getNumberByIndex(rowArray, headerMap.get('quantity')) || 0,
                    unit: 'ea',
                    movementDate: movementDate || new Date(),
                    user: getValueByIndex(rowArray, headerMap.get('user'), ''),
                    reason: getValueByIndex(rowArray, headerMap.get('reason'), ''),
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
function getValueByIndex(row, index, defaultValue) {
    if (index === undefined || index < 0 || index >= row.length) {
        return defaultValue;
    }
    const value = row[index];
    return value ? String(value) : defaultValue;
}
/**
 * Safely get number value from row by column index
 */
function getNumberByIndex(row, index) {
    if (index === undefined || index < 0 || index >= row.length) {
        return undefined;
    }
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
function getDateByIndex(row, index) {
    if (index === undefined || index < 0 || index >= row.length) {
        return undefined;
    }
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

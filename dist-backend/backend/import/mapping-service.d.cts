/**
 * Column Mapping Service
 * Handles dynamic column mapping from Excel files to expected schema
 */
export type ColumnMapping = {
    readonly sourceColumn: string;
    readonly targetField: string;
    readonly required: boolean;
};
export type EntityMapping = {
    readonly entityName: string;
    readonly displayName: string;
    readonly mappings: ColumnMapping[];
};
export type MappingPreset = {
    readonly id: string;
    readonly name: string;
    readonly pluginId: string;
    readonly mappings: Record<string, ColumnMapping[]>;
    readonly createdAt: Date;
};
export type MappingValidationResult = {
    readonly valid: boolean;
    readonly missing: readonly string[];
    readonly errors: readonly {
        field: string;
        issue: string;
    }[];
};
/**
 * Expected schema definitions for each entity type
 * These define the target fields that can be mapped to
 */
export declare const SCHEMAS: {
    readonly products: {
        readonly entityName: "products";
        readonly displayName: "Products";
        readonly fields: readonly [{
            readonly field: "sku";
            readonly required: true;
            readonly displayName: "SKU";
            readonly type: "string";
        }, {
            readonly field: "name";
            readonly required: true;
            readonly displayName: "Product Name";
            readonly type: "string";
        }, {
            readonly field: "description";
            readonly required: false;
            readonly displayName: "Description";
            readonly type: "string";
        }, {
            readonly field: "category";
            readonly required: true;
            readonly displayName: "Category";
            readonly type: "string";
        }, {
            readonly field: "subcategory";
            readonly required: false;
            readonly displayName: "Subcategory";
            readonly type: "string";
        }, {
            readonly field: "brand";
            readonly required: false;
            readonly displayName: "Brand";
            readonly type: "string";
        }, {
            readonly field: "unit";
            readonly required: true;
            readonly displayName: "Unit of Measure";
            readonly type: "string";
        }, {
            readonly field: "weight";
            readonly required: false;
            readonly displayName: "Weight (kg)";
            readonly type: "number";
        }, {
            readonly field: "volume";
            readonly required: false;
            readonly displayName: "Volume (m³)";
            readonly type: "number";
        }, {
            readonly field: "minStock";
            readonly required: false;
            readonly displayName: "Min Stock Level";
            readonly type: "number";
        }, {
            readonly field: "maxStock";
            readonly required: false;
            readonly displayName: "Max Stock Level";
            readonly type: "number";
        }, {
            readonly field: "reorderPoint";
            readonly required: false;
            readonly displayName: "Reorder Point";
            readonly type: "number";
        }, {
            readonly field: "reorderQuantity";
            readonly required: false;
            readonly displayName: "Reorder Quantity";
            readonly type: "number";
        }, {
            readonly field: "costPrice";
            readonly required: false;
            readonly displayName: "Cost Price";
            readonly type: "number";
        }, {
            readonly field: "sellingPrice";
            readonly required: false;
            readonly displayName: "Selling Price";
            readonly type: "number";
        }, {
            readonly field: "supplier";
            readonly required: false;
            readonly displayName: "Supplier";
            readonly type: "string";
        }];
    };
    readonly inventory: {
        readonly entityName: "inventory";
        readonly displayName: "Inventory";
        readonly fields: readonly [{
            readonly field: "productId";
            readonly required: true;
            readonly displayName: "Product ID";
            readonly type: "string";
        }, {
            readonly field: "locationId";
            readonly required: true;
            readonly displayName: "Location ID";
            readonly type: "string";
        }, {
            readonly field: "quantity";
            readonly required: true;
            readonly displayName: "Quantity";
            readonly type: "number";
        }, {
            readonly field: "availableQuantity";
            readonly required: false;
            readonly displayName: "Available Quantity";
            readonly type: "number";
        }, {
            readonly field: "reservedQuantity";
            readonly required: false;
            readonly displayName: "Reserved Quantity";
            readonly type: "number";
        }];
    };
    readonly movements: {
        readonly entityName: "movements";
        readonly displayName: "Stock Movements";
        readonly fields: readonly [{
            readonly field: "productId";
            readonly required: true;
            readonly displayName: "Product ID/SKU";
            readonly type: "string";
        }, {
            readonly field: "productSku";
            readonly required: true;
            readonly displayName: "Product SKU";
            readonly type: "string";
        }, {
            readonly field: "productName";
            readonly required: true;
            readonly displayName: "Product Name";
            readonly type: "string";
        }, {
            readonly field: "type";
            readonly required: true;
            readonly displayName: "Movement Type";
            readonly type: "string";
        }, {
            readonly field: "quantity";
            readonly required: true;
            readonly displayName: "Quantity";
            readonly type: "number";
        }, {
            readonly field: "sourceLocationCode";
            readonly required: false;
            readonly displayName: "Source Location";
            readonly type: "string";
        }, {
            readonly field: "destinationLocationCode";
            readonly required: false;
            readonly displayName: "Destination Location";
            readonly type: "string";
        }, {
            readonly field: "movementDate";
            readonly required: true;
            readonly displayName: "Movement Date";
            readonly type: "date";
        }, {
            readonly field: "unit";
            readonly required: false;
            readonly displayName: "Unit";
            readonly type: "string";
        }, {
            readonly field: "user";
            readonly required: false;
            readonly displayName: "User";
            readonly type: "string";
        }, {
            readonly field: "referenceType";
            readonly required: false;
            readonly displayName: "Reference Type";
            readonly type: "string";
        }, {
            readonly field: "referenceId";
            readonly required: false;
            readonly displayName: "Reference ID";
            readonly type: "string";
        }];
    };
};
/**
 * Create default mappings based on common naming conventions
 * @param availableColumns - Columns from Excel file
 * @param schema - Schema to map to
 * @returns Array of column mappings
 */
export declare const suggestMappings: (availableColumns: readonly string[], schema: readonly {
    readonly field: string;
    readonly required: boolean;
    readonly displayName: string;
}[]) => ColumnMapping[];
/**
 * Validate column mappings against schema requirements
 * @param mappings - Column mappings to validate
 * @param schema - Schema to validate against
 * @returns Validation result
 */
export declare const validateMappings: (mappings: readonly ColumnMapping[], schema: readonly {
    readonly field: string;
    readonly required: boolean;
    readonly displayName: string;
}[]) => MappingValidationResult;
/**
 * Apply column mappings to transform data
 * @param data - Raw data rows from Excel
 * @param mappings - Column mappings to apply
 * @returns Transformed data
 */
export declare const applyMappings: (data: readonly Record<string, unknown>[], mappings: readonly ColumnMapping[]) => Record<string, unknown>[];
/**
 * Save mapping preset for reuse
 * @param preset - Mapping preset to save
 */
export declare const saveMappingPreset: (preset: MappingPreset) => void;
/**
 * Load mapping preset
 * @param presetId - Preset ID to load
 * @returns Mapping preset or null
 */
export declare const loadMappingPreset: (_presetId: string) => MappingPreset | null;
/**
 * Get available schemas for mapping
 * @returns List of available schemas
 */
export declare const getAvailableSchemas: () => readonly {
    readonly key: string;
    readonly name: string;
}[];

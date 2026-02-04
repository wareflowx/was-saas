/**
 * Column Mapping Service
 * Handles dynamic column mapping from Excel files to expected schema
 */

// ============================================================================
// TYPES
// ============================================================================

export type ColumnMapping = {
  readonly sourceColumn: string
  readonly targetField: string
  readonly required: boolean
}

export type EntityMapping = {
  readonly entityName: string
  readonly displayName: string
  readonly mappings: ColumnMapping[]
}

export type MappingPreset = {
  readonly id: string
  readonly name: string
  readonly pluginId: string
  readonly mappings: Record<string, ColumnMapping[]>
  readonly createdAt: Date
}

export type MappingValidationResult = {
  readonly valid: boolean
  readonly missing: readonly string[]
  readonly errors: readonly { field: string; issue: string }[]
}

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

/**
 * Expected schema definitions for each entity type
 * These define the target fields that can be mapped to
 */
export const SCHEMAS = {
  products: {
    entityName: 'products',
    displayName: 'Products',
    fields: [
      { field: 'sku', required: true, displayName: 'SKU', type: 'string' },
      { field: 'name', required: true, displayName: 'Product Name', type: 'string' },
      { field: 'description', required: false, displayName: 'Description', type: 'string' },
      { field: 'category', required: true, displayName: 'Category', type: 'string' },
      { field: 'subcategory', required: false, displayName: 'Subcategory', type: 'string' },
      { field: 'brand', required: false, displayName: 'Brand', type: 'string' },
      { field: 'unit', required: true, displayName: 'Unit of Measure', type: 'string' },
      { field: 'weight', required: false, displayName: 'Weight (kg)', type: 'number' },
      { field: 'volume', required: false, displayName: 'Volume (m³)', type: 'number' },
      { field: 'minStock', required: false, displayName: 'Min Stock Level', type: 'number' },
      { field: 'maxStock', required: false, displayName: 'Max Stock Level', type: 'number' },
      { field: 'reorderPoint', required: false, displayName: 'Reorder Point', type: 'number' },
      { field: 'reorderQuantity', required: false, displayName: 'Reorder Quantity', type: 'number' },
      { field: 'costPrice', required: false, displayName: 'Cost Price', type: 'number' },
      { field: 'sellingPrice', required: false, displayName: 'Selling Price', type: 'number' },
      { field: 'supplier', required: false, displayName: 'Supplier', type: 'string' },
    ] as const,
  },

  inventory: {
    entityName: 'inventory',
    displayName: 'Inventory',
    fields: [
      { field: 'productId', required: true, displayName: 'Product ID', type: 'string' },
      { field: 'locationId', required: true, displayName: 'Location ID', type: 'string' },
      { field: 'quantity', required: true, displayName: 'Quantity', type: 'number' },
      { field: 'availableQuantity', required: false, displayName: 'Available Quantity', type: 'number' },
      { field: 'reservedQuantity', required: false, displayName: 'Reserved Quantity', type: 'number' },
    ] as const,
  },

  movements: {
    entityName: 'movements',
    displayName: 'Stock Movements',
    fields: [
      { field: 'productId', required: true, displayName: 'Product ID/SKU', type: 'string' },
      { field: 'productSku', required: true, displayName: 'Product SKU', type: 'string' },
      { field: 'productName', required: true, displayName: 'Product Name', type: 'string' },
      { field: 'type', required: true, displayName: 'Movement Type', type: 'string' },
      { field: 'quantity', required: true, displayName: 'Quantity', type: 'number' },
      { field: 'sourceLocationCode', required: false, displayName: 'Source Location', type: 'string' },
      { field: 'destinationLocationCode', required: false, displayName: 'Destination Location', type: 'string' },
      { field: 'movementDate', required: true, displayName: 'Movement Date', type: 'date' },
      { field: 'unit', required: false, displayName: 'Unit', type: 'string' },
      { field: 'user', required: false, displayName: 'User', type: 'string' },
      { field: 'referenceType', required: false, displayName: 'Reference Type', type: 'string' },
      { field: 'referenceId', required: false, displayName: 'Reference ID', type: 'string' },
    ] as const,
  },
} as const

// ============================================================================
// MAPPING SERVICE
// ============================================================================

/**
 * Create default mappings based on common naming conventions
 * @param availableColumns - Columns from Excel file
 * @param schema - Schema to map to
 * @returns Array of column mappings
 */
export const suggestMappings = (
  availableColumns: readonly string[],
  schema: readonly { readonly field: string; readonly required: boolean; readonly displayName: string }[]
): ColumnMapping[] => {
  const mappings: ColumnMapping[] = []
  const mappedColumns = new Set<string>()

  for (const schemaField of schema) {
    // Try exact match first
    if (availableColumns.includes(schemaField.field)) {
      mappings.push({
        sourceColumn: schemaField.field,
        targetField: schemaField.field,
        required: schemaField.required,
      })
      mappedColumns.add(schemaField.field)
      continue
    }

    // Try case-insensitive match
    const caseInsensitiveMatch = availableColumns.find(
      col => col.toLowerCase() === schemaField.field.toLowerCase()
    )
    if (caseInsensitiveMatch && !mappedColumns.has(caseInsensitiveMatch)) {
      mappings.push({
        sourceColumn: caseInsensitiveMatch,
        targetField: schemaField.field,
        required: schemaField.required,
      })
      mappedColumns.add(caseInsensitiveMatch)
      continue
    }

    // Try common variations
    const variations = getFieldVariations(schemaField.field)
    for (const variation of variations) {
      const match = availableColumns.find(col => col.toLowerCase() === variation.toLowerCase())
      if (match && !mappedColumns.has(match)) {
        mappings.push({
          sourceColumn: match,
          targetField: schemaField.field,
          required: schemaField.required,
        })
        mappedColumns.add(match)
        break
      }
    }

    // If required and not mapped, add as unmapped
    if (schemaField.required && !mappings.some(m => m.targetField === schemaField.field)) {
      mappings.push({
        sourceColumn: '', // Empty means not mapped
        targetField: schemaField.field,
        required: true,
      })
    }
  }

  return mappings
}

/**
 * Get common field name variations for auto-mapping
 * @param fieldName - Field name to get variations for
 * @returns Array of possible variations
 */
function getFieldVariations(fieldName: string): string[] {
  const variations: string[] = []

  // Common abbreviations
  const abbreviations: Record<string, string[]> = {
    sku: ['part_num', 'part_number', 'item_num', 'item_number', 'product_code'],
    description: ['desc', 'product_desc', 'details', 'product_info'],
    category: ['cat', 'product_category', 'group'],
    brand: ['manufacturer', 'mfr', 'supplier'],
    quantity: ['qty', 'amount', 'qty_available', 'stock_qty'],
    price: ['unit_price', 'unitprice', 'cost', 'amount'],
    weight: ['weight_kg', 'net_weight', 'gross_weight'],
    volume: ['volume_m3', 'cubic_volume', 'cbm'],
    name: ['product_name', 'item_name', 'description'],
  }

  if (abbreviations[fieldName]) {
    variations.push(...abbreviations[fieldName])
  }

  // Snake case variations
  variations.push(
    fieldName.replace(/([A-Z])/g, '_$1').toLowerCase(),
    fieldName.replace(/([A-Z])/g, '-$1').toLowerCase()
  )

  return variations
}

/**
 * Validate column mappings against schema requirements
 * @param mappings - Column mappings to validate
 * @param schema - Schema to validate against
 * @returns Validation result
 */
export const validateMappings = (
  mappings: readonly ColumnMapping[],
  schema: readonly { readonly field: string; readonly required: boolean; readonly displayName: string }[]
): MappingValidationResult => {
  const errors: { field: string; issue: string }[] = []
  const mappedFields = new Set<string>()

  // Check what's mapped
  for (const mapping of mappings) {
    if (mapping.sourceColumn) {
      mappedFields.add(mapping.targetField)
    }
  }

  // Check required fields
  for (const field of schema) {
    if (field.required && !mappedFields.has(field.field)) {
      errors.push({
        field: field.field,
        issue: `${field.displayName} is required but not mapped`,
      })
    }
  }

  // Check for duplicate mappings
  const sourceCols = mappings.filter(m => m.sourceColumn).map(m => m.sourceColumn)
  const duplicates = sourceCols.filter((col, index) => sourceCols.indexOf(col) !== index)
  for (const duplicate of duplicates) {
    errors.push({
      field: duplicate,
      issue: 'Column is mapped to multiple fields',
    })
  }

  return {
    valid: errors.length === 0,
    missing: schema
      .filter(f => f.required && !mappedFields.has(f.field))
      .map(f => f.displayName),
    errors,
  }
}

/**
 * Apply column mappings to transform data
 * @param data - Raw data rows from Excel
 * @param mappings - Column mappings to apply
 * @returns Transformed data
 */
export const applyMappings = (
  data: readonly Record<string, unknown>[],
  mappings: readonly ColumnMapping[]
): Record<string, unknown>[] => {
  return data.map(row => {
    const transformed: Record<string, unknown> = {}

    for (const mapping of mappings) {
      if (mapping.sourceColumn && mapping.sourceColumn in row) {
        transformed[mapping.targetField] = row[mapping.sourceColumn]
      }
    }

    return transformed
  })
}

/**
 * Get available schemas for mapping
 * @returns List of available schemas
 */
export const getAvailableSchemas = (): readonly { readonly key: string; readonly name: string }[] => {
  return [
    { key: 'products', name: 'Products' },
    { key: 'inventory', name: 'Inventory' },
    { key: 'movements', name: 'Stock Movements' },
    { key: 'orders', name: 'Orders' },
    { key: 'pickings', name: 'Pickings' },
    { key: 'receptions', name: 'Receptions' },
    { key: 'restockings', name: 'Restockings' },
    { key: 'returns', name: 'Returns' },
  ]
}

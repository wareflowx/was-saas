# TypeScript Import Plugin System

## Overview

The **Import Plugin System** is the core of Wareflow's data ingestion architecture. It bridges the gap between various WMS (Warehouse Management Systems) Excel exports and Wareflow's normalized local database schema.

### Architecture Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL WMS SYSTEMS                          │
├─────────────────────────────────────────────────────────────────┤
│  SAP EWM    Manhattan    HighJump    Custom/Homegrown WMS       │
│     ↓            ↓           ↓                ↓                 │
│  Excel       Excel       Excel            Excel                 │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              TYPESCRIPT IMPORT PLUGINS                          │
├─────────────────────────────────────────────────────────────────┤
│  SAP Plugin   Manhattan   HighJump    Custom Plugin             │
│     ↓            ↓           ↓                ↓                 │
│  Transform    Transform   Transform      Transform               │
│  (TS code)    (TS code)   (TS code)      (TS code)              │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│              NORMALIZED WAREFLOW SCHEMA                         │
├─────────────────────────────────────────────────────────────────┤
│  Single, consistent schema that ALL plugins output             │
│  • produits  • mouvements  • commandes  • receptions           │
│  • Returns   • Adjustments  • Users      • Locations            │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│            LOCAL SQLITE DATABASE (User's Machine)              │
├─────────────────────────────────────────────────────────────────┤
│  Stored in user's AppData/Library/Application Support          │
│  No cloud, no server, 100% local, 100% private                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Every WMS Needs a Plugin**: No two WMS systems export data the same way. Each WMS (or even each WMS version/configuration) requires its own plugin.

2. **Plugins are Pure TypeScript**: Type-safe, testable, maintainable, using only types and functions (no classes, no interfaces).

3. **Single Normalized Schema**: **ALL plugins produce the exact same output schema**. This is critical - the analysis engine doesn't care which WMS the data came from.

4. **Plugins are Deterministic**: Given the same WMS Excel file, a plugin should always produce the same normalized output.

5. **Local-First**: All processing happens on the user's machine. No data is sent to any server.

6. **Functional Programming**: Backend uses only types and functions - no classes, no methods, pure functions whenever possible.

## Plugin Contract (TypeScript Types)

### Core Plugin Type

Every import plugin must implement this type:

```typescript
// Located in: src/import/plugins/types.ts

/**
 * WMS Input Data - Raw Excel data from WMS export
 */
type WMSInputData = {
  readonly sheets: Record<string, WMSSheet>
  readonly metadata: {
    readonly filename: string
    readonly fileSize: number
    readonly uploadedAt: Date
    readonly wmsSystem?: string
  }
}

/**
 * Normalized Data - All plugins must produce this format
 */
type NormalizedData = {
  readonly metadata: {
    readonly importDate: Date
    readonly pluginId: string
    readonly pluginVersion: string
    readonly wmsSystem: string
    readonly wmsVersion?: string
  }

  // Core entities (required)
  readonly produits: readonly Product[]
  readonly mouvements: readonly Movement[]

  // Optional entities (depends on WMS capabilities)
  readonly commandes?: readonly Order[]
  readonly receptions?: readonly Receipt[]
  readonly retours?: readonly Return[]
}

/**
 * Import Plugin Type
 */
type ImportPlugin = {
  // Plugin identification
  readonly id: string                    // e.g., 'sap-ewm', 'manhattan-9.5', 'generic-excel'
  readonly name: string
  readonly version: string               // Semver: '1.0.0'
  readonly description: string
  readonly author: string

  // WMS compatibility
  readonly wmsSystem: string             // e.g., 'SAP EWM', 'Manhattan Associates'
  readonly wmsVersions?: readonly string[]
  readonly supportedFormats: readonly ('xlsx' | 'xls' | 'csv')[]

  // Input schema - what this plugin expects from WMS Excel
  readonly inputSchema: WMSInputSchema

  // Validation function
  readonly validate: (input: WMSInputData) => readonly ValidationResult[]

  // Transformation function
  readonly transform: (input: WMSInputData, context: TransformContext) => Promise<NormalizedData>

  // Optional configuration schema
  readonly configSchema?: z.ZodType
  readonly defaultConfig?: unknown
}
```

### Supporting Types

```typescript
// WMS Input Schema Definition
type WMSInputSchema = {
  readonly sheets: readonly {
    readonly name: string
    readonly required: boolean
    readonly description: string
    readonly columns: readonly {
      readonly name: string
      readonly type: 'string' | 'number' | 'date' | 'boolean'
      readonly required: boolean
      readonly description: string
    }[]
  }[]
}

// Validation Result
type ValidationResult = {
  readonly severity: 'error' | 'warning' | 'info'
  readonly sheet?: string
  readonly row?: number
  readonly column?: string
  readonly message: string
  readonly suggestion?: string
}

// Transform Context
type TransformContext = {
  readonly config: unknown
  readonly warehouseId: string
  readonly onProgress?: (progress: number, message: string) => void
}
```

## Normalized Schema (All Plugins Output This)

This is the **single source of truth** for Wareflow's data model. Every plugin must produce this exact schema.

### Core Entities Types

```typescript
// Product (Produit)
type Product = {
  readonly no_produit: number
  readonly nom_produit: string
  readonly description?: string

  // Categorization
  readonly categorie_1?: string
  readonly categorie_2?: string
  readonly categorie_3?: string
  readonly classe_produit?: string

  // Status
  readonly etat: 'active' | 'inactive' | 'discontinued'

  // Additional identifiers
  readonly ean?: string
  readonly sku?: string

  // Metadata
  readonly created_at: Date
  readonly updated_at: Date
}

// Movement (Mouvement)
type Movement = {
  readonly oid: number
  readonly no_produit: number
  readonly nom_produit: string
  readonly type: 'ENTREE' | 'SORTIE' | 'TRANSFERT' | 'AJUSTEMENT'

  // Locations
  readonly site_source?: string
  readonly zone_source?: string
  readonly localisation_source?: string
  readonly site_cible?: string
  readonly zone_cible?: string
  readonly localisation_cible?: string

  // Quantity and timing
  readonly quantite: number
  readonly unite?: string
  readonly date_heure: Date

  // Tracking
  readonly usager?: string
  readonly raison?: string
  readonly lot?: string
  readonly date_expiration?: Date
}
```

## Import Engine Architecture

### Functional Programming Approach

**Key Principle**: The backend uses ONLY types and functions. NO classes, NO interfaces, NO methods.

**Why Functional?**
- **Predictability**: Pure functions with no side effects are easier to test and reason about
- **Immutability**: `readonly` properties prevent accidental mutations
- **Composability**: Small functions can be combined to build complex behavior
- **Type Safety**: TypeScript's type system works better with pure functions

### Architecture Components

```
┌─────────────────────────────────────────────────────────┐
│              PLUGIN REGISTRY (Type)                      │
│  Record<string, ImportPlugin> - Immutable collection     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              PLUGIN LOADER (Functions)                   │
│  • loadPlugin(path) → ImportPlugin                       │
│  • getPlugin(registry, id) → ImportPlugin | undefined   │
│  • listPlugins(registry) → ImportPlugin[]                │
│  • detectPlugin(registry, data) → ImportPlugin | null     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              IMPORT ENGINE (Functions)                    │
│  • importData(file, plugin, config) → ImportResult      │
│  • validateData(data) → void | throws                   │
│  • loadToDatabase(db, data) → Stats                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              LOCAL SQLITE DATABASE                        │
│  • Table per warehouse: [warehouse-id]_produits           │
│  • Atomic transactions for consistency                   │
│  • Better-SQLite3 (synchronous, not async)              │
└─────────────────────────────────────────────────────────┘
```

### Multi-Warehouse Support

#### Data Isolation Strategy

**Option 1: Prefixed Tables (Recommended for MVP)**
```
Table names include warehouse ID:
- [wh-paris]_produits
- [wh-lyon]_produits
- [wh-marseille]_mouvements

Pros: Complete isolation, simple SQL
Cons: Query aggregation requires UNION
```

**Option 2: Single Table with Warehouse Column**
```
Single tables with warehouse_id:
- produits(warehouse_id, no_produit, ...)
- Primary key: (warehouse_id, no_produit)

Pros: Easy cross-warehouse queries
Cons: More complex queries, potential locking
```

### Incremental Import Strategy

Users can reimport data multiple times. System supports three modes:

```typescript
type ImportMode =
  | 'full'          // Replace all data for this warehouse
  | 'incremental'   // Insert new, update existing, delete missing
  | 'append'        // Only insert new records (never update/delete)

type ImportConfig = {
  readonly mode: ImportMode
  readonly warehouseId: string
  readonly dateRange?: {
    readonly start: Date
    readonly end: Date
  }
  readonly dryRun?: boolean
}
```

#### Data Merging Workflow

For `incremental` mode:
1. Compare incoming data with existing data
2. Identify records to: insert, update, delete, skip
3. Apply changes in single transaction
4. Return statistics (inserted/updated/deleted/skipped)

## Adaptive Analysis Availability

### Analysis Requirements Contract

Each analysis declares what data it needs:

```typescript
type AnalysisRequirements = {
  readonly requiredTables: readonly string[]
  readonly optionalTables?: readonly string[]
  readonly minRows?: number
  readonly dateRange?: {
    readonly column: string
    readonly minDays: number
  }
}
```

### Availability Checking

The system automatically checks which analyses can run based on imported data:

```
For each analysis:
  1. Check required tables exist for warehouse
  2. Check minimum row count
  3. Check date range if applicable
  4. Return: available OR blocked with reason
```

**UI Behavior**:
- ✅ Available analyses: Fully clickable, normal appearance
- ❌ Blocked analyses: Grayed out, shows reason (e.g., "Missing table: commandes")

### Example

```
User imports only produits and mouvements (no commandes):

ABC Classification:
  ✅ Required: produits, mouvements
  ✅ Available: YES

Order Fulfillment Analysis:
  ❌ Required: produits, mouvements, commandes
  ❌ Blocked: Missing table: commandes
  💡 UI shows: "Import commandes data to enable this analysis"
```

## Plugin Development Workflow

### 1. Define Plugin Requirements

Before writing code, answer:
- Which WMS does this plugin target?
- What Excel sheets/columns does it expect?
- What data quality issues should be validated?
- What transformations are needed?

### 2. Define Input Schema

```typescript
const sapEWMInputSchema: WMSInputSchema = {
  sheets: [
    {
      name: '/EWM/Orders',
      required: true,
      description: 'Order headers from SAP EWM',
      columns: [
        { name: 'DOC_ID', type: 'string', required: true, description: 'Document ID' },
        { name: 'DOC_CAT', type: 'string', required: true, description: 'Document category' }
      ]
    }
  ]
}
```

### 3. Implement Plugin Functions

```typescript
// Minimal plugin structure
const sapEWMPlugin: ImportPlugin = {
  id: 'sap-ewm',
  name: 'SAP EWM Import Plugin',
  version: '1.0.0',
  // ... metadata ...

  inputSchema: sapEWMInputSchema,

  validate: (input: WMSInputData) => {
    // Return validation errors
  },

  transform: async (input: WMSInputData, context: TransformContext) => {
    // Transform to NormalizedData
    return {
      metadata: { ... },
      produits: [...],
      mouvements: [...]
    }
  }
}
```

### 4. Test Plugin

```typescript
// Test requirements:
// 1. Validate correct input passes
// 2. Validate incorrect input fails appropriately
// 3. Transform produces correct output schema
// 4. Transform is deterministic (same input = same output)
```

## Default Plugins Included

### 1. Generic Excel Plugin
- **Purpose**: Flexible import for unknown/custom WMS formats
- **Features**: User manually maps columns to normalized schema
- **Use Case**: First-time imports, custom WMS, homegrown systems

### 2. SAP EWM Plugin
- **Purpose**: Pre-configured for SAP Extended Warehouse Management
- **Features**: Handles SAP-specific column names and data formats
- **Use Case**: Companies using SAP EWM

### 3. Manhattan Plugin (Future)
- **Purpose**: Pre-configured for Manhattan Associates WMS
- **Features**: Handles Manhattan-specific data structures
- **Use Case**: Companies using Manhattan Associates

## Plugin Registry

Plugins are discovered from:

```
src/import/plugins/
├── types.ts                 # Shared type definitions
├── registry.ts              # Plugin registry (Record<string, ImportPlugin>)
├── generic-excel/           # Generic Excel plugin
│   └── index.ts
├── sap-ewm/                 # SAP EWM plugin
│   ├── index.ts
│   └── mappings.ts          # SAP-specific column mappings
└── [custom-plugins]/         # User-created plugins
```

## Error Handling Strategy

### Validation Errors

Plugins should return validation errors with:

```typescript
type ValidationResult = {
  readonly severity: 'error' | 'warning' | 'info'
  readonly sheet?: string
  readonly row?: number
  readonly column?: string
  readonly message: string
  readonly suggestion?: string
}
```

**Examples**:
- ❌ "Missing required sheet: /EWM/Orders"
- ❌ "Column DOC_CAT not found in sheet /EWM/Orders"
- ⚠️ "Duplicate product IDs found: rows 45, 67, 89"

### Transform Errors

Transform functions should:
- Use pure functions (no side effects)
- Throw descriptive errors for invalid data
- Include context in error messages
- Never silently fail

## Performance Considerations

### Import Performance

- **Batch size**: Process data in batches of 1000-5000 rows
- **Memory**: Use streams for very large files (>100MB)
- **Transactions**: Wrap database operations in transactions
- **Indexing**: Create indexes after data load for better performance

### Plugin Performance

- **Avoid nested loops**: O(n²) algorithms are too slow
- **Use Maps/Sets**: O(1) lookups instead of O(n) array searches
- **Lazy validation**: Don't validate what hasn't changed
- **Progress reporting**: Report progress every 5-10%

## Security Considerations

### Input Validation

- **Validate file types**: Only allow .xlsx, .xls, .csv files
- **Limit file sizes**: Reject files > 100MB (configurable)
- **Sanitize data**: Remove formulas/macros from Excel files
- **Type checking**: Use TypeScript's type system throughout

### Data Privacy

- **100% local**: No data ever leaves user's machine
- **No telemetry**: No usage statistics or crash reports sent
- **No analytics**: No tracking of what users import
- **User control**: User decides when/if to update

## Best Practices

### 1. Type Safety

```typescript
// ✅ GOOD - Use types
interface SAPOrder {
  readonly DOC_ID: string
  readonly DOC_CAT: string
}

const order = row as SAPOrder

// ❌ BAD - Untyped access
const docId = row['DOC_ID']
```

### 2. Immutability

```typescript
// ✅ GOOD - Immutable
const produits = input.sheets.Products.rows
  .map(row => transformProduct(row))

// ❌ BAD - Mutating
const produits = input.sheets.Products.rows
produits.forEach(p => transformProduct(p))
```

### 3. Pure Functions

```typescript
// ✅ GOOD - Pure function
const transformProduct = (row: unknown): Product => ({
  no_produit: Number(row.SKU),
  nom_produit: String(row.Name)
})

// ❌ BAD - Side effects
let transformedCount = 0
const transformProduct = (row: unknown): Product => {
  transformedCount++
  // ...
}
```

### 4. Error Handling

```typescript
// ✅ GOOD - Descriptive errors
if (!input.sheets['Products']) {
  return [{
    severity: 'error',
    message: 'Required sheet missing',
    suggestion: 'Ensure your Excel file has a sheet named "Products"'
  }]
}
```

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft - Architecture & Requirements Only

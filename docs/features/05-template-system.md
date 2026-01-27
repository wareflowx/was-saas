# Template System Architecture

## Overview

The Template System is the **bridge between raw Excel data and available analyses**. It defines:
1. What data structure is expected
2. How columns should be mapped
3. Which analyses are automatically enabled
4. What validation rules apply

## Template Philosophy

```
Template = Schema + Mapping + Analyses + Validation
```

A template answers the question:
> "Given this type of warehouse data, what analyses can I run?"

## Core Types

### Template Definition Type

```typescript
type DataTemplate = {
  // Identification
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly category: TemplateCategory

  // Data schema
  readonly schema: {
    readonly tables: Record<string, TableSchema>
    readonly relationships?: readonly RelationshipSchema[]
  }

  // Default column mappings
  readonly defaultMappings: readonly ColumnMappingProfile[]

  // Enabled analyses
  readonly enabledAnalyses: readonly string[]

  // Validation rules
  readonly validationRules: readonly ValidationRule[]

  // Export templates
  readonly exportTemplates: readonly ExportTemplate[]

  // Metadata
  readonly metadata: {
    readonly author?: string
    readonly createdAt: Date
    readonly updatedAt: Date
    readonly tags: readonly string[]
    readonly industries: readonly string[]
  }
}

type TemplateCategory =
  | 'warehouse-basic'      // Single warehouse, basic operations
  | 'warehouse-advanced'   // Multi-warehouse, complex operations
  | 'distribution'         // Distribution center
  | 'retail'               // Retail back-of-house
  | 'manufacturing'        // Manufacturing warehouse
  | 'custom'               // User-defined
```

### Table Schema Type

```typescript
type TableSchema = {
  readonly name: string
  readonly description: string
  readonly required: boolean

  // Column definitions
  readonly columns: readonly ColumnSchema[]

  // Primary key
  readonly primaryKey: string

  // Foreign keys
  readonly foreignKeys?: readonly {
    readonly column: string
    readonly references: {
      readonly table: string
      readonly column: string
    }
  }[]

  // Constraints
  readonly constraints?: {
    readonly unique?: readonly string[]       // Columns that must be unique
    readonly minRows?: number                // Minimum required rows
    readonly maxRows?: number                // Maximum allowed rows
  }
}

type ColumnSchema = {
  readonly name: string
  readonly type: 'integer' | 'float' | 'text' | 'date' | 'boolean'
  readonly required: boolean
  readonly nullable: boolean

  // Validation
  readonly validation?: {
    readonly min?: number
    readonly max?: number
    readonly pattern?: string
    readonly enum?: readonly string[]
  }

  // Aliases for fuzzy matching
  readonly aliases?: readonly string[]

  // Description
  readonly description?: string
}
```

### Column Mapping Profile Type

```typescript
type ColumnMappingProfile = {
  // Source pattern (from Excel)
  readonly sourcePattern: {
    // Exact match
    readonly exact?: readonly string[]

    // Fuzzy match (Levenshtein distance)
    readonly fuzzy?: readonly string[]

    // Pattern match (regex)
    readonly pattern?: string

    // Synonyms
    readonly synonyms?: readonly string[]
  }

  // Target column (in schema)
  readonly targetColumn: string

  // Transformation
  readonly transformation?: {
    readonly type: 'date' | 'number' | 'text' | 'custom'
    readonly customFn?: string  // For custom transformations
  }

  // Confidence score (0-1)
  readonly confidence: number
}
```

## Built-in Templates

### Template 1: Basic Warehouse

**Purpose**: Simple warehouse with products and movements

**Schema**:
- `produits` table: Product catalog (no_produit, nom_produit, description, categorie_1, etat)
- `mouvements` table: Stock movements (oid, no_produit, type, quantite, date_heure, usager)

**Column Mappings**:
- Product ID: no_produit, product_id, produit, sku, ref, id
- Product name: nom_produit, product_name, name, libelle, designation
- Quantity: quantite, quantity, qty, qte
- Date: date_heure, datetime, date, timestamp, movement_date

**Enabled Analyses**:
- ABC Classification
- Inventory Overview

**Validation Rules**:
- Unique product IDs
- Positive quantities only
- Dates not in future

### Template 2: Full Analytics Warehouse

**Purpose**: Complete warehouse with orders, receptions, and users

**Schema**:
- All basic warehouse tables, plus:
- `commandes` table: Order management
- `receptions` table: Receipt tracking
- `usagers` table: User management

**Additional Enabled Analyses**:
- Flux analyses (temporal, spatial, operational)
- Personnes analyses (productivity, teams, performance)
- Product analyses (lifecycle, stock)
- Order analyses (fulfillment, lead-time)
- Supplier analyses (performance)

## Template Matching Architecture

### Matching Process

**Objective**: Find best matching template for uploaded Excel data

**Algorithm Scoring**:
1. **Table presence**: 5 points per matching table
2. **Column presence**: 1 point per matching column
3. **Total score**: (points earned / max possible points) × 100

**Matching Strategy**:
- **Exact match**: Column name matches exactly
- **Alias match**: Column name matches defined alias
- **Fuzzy match**: Levenshtein distance within threshold
- **Synonym match**: Column name matches synonym list

**Result**:
- Best matching template
- Alternative templates with lower scores
- Confidence score (0-1)
- Missing tables/columns
- Whether import is possible
- Which analyses would be unavailable

### Template Matching Result Type

```typescript
type TemplateMatchResult = {
  readonly bestMatch: TemplateMatch
  readonly alternatives: readonly TemplateMatch[]
  readonly confidence: number  // 0-1
}

type TemplateMatch = {
  readonly template: DataTemplate
  readonly score: number  // 0-100
  readonly missingTables: readonly string[]
  readonly missingColumns: Record<string, readonly string[]>  // table -> columns
  readonly confidence: number  // 0-1

  // Can data be imported with this template?
  readonly canImport: boolean

  // Would some analyses be unavailable?
  readonly unavailableAnalyses?: readonly string[]
}
```

## Template-Based Analysis Unlocking

### Automatic Analysis Activation

**Process**:
1. User imports data
2. System matches best template
3. System checks which analyses can run with imported data
4. UI shows available analyses (enabled) and blocked analyses (disabled with reason)

**Requirements Checking**:
- **Tables required**: All tables present in imported data
- **Columns required**: All columns present in respective tables
- **Row count**: Minimum rows threshold met
- **Date range**: Sufficient time span (if applicable)

**Available Analysis Result**:
```typescript
type AvailableAnalysis = {
  readonly analysis: AnalysisDefinition
  readonly available: boolean
  readonly reason: string
  readonly missingData?: readonly string[]
}
```

## Custom Templates

### Template Builder Approach

Users can create custom templates through:

1. **Visual Template Builder UI**:
   - Select tables to include
   - Define column mappings
   - Choose analyses to enable
   - Set validation rules
   - Preview and test template

2. **Template Definition Steps**:
   - Start new template
   - Add table schemas
   - Configure column mappings (exact, fuzzy, synonyms)
   - Enable analyses
   - Add validation rules
   - Define export templates
   - Save and test

### Template Sharing

**Future Capability**: Template Marketplace

Users will be able to:
- Browse community templates
- Download templates for specific WMS systems
- Upload custom templates
- Rate and review templates
- Get notifications for template updates

## Template Versioning

### Version Management

**Version Strategy**: Semantic versioning (MAJOR.MINOR.PATCH)

- **MAJOR**: Breaking schema changes
- **MINOR**: New tables/columns added
- **PATCH**: Validation rule updates

**Migration Process**:
1. User imports data with older template version
2. System detects version difference
3. System applies migration script if available
4. User prompted to confirm migration
5. Data migrated to new schema
6. Template version updated

**Template Version Type**:
```typescript
type TemplateVersion = {
  readonly templateId: string
  readonly version: string
  readonly changelog: string
  readonly createdAt: Date
  readonly migrationRequired: boolean
  readonly migrationScript?: string
}
```

**Migration Function**:
```typescript
type MigrationFunction = (
  data: DataSet,
  fromVersion: string,
  toVersion: string
) => Promise<DataSet>
```

## Template Registry

**Storage Location**: Local SQLite database (templates table)

**Registry Operations**:
- List all available templates
- Get template by ID
- Save custom template
- Update template
- Delete template
- Get template version history

**Default Templates**:
Shipped with application, updated via app updates

**User Templates**:
Created by user, stored separately, not affected by app updates

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft - Architecture & Types Only

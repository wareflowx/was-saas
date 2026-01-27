# Data Models and Import Plugin System

## Data Model Philosophy

The data model follows these principles:
1. **Import Plugins Transform Data**: Every WMS needs a TypeScript plugin to transform its Excel export into the normalized schema
2. **Single Normalized Schema**: All plugins produce the same output schema - this is critical for consistency
3. **Local SQLite Storage**: All data stored locally on user's machine - no cloud dependency
4. **Multi-Warehouse Support**: Multiple warehouses can coexist in the same database, each with independent imports
5. **Incremental Imports**: Users can reimport data to update existing records (no full wipe required)
6. **Adaptive Analyses**: Analyses are available/disabled based on which data has been imported
7. **Preserve Source Data**: Keep original WMS data accessible for debugging and audit trails
8. **Schema Version Controlled**: Track schema changes over time with migrations

## Import Plugin Architecture

### The Import Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER UPLOADS WMS EXCEL FILE                             │
│     - User selects Excel file from their WMS                │
│     - File may contain multiple sheets (tables)             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. PLUGIN DETECTION                                        │
│     - System suggests appropriate plugin based on format    │
│     - User confirms or selects plugin manually              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. PLUGIN VALIDATES INPUT                                 │
│     - Plugin checks if required sheets/columns are present  │
│     - Reports missing or invalid data                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. PLUGIN TRANSFORMS DATA (TypeScript)                    │
│     - Plugin reads WMS-specific format                      │
│     - Applies business logic and transformations             │
│     - Outputs normalized Wareflow schema                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. VALIDATE NORMALIZED OUTPUT                             │
│     - System validates against normalized schema            │
│     - Checks referential integrity                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  6. LOAD TO LOCAL SQLITE                                   │
│     - Create/update tables in local SQLite database        │
│     - Insert normalized data with transaction management    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  7. UPDATE AVAILABLE ANALYSES                              │
│     - System checks which analyses can now run              │
│     - Updates UI with available analyses                    │
└─────────────────────────────────────────────────────────────┘
```

### Plugin Contract (TypeScript Types)

Every import plugin must implement this type definition:

```typescript
type ImportPlugin = {
  // Plugin identification
  readonly id: string                    // e.g., 'sap-ewm', 'manhattan', 'generic-excel'
  readonly name: string
  readonly version: string
  readonly description: string
  readonly author: string

  // WMS compatibility
  readonly wmsSystem: string
  readonly wmsVersions?: readonly string[]
  readonly supportedFormats: readonly ('xlsx' | 'xls' | 'csv')[]

  // What this plugin expects from WMS Excel
  readonly inputSchema: WMSInputSchema

  // Validate WMS input before transformation
  readonly validate: (input: WMSInputData) => readonly ValidationResult[]

  // Transform WMS data → Normalized schema
  readonly transform: (input: WMSInputData, context: TransformContext) => Promise<NormalizedData>

  // Optional: Configuration UI for plugin-specific settings
  readonly configSchema?: z.ZodType
  readonly defaultConfig?: unknown
}

// Output: All plugins produce this normalized schema
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
```

### Default Plugins Included

1. **Generic Excel Plugin**
   - Flexible column mapping UI
   - User manually maps columns to normalized schema
   - Good for unknown or custom WMS formats

2. **SAP EWM Plugin** (example)
   - Pre-configured for SAP EWM exports
   - Handles SAP-specific column names and data formats
   - No user mapping required

3. **Manhattan Plugin** (future)
   - Pre-configured for Manhattan Associates WMS
   - Handles Manhattan-specific data structures

### Custom Plugins

Users can create custom plugins in TypeScript for their specific WMS systems. Custom plugins follow the same `ImportPlugin` type contract and must:

1. **Define input schema**: Specify which Excel sheets and columns the plugin expects
2. **Implement validate function**: Check that input data matches expected format
3. **Implement transform function**: Convert WMS-specific data to normalized schema
4. **Provide metadata**: Plugin identification, version, compatibility information

## Multi-Warehouse Architecture

### Warehouse Isolation

When dealing with multiple warehouses (e.g., different locations, different WMS systems), each warehouse operates independently within the same database:

```typescript
// Warehouse configuration type
type Warehouse = {
  readonly id: string                    // e.g., 'wh-paris', 'wh-lyon'
  readonly name: string                  // Display name
  readonly location: string              // City, country
  readonly wmsSystem: string             // Which WMS this warehouse uses
  readonly pluginId: string              // Which import plugin to use

  // Metadata
  readonly createdAt: Date
  readonly lastImportAt?: Date           // Last successful import
  readonly lastImportCount?: number      // Number of rows in last import

  // Import history
  readonly imports: readonly ImportMetadata[]
}

type ImportMetadata = {
  readonly id: string
  readonly warehouseId: string
  readonly importedAt: Date
  readonly pluginId: string
  readonly pluginVersion: string
  readonly sourceFile: string
  readonly rowsProcessed: number
  readonly status: 'success' | 'partial' | 'failed'
  readonly errorMessage?: string
}
```

### Data Isolation Strategy

**Option 1: Prefixed Tables (Recommended for MVP)**
```sql
-- Each warehouse has its own tables with prefix
CREATE TABLE [wh-paris]_produits (
  no_produit INTEGER PRIMARY KEY,
  nom_produit TEXT NOT NULL,
  -- ...
);

CREATE TABLE [wh-lyon]_produits (
  no_produit INTEGER PRIMARY KEY,
  nom_produit TEXT NOT NULL,
  -- ...
);

-- Shared metadata table
CREATE TABLE warehouses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  wms_system TEXT,
  plugin_id TEXT,
  created_at TEXT,
  last_import_at TEXT
);
```

**Option 2: Single Table with Warehouse Column**
```sql
-- Shared tables with warehouse_id column
CREATE TABLE produits (
  warehouse_id TEXT NOT NULL,           -- Partition key
  no_produit INTEGER NOT NULL,
  nom_produit TEXT NOT NULL,
  -- ...
  PRIMARY KEY (warehouse_id, no_produit)
);

CREATE INDEX idx_produits_warehouse ON produits(warehouse_id);
```

### Incremental Import Strategy

Users can reimport data to update their warehouse. The system supports:

```typescript
// Import mode type
type ImportMode =
  | 'full'          // Replace all data for this warehouse
  | 'incremental'   // Insert new, update existing, delete missing
  | 'append'        // Only insert new records (never update/delete)

// Import options type
type ImportOptions = {
  readonly mode: ImportMode
  readonly warehouseId: string
  readonly dateRange?: {
    readonly start: Date
    readonly end: Date
  }
  readonly dryRun?: boolean             // Preview changes without applying
}

// Import result type
type ImportResult = {
  readonly status: 'success' | 'partial' | 'failed'
  readonly warehouseId: string
  readonly stats: {
    readonly inserted: number
    readonly updated: number
    readonly deleted: number
    readonly skipped: number            // Unchanged records
  }
  readonly duration: number             // milliseconds
  readonly errors: readonly ImportError[]
}
```

### Import Workflow for Multi-Warehouse

The import process for multi-warehouse environments follows these steps:

1. **Select warehouse**: User chooses which warehouse to update
2. **Configure import**: User specifies import mode (full/incremental/append) and optional date range
3. **Execute import**: System processes Excel file using warehouse's assigned plugin
4. **Update analysis availability**: System recalculates which analyses can run based on updated data

Each warehouse maintains its own import history and operates independently from other warehouses.

### Data Merging Strategy

For incremental imports, the system merges new data with existing data by comparing records based on primary keys:

**Merge Operations**:
- **Insert**: Records in incoming data that don't exist in database
- **Update**: Records that exist but have different values (system compares all fields)
- **Delete**: Records in database that are missing from incoming data
- **Skip**: Records that exist and haven't changed

**Merge Process**:
1. Build in-memory maps of existing and incoming records for O(1) lookups
2. Compare records by primary key to identify operation needed
3. Apply all changes in a single database transaction
4. Return statistics (inserted/updated/deleted/skipped counts)

This ensures users can update their warehouse data without losing historical records or needing to do full imports.

## Adaptive Analysis Availability

### Analysis Requirements

Each analysis declares what data it needs:

```typescript
// Analysis requirements type
type AnalysisRequirements = {
  readonly requiredTables: readonly string[]
  readonly optionalTables?: readonly string[]

  // Data quality requirements
  readonly minRows?: number
  readonly dateRange?: {
    readonly column: string
    readonly minDays: number
  }

  // Column requirements
  readonly requiredColumns?: Record<string, readonly string[]>
}
```

### Availability Checking

The system automatically determines which analyses can run based on imported data:

**Checking Process**:
1. **Required tables**: Verify all required tables exist for warehouse
2. **Minimum rows**: Check if tables meet minimum row count requirements
3. **Date range**: Validate sufficient data span for time-based analyses
4. **Column requirements**: Ensure required columns exist and have valid data

**Availability Result**:
- **Available**: All requirements met, analysis can run
- **Blocked**: Missing requirements with descriptive reason (e.g., "Missing table: commandes", "Insufficient data: 50 rows (minimum 100 required)")

**UI Behavior**:
- ✅ Available analyses: Fully clickable, normal styling
- ❌ Blocked analyses: Grayed out with explanation of what's missing

### UI Adaptation

The UI automatically adapts to show which analyses are available:

**Visual Indicators**:
- **Available analyses**: Displayed with full color, clickable buttons
- **Blocked analyses**: Grayed out with disabled interaction, show blocking reason

**User Feedback**:
- Clear explanation of why an analysis is blocked
- Specific list of missing tables/columns
- Suggested actions to enable the analysis (e.g., "Import commandes data to enable this analysis")

## Core Data Entities

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   produits   │────────<│  mouvements  │>────────│   usagers    │
│              │  (1:N)  │              │  (N:1)  │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                       │
       │                       │
       v                       v
┌──────────────┐         ┌──────────────┐
│  categories  │         │  commandes   │
└──────────────┘         └──────────────┘
                                │
                                v
                         ┌──────────────┐
                         │  receptions  │
                         └──────────────┘
```

### Core Tables

#### 1. Products (produits)

```sql
CREATE TABLE produits (
  -- Primary key
  no_produit INTEGER PRIMARY KEY,

  -- Basic information
  nom_produit TEXT NOT NULL,
  description TEXT,

  -- Categorization (3 levels)
  classe_produit TEXT,
  categorie_1 TEXT,
  categorie_2 TEXT,
  categorie_3 TEXT,

  -- Status and configuration
  etat TEXT,  -- Active, Inactive, Discontinued
  configuration TEXT,

  -- Identifiers
  ean_alternatif TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_produits_nom (nom_produit),
  INDEX idx_produits_categorie1 (categorie_1),
  INDEX idx_produits_etat (etat),
  INDEX idx_produits_ean (ean_alternatif)
);
```

**Usage**:
- Master product catalog
- Reference for all movements
- Basis for inventory analysis

#### 2. Movements (mouvements)

```sql
CREATE TABLE mouvements (
  -- Primary key
  oid INTEGER PRIMARY KEY,

  -- Product reference
  no_produit INTEGER NOT NULL,
  nom_produit TEXT NOT NULL,

  -- Movement type
  type TEXT NOT NULL,  -- SORTIE, ENTREE, TRANSFERT

  -- Source location (for outbound/transfer)
  site_source TEXT,
  zone_source TEXT,
  localisation_source TEXT,
  conteneur_source TEXT,

  -- Target location (for inbound/transfer)
  site_cible TEXT,
  zone_cible TEXT,
  localisation_cible TEXT,
  conteneur_cible TEXT,

  -- Quantity
  quantite_uoi TEXT,  -- Unit of issue
  quantite INTEGER NOT NULL,
  unite TEXT,

  -- Timestamp
  date_heure DATETIME NOT NULL,
  date_heure_2 TEXT,  -- Alternative format

  -- User and reason
  usager TEXT,
  raison REAL,
  lot_expiration REAL,
  date_expiration REAL,

  -- Foreign keys
  FOREIGN KEY (no_produit) REFERENCES produits(no_produit),

  -- Indexes
  INDEX idx_mouvements_produit (no_produit),
  INDEX idx_mouvements_date (date_heure),
  INDEX idx_mouvements_type (type),
  INDEX idx_mouvements_usager (usager)
);
```

**Usage**:
- Core operational data
- Basis for ABC analysis
- Source for flux analysis

#### 3. Orders (commandes)

```sql
CREATE TABLE commandes (
  -- Primary key
  commande TEXT PRIMARY KEY,

  -- Order type
  type_commande TEXT,

  -- Parties involved
  demandeur TEXT,
  destinataire TEXT,
  no_destinataire INTEGER,

  -- Priority and scheduling
  priorite INTEGER,
  vague TEXT,
  date_requise DATETIME,

  -- Order details
  lignes INTEGER,  -- Number of lines
  chargement TEXT,
  transporteur TEXT,

  -- Status tracking
  etat_inferieur TEXT,
  etat_superieur TEXT,
  etat TEXT,
  statut_prepositionnement_max TEXT,
  statut_prepositionnement_actuel TEXT,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Usage**:
- Order fulfillment analysis
- Demandeur performance
- Lead time analysis

#### 4. Receptions (receptions)

```sql
CREATE TABLE receptions (
  -- Primary key
  no_reference INTEGER PRIMARY KEY,

  -- Reception reference
  reception INTEGER,

  -- Quantity and product
  quantite_recue INTEGER NOT NULL,
  produit INTEGER NOT NULL,

  -- Supplier information
  fournisseur TEXT,

  -- Location
  site TEXT,
  localisation_reception TEXT,

  -- Timing
  date_reception DATETIME NOT NULL,

  -- User and status
  utilisateur TEXT,
  etat TEXT,

  -- Lot tracking
  numero_lot REAL,
  date_expiration REAL,

  -- Foreign keys
  FOREIGN KEY (produit) REFERENCES produits(no_produit),

  -- Indexes
  INDEX idx_receptions_produit (produit),
  INDEX idx_receptions_fournisseur (fournisseur),
  INDEX idx_receptions_date (date_reception)
);
```

**Usage**:
- Supplier performance
- Lot/expiration tracking
- Receipt analysis

#### 5. Users (usagers) - Virtual Entity

Users are typically extracted from movement data rather than stored as a separate table:

**User Statistics**:
- Total movements performed by user
- First and last movement dates
- Average movements per day
- Movement types distribution

This virtual entity is created on-demand from the `mouvements` table's `usager` column.

## Import System Architecture

### Import Pipeline

**1. File Upload**: User drags & drops Excel file or selects from file system

**2. Parse & Detect**:
- Parse Excel sheets using SheetJS or ExcelJS
- Detect columns using fuzzy matching
- Detect data types automatically

**3. Template Matching**:
- Match against known WMS templates
- Calculate confidence scores
- Suggest best matching plugin/template

**4. Mapping UI**:
- Show detected column mapping
- Allow user manual adjustments
- Preview data transformation

**5. Validation**:
- Check required columns present
- Validate data types
- Check referential integrity

**6. Data Load**:
- Batch insert to local SQLite database
- Update indexes
- Create import history record

**7. Post-Import**:
- Update available analyses
- Generate import statistics
- Calculate baseline metrics

### Column Detection and Mapping

**Detection Strategy**:
- Fuzzy matching using Levenshtein distance
- Synonym detection (e.g., "SKU" → "no_produit")
- Pattern matching for date formats

**Column Mapping Result**:
- Source column (from Excel)
- Target column (normalized schema)
- Confidence score (0-1)
- Suggested transformation if needed

### Data Validation Rules

**Common Validation Rules**:
- **Primary key uniqueness**: No duplicate primary keys
- **Required columns**: All required columns present
- **Data types**: Values match expected types
- **Referential integrity**: Foreign keys reference valid records
- **Date ranges**: Dates are reasonable (not in future)
- **Business rules**: Quantities > 0, required fields populated

**Validation Result**:
- Severity: error / warning / info
- Location: sheet / row / column
- Message: Description of issue
- Suggestion: How to fix

### Template Matching

**Matching Algorithm**:
1. Compare detected tables against template schemas
2. Score based on tables present (10 points each)
3. Score based on columns present (1 point each)
4. Calculate match percentage
5. Return sorted list by confidence score

**Match Result**:
- Template that matched
- Confidence score (0-1)
- Missing tables (if any)
- Missing columns (if any)

### Data Transformations

**Normalization Pipeline**:
1. Read raw row from Excel
2. Apply type conversions per column
3. Validate against schema
4. Return normalized record

**Type Conversions**:
- **Integer**: Parse numeric strings, handle nulls
- **Float**: Parse decimal values, handle locale formats
- **Date**: Handle Excel serial dates, ISO strings, locale formats
- **Text**: Trim whitespace, handle null/empty

### Data Quality Monitoring

**Quality Metrics Calculated**:
- **Completeness**: Ratio of complete rows to total rows
- **Accuracy**: Ratio of valid values to total values
- **Consistency**: Duplicate records, referential integrity violations
- **Timeliness**: Data age (oldest to newest date span)

These metrics are displayed to user after import to assess data quality.

### Import Error Handling

**Structured Error Types**:
- **File errors**: Invalid format, file too large, corrupt file
- **Sheet errors**: Missing required sheets
- **Column errors**: Missing required columns, invalid data types
- **Row errors**: Constraint violations, invalid values
- **Value errors**: Type mismatches, out-of-range values

**Error Information**:
- Location (sheet/row/column)
- Error code and message
- Suggestion for fixing
- Whether import can continue

**Import Result**:
- Success/failure status
- Rows processed/inserted/failed
- Errors and warnings arrays
- Data quality metrics

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Status**: Draft

# Technical Architecture

## System Architecture Overview

Wareflow follows a **local-first, plugin-based layered architecture** with clear separation of concerns. All data processing happens on the user's machine - no cloud services required.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ELECTRON DESKTOP APP                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    PRESENTATION LAYER                    │  │
│  │  React UI Components │ Data Tables │ Visualizations │ Forms│  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (TypeScript)                │
│  ┌────────────────┐  ┌─────────────────┐  ┌────────────────┐   │
│  │ Import Engine  │  │ Analysis Engine │  │ Export Engine  │   │
│  │  + Plugin Sys  │  │  + Registry     │  │  + Templates   │   │
│  └────────────────┘  └─────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       LOCAL SQLITE DATABASE                      │
│  • Products  • Movements  • Orders  • All normalized data       │
│  • Stored locally on user's machine  • No cloud sync             │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Desktop App (Electron + React)

```yaml
Framework: Electron 28+
Runtime: Node.js 20 LTS (embedded in Electron)

Frontend:
  Framework: React 18.3+
  Language: TypeScript 5.3+
  Build Tool: Vite 5.0+
  State Management: Zustand 4.5+
  UI Components: shadcn/ui + Radix UI
  Styling: Tailwind CSS 3.4+

Data Processing:
  Language: TypeScript 5.3+
  Excel Parser: SheetJS (xlsx) or ExcelJS
  Validation: Zod

Data Storage:
  Database: SQLite 3.40+ (local, embedded)
  ORM: Better-SQLite3 (synchronous SQLite driver)
  Location: User's data directory (OS-specific)
```

### Import Plugin System (TypeScript)

```yaml
Plugin Architecture:
  Language: TypeScript 5.3+
  Format: ES Modules
  Loading: Dynamic import()
  Hot Reload: Supported (dev mode)

Default Plugins:
  - Generic Excel Plugin (flexible mapping)
  - SAP EWM Plugin
  - Manhattan Plugin
  - Custom Templates
```

### Build & Distribution

```yaml
Packager: electron-builder
Build Targets:
  - Windows: NSIS installer + portable
  - macOS: DMG + PKG
  - Linux: AppImage + deb

Distribution:
  Channel: GitHub Releases
  Auto-update: electron-updater
  Code Signing: Optional (recommended for Windows)

No Cloud Services:
  - No authentication server
  - No database server
  - No API gateway
  - 100% offline capable
```

## Component Architecture

### 1. TypeScript Import Plugin System

```
┌─────────────────────────────────────────────────────────┐
│              IMPORT ENGINE (TypeScript)                  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Plugin Loader│→│  Transformer │→│   Validator  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              NORMALIZED DATA SCHEMA                      │
│  All plugins produce the same normalized schema          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              SQLITE DATABASE (Local)                     │
│  Batch insert with transaction management                │
└─────────────────────────────────────────────────────────┘
```

**Key Components**:
- `PluginLoader`: Dynamically loads TypeScript import plugins
- `Transformer`: Executes plugin transformation logic (WMS → Normalized)
- `Validator`: Validates normalized data against schema
- `DatabaseLoader`: Batch loads to local SQLite with transactions

**Plugin Interface (TypeScript Types & Functions)**:
```typescript
// Using type aliases and functions only - NO interfaces, NO classes
type ImportPlugin = {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly wmsSystem: string

  // What this plugin expects from Excel
  readonly inputSchema: WMSInputSchema

  // Transform function
  readonly transform: (input: WMSInputData, context: TransformContext) => Promise<NormalizedData>

  // Validate function
  readonly validate: (input: WMSInputData) => ValidationResult[]
}
```

### 2. Analysis Engine (Functional Approach)

**Core Types**:
```typescript
// Analysis definition as a type alias
type AnalysisDefinition = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly category: AnalysisCategory

  // Required data
  readonly requirements: DataRequirements

  // Execute function (pure)
  readonly execute: (data: DataSet, config: AnalysisConfig) => Promise<AnalysisResult>
}

// Registry as a Record type
type AnalysisRegistry = Record<string, AnalysisDefinition>
```

**Key Functions**:
- `executeAnalysis`: Check requirements, then execute analysis
- `canExecuteAnalysis`: Verify all required tables present
- `listAvailableAnalyses`: Filter analyses by data availability

**Component Breakdown**:

```
src/analysis/
├── core/
│   ├── engine.ts              # Main orchestration
│   ├── registry.ts            # Analysis registration
│   ├── executor.ts            # Execution with dependency resolution
│   └── validator.ts           # Pre-condition validation
├── data/
│   ├── dataset.ts             # DataSet interface
│   ├── query-builder.ts       # Query construction
│   └── transformations.ts     # Common transformations
├── results/
│   ├── result.ts              # Result types
│   ├── exporter.ts            # Export formatting
│   └── visualizer.ts          # Visualization helpers
└── plugins/
    ├── loader.ts              # Dynamic plugin loading
    ├── api.ts                 # Plugin API surface
    └── registry.ts            # Plugin registry
```

### 3. Local SQLite Database Architecture (Functional)

**Core Type**:
```typescript
// Database configuration as a type
type DatabaseConfig = {
  readonly path: string
  readonly mode: 'read-write' | 'read-only'
}
```

**Key Functions**:
- `createConnection`: Create database connection from config
- `executeQuery`: Execute parameterized query with params
- `executeTransaction`: Wrap operations in transaction
- `insertData`: Batch insert data with transaction
- `getDatabasePath`: Get OS-specific database path

**Schema Management**:
- Single normalized schema used by all plugins
- Schema version tracked in `schema_migrations` table
- Functional migrations: `(db: Database.Database, from: string, to: string) => void`
- Rollback capability with pure migration functions

**Performance Optimizations**:
- Synchronous operations (Better-SQLite3) for better control
- Batch inserts with pure transaction functions
- Proper indexing on foreign keys and query columns
- WAL mode for concurrent reads
- Periodic VACUUM with pure maintenance functions

### 4. Export Engine (Functional)

**Core Types**:
```typescript
// Export configuration type
type ExportConfig = {
  readonly format: 'excel' | 'csv' | 'pdf'
  readonly outputPath: string
  readonly template?: ExportTemplate
}

// Export template type (using type alias, not interface)
type ExportTemplate = {
  readonly id: string
  readonly name: string
  readonly format: 'excel' | 'csv' | 'pdf'
  readonly headerStyle?: {
    readonly font?: unknown  // ExcelJS.Font
    readonly fill?: unknown   // ExcelJS.Fill
    readonly alignment?: unknown  // ExcelJS.Alignment
  }
  readonly conditionalFormatting?: unknown[]  // ExcelJS.ConditionalFormatting[]
}
```

**Key Functions**:
- `exportToExcel`: Create workbook, add data, apply template, save file
- `applyTemplate`: Apply header styles and conditional formatting to worksheet

## Data Flow

### Import Flow

```
User uploads Excel
    ↓
FileParser reads file
    ↓
ColumnDetector identifies columns
    ↓
TemplateMatcher suggests template
    ↓
User reviews/adjusts mapping
    ↓
DataValidator validates
    ↓
DatabaseLoader inserts data
    ↓
AnalysisEngine updates available analyses
    ↓
UI updates dashboard
```

### Analysis Flow

```
User selects analysis
    ↓
AnalysisEngine.checkRequirements()
    ↓
Gather configuration from user
    ↓
AnalysisEngine.execute()
    ↓
Query data from database
    ↓
Apply transformations
    ↓
Calculate results
    ↓
Format results
    ↓
Return to UI
```

### Export Flow

```
User clicks export
    ↓
Select export template
    ↓
Apply formatting
    ↓
Generate Excel file
    ↓
Download to user location
```

## Database Schema Strategy

### Local-First SQLite Database

**Database File Location**:
```typescript
// Cross-platform database path
const DB_PATH = {
  windows: 'C:\\Users\\<user>\\AppData\\Roaming\\Wareflow\\wareflow.db',
  mac: '/Users/<user>/Library/Application Support/Wareflow/wareflow.db',
  linux: '/home/<user>/.config/Wareflow/wareflow.db'
}
```

### Schema Versioning

```sql
-- Schema version tracking (local only)
CREATE TABLE schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now')),
  description TEXT
);

-- Import history (local audit trail)
CREATE TABLE import_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plugin_id TEXT NOT NULL,
  plugin_version TEXT NOT NULL,
  imported_at TEXT DEFAULT (datetime('now')),
  rows_imported INTEGER,
  source_file TEXT,
  status TEXT NOT NULL  -- 'success', 'partial', 'failed'
);
```

### Normalized Schema (All Plugins Output)

**Key Principle**: Every import plugin produces the same normalized schema.

```sql
-- Core tables (all plugins populate these)
CREATE TABLE produits (...);
CREATE TABLE mouvements (...);
CREATE TABLE commandes (...);
-- Additional tables as defined in normalized schema
```

This ensures:
- ✅ All analyses work on any WMS data
- ✅ Plugins are interchangeable
- ✅ Schema is stable and predictable
- ✅ Migrations are centralized

## Performance Considerations

### 1. Virtual Scrolling

For large datasets, use virtualization to render only visible rows:
- Library: `@tanstack/react-virtual`
- Render only visible rows + overscan buffer
- Dramatically reduces DOM nodes for large tables

### 2. Lazy Loading

Load analyses on-demand using dynamic imports:
- Reduces initial bundle size
- Load analysis code only when needed
- Improves app startup time

### 3. Background Processing

Long-running analyses should run in Web Workers:
- Prevents UI freezing during computation
- Parallel processing for independent analyses
- Progress reporting to main thread

### 4. Database Indexing

Critical indexes for performance:
```sql
CREATE INDEX idx_mouvements_produit ON mouvements(no_produit);
CREATE INDEX idx_mouvements_date ON mouvements(date_heure);
CREATE INDEX idx_mouvements_type ON mouvements(type);
CREATE INDEX idx_mouvements_usager ON mouvements(usager);
CREATE INDEX idx_produits_categorie ON produits(categorie_1);
```

## Security Considerations

### 1. Input Validation

All user inputs must be validated with Zod schemas before processing:
- Define schemas for all user-facing inputs
- Validate at system boundaries (file upload, API calls)
- Type-safe runtime validation

### 2. SQL Injection Prevention

Always use parameterized queries:
- Never concatenate user input into SQL strings
- Use prepared statements with bound parameters
- Better-SQLite3 automatically handles parameterization

### 3. File Upload Security

Validate all file uploads:
- **Size limit**: Reject files > 100MB (configurable)
- **Type validation**: Only allow .xlsx, .xls, .csv files
- **Content sanitization**: Remove formulas/macros from Excel files
- **Validation**: Check file signatures, not just extensions

## Error Handling Strategy

**Error Type Structure**:
```typescript
type AnalysisError = {
  readonly code: string
  readonly message: string
  readonly suggestions: readonly string[]
}
```

**Error Handling Approach**:
- Catch errors at appropriate boundaries
- Show user-friendly error messages
- Provide actionable suggestions for recovery
- Log technical details for debugging

## Testing Strategy

```yaml
Unit Tests:
  Framework: Vitest
  Coverage: > 80%
  Focus: Business logic, transformations

Integration Tests:
  Framework: Vitest + Playwright
  Coverage: Critical paths
  Focus: Import → Analyze → Export

E2E Tests:
  Framework: Playwright
  Coverage: Key workflows
  Focus: User journeys

Performance Tests:
  Tool: k6
  Scenarios: Large dataset handling
```

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Status**: Draft

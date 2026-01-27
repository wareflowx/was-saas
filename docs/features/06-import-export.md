# Import and Export Workflows Architecture

## Overview

This document describes the complete workflows for importing raw Excel data and exporting formatted Excel reports.

## Import Workflow

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────────┐
│  1. FILE SELECTION                                           │
│     User selects Excel file(s) via drag & drop or browser    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. FILE VALIDATION                                          │
│     ✓ Check file format (.xlsx, .xls)                        │
│     ✓ Check file size (max 100MB)                            │
│     ✓ Check file integrity                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. FILE PARSING                                             │
│     • Parse Excel sheets                                     │
│     • Extract headers and data                               │
│     • Detect data types                                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. TEMPLATE MATCHING                                        │
│     • Match columns against known templates                  │
│     • Calculate confidence scores                            │
│     • Suggest best matching template                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. MAPPING REVIEW (User Interaction)                        │
│     • Show detected mapping                                  │
│     • Allow user adjustments                                 │
│     • Preview data transformation                            │
│     • Confirm or modify template selection                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  6. DATA VALIDATION                                          │
│     • Validate required columns present                      │
│     • Validate data types                                    │
│     • Check business rules                                   │
│     • Verify referential integrity                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  7. DATA TRANSFORMATION                                     │
│     • Normalize column names                                 │
│     • Convert data types                                     │
│     • Apply transformations                                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  8. DATABASE LOADING                                         │
│     • Create/update schema                                  │
│     • Batch insert data                                     │
│     • Update indexes                                         │
│     • Create data version                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  9. POST-IMPORT                                              │
│     • Update available analyses                             │
│     • Calculate base statistics                            │
│     • Create baseline metrics                               │
│     • Generate data quality report                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  10. COMPLETE                                                │
│      Show summary and next steps                             │
└─────────────────────────────────────────────────────────────┘
```

### Import State Machine Type

```typescript
type ImportState =
  | 'idle'           // No import in progress
  | 'selecting'      // User selecting files
  | 'validating'     // Validating file format
  | 'parsing'        // Parsing file contents
  | 'matching'       // Matching templates
  | 'reviewing'      // User reviewing mapping
  | 'validating-data'// Validating data
  | 'transforming'   // Transforming data
  | 'loading'        // Loading to database
  | 'finalizing'     // Post-import tasks
  | 'completed'      // Import complete
  | 'failed'         // Import failed

type ImportEvent =
  | { readonly type: 'SELECT_FILES'; readonly files: File[] }
  | { readonly type: 'VALIDATION_PASS' }
  | { readonly type: 'VALIDATION_FAIL'; readonly errors: readonly ImportError[] }
  | { readonly type: 'PARSE_COMPLETE'; readonly data: ParsedData }
  | { readonly type: 'TEMPLATE_SELECTED'; readonly template: DataTemplate }
  | { readonly type: 'MAPPING_CONFIRMED'; readonly mapping: readonly ColumnMapping[] }
  | { readonly type: 'DATA_VALIDATION_PASS' }
  | { readonly type: 'DATA_VALIDATION_FAIL'; readonly errors: readonly ValidationError[] }
  | { readonly type: 'LOAD_COMPLETE'; readonly stats: ImportStats }
  | { readonly type: 'FINALIZE_COMPLETE' }
  | { readonly type: 'ERROR'; readonly error: Error }
```

### Import Progress Tracking Type

```typescript
type ImportProgress = {
  readonly state: ImportState
  readonly progress: number  // 0-100
  readonly currentStep: string
  readonly totalSteps: number
  readonly currentStepNumber: number

  // Detailed progress
  readonly details: {
    readonly rowsProcessed: number
    readonly totalRows: number
    readonly tablesProcessed: number
    readonly totalTables: number
  }

  // Errors and warnings
  readonly errors: readonly ImportError[]
  readonly warnings: readonly ImportWarning[]

  // Estimated time remaining
  readonly eta: number | null  // seconds
}

// Progress update callback
type ProgressCallback = (progress: ImportProgress) => void
```

### Error Handling Type

```typescript
type ImportError = {
  readonly type: 'file' | 'sheet' | 'column' | 'row' | 'value' | 'database'
  readonly severity: 'error' | 'warning' | 'info'

  // Location
  readonly file?: string
  readonly sheet?: string
  readonly row?: number
  readonly column?: string

  // Error details
  readonly code: string
  readonly message: string
  readonly suggestion?: string

  // Recovery
  readonly canContinue: boolean
  readonly recoveryAction?: string
}
```

**Error Code Categories**:
- **File errors (E001-E099)**: File not found, too large, invalid format, corrupt
- **Sheet errors (E101-E199)**: No sheets, empty sheet, sheet not found
- **Column errors (E201-E299)**: Required column missing, type mismatch, duplicates
- **Row errors (E301-E399)**: Duplicate primary key, missing foreign key, invalid value
- **Database errors (E401-E499)**: Connection failed, constraint violation, transaction failed

## Export Workflow

### Export Process

```
┌─────────────────────────────────────────────────────────────┐
│  1. SELECT EXPORT                                           │
│     User chooses analysis result to export                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. SELECT TEMPLATE                                         │
│     User selects export template or uses default            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. CONFIGURE EXPORT                                        │
│     • Choose output filename                                │
│     • Choose output location                                │
│     • Configure formatting options                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. GENERATE EXCEL                                          │
│     • Apply template formatting                             │
│     • Create sheets                                         │
│     • Add data                                              │
│     • Add charts and visualizations                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. SAVE FILE                                               │
│     Write Excel file to disk                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  6. COMPLETE                                                │
│     Show success message and open location                  │
└─────────────────────────────────────────────────────────────┘
```

### Export Template Structure Type

```typescript
type ExportTemplate = {
  readonly id: string
  readonly name: string
  readonly description: string

  // Sheets configuration
  readonly sheets: readonly SheetConfig[]

  // Global formatting
  readonly formatting: {
    // Metadata
    readonly title?: string
    readonly subtitle?: string
    readonly logo?: string
    readonly author?: string
    readonly generatedAt?: boolean

    // Styles
    readonly headerFont: { readonly name: string; readonly size: number; readonly bold: boolean; readonly color: string }
    readonly rowFont: { readonly name: string; readonly size: number; readonly bold: boolean; readonly color: string }

    // Colors
    readonly headerBgColor: string
    readonly alternateRowColor: string

    // Borders
    readonly borderStyle: 'thin' | 'medium' | 'thick'
    readonly borderColor: string
  }
}

type SheetConfig = {
  readonly name: string
  readonly type: 'data' | 'summary' | 'chart' | 'pivot'

  // Data source
  readonly dataSource: {
    readonly analysisId?: string
    readonly tableName?: string
    readonly query?: string
  }

  // Layout
  readonly layout: {
    readonly freezeHeader: boolean
    readonly autoFilter: boolean
    readonly autoFitColumns: boolean
    readonly columnWidths?: Record<string, number>
  }

  // Content
  readonly columns?: readonly ColumnConfig[]
  readonly rows?: readonly RowConfig[]
  readonly charts?: readonly ChartConfig[]

  // Highlighting rules
  readonly highlights?: readonly HighlightRule[]
}

type ColumnConfig = {
  readonly key: string
  readonly header: string
  readonly width?: number
  readonly format?: 'text' | 'number' | 'date' | 'currency' | 'percentage'
  readonly numberFormat?: string
  readonly alignment?: 'left' | 'center' | 'right'
}

type HighlightRule = {
  readonly condition: (row: unknown) => boolean
  readonly style: {
    readonly bgColor?: string
    readonly fontColor?: string
    readonly bold?: boolean
    readonly italic?: boolean
  }
}

type ChartConfig = {
  readonly type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap'
  readonly title: string
  readonly dataSource: {
    readonly xAxis: string
    readonly yAxis: string
    readonly groupBy?: string
  }
  readonly position: {
    readonly row: number
    readonly column: number
    readonly height: number
    readonly width: number
  }
  readonly style: {
    readonly colors?: readonly string[]
    readonly showLegend: boolean
    readonly showDataLabels: boolean
  }
}
```

### Export Engine Architecture

**Key Functions**:
- `exportToExcel`: Create workbook, apply template, save file
- `addDataTable`: Add data table with headers and formatting
- `addSummarySheet`: Add summary statistics
- `addChartSheet`: Add charts and visualizations
- `applySheetFormatting`: Apply formatting to sheet
- `applyHighlights`: Apply conditional formatting rules

**Sheet Types**:
- **Data sheets**: Tabular data from analysis results
- **Summary sheets**: Aggregated statistics and metrics
- **Chart sheets**: Visualizations and graphs
- **Pivot sheets**: Cross-tabulated data

## File Format Support

### Import Formats

| Format | Extension | Status | Notes |
|--------|-----------|--------|-------|
| Excel | .xlsx, .xls | ✅ Supported | Primary format |
| CSV | .csv | 🔄 Planned | With delimiter detection |
| JSON | .json | 🔄 Planned | For API imports |
| XML | .xml | ❌ Not planned | Too complex for warehouse data |

### Export Formats

| Format | Extension | Status | Notes |
|--------|-----------|--------|-------|
| Excel | .xlsx | ✅ Supported | With formatting |
| CSV | .csv | 🔄 Planned | Plain data export |
| PDF | .pdf | ❌ Not planned | Use Excel export + PDF converter |

## Batch Operations

### Batch Import Type

```typescript
type BatchImportOptions = {
  readonly files: readonly File[]
  readonly template?: DataTemplate
  readonly continueOnError: boolean
  readonly onProgress?: (progress: BatchImportProgress) => void
}

type BatchImportProgress = {
  readonly totalFiles: number
  readonly completedFiles: number
  readonly failedFiles: number
  readonly currentFile: string
  readonly overallProgress: number  // 0-100
}
```

### Batch Export Type

```typescript
type BatchExportOptions = {
  readonly results: readonly AnalysisResult[]
  readonly template: ExportTemplate
  readonly outputDirectory: string
  readonly namingPattern: string  // e.g., "{analysis_id}_{timestamp}.xlsx"
  readonly onProgress?: (progress: BatchExportProgress) => void
}

type BatchExportProgress = {
  readonly totalExports: number
  readonly completedExports: number
  readonly currentExport: string
  readonly overallProgress: number  // 0-100
}
```

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft - Architecture & Types Only

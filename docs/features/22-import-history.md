# Import History & Traceability

## Overview

This document describes the architecture for tracking, comparing, and managing data imports throughout their lifecycle. The system maintains complete audit trails of all imports, enables comparison between import versions, provides rollback capabilities, and tracks data lineage from source to final storage.

## Core Concepts

### Import Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. IMPORT INITIATED                                        │
│     File selected, import session created                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. IMPORT IN PROGRESS                                      │
│     Data validation, transformation, loading                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. IMPORT COMPLETED                                        │
│     Rollback point created, log entry saved                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. DATA LINEAGE RECORDED                                   │
│     Record-to-import mapping stored                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. CHANGE TRACKING COMPLETE                                │
│     Added/updated/deleted records catalogued                │
└─────────────────────────────────────────────────────────────┘
```

## Type Definitions

### ImportLog

Represents a complete audit trail entry for a single import operation.

```typescript
type ImportLog = {
  readonly id: string
  readonly timestamp: Date
  readonly warehouse: string

  // Source information
  readonly source: {
    readonly fileName: string
    readonly filePath: string
    readonly fileSize: number
    readonly fileHash: string
    readonly sheets: readonly string[]
  }

  // Import metadata
  readonly importMetadata: {
    readonly pluginId: string
    readonly pluginVersion: string
    readonly templateId: string
    readonly templateVersion: string
    readonly userId?: string
    readonly userName?: string
  }

  // Processing statistics
  readonly processing: {
    readonly duration: number  // milliseconds
    readonly startTime: Date
    readonly endTime: Date
    readonly rowsProcessed: number
    readonly rowsInserted: number
    readonly rowsUpdated: number
    readonly rowsDeleted: number
    readonly rowsSkipped: number
  }

  // Data quality metrics
  readonly dataQuality: {
    readonly totalRecords: number
    readonly validRecords: number
    readonly invalidRecords: number
    readonly errorRecords: number
    readonly completenessRate: number  // 0-1
    readonly validityRate: number  // 0-1
  }

  // Validation results
  readonly validation: {
    readonly errors: readonly ImportError[]
    readonly warnings: readonly ImportWarning[]
    readonly passed: boolean
  }

  // Status
  readonly status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'rolled-back'

  // Rollback point reference
  readonly rollbackPointId: string

  // Change summary
  readonly changes: ImportChanges
}
```

### ImportChanges

Summarizes what changed during an import operation.

```typescript
type ImportChanges = {
  readonly tables: readonly TableChange[]
  readonly summary: {
    readonly totalTablesAffected: number
    readonly totalRecordsChanged: number
    readonly totalRecordsAdded: number
    readonly totalRecordsUpdated: number
    readonly totalRecordsDeleted: number
  }
}

type TableChange = {
  readonly tableName: string
  readonly recordsAdded: number
  readonly recordsUpdated: number
  readonly recordsDeleted: number
  readonly recordsUnchanged: number
  readonly changes: readonly RecordChange[]
}

type RecordChange = {
  readonly recordType: 'insert' | 'update' | 'delete'
  readonly tableName: string
  readonly recordId: string
  readonly before?: Record<string, unknown>
  readonly after?: Record<string, unknown>
  readonly fieldChanges?: readonly FieldChange[]
}

type FieldChange = {
  readonly fieldName: string
  readonly oldValue: unknown
  readonly newValue: unknown
}
```

### ImportComparison

Compares two imports to identify differences.

```typescript
type ImportComparison = {
  readonly import1: ImportLogReference
  readonly import2: ImportLogReference
  readonly comparisonDate: Date

  // Summary differences
  readonly summaryDifferences: {
    readonly durationChange: number
    readonly rowsProcessedChange: number
    readonly dataQualityChange: DataQualityChange
  }

  // Table-level differences
  readonly tableDifferences: readonly TableDifference[]

  // Record-level differences
  readonly recordDifferences: readonly RecordDifference[]

  // Structural differences
  readonly structuralDifferences: {
    readonly tablesAdded: readonly string[]
    readonly tablesRemoved: readonly string[]
    readonly columnsAdded: readonly ColumnDifference[]
    readonly columnsRemoved: readonly ColumnDifference[]
  }
}

type ImportLogReference = {
  readonly importId: string
  readonly timestamp: Date
  readonly fileName: string
  readonly warehouse: string
}

type DataQualityChange = {
  readonly completenessRateChange: number
  readonly validityRateChange: number
  readonly errorRateChange: number
}

type TableDifference = {
  readonly tableName: string
  readonly recordCountChange: number
  readonly addedRecords: number
  readonly updatedRecords: number
  readonly deletedRecords: number
}

type RecordDifference = {
  readonly tableName: string
  readonly recordId: string
  readonly changeType: 'added' | 'modified' | 'deleted' | 'restored'
  readonly fieldChanges?: readonly FieldChange
}

type ColumnDifference = {
  readonly tableName: string
  readonly columnName: string
}
```

### ImportStatistics

Aggregates statistical data about import operations.

```typescript
type ImportStatistics = {
  readonly period: {
    readonly startDate: Date
    readonly endDate: Date
  }

  // Overall statistics
  readonly overall: {
    readonly totalImports: number
    readonly successfulImports: number
    readonly failedImports: number
    readonly rolledBackImports: number
    readonly successRate: number  // 0-1
  }

  // Data quality statistics
  readonly dataQuality: {
    readonly averageCompletenessRate: number
    readonly averageValidityRate: number
    readonly averageErrorRate: number
    readonly trend: 'improving' | 'stable' | 'declining'
  }

  // Processing statistics
  readonly processing: {
    readonly averageDuration: number
    readonly averageRowsProcessed: number
    readonly fastestImport: ImportLogReference
    readonly slowestImport: ImportLogReference
  }

  // Warehouse statistics
  readonly byWarehouse: readonly WarehouseStatistics

  // Error statistics
  readonly errors: {
    readonly mostCommonErrors: readonly ErrorStatistic
    readonly errorRate: number
    readonly errorTrend: 'decreasing' | 'stable' | 'increasing'
  }

  // Time-based statistics
  readonly temporal: {
    readonly importsByDay: readonly DayStatistics
    readonly importsByWeek: readonly WeekStatistics
    readonly importsByMonth: readonly MonthStatistics
    readonly peakImportTimes: readonly TimeSlot
  }
}

type WarehouseStatistics = {
  readonly warehouse: string
  readonly totalImports: number
  readonly averageDataQuality: number
  readonly lastImport: Date
  readonly lastImportStatus: string
}

type ErrorStatistic = {
  readonly errorCode: string
  readonly errorMessage: string
  readonly count: number
  readonly percentage: number
}

type DayStatistics = {
  readonly date: Date
  readonly importCount: number
  readonly successRate: number
}

type WeekStatistics = {
  readonly week: number
  readonly year: number
  readonly importCount: number
  readonly successRate: number
}

type MonthStatistics = {
  readonly month: number
  readonly year: number
  readonly importCount: number
  readonly successRate: number
}

type TimeSlot = {
  readonly hour: number
  readonly dayOfWeek: number
  readonly importCount: number
}
```

### DataLineage

Tracks the origin and transformation history of individual records.

```typescript
type DataLineage = {
  readonly record: {
    readonly tableName: string
    readonly recordId: string
    readonly currentData: Record<string, unknown>
  }

  // Origin information
  readonly origin: {
    readonly importId: string
    readonly sourceFile: string
    readonly sourceSheet?: string
    readonly sourceRow: number
    readonly importDate: Date
  }

  // Transformation history
  readonly transformations: readonly Transformation

  // Import history for this record
  readonly importHistory: readonly RecordImportEvent

  // Current status
  readonly status: 'active' | 'updated' | 'deleted' | 'archived'
}

type Transformation = {
  readonly timestamp: Date
  readonly importId: string
  readonly transformationType: 'insert' | 'update' | 'delete' | 'restore'
  readonly fieldChanges?: readonly FieldChange
  readonly before?: Record<string, unknown>
  readonly after?: Record<string, unknown>
}

type RecordImportEvent = {
  readonly importId: string
  readonly importDate: Date
  readonly operation: 'inserted' | 'updated' | 'deleted' | 'restored'
  readonly changes?: readonly FieldChange
}
```

### RollbackPoint

Represents a point in time that the database can be restored to.

```typescript
type RollbackPoint = {
  readonly id: string
  readonly importId: string
  readonly timestamp: Date

  // Snapshot information
  readonly snapshot: {
    readonly databaseVersion: string
    readonly schemaVersion: string
    readonly tableChecksums: readonly TableChecksum
  }

  // Metadata
  readonly metadata: {
    readonly warehouse: string
    readonly description: string
    readonly createdBy?: string
    readonly isAutomatic: boolean
    readonly isRestorable: boolean
  }

  // Size information
  readonly size: {
    readonly estimatedSize: number  // bytes
    readonly compressionRatio: number
  }

  // Status
  readonly status: 'available' | 'expired' | 'deleted' | 'corrupted'

  // Expiration
  readonly expiration: {
    readonly created: Date
    readonly expires: Date
    readonly retentionPeriod: number  // days
  }
}

type TableChecksum = {
  readonly tableName: string
  readonly rowCount: number
  readonly checksum: string
  readonly lastModified: Date
}
```

## Key Functions

### Import Logging Functions

```typescript
type CreateImportLog = (
  warehouse: string,
  source: ImportLog['source'],
  metadata: ImportLog['importMetadata']
) => ImportLog

type UpdateImportLog = (
  importId: string,
  updates: Partial<ImportLog>
) => ImportLog

type GetImportLog = (
  importId: string
) => ImportLog | null

type ListImportLogs = (
  filters: ImportLogFilters
) => readonly ImportLog[]

type ImportLogFilters = {
  readonly warehouse?: string
  readonly status?: ImportLog['status']
  readonly dateRange?: {
    readonly startDate: Date
    readonly endDate: Date
  }
  readonly userId?: string
}
```

### Import Comparison Functions

```typescript
type CompareImports = (
  import1Id: string,
  import2Id: string
) => ImportComparison

type GetImportComparison = (
  comparisonId: string
) => ImportComparison | null

type ListComparisons = (
  importId: string
) => readonly ImportComparison[]
```

### Rollback Functions

```typescript
type CreateRollbackPoint = (
  importId: string,
  metadata: Partial<RollbackPoint['metadata']>
) => RollbackPoint

type GetRollbackPoint = (
  rollbackPointId: string
) => RollbackPoint | null

type ListRollbackPoints = (
  filters: RollbackPointFilters
) => readonly RollbackPoint[]

type RollbackPointFilters = {
  readonly warehouse?: string
  readonly importId?: string
  readonly dateRange?: {
    readonly startDate: Date
    readonly endDate: Date
  }
  readonly status?: RollbackPoint['status']
}

type ExecuteRollback = (
  rollbackPointId: string,
  options: RollbackOptions
) => RollbackResult

type RollbackOptions = {
  readonly createBackup: boolean
  readonly reason?: string
  readonly force?: boolean
}

type RollbackResult = {
  readonly success: boolean
  readonly recordsRestored: number
  readonly duration: number
  readonly newRollbackPointId: string
  readonly errors: readonly Error[]
}
```

### Data Lineage Functions

```typescript
type GetRecordLineage = (
  tableName: string,
  recordId: string
) => DataLineage | null

type TraceRecordSource = (
  tableName: string,
  recordId: string
) => DataLineage['origin']

type GetRecordImportHistory = (
  tableName: string,
  recordId: string
) => readonly RecordImportEvent[]

type FindRecordsByImport = (
  importId: string
) => readonly DataLineage
```

### Statistics Functions

```typescript
type CalculateImportStatistics = (
  period: {
    readonly startDate: Date
    readonly endDate: Date
  },
  groupBy?: 'warehouse' | 'user' | 'template' | 'plugin'
) => ImportStatistics

type GetSuccessRate = (
  period?: {
    readonly startDate: Date
    readonly endDate: Date
  }
) => number

type GetErrorRate = (
  period?: {
    readonly startDate: Date
    readonly endDate: Date
  }
) => number

type GetDataQualityTrend = (
  warehouse?: string,
  period?: {
    readonly startDate: Date
    readonly endDate: Date
  }
) => 'improving' | 'stable' | 'declining'
```

### Change Tracking Functions

```typescript
type GetImportChanges = (
  importId: string
) => ImportChanges

type GetTableChanges = (
  tableName: string,
  importId: string
) => TableChange

type GetRecordChanges = (
  tableName: string,
  recordId: string
) => readonly RecordChange[]

type FindChangedRecords = (
  filters: ChangeFilters
) => readonly RecordChange[]

type ChangeFilters = {
  readonly importId?: string
  readonly tableName?: string
  readonly changeType?: RecordChange['recordType']
  readonly dateRange?: {
    readonly startDate: Date
    readonly endDate: Date
  }
}
```

## Architecture Overview

### Storage Architecture

The system maintains import history data in separate tables from the core warehouse data:

```
Core Warehouse Tables          Import History Tables
├── warehouses                 ├── import_logs
├── items                      ├── import_changes
├── inventory                  ├── import_comparisons
├── transactions               ├── rollback_points
├── locations                  ├── data_lineage
└── ...                        └── import_statistics
```

### Query Patterns

**Import Log Queries**:
- Retrieve import history by warehouse, date range, or user
- Filter by status (completed, failed, rolled back)
- Sort by timestamp, duration, or data quality metrics

**Comparison Queries**:
- Compare any two imports from the same warehouse
- Identify record-level changes between imports
- Detect structural changes (tables, columns)

**Lineage Queries**:
- Trace any record back to its source import
- View complete modification history
- Identify which imports affected specific records

**Rollback Queries**:
- List available rollback points by warehouse
- Check rollback point status and expiration
- Verify restorability before executing rollback

### Data Retention

**Import Logs**: Retained indefinitely
- Complete audit trail
- searchable by all metadata fields

**Rollback Points**: Configurable retention (default: 90 days)
- Automatic expiration based on retention policy
- Manual mark for permanent retention

**Data Lineage**: Retained as long as record exists
- Automatic cleanup when record deleted
- Optional archiving of lineage data

**Import Statistics**: Aggregated and stored
- Daily aggregations retained for 1 year
- Weekly aggregations retained for 5 years
- Monthly aggregations retained indefinitely

## Product Requirements

### User Stories

**As a warehouse manager**, I want to:
- View the complete history of all imports for my warehouse
- Compare two imports to see what changed
- Rollback to a previous import if something goes wrong
- Track data quality improvements over time
- Understand where each data record came from

**As a data analyst**, I want to:
- Identify which import introduced erroneous data
- Trace data quality issues to specific source files
- Compare imports across different time periods
- Analyze trends in import success rates

**As a system administrator**, I want to:
- Monitor import system health
- Identify frequently failing imports
- Manage rollback point storage
- Generate import statistics reports

### Feature Requirements

**Must Have (MVP)**:
- Import log with all processing details
- Basic comparison between consecutive imports
- Manual rollback to previous import
- Per-record data lineage
- Success/error rate statistics

**Should Have**:
- Comparison between any two imports
- Automated rollback point creation
- Change tracking dashboard
- Data quality trend analysis
- Import scheduling recommendations

**Could Have**:
- Automatic rollback on critical errors
- Predictive import success analysis
- Anomaly detection in import patterns
- Import performance optimization suggestions
- Advanced data lineage visualization

### UI Requirements

**Import History Page**:
- Tabular view of all imports
- Filters: warehouse, date range, status, user
- Sort: timestamp, duration, data quality
- Actions: view details, compare, rollback

**Import Comparison View**:
- Side-by-side import comparison
- Summary statistics diff
- Table-level changes
- Record-level change details
- Field-level change highlighting

**Data Lineage View**:
- Record origin information
- Complete modification timeline
- Import-by-import changes
- Field-level change history

**Statistics Dashboard**:
- Success/error rate charts
- Data quality trends
- Import frequency analysis
- Peak time identification

### Performance Requirements

**Query Performance**:
- Import log list: < 500ms for 1000 records
- Import comparison: < 2s for typical imports
- Data lineage query: < 100ms per record
- Statistics calculation: < 5s for 1-year period

**Storage Performance**:
- Rollback point creation: < 30s per GB
- Rollback execution: < 60s per GB
- Log entry creation: < 100ms
- Comparison storage: < 500ms

### Security Requirements

**Access Control**:
- View-only access for most users
- Rollback access restricted to administrators
- Audit trail for all rollback operations
- Import history cannot be modified

**Data Privacy**:
- Source file paths stored but not file contents
- User information optional and configurable
- No sensitive data in statistics

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft - Architecture & Types Only

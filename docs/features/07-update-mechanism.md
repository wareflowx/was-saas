# Update and Migration Mechanism

## Overview

The update mechanism ensures seamless updates of the SaaS application while preserving user data and maintaining system integrity.

## Update Strategy

### Desktop Application Updates (Electron)

```typescript
type UpdateStrategy = {
  // Check for updates
  check(): Promise<UpdateInfo>

  // Download update
  download(updateInfo: UpdateInfo): Promise<void>

  // Apply update
  apply(): Promise<void>

  // Rollback if needed
  rollback(): Promise<void>
}
```

### Update Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. CHECK FOR UPDATES                                        │
│     • Check version against remote                          │
│     • Compare current and latest versions                   │
│     • Notify user if update available                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  2. DOWNLOAD UPDATE                                         │
│     • Download update package                               │
│     • Verify checksum/signature                             │
│     • Show progress to user                                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  3. PREPARE UPDATE                                          │
│     • Backup current version                                │
│     • Backup database schema                                │
│     • Prepare migration scripts                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  4. DATABASE MIGRATION                                      │
│     • Run migration scripts                                 │
│     • Validate migrated data                                │
│     • Create data version snapshots                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  5. APPLY UPDATE                                            │
│     • Install new version                                   │
│     • Update templates and analyses                         │
│     • Verify installation                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  6. POST-UPDATE VERIFICATION                               │
│     • Run smoke tests                                       │
│     • Verify data integrity                                 │
│     • Test critical features                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  7. COMPLETE                                                │
│     Clean up backups and finalize                           │
└─────────────────────────────────────────────────────────────┘
```

## Version Management

### Semantic Versioning

```
MAJOR.MINOR.PATCH

Examples:
  1.0.0 → Initial release
  1.1.0 → New features (backward compatible)
  1.1.1 → Bug fix
  2.0.0 → Breaking changes
```

### Version Information

```typescript
type AppVersion = {
  major: number
  minor: number
  patch: number
  readonly preRelease?: string
  readonly buildMetadata?: string

  toString(): string
  compare(other: AppVersion): number
}

type UpdateInfo = {
  readonly version: AppVersion
  readonly releaseDate: Date
  readonly downloadUrl: string
  readonly checksum: string
  readonly signature: string
  readonly size: number

  // Release notes
  readonly releaseNotes: {
    readonly features: string[]
    readonly improvements: string[]
    readonly bugFixes: string[]
    readonly breakingChanges?: string[]
  }

  // Migration info
  readonly requiresMigration: boolean
  readonly migrationVersion?: string
  readonly estimatedTime: number  // seconds
}
```

## Database Migration

### Migration System

```typescript
type Migration = {
  // Version this migrates from
  readonly from: string

  // Version this migrates to
  readonly to: string

  // Migration type
  readonly type: 'schema' | 'data' | 'template' | 'analysis'

  // Migration script
  readonly up: (db: Database) => Promise<void>

  // Downgrade script (for rollback)
  readonly down: (db: Database) => Promise<void>

  // Validation
  readonly validate?: (db: Database) => Promise<boolean>

  // Safety checks
  readonly safe: boolean  // Can be rolled back
  readonly estimatedTime: number  // seconds
}
```

### Migration Types

The system supports different types of migrations:

- **Schema**: Database structure changes (tables, columns, indexes)
- **Data**: Data transformation and normalization
- **Template**: Template definition and mapping updates
- **Analysis**: Analysis algorithm and parameter updates

Each migration must specify the source and target versions, type, and whether it's safe to rollback.

## Template Versioning

### Template Migration Strategy

```typescript
type TemplateMigration = {
  readonly templateId: string
  readonly fromVersion: string
  readonly toVersion: string

  // Migrate data to new template format
  readonly migrateData: (data: DataSet) => Promise<DataSet>

  // Update column mappings
  readonly updateMappings: (mappings: ColumnMapping[]) => ColumnMapping[]

  // Validate migrated data
  readonly validate?: (data: DataSet) => Promise<ValidationResult[]>
}
```

### Data Version Snapshots

```sql
-- Data version tracking
CREATE TABLE data_versions (
  id SERIAL PRIMARY KEY,
  version VARCHAR(14) NOT NULL,  -- YYYYMMDDHHMMSS
  template_id VARCHAR(255),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT,

  -- Snapshot metadata
  tables_imported INTEGER[],
  row_counts JSONB,
  data_quality_score DECIMAL(3,2)
);

-- Rollback capability
CREATE TABLE data_snapshots (
  id SERIAL PRIMARY KEY,
  version VARCHAR(14) NOT NULL,
  table_name TEXT NOT NULL,
  snapshot_data BYTEA,  -- Compressed table data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Analysis Updates

### Hot-Reloading Analyses

The system supports hot-reloading of analyses without application restart. This allows real-time updates to analysis algorithms and parameters while maintaining data integrity.

## Update Safety

### Pre-Update Checks

```typescript
type PreUpdateCheck = {
  readonly name: string
  readonly description: string

  // Check function
  readonly check: () => Promise<boolean>

  // Error message if check fails
  readonly errorMessage: string

  // Can update proceed if this fails?
  readonly optional: boolean
}
```

## Update Safety

### Pre-Update Requirements

The system performs critical checks before applying updates:

- **Disk Space**: Verify sufficient disk space for download and installation
- **Data Backup**: Ensure recent database backups exist
- **Critical Jobs**: Confirm no critical processing jobs are running

### Rollback Strategy

When updates fail verification, the system can automatically rollback to the previous version by restoring backups and running downgrade scripts.


## Update Notifications

### User Notification Flow

```typescript
type UpdateNotification = {
  readonly available: boolean
  readonly currentVersion: AppVersion
  readonly latestVersion: AppVersion

  // Urgency
  readonly urgency: 'low' | 'medium' | 'high' | 'critical'

  // What's new
  readonly releaseNotes: string

  // Actions
  readonly actions: {
    readonly updateNow: () => Promise<void>
    readonly scheduleUpdate: (time: Date) => Promise<void>
    readonly skipVersion: () => Promise<void>
    readonly remindLater: () => Promise<void>
  }
}
```

### Update Urgency Classification

- **Critical**: Security patches and critical bug fixes
- **High**: Breaking changes and major version bumps
- **Medium**: Minor version with significant features
- **Low**: Minor enhancements and bug fixes

## Scheduled Updates

### Auto-Update Configuration

```typescript
type UpdateSchedule = {
  readonly enabled: boolean
  readonly frequency: 'daily' | 'weekly' | 'monthly'
  readonly dayOfWeek?: number  // 0-6 for weekly
  readonly time?: string  // HH:MM format
  readonly timezone: string

  // Behavior
  readonly downloadOnly: boolean  // Download but don't install
  readonly requireConfirmation: boolean
  readonly allowCriticalUpdates: boolean  // Bypass schedule for critical updates
}
```

### Update Scheduling Options

- **Daily**: Check for updates every day at specified time
- **Weekly**: Check for updates weekly on specified day
- **Monthly**: Check for updates monthly at specified time
- **Critical Updates**: Bypass schedule for security patches

## Update Server

### Version Metadata API

The update server provides REST APIs for:

- **Update Check**: `/api/updates/check` - Verify if updates are available
- **Migration Info**: `/api/updates/migrations/:version` - Retrieve required migrations

### API Response Types

```typescript
type UpdateCheckResponse = {
  readonly updateAvailable: boolean
  readonly latestVersion: AppVersion
  readonly currentVersion: AppVersion
  readonly downloadUrl?: string
  readonly checksum?: string
  readonly signature?: string
  readonly releaseNotes: ReleaseNotes
  readonly requiresMigration: boolean
  readonly estimatedTime: number
}

type MigrationResponse = {
  readonly migrations: Migration[]
  readonly instructions: string
  readonly warnings: string[]
}
```

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Status**: Draft

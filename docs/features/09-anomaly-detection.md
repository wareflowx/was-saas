# Anomaly Detection and Notifications

## Overview

Anomaly detection identifies unusual patterns, errors, or potential issues in warehouse data. This system provides real-time alerts and notifications to help users address problems quickly.

**Note**: This is a **Phase 2 feature**. The core system focuses on data access and basic analyses. Anomaly detection will be added after the foundation is stable.

## Anomaly Categories

1. **Data Quality Anomalies**: Issues with data integrity, completeness, or consistency
2. **Operational Anomalies**: Unusual operational patterns or performance issues
3. **Inventory Anomalies**: Stock-related issues (overstock, stockouts, dead stock)
4. **Performance Anomalies**: Unusual productivity or efficiency patterns
5. **Business Rule Violations**: Violations of defined business rules or constraints

## Anomaly Detection Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Anomaly Detection Engine                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Detectors   │→│   Scoring    │→│  Filtering   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Aggregation │→│  Alerting    │→│  Notifying   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Notification Channels                     │
├─────────────────────────────────────────────────────────────┤
│  In-App  │  Email  │  Desktop  │  Webhook  │  Dashboard    │
└─────────────────────────────────────────────────────────────┘
```

## Detector Interface

### Core Detector Definition

```typescript
type AnomalyDetector = {
  // Identification
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string
  readonly category: AnomalyCategory

  // Configuration
  readonly configSchema: z.ZodType<any>

  // Detection
  detect(
    data: DataSet,
    config: any,
    context: DetectionContext
  ): Promise<Anomaly[]> | Anomaly[]

  // Scoring
  score(anomaly: Anomaly): number  // 0-100 severity score

  // Metadata
  readonly metadata: {
    readonly frequency: 'real-time' | 'batch' | 'on-demand'
    readonly estimatedDuration: number  // milliseconds
    readonly requiresHistoricalData: boolean
    readonly historicalDataDays?: number
  }
}

type AnomalyCategory =
  | 'data-quality'
  | 'operational'
  | 'inventory'
  | 'performance'
  | 'business-rule'
```

### Anomaly Structure

```typescript
type Anomaly = {
  // Identification
  readonly id: string
  readonly detectorId: string
  readonly category: AnomalyCategory

  // Severity
  readonly severity: 'low' | 'medium' | 'high' | 'critical'
  readonly score: number  // 0-100

  // Description
  readonly title: string
  readonly description: string
  readonly impact: string

  // Location
  readonly location: {
    readonly table?: string
    readonly rowIds?: string[]
    readonly columns?: string[]
    readonly timestamp?: Date
  }

  // Context
  readonly context: {
    readonly actualValue: any
    readonly expectedValue: any
    readonly threshold: any
    readonly variance: any
  }

  // Recommendations
  readonly recommendations: string[]

  // Metadata
  readonly detectedAt: Date
  readonly status: 'active' | 'acknowledged' | 'resolved' | 'ignored'

  // History
  readonly history?: {
    readonly firstDetected: Date
    readonly lastDetected: Date
    readonly occurrenceCount: number
  }
}
```

## Built-in Detectors

### 1. Dead Stock Detector

**ID**: `dead-stock`
**Category**: `inventory`
**Severity**: `medium`

Detects products that haven't had any movement in a specified period.

**Configuration**:
- `daysWithoutMovement`: Number of days without movement (min 30, default 90)
- `excludeInactive`: Whether to exclude inactive products (default true)
- `minStockValue`: Minimum stock value threshold

**Detection Logic**:
- Identifies products with no movement in specified period
- Calculates severity based on days without movement
- Provides recommendations for review and action

---

### 2. Sudden Volume Spike Detector

**ID**: `sudden-spike`
**Category**: `operational`
**Severity**: `high` / `medium` (based on magnitude)

Detects unusual spikes in movement volume that may indicate data errors or actual operational anomalies.

**Configuration**:
- `windowSize`: Days for baseline calculation (default 7)
- `spikeThreshold`: Standard deviations for spike detection (default 3)
- `minVolume`: Minimum daily volume to consider (default 100)

**Detection Logic**:
- Calculates baseline using moving average and standard deviation
- Identifies days with volume spikes exceeding threshold
- Scores anomalies based on deviation magnitude

---

### 3. Data Quality Detector

**ID**: `data-quality`
**Category**: `data-quality`
**Severity**: `medium` / `low`

Detects data quality issues such as missing values, invalid formats, and referential integrity violations.

**Configuration**:
- `checks`: Array of quality checks to perform
  - `missing-values`: Null value detection
  - `invalid-dates`: Invalid date format detection
  - `negative-quantities`: Negative quantity detection
  - `orphaned-records`: Referential integrity violations
  - `duplicate-keys`: Duplicate key detection

**Detection Logic**:
- Performs configurable data quality checks
- Scores based on impact and prevalence
- Provides recommendations for data cleaning

## Notification System

### Notification Channels

```typescript
type NotificationChannel = {
  readonly id: string
  readonly name: string
  readonly type: NotificationType

  // Send notification
  send(anomalies: Anomaly[], recipient: NotificationRecipient): Promise<void>

  // Configuration
  readonly configSchema: z.ZodType<any>
}

type NotificationType =
  | 'in-app'      // Show in app notification center
  | 'email'       // Send email
  | 'desktop'     // Desktop notification
  | 'webhook'     // HTTP webhook
  | 'dashboard'   // Show on dashboard widget
```

### In-App Notifications

Stores notifications in database and emits real-time events to users within the application.

**Features**:
- Persistent storage with read/unread status
- Real-time push notifications
- User notification center

### Email Notifications

Sends email notifications based on configurable templates and frequencies.

**Features**:
- Template-based content (summary/detailed)
- Frequency control (immediate/hourly/daily)
- HTML and plain text content

### Webhook Notifications

Sends anomaly data to external systems via HTTP webhook.

**Features**:
- Configurable endpoints and headers
- Standard JSON payload format
- RESTful API integration

## Alert Rules

### Rule Configuration

```typescript
type AlertRule = {
  readonly id: string
  readonly name: string
  readonly description: string

  // Trigger conditions
  readonly trigger: {
    readonly detectorId: string
    readonly severity?: AnomalySeverity
    readonly scoreThreshold?: number  // Minimum score to trigger
    readonly countThreshold?: number  // Minimum anomalies to trigger
  }

  // Notification settings
  readonly notifications: {
    readonly channels: NotificationChannel[]
    readonly recipients: NotificationRecipient[]
    readonly throttle: {
      readonly maxNotifications: number  // Max notifications per period
      readonly period: number            // Period in seconds
    }
  }

  // Schedule
  readonly schedule?: {
    readonly enabled: boolean
    readonly timezone: string
    readonly hours: number[]  // Hours when notifications allowed
  }

  // Status
  readonly enabled: boolean
  readonly createdAt: Date
  readonly lastTriggered?: Date
}
```

### Example Alert Rules

1. **Critical Stockout Alerts**: Immediate notification for critical stock issues
   - Trigger: Any critical severity stockout
   - Channels: In-app, email, desktop
   - Recipients: Warehouse manager, inventory team lead
   - Schedule: 6am-6pm daily

2. **Daily Data Quality Summary**: Daily digest of data quality issues
   - Trigger: Any data quality issues above threshold
   - Channels: Email only
   - Recipients: Data quality team
   - Schedule: 9am daily

## Anomaly Dashboard

### Dashboard Widgets

```typescript
type AnomalyDashboard = {
  readonly widgets: DashboardWidget[]

  readonly layout: {
    readonly columns: number
    readonly rows: number
  }
}

type DashboardWidget =
  | ActiveAnomaliesWidget
  | AnomalyTrendWidget
  | SeverityBreakdownWidget
  | CategoryBreakdownWidget
  | RecentAlertsWidget

// Active anomalies widget
type ActiveAnomaliesWidget = {
  readonly type: 'active-anomalies'
  readonly title: string
  readonly config: {
    readonly maxItems: number
    readonly groupBy: 'severity' | 'category' | 'detector'
  }
}

// Anomaly trend widget
type AnomalyTrendWidget = {
  readonly type: 'anomaly-trend'
  readonly title: string
  readonly config: {
    readonly period: '7d' | '30d' | '90d'
    readonly groupBy: 'day' | 'week' | 'month'
  }
}
```

## Implementation Timeline

**Phase 2** (after MVP is stable):

1. **Month 1-2**: Core detector framework + 3 basic detectors
2. **Month 3**: Notification channels (in-app, email)
3. **Month 4**: Alert rules engine + dashboard
4. **Month 5-6**: Advanced detectors + customization

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Status**: Draft - Planned for Phase 2
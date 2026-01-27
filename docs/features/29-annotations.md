# Annotations System

## Overview

The annotations system enables users to add contextual information, insights, and event markers throughout their warehouse data and analyses. Annotations provide a collaborative layer for documentation, knowledge sharing, and business context tracking.

## Core Concepts

### User Annotations

User annotations are personal or shared notes attached to specific entities within the system:

- **Analysis annotations**: Notes on analysis results, interpretations, and conclusions
- **Chart annotations**: Comments on visualizations, trends, and patterns
- **Data point annotations**: Observations on specific data points or outliers
- **Entity annotations**: General notes on products, locations, users, or orders
- **Contextual annotations**: Explanations of business rules, decisions, or processes

### Event Markers

Event markers highlight significant business events that impact warehouse operations:

- **Sales events**: Promotions, flash sales, clearance events
- **Inventory events**: Stockouts, overstocks, recalls
- **Operational events**: System changes, process modifications, reorganizations
- **External events**: Holidays, weather events, supply chain disruptions
- **Business events**: New product launches, supplier changes, contract modifications

### Annotation Types

Annotations are categorized by their purpose and nature:

```typescript
type AnnotationType =
  | 'note'           // General informational note
  | 'warning'        // Warning or caution
  | 'event'          // Business event marker
  | 'insight'        // Analysis insight or conclusion
  | 'question'       // Question or clarification needed
  | 'action'         // Action item or follow-up required
  | 'decision'       // Business decision record
```

### Annotation Visibility

Annotations support multiple visibility levels for different collaboration scenarios:

```typescript
type AnnotationVisibility =
  | 'private'        // Only visible to creator
  | 'team'           // Visible to team members
  | 'organization'   // Visible across organization
  | 'public'         // Visible to all users (future feature)
```

## Type Definitions

### Annotation

```typescript
type Annotation = {
  // Identification
  readonly annotationId: string
  readonly externalAnnotationId?: string

  // Content
  readonly content: {
    readonly type: AnnotationType
    readonly title: string
    readonly body: string
    readonly format: 'plain' | 'markdown' | 'html'
    readonly richContent?: AnnotationRichContent
  }

  // Context - what this annotation is attached to
  readonly context: AnnotationContext

  // Visibility and sharing
  readonly visibility: AnnotationVisibility
  readonly sharedWith?: readonly string[]          // User IDs for team sharing

  // Creator
  readonly creator: {
    readonly userId: string
    readonly userName: string
    readonly userEmail?: string
  }

  // Timestamps
  readonly timestamps: {
    readonly createdAt: Date
    readonly modifiedAt?: Date
    readonly deletedAt?: Date
  }

  // Status
  readonly status: AnnotationStatus
  readonly resolvedAt?: Date
  readonly resolvedBy?: string

  // Engagement
  readonly engagement: {
    readonly viewCount: number
    readonly lastViewedAt?: Date
    readonly commentCount: number
    readonly attachmentCount: number
  }

  // Metadata
  readonly metadata: {
    readonly warehouse: string
    readonly source: 'user' | 'system' | 'import'
    readonly importance?: AnnotationImportance
    readonly tags?: readonly string[]
    readonly searchableText: string
  }
}

type AnnotationRichContent = {
  readonly links?: readonly AnnotationLink[]
  readonly references?: readonly AnnotationReference[]
  readonly mentions?: readonly string[]          // User IDs mentioned
  readonly attachments?: readonly AnnotationAttachment[]
  readonly formatting?: AnnotationFormatting
}

type AnnotationLink = {
  readonly url: string
  readonly label: string
  readonly type: 'internal' | 'external' | 'analysis' | 'report'
}

type AnnotationReference = {
  readonly entityType: 'product' | 'location' | 'order' | 'user' | 'analysis'
  readonly entityId: string
  readonly entityName: string
}

type AnnotationAttachment = {
  readonly attachmentId: string
  readonly fileName: string
  readonly fileType: string
  readonly fileSize: number
  readonly url: string
}

type AnnotationFormatting = {
  readonly bold?: readonly number[]              // Character ranges
  readonly italic?: readonly number[]
  readonly code?: readonly number[]
  readonly lists?: readonly AnnotationList[]
}

type AnnotationList = {
  readonly type: 'ordered' | 'unordered'
  readonly startIndex: number
  readonly endIndex: number
}

type AnnotationImportance =
  | 'low'
  | 'normal'
  | 'high'
  | 'critical'

type AnnotationStatus =
  | 'active'
  | 'archived'
  | 'resolved'
  | 'deleted'
```

### Event Marker

```typescript
type EventMarker = {
  // Identification
  readonly markerId: string
  readonly externalMarkerId?: string

  // Event definition
  readonly event: {
    readonly type: EventType
    readonly category: EventCategory
    readonly title: string
    readonly description: string
    readonly severity: EventSeverity
  }

  // Timing
  readonly timing: {
    readonly startDate: Date
    readonly endDate?: Date                      // For ongoing events
    readonly allDay: boolean
    readonly timezone?: string
  }

  // Scope
  readonly scope: {
    readonly warehouses?: readonly string[]      // Affected warehouses
    readonly zones?: readonly string[]           // Affected zones
    readonly products?: readonly string[]        // Affected products
    readonly categories?: readonly string[]      // Affected categories
  }

  // Impact
  readonly impact: {
    readonly type: EventImpactType
    readonly description: string
    readonly metrics?: EventImpactMetrics
  }

  // Visualization
  readonly display: {
    readonly color: string
    readonly icon: string
    readonly showOnTimeline: boolean
    readonly showOnCharts: boolean
  }

  // Creator
  readonly creator: {
    readonly userId: string
    readonly userName: string
  }

  // Timestamps
  readonly timestamps: {
    readonly createdAt: Date
    readonly modifiedAt?: Date
  }

  // Status
  readonly status: EventMarkerStatus

  // Metadata
  readonly metadata: {
    readonly source: 'manual' | 'automatic' | 'import'
    readonly externalSystem?: string
    readonly tags?: readonly string[]
    readonly searchableText: string
  }
}

type EventType =
  | 'sale'              // Sales/promotion event
  | 'inventory'         // Inventory event
  | 'operational'       // Operational change
  | 'external'          // External event
  | 'system'            // System change
  | 'compliance'        // Compliance event
  | 'quality'           // Quality event

type EventCategory =
  | 'promotion'         // Promotional sale
  | 'flash-sale'        // Flash sale
  | 'clearance'         // Clearance event
  | 'stockout'          // Stockout event
  | 'overstock'         // Overstock situation
  | 'recall'            // Product recall
  | 'system-change'     // System modification
  | 'process-change'    // Process modification
  | 'reorganization'    // Warehouse reorganization
  | 'holiday'           // Holiday period
  | 'weather'           // Weather event
  | 'supply-chain'      // Supply chain disruption
  | 'supplier-change'   // Supplier change
  | 'contract'          // Contract modification
  | 'audit'             // Audit event
  | 'training'          // Training event
  | 'other'

type EventSeverity =
  | 'info'
  | 'minor'
  | 'major'
  | 'critical'

type EventImpactType =
  | 'volume'            // Volume impact
  | 'efficiency'        // Efficiency impact
  | 'quality'           // Quality impact
  | 'cost'              // Cost impact
  | 'compliance'        // Compliance impact
  | 'other'

type EventImpactMetrics = {
  readonly volumeChangePercent?: number
  readonly efficiencyChangePercent?: number
  readonly costImpact?: number
  readonly affectedOrderCount?: number
  readonly affectedProductCount?: number
}

type EventMarkerStatus =
  | 'planned'           // Upcoming event
  | 'active'            // Currently happening
  | 'completed'         // Past event
  | 'cancelled'         // Cancelled event
```

### Annotation Context

```typescript
type AnnotationContext = {
  // What entity type this annotation is attached to
  readonly entityType: ContextEntityType

  // Entity reference
  readonly entityId: string
  readonly entityName: string
  readonly entityDescription?: string

  // Context-specific data
  readonly context: ContextData

  // Navigation
  readonly navigation: {
    readonly viewUrl: string
    readonly deepLink?: string
  }
}

type ContextEntityType =
  | 'product'
  | 'location'
  | 'user'
  | 'order'
  | 'analysis'
  | 'chart'
  | 'data-point'
  | 'report'
  | 'dashboard'
  | 'warehouse'
  | 'zone'
  | 'movement'
  | 'receipt'
  | 'return'
  | 'adjustment'
  | 'replenishment'

type ContextData =
  | ProductAnnotationContext
  | LocationAnnotationContext
  | UserAnnotationContext
  | AnalysisAnnotationContext
  | ChartAnnotationContext
  | DataPointAnnotationContext
  | ReportAnnotationContext

type ProductAnnotationContext = {
  readonly entityType: 'product'
  readonly productId: string
  readonly productCode: string
  readonly categoryPath?: string
  readonly currentInventory?: number
  readonly movementCount?: number
}

type LocationAnnotationContext = {
  readonly entityType: 'location'
  readonly locationId: string
  readonly locationPath: string
  readonly zone: string
  readonly currentOccupancy?: LocationOccupancy
  readonly productCount?: number
}

type UserAnnotationContext = {
  readonly entityType: 'user'
  readonly userId: string
  readonly userName: string
  readonly role: UserRole
  readonly team?: string
  readonly movementCount?: number
}

type AnalysisAnnotationContext = {
  readonly entityType: 'analysis'
  readonly analysisId: string
  readonly analysisName: string
  readonly analysisType: string
  readonly warehouse: string
  readonly dateRange: {
    readonly start: Date
    readonly end: Date
  }
  readonly parameters?: readonly AnalysisParameter[]
}

type AnalysisParameter = {
  readonly name: string
  readonly value: string | number | boolean
  readonly display: string
}

type ChartAnnotationContext = {
  readonly entityType: 'chart'
  readonly chartId: string
  readonly chartName: string
  readonly chartType: ChartType
  readonly analysisId: string
  readonly dataSeries?: readonly string[]
}

type ChartType =
  | 'line'
  | 'bar'
  | 'scatter'
  | 'pie'
  | 'heatmap'
  | 'histogram'
  | 'box-plot'
  | 'treemap'
  | 'sankey'
  | 'gantt'

type DataPointAnnotationContext = {
  readonly entityType: 'data-point'
  readonly chartId: string
  readonly analysisId: string
  readonly point: {
    readonly x: number | string | Date
    readonly y: number
    readonly series?: string
  }
  readonly metadata?: Record<string, string | number>
}

type ReportAnnotationContext = {
  readonly entityType: 'report'
  readonly reportId: string
  readonly reportName: string
  readonly reportType: string
  readonly generatedAt: Date
  readonly dateRange: {
    readonly start: Date
    readonly end: Date
  }
}
```

### Annotation Timeline

```typescript
type AnnotationTimeline = {
  // Timeline metadata
  readonly timelineId: string
  readonly timelineName: string

  // Filters applied to timeline
  readonly filters: TimelineFilters

  // Time range
  readonly timeRange: {
    readonly start: Date
    readonly end: Date
    readonly granularity: TimelineGranularity
  }

  // Annotations and events in this timeline
  readonly items: readonly TimelineItem[]

  // Statistics
  readonly statistics: {
    readonly totalAnnotations: number
    readonly totalEvents: number
    readonly annotationCountsByType: Record<AnnotationType, number>
    readonly eventCountsByType: Record<EventType, number>
  }
}

type TimelineFilters = {
  // Visibility filter
  readonly visibility?: readonly AnnotationVisibility[]

  // Type filters
  readonly annotationTypes?: readonly AnnotationType[]
  readonly eventTypes?: readonly EventType[]

  // Creator filter
  readonly creators?: readonly string[]           // User IDs

  // Entity filter
  readonly entityTypes?: readonly ContextEntityType[]
  readonly entityIds?: readonly string[]

  // Warehouse filter
  readonly warehouses?: readonly string[]

  // Tag filter
  readonly tags?: readonly string[]

  // Search filter
  readonly searchText?: string

  // Status filter
  readonly statuses?: readonly AnnotationStatus[]
  readonly eventStatuses?: readonly EventMarkerStatus[]
}

type TimelineGranularity =
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'

type TimelineItem = {
  readonly itemId: string
  readonly itemType: 'annotation' | 'event'
  readonly timestamp: Date
  readonly data: Annotation | EventMarker
  readonly position: TimelinePosition
}

type TimelinePosition = {
  readonly x: number                           // Position on timeline axis
  readonly y?: number                          // Optional vertical position
  readonly row?: number                        // For swimlane layouts
}
```

### Annotation Search

```typescript
type AnnotationSearchQuery = {
  // Search terms
  readonly searchText?: string
  readonly searchIn?: readonly AnnotationSearchField[]

  // Filters
  readonly filters: TimelineFilters

  // Sorting
  readonly sortBy: AnnotationSearchSort
  readonly sortOrder: 'asc' | 'desc'

  // Pagination
  readonly pagination: {
    readonly page: number
    readonly pageSize: number
  }
}

type AnnotationSearchField =
  | 'title'
  | 'body'
  | 'tags'
  | 'creator'
  | 'entity'
  | 'all'

type AnnotationSearchSort =
  | 'relevance'
  | 'date-created'
  | 'date-modified'
  | 'type'
  | 'creator'
  | 'importance'

type AnnotationSearchResult = {
  // Results
  readonly items: readonly AnnotationSearchResultItem[]

  // Facets for filtering
  readonly facets: AnnotationSearchFacets

  // Pagination
  readonly pagination: {
    readonly total: number
    readonly page: number
    readonly pageSize: number
    readonly totalPages: number
  }
}

type AnnotationSearchResultItem = {
  readonly annotation: Annotation
  readonly relevance: number
  readonly highlights?: readonly SearchHighlight[]
}

type SearchHighlight = {
  readonly field: string
  readonly text: string
  readonly position: {
    readonly start: number
    readonly end: number
  }
}

type AnnotationSearchFacets = {
  readonly types: FacetCount<AnnotationType>
  readonly visibility: FacetCount<AnnotationVisibility>
  readonly creators: FacetCount<string>
  readonly entityTypes: FacetCount<ContextEntityType>
  readonly warehouses: FacetCount<string>
  readonly tags: FacetCount<string>
  readonly dateRange: {
    readonly earliest: Date
    readonly latest: Date
  }
}

type FacetCount<T> = readonly {
  readonly value: T
  readonly count: number
}[]
```

### Annotation Comments

```typescript
type AnnotationComment = {
  // Identification
  readonly commentId: string
  readonly annotationId: string

  // Content
  readonly content: {
    readonly body: string
    readonly format: 'plain' | 'markdown'
    readonly mentions?: readonly string[]    // User IDs
  }

  // Author
  readonly author: {
    readonly userId: string
    readonly userName: string
  }

  // Timestamps
  readonly createdAt: Date
  readonly modifiedAt?: Date

  // Status
  readonly status: 'active' | 'deleted'

  // Engagement
  readonly engagement: {
    readonly replyCount: number
    readonly likeCount: number
  }

  // Parent comment (for threaded replies)
  readonly parentCommentId?: string
  readonly threadId?: string
}
```

### Notification and Alerts

```typescript
type AnnotationNotification = {
  // Identification
  readonly notificationId: string
  readonly userId: string

  // Type
  readonly type: AnnotationNotificationType

  // Reference
  readonly annotationId: string
  readonly annotationTitle: string

  // Actor
  readonly actor: {
    readonly userId: string
    readonly userName: string
  }

  // Timestamp
  readonly createdAt: Date

  // Status
  readonly status: 'unread' | 'read' | 'archived'

  // Context
  readonly context: {
    readonly entityType: ContextEntityType
    readonly entityId: string
    readonly entityName: string
  }

  // Action link
  readonly actionUrl: string
}

type AnnotationNotificationType =
  | 'mention'           // User was mentioned
  | 'comment'           // Comment on user's annotation
  | 'reply'             // Reply to user's comment
  | 'shared'            // Annotation shared with user
  | 'assigned'          // Action assigned to user
  | 'resolved'          // Action annotation resolved
```

## User Experience

### Creating Annotations

Users can create annotations through various entry points:

**Chart annotations**:
- Click on data points to attach notes
- Draw regions on charts to mark areas of interest
- Add trend lines with explanations
- Mark outliers or anomalies

**Analysis annotations**:
- Add overall notes to analysis results
- Highlight key findings
- Document methodology and assumptions
- Record conclusions and recommendations

**Entity annotations**:
- Add notes to products, locations, or users
- Document business rules or exceptions
- Record historical context
- Tag for categorization

**Event markers**:
- Create event markers from calendar UI
- Import events from external systems
- Define event scope and impact
- Set visual display preferences

### Annotation Timeline

The timeline view provides a chronological overview of annotations and events:

**Timeline features**:
- Zoomable time axis (hour to year granularity)
- Swimlane layout by entity type, user, or category
- Filter by visibility, type, creator, tags
- Search and highlight specific annotations
- Export timeline data

**Timeline interactions**:
- Click items to view full annotation
- Drag to select time range
- Double-click to create annotation at specific time
- Hover for quick preview
- Filter in real-time

**Visual indicators**:
- Color coding by annotation type
- Size scaling by importance
- Icons for quick identification
- Density indicators for clustered items
- Thread indicators for discussions

### Annotation Search and Discovery

Powerful search capabilities help users find relevant annotations:

**Search modes**:
- Full-text search across title and body
- Filter by type, visibility, creator, date
- Faceted navigation for drill-down
- Saved searches for repeat queries

**Search results**:
- Relevance ranking
- Highlighted matching text
- Grouped by context
- Preview snippets
- Quick actions (view, edit, share)

**Advanced filters**:
- Date range picker
- Multi-select for facets
- Tag filtering
- Entity type filtering
- Warehouse/zone filtering

### Annotation Management

Users can manage their annotations through dedicated views:

**My annotations**:
- View all personal annotations
- Filter by status, type, date
- Bulk operations (archive, delete, change visibility)
- Export annotations

**Shared with me**:
- Annotations shared by team members
- Action items assigned to user
- Annotations where user is mentioned
- Team discussions

**All annotations**:
- Organization-wide view (based on permissions)
- Browse by entity, date, type
- Admin management functions

**Activity feed**:
- Recent annotations across organization
- Real-time updates
- Notification center
- Digest emails

## Integration Points

### Analysis Integration

Annotations integrate with analysis engine:

- Analysis results automatically suggest annotation points
- Outliers and anomalies flagged for potential annotation
- Trend changes detected and highlighted
- Event markers shown on analysis charts
- Annotations inform analysis parameters

### Reporting Integration

Annotations enhance reports:

- Include annotations in report exports
- Reference annotations in report text
- Show event markers on report timelines
- Annotation comments as report narrative
- Filter reports by annotation presence

### Dashboard Integration

Dashboard widgets display annotations:

- Recent annotations widget
- Event markers timeline widget
- Action items widget
- Team activity widget
- Annotation calendar widget

### Data Model Integration

Annotations link to core entities:

- Foreign key relationships to all entities
- Cascade delete configuration
- Indexes for fast lookup
- Full-text search indexes
- Audit trail integration

## Product Requirements

### MVP Requirements (Phase 1)

**Core annotation features**:
- User annotations on analyses and charts
- Basic event markers
- Private and team visibility
- Simple timeline view
- Basic text search

**MVP data types**:
- Annotation (basic fields only)
- EventMarker (basic fields only)
- AnnotationContext (limited entity types)

**MVP UI features**:
- Create annotation from analysis results
- Create annotation from chart click
- View annotations in list
- Simple timeline (day granularity)
- Basic search (text only)

### Growth Requirements (Phase 2)

**Enhanced collaboration**:
- Annotation comments and threading
- User mentions
- Attachment support
- Activity notifications
- Shared annotation views

**Advanced features**:
- Rich text formatting
- Data point annotations
- Multiple timeline layouts
- Faceted search
- Saved searches

**Extended context**:
- Support for all entity types
- Advanced filtering
- Bulk operations
- Import/export annotations

### Scale Requirements (Phase 3)

**Enterprise features**:
- Organization-wide visibility
- Annotation workflows
- Approval processes
- Advanced permissions
- Annotation analytics

**Integrations**:
- External calendar sync
- Event import from business systems
- API access for annotations
- Webhook notifications
- Custom event types

**Advanced analytics**:
- Annotation usage metrics
- Collaboration insights
- Event impact analysis
- Annotation trends
- Search analytics

## Technical Considerations

### Performance

- Full-text search index for annotation content
- Denormalized context data for fast queries
- Cached timeline views
- Lazy loading for comment threads
- Indexed lookups by entity, user, date

### Scalability

- Partition annotations by warehouse
- Archive old annotations periodically
- Pagination for all list views
- Rate limiting for search
- Connection pooling for database

### Security

- Row-level security for visibility
- Audit trail for all changes
- Sanitization of user content
- Rate limiting for creation
- Validation of references

### Data Management

- Soft delete for annotations
- Cascade delete configuration
- Periodic cleanup of deleted items
- Export/import functionality
- Backup strategy

---

**Version**: 1.0.0
**Last Updated**: 2026-01-27
**Status**: Draft

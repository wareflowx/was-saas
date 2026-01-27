# Favorites & Saved Views

## Overview

The Favorites & Saved Views system enables users to personalize their analytics experience by storing, organizing, and sharing custom view configurations. This feature increases productivity by allowing users to quickly access their preferred data perspectives and share insights across teams.

## Core Concepts

### Saved Views

Users can save filter configurations, chart settings, and visualization preferences as named views that can be quickly restored. Saved views capture the exact state of analysis including:

- Applied filters and their values
- Sort configurations
- Column visibility and ordering
- Chart type and visualization settings
- Time range selections
- Grouping and aggregation settings

### Custom Dashboards

Users can create personalized dashboard layouts by arranging multiple saved views into a unified display. Dashboards support:

- Grid-based layout system
- Resizable view containers
- Drag-and-drop reorganization
- Cross-view filtering interactions
- Responsive layout adaptation

### Favorites Management

Users maintain a curated list of frequently accessed views and dashboards for quick access. The favorites system provides:

- Pinned items priority ordering
- Recently used views tracking
- Quick access shortcuts
- Personalized landing page selection

### View Templates

Predefined view configurations provide starting points for common analysis scenarios. Templates include:

- Inventory overview templates
- Shipping analysis templates
- Performance monitoring templates
- Custom reporting templates

### View Sharing

View configurations can be exported and imported to share insights across users and teams. Sharing supports:

- Configuration file export/import
- Cross-user view distribution
- Template library management
- View versioning and updates

## Type Definitions

### ViewConfiguration

```typescript
type ViewConfiguration = readonly {
  id: string;
  name: string;
  description: string;
  filters: readonly FilterConfiguration[];
  chartSettings: readonly ChartSettings;
  tableSettings: readonly TableSettings;
  timeRange: TimeRangeConfiguration;
  grouping: GroupingConfiguration;
  createdAt: DateTime;
  updatedAt: DateTime;
};
```

### FilterConfiguration

```typescript
type FilterConfiguration = readonly {
  field: string;
  operator: FilterOperator;
  value: FilterValue;
  enabled: boolean;
};

type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "between"
  | "in"
  | "notIn";

type FilterValue = string | number | boolean | readonly FilterValue[];
```

### ChartSettings

```typescript
type ChartSettings = readonly {
  type: ChartType;
  xAxis: AxisConfiguration;
  yAxis: readonly AxisConfiguration[];
  series: readonly SeriesConfiguration[];
  legend: LegendConfiguration;
  colors: ColorScheme;
  animations: AnimationSettings;
};

type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "area"
  | "heatmap"
  | "table"
  | "metric";

type AxisConfiguration = readonly {
  field: string;
  label: string;
  format: string;
  aggregation: AggregationType;
};

type AggregationType =
  | "sum"
  | "average"
  | "count"
  | "min"
  | "max"
  | "median";
```

### TableSettings

```typescript
type TableSettings = readonly {
  visibleColumns: readonly string[];
  columnOrder: readonly string[];
  sortColumns: readonly SortConfiguration[];
  pageSize: number;
  columnWidths: readonly ColumnWidth[];
};

type SortConfiguration = readonly {
  field: string;
  direction: "asc" | "desc";
};

type ColumnWidth = readonly {
  column: string;
  width: number;
  autoSized: boolean;
};
```

### TimeRangeConfiguration

```typescript
type TimeRangeConfiguration = readonly {
  type: "preset" | "custom" | "relative";
  startDate: DateTime;
  endDate: DateTime;
  granularity: TimeGranularity;
  preset: TimePreset;
};

type TimeGranularity =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

type TimePreset =
  | "today"
  | "yesterday"
  | "last7Days"
  | "last30Days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "thisYear";
```

### GroupingConfiguration

```typescript
type GroupingConfiguration = readonly {
  enabled: boolean;
  fields: readonly string[];
  aggregations: readonly AggregationConfiguration[];
  hierarchy: GroupingHierarchy;
};

type AggregationConfiguration = readonly {
  field: string;
  type: AggregationType;
  label: string;
};

type GroupingHierarchy = readonly {
  levels: readonly GroupingLevel[];
  expanded: readonly boolean[];
};
```

### GroupingLevel

```typescript
type GroupingLevel = readonly {
  field: string;
  depth: number;
  collapsible: boolean;
};
```

### SavedView

```typescript
type SavedView = readonly {
  id: string;
  configuration: ViewConfiguration;
  metadata: ViewMetadata;
  access: ViewAccess;
  version: number;
  isFavorite: boolean;
  usageStatistics: UsageStatistics;
};
```

### ViewMetadata

```typescript
type ViewMetadata = readonly {
  createdAt: DateTime;
  createdBy: string;
  lastModifiedAt: DateTime;
  lastModifiedBy: string;
  category: ViewCategory;
  tags: readonly string[];
  description: string;
};

type ViewCategory =
  | "inventory"
  | "shipping"
  | "performance"
  | "custom"
  | "system";
```

### ViewAccess

```typescript
type ViewAccess = readonly {
  visibility: VisibilityScope;
  owner: string;
  sharedWith: readonly string[];
  permissions: AccessPermissions;
};

type VisibilityScope =
  | "private"
  | "shared"
  | "public";

type AccessPermissions = readonly {
  canView: readonly string[];
  canEdit: readonly string[];
  canDelete: readonly string[];
  canShare: readonly string[];
};
```

### UsageStatistics

```typescript
type UsageStatistics = readonly {
  timesOpened: number;
  lastOpenedAt: DateTime;
  averageSessionDuration: number;
  openCountPerDay: readonly DailyUsage[];
};

type DailyUsage = readonly {
  date: DateTime;
  count: number;
};
```

### CustomDashboard

```typescript
type CustomDashboard = readonly {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  widgets: readonly DashboardWidget[];
  theme: DashboardTheme;
  filters: DashboardFilters;
  metadata: DashboardMetadata;
  access: ViewAccess;
  isFavorite: boolean;
  isDefault: boolean;
};
```

### DashboardLayout

```typescript
type DashboardLayout = readonly {
  type: "grid" | "freeform" | "tabs";
  columns: number;
  spacing: SpacingConfiguration;
  responsiveness: ResponsiveBreakpoints;
};

type SpacingConfiguration = readonly {
  padding: number;
  gap: number;
  margin: number;
};

type ResponsiveBreakpoints = readonly {
  small: number;
  medium: number;
  large: number;
};
```

### DashboardWidget

```typescript
type DashboardWidget = readonly {
  id: string;
  viewId: string;
  position: WidgetPosition;
  size: WidgetSize;
  title: string;
  interactions: WidgetInteractions;
  refreshInterval: number;
  visible: boolean;
};

type WidgetPosition = readonly {
  column: number;
  row: number;
  zIndex: number;
};

type WidgetSize = readonly {
  width: number;
  height: number;
  minimumWidth: number;
  minimumHeight: number;
  maximumWidth: number;
  maximumHeight: number;
};

type WidgetInteractions = readonly {
  crossFiltering: boolean;
  drillDown: boolean;
  linkTo: readonly string[];
  highlightOnHover: boolean;
};
```

### DashboardTheme

```typescript
type DashboardTheme = readonly {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
  shadowLevel: number;
  chartColors: readonly string[];
};
```

### DashboardFilters

```typescript
type DashboardFilters = readonly {
  globalFilters: readonly FilterConfiguration[];
  crossWidgetFiltering: boolean;
  filterBarVisible: boolean;
  filterPersistence: FilterPersistence;
};

type FilterPersistence =
  | "session"
  | "local"
  | "url"
  | "permanent";
```

### DashboardMetadata

```typescript
type DashboardMetadata = readonly {
  createdAt: DateTime;
  createdBy: string;
  lastModifiedAt: DateTime;
  lastModifiedBy: string;
  version: number;
  thumbnail: string;
  category: string;
  tags: readonly string[];
};
```

### ViewTemplate

```typescript
type ViewTemplate = readonly {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  configuration: ViewConfiguration;
  preview: TemplatePreview;
  isSystemTemplate: boolean;
  popularity: TemplatePopularity;
  difficulty: TemplateDifficulty;
  estimatedSetupTime: number;
};

type TemplateCategory =
  | "inventory"
  | "shipping"
  | "performance"
  | "reporting"
  | "custom";

type TemplatePreview = readonly {
  thumbnail: string;
  screenshot: string;
  description: string;
  features: readonly string[];
};

type TemplatePopularity = readonly {
  usageCount: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
};

type TemplateDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";
```

### ViewSharing

```typescript
type ViewSharing = readonly {
  shareableId: string;
  shareableLink: string;
  expiration: SharingExpiration;
  permissions: SharingPermissions;
  accessLog: readonly SharingAccess[];
  maxUses: number;
  currentUses: number;
};

type SharingExpiration = readonly {
  enabled: boolean;
  expiresAt: DateTime;
  duration: number;
};

type SharingPermissions = readonly {
  canView: boolean;
  canEdit: boolean;
  canDuplicate: boolean;
  requiresAuth: boolean;
  allowedUsers: readonly string[];
};

type SharingAccess = readonly {
  accessedAt: DateTime;
  accessedBy: string;
  action: string;
};
```

### FavoriteItem

```typescript
type FavoriteItem = readonly {
  id: string;
  type: FavoriteType;
  itemId: string;
  pinnedOrder: number;
  addedAt: DateTime;
  notes: string;
  shortcut: string;
};

type FavoriteType =
  | "view"
  | "dashboard"
  | "report"
  | "template";
```

### ViewExport

```typescript
type ViewExport = readonly {
  format: ExportFormat;
  configuration: ViewConfiguration;
  metadata: ViewMetadata;
  version: string;
  compressed: boolean;
  encrypted: boolean;
  includeData: boolean;
};

type ExportFormat =
  | "json"
  | "yaml"
  | "xml";
```

### ViewImport

```typescript
type ViewImport = readonly {
  source: ImportSource;
  format: ExportFormat;
  conflictResolution: ConflictResolution;
  preserveOwnership: boolean;
  validateBeforeImport: boolean;
  createBackup: boolean;
};

type ImportSource =
  | "file"
  | "url"
  | "clipboard"
  | "templateLibrary";

type ConflictResolution =
  | "skip"
  | "overwrite"
  | "rename"
  | "merge"
  | "ask";
```

### ViewValidation

```typescript
type ViewValidation = readonly {
  isValid: boolean;
  errors: readonly ValidationError[];
  warnings: readonly ValidationWarning[];
  compatibility: CompatibilityInfo;
};

type ValidationError = readonly {
  field: string;
  message: string;
  severity: "error" | "warning" | "info";
  code: string;
};

type ValidationWarning = readonly {
  field: string;
  message: string;
  suggestion: string;
  autoFixable: boolean;
};

type CompatibilityInfo = readonly {
  targetVersion: string;
  sourceVersion: string;
  breakingChanges: readonly string[];
  migrationRequired: boolean;
};
```

### ViewHistory

```typescript
type ViewHistory = readonly {
  viewId: string;
  versions: readonly ViewVersion[];
  currentVersion: number;
  autoSaveEnabled: boolean;
  maxVersions: number;
};

type ViewVersion = readonly {
  version: number;
  configuration: ViewConfiguration;
  savedAt: DateTime;
  savedBy: string;
  changeDescription: string;
  size: number;
};
```

### ViewSearch

```typescript
type ViewSearch = readonly {
  query: string;
  filters: SearchFilters;
  sortBy: SearchSortOption;
  sortOrder: "asc" | "desc";
  limit: number;
  offset: number;
};

type SearchFilters = readonly {
  categories: readonly string[];
  tags: readonly string[];
  owners: readonly string[];
  dateRange: TimeRangeConfiguration;
  isFavorite: boolean;
  isShared: boolean;
};

type SearchSortOption =
  | "name"
  | "dateCreated"
  | "dateModified"
  | "popularity"
  | "lastUsed";
```

### ViewPermissions

```typescript
type ViewPermissions = readonly {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
  canImport: boolean;
  canDuplicate: boolean;
  canManagePermissions: boolean;
};
```

## Function Signatures

### View Management

```typescript
type CreateView = (
  configuration: ViewConfiguration,
  metadata: ViewMetadata
) => Promise<SavedView>;

type UpdateView = (
  viewId: string,
  configuration: ViewConfiguration,
  createVersion: boolean
) => Promise<SavedView>;

type DeleteView = (
  viewId: string,
  permanent: boolean
) => Promise<boolean>;

type DuplicateView = (
  viewId: string,
  newName: string,
  copyOwner: boolean
) => Promise<SavedView>;

type GetView = (
  viewId: string
) => Promise<SavedView>;

type ListViews = (
  filters: SearchFilters
) => Promise<readonly SavedView[]>;

type SearchViews = (
  search: ViewSearch
) => Promise<readonly SavedView[]>;
```

### Favorites Management

```typescript
type AddFavorite = (
  itemId: string,
  type: FavoriteType,
  notes: string
) => Promise<FavoriteItem>;

type RemoveFavorite = (
  favoriteId: string
) => Promise<boolean>;

type GetFavorites = (
  type?: FavoriteType
) => Promise<readonly FavoriteItem[]>;

type PinFavorite = (
  favoriteId: string,
  order: number
) => Promise<FavoriteItem>;

type UnpinFavorite = (
  favoriteId: string
) => Promise<boolean>;

type ReorderFavorites = (
  favoriteIds: readonly string[]
) => Promise<boolean>;
```

### Dashboard Management

```typescript
type CreateDashboard = (
  name: string,
  description: string,
  layout: DashboardLayout,
  widgets: readonly DashboardWidget[]
) => Promise<CustomDashboard>;

type UpdateDashboard = (
  dashboardId: string,
  layout?: DashboardLayout,
  widgets?: readonly DashboardWidget[]
) => Promise<CustomDashboard>;

type DeleteDashboard = (
  dashboardId: string
) => Promise<boolean>;

type GetDashboard = (
  dashboardId: string
) => Promise<CustomDashboard>;

type ListDashboards = (
  includeWidgets: boolean
) => Promise<readonly CustomDashboard[]>;

type AddWidgetToDashboard = (
  dashboardId: string,
  widget: DashboardWidget
) => Promise<CustomDashboard>;

type RemoveWidgetFromDashboard = (
  dashboardId: string,
  widgetId: string
) => Promise<CustomDashboard>;

type UpdateWidgetPosition = (
  dashboardId: string,
  widgetId: string,
  position: WidgetPosition
) => Promise<DashboardWidget>;

type UpdateWidgetSize = (
  dashboardId: string,
  widgetId: string,
  size: WidgetSize
) => Promise<DashboardWidget>;
```

### Template Management

```typescript
type CreateTemplate = (
  name: string,
  description: string,
  configuration: ViewConfiguration,
  category: TemplateCategory
) => Promise<ViewTemplate>;

type GetTemplate = (
  templateId: string
) => Promise<ViewTemplate>;

type ListTemplates = (
  category?: TemplateCategory,
  difficulty?: TemplateDifficulty
) => Promise<readonly ViewTemplate[]>;

type ApplyTemplate = (
  templateId: string,
  customization: Partial<ViewConfiguration>
) => Promise<SavedView>;

type RateTemplate = (
  templateId: string,
  rating: number,
  review?: string
) => Promise<ViewTemplate>;

type UpdateTemplate = (
  templateId: string,
  configuration: ViewConfiguration
) => Promise<ViewTemplate>;

type DeleteTemplate = (
  templateId: string
) => Promise<boolean>;
```

### Sharing and Export

```typescript
type ExportView = (
  viewId: string,
  format: ExportFormat,
  includeMetadata: boolean
) => Promise<ViewExport>;

type ImportView = (
  exportData: ViewExport,
  importOptions: ViewImport
) => Promise<SavedView>;

type CreateShareableLink = (
  viewId: string,
  expiration?: DateTime,
  permissions?: SharingPermissions
) => Promise<ViewSharing>;

type RevokeShareableLink = (
  shareableId: string
) => Promise<boolean>;

type GetSharedView = (
  shareableId: string
) => Promise<ViewConfiguration>;

type ListSharedWithMe = (
  includeExpired: boolean
) => Promise<readonly ViewSharing[]>;

type UpdateSharingPermissions = (
  shareableId: string,
  permissions: SharingPermissions
) => Promise<ViewSharing>;
```

### Version Management

```typescript
type GetViewHistory = (
  viewId: string
) => Promise<ViewHistory>;

type RestoreViewVersion = (
  viewId: string,
  version: number
) => Promise<SavedView>;

type CompareViewVersions = (
  viewId: string,
  version1: number,
  version2: number
) => Promise<readonly VersionDiff[]>;

type DeleteOldVersions = (
  viewId: string,
  keepLastN: number
) => Promise<boolean>;

type EnableAutoSave = (
  viewId: string,
  interval: number
) => Promise<boolean>;

type DisableAutoSave = (
  viewId: string
) => Promise<boolean>;
```

### Validation and Compatibility

```typescript
type ValidateViewConfiguration = (
  configuration: ViewConfiguration
) => Promise<ViewValidation>;

type ValidateImportCompatibility = (
  exportData: ViewExport
) => Promise<ViewValidation>;

type MigrateViewVersion = (
  configuration: ViewConfiguration,
  targetVersion: string
) => Promise<ViewConfiguration>;

type SuggestViewFixes = (
  validation: ViewValidation
) => Promise<readonly ValidationFix[]>;
```

### Usage and Analytics

```typescript
type TrackViewUsage = (
  viewId: string,
  action: string,
  duration: number
) => Promise<boolean>;

type GetViewStatistics = (
  viewId: string,
  timeRange: TimeRangeConfiguration
) => Promise<UsageStatistics>;

type GetPopularViews = (
  limit: number,
  timeRange: TimeRangeConfiguration
) => Promise<readonly SavedView[]>;

type GetRecentlyUsedViews = (
  limit: number
) => Promise<readonly SavedView[]>;

type GetRecommendedViews = (
  userId: string,
  limit: number
) => Promise<readonly SavedView[]>;

type UpdateUsageStatistics = (
  viewId: string,
  statistics: Partial<UsageStatistics>
) => Promise<boolean>;
```

### View Permissions

```typescript
type GetViewPermissions = (
  viewId: string
) => Promise<ViewPermissions>;

type SetViewPermissions = (
  viewId: string,
  permissions: Partial<ViewPermissions>,
  users?: readonly string[]
) => Promise<boolean>;

type GrantViewAccess = (
  viewId: string,
  userId: string,
  permissions: Partial<ViewPermissions>
) => Promise<boolean>;

type RevokeViewAccess = (
  viewId: string,
  userId: string
) => Promise<boolean>;

type CheckViewAccess = (
  viewId: string,
  userId: string,
  requiredPermission: keyof ViewPermissions
) => Promise<boolean>;
```

## Default Views

System-provided default views give users immediate value without requiring configuration:

### Inventory Defaults

- **Inventory Overview**: Total items, low stock alerts, category distribution
- **Stock Levels**: Current inventory levels across all warehouses
- **Reorder Analysis**: Items requiring reorder based on lead time
- **Inventory Valuation**: Total inventory value by category

### Shipping Defaults

- **Shipping Summary**: Daily/weekly shipping volumes and trends
- **Carrier Performance**: On-time delivery rates by carrier
- **Shipping Costs**: Cost analysis per carrier and route
- **Delivery Status**: Current delivery status distribution

### Performance Defaults

- **Warehouse KPIs**: Key performance indicators dashboard
- **Throughput Analysis**: Items processed per time period
- **Efficiency Metrics**: Labor and space utilization
- **Error Rates**: Pick/pack/ship error tracking

## Product Requirements

### Functional Requirements

- Users must be able to save any current view configuration with a custom name
- Saved views must capture all filter, sort, and visualization settings
- Users must be able to organize saved views into categories and tags
- Users must be able to create custom dashboards by combining multiple saved views
- Dashboard layouts must support drag-and-drop widget arrangement
- Users must be able to mark views and dashboards as favorites
- Favorite items must appear prominently in the navigation
- Users must be able to export view configurations for backup or sharing
- Users must be able to import view configurations from files
- System must provide a library of predefined view templates
- Users must be able to rate and review view templates
- Users must be able to share views via shareable links with expiration
- System must track view usage statistics and popularity
- Users must be able to restore previous versions of saved views
- System must validate imported configurations for compatibility

### Non-Functional Requirements

- View saving must complete within 500ms
- Dashboard loading must complete within 2 seconds
- Favorite updates must reflect immediately across sessions
- Exported configuration files must not exceed 1MB for typical views
- System must support at least 1000 saved views per user
- Dashboard must support at least 20 widgets without performance degradation
- View search must return results within 1 second
- Imported configurations must be validated before application
- Shareable links must support expiration and access limits
- System must maintain at least 10 historical versions per view

### User Experience Requirements

- Save view action must be accessible from any view page
- Quick save option must be available with default naming
- Dashboard creation must include drag-and-drop interface
- Favorite items must be accessible within 2 clicks from homepage
- Template library must be searchable and filterable
- Import process must provide clear feedback on compatibility issues
- Shareable link creation must include expiration options
- Version history must show clear change descriptions
- View restoration must preview changes before applying
- Mobile interface must support dashboard viewing

### Security Requirements

- Private views must only be accessible to owner
- Shared views must enforce permission settings
- Shareable links must use cryptographically secure identifiers
- Exported configurations must not contain sensitive data
- Import process must validate against malicious content
- Access logs must track all shared view access
- View permissions must support role-based assignment
- System must audit all view modifications

### Data Management Requirements

- View configurations must be version-controlled
- Deleted views must be retained in trash for 30 days
- Favorite associations must cascade on view deletion
- Dashboard dependencies must be tracked for widgets
- Template updates must notify users of changes
- System must clean up expired shareable links
- Usage statistics must be aggregated for performance
- Old versions must be purged based on retention policy

## Integration Points

### User Preferences System

- Default view selection for homepage
- Auto-save preferences configuration
- Notification settings for shared views
- Theme and layout personalization

### Analytics System

- View usage tracking and reporting
- Popular view recommendations
- Template performance metrics
- User behavior analysis

### Notification System

- Shared view access notifications
- Template update alerts
- Favorite item changes
- View expiration warnings

### Search System

- Full-text view name and description search
- Tag-based filtering
- Category browsing
- Owner and permission filtering

### Audit System

- View creation and modification logging
- Sharing access tracking
- Permission changes recording
- Import/export activity logging

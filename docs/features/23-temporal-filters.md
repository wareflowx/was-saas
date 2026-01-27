# Temporal Filters

## Overview

Global temporal filtering system that applies consistent time-based constraints across all analytics, reporting, and data visualization features in the platform.

## Core Concepts

### Global Time Context
- Single source of truth for all time-based filtering
- Applied consistently across dashboards, reports, and exports
- Maintains user-selected time range throughout session
- Persists preferences across sessions for consistency

### Temporal Granularity
- Supports multiple time granularities (hourly, daily, weekly, monthly, quarterly, yearly)
- Automatic aggregation based on selected time range
- Flexible grouping for trend analysis and comparisons

## Type Definitions

### DatePreset

Represents predefined time period options for quick selection.

```typescript
type DatePreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_14_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'week_to_date'
  | 'month_to_date'
  | 'quarter_to_date'
  | 'year_to_date'
  | 'custom';
```

### TimeRange

Defines a specific time period with start and end boundaries.

```typescript
type TimeRange = readonly {
  readonly start: DateTime;
  readonly end: DateTime;
  readonly preset?: DatePreset;
  readonly timezone: string;
};
```

### PeriodComparison

Configuration for comparing time periods to identify trends and variations.

```typescript
type PeriodComparison = readonly {
  readonly current: TimeRange;
  readonly previous: TimeRange;
  readonly comparisonType: ComparisonType;
  readonly includeAbsoluteValues: boolean;
  readonly includePercentageChange: boolean;
  readonly alignPeriods: boolean;
};

type ComparisonType =
  | 'period_over_period'
  | 'year_over_year'
  | 'quarter_over_quarter'
  | 'month_over_month'
  | 'week_over_week';
```

### TemporalFilterContext

Comprehensive context for temporal filtering across the application.

```typescript
type TemporalFilterContext = readonly {
  readonly selectedRange: TimeRange;
  readonly comparison?: PeriodComparison;
  readonly granularities: readonly TimeGranularity[];
  readonly activeGranularity: TimeGranularity;
  readonly timezone: string;
  readonly locale: string;
  readonly businessHours?: BusinessHoursConfig;
  readonly excludeHolidays: boolean;
  readonly fiscalYearConfig?: FiscalYearConfig;
};

type TimeGranularity =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

type BusinessHoursConfig = readonly {
  readonly daysOfWeek: readonly DayOfWeek[];
  readonly startHour: number;
  readonly endHour: number;
  readonly timezone: string;
};

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type FiscalYearConfig = readonly {
  readonly startMonth: number;
  readonly startDay: number;
  readonly namingConvention: FiscalYearNaming;
};

type FiscalYearNaming =
  | 'calendar_year'
  | 'year_end'
  | 'start_year';
```

### TrendAnalysis

Configuration for analyzing patterns and trends over time periods.

```typescript
type TrendAnalysis = readonly {
  readonly timeRange: TimeRange;
  readonly granularity: TimeGranularity;
  readonly metrics: readonly TrendMetric[];
  readonly analysisType: TrendAnalysisType;
  readonly smoothingFactor?: number;
  readonly forecastPeriod?: number;
  readonly confidenceLevel?: number;
  readonly seasonalityAdjustment: boolean;
};

type TrendMetric = readonly {
  readonly name: string;
  readonly aggregation: AggregationMethod;
  readonly dataPoints: readonly DataPoint[];
};

type DataPoint = readonly {
  readonly timestamp: DateTime;
  readonly value: number;
  readonly metadata?: Record<string, unknown>;
};

type AggregationMethod =
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'count'
  | 'median'
  | 'percentile';

type TrendAnalysisType =
  | 'linear'
  | 'exponential'
  | 'moving_average'
  | 'seasonal'
  | 'custom';

type TrendDirection = 'increasing' | 'decreasing' | 'stable' | 'volatile';

type TrendInsight = readonly {
  readonly direction: TrendDirection;
  readonly magnitude: number;
  readonly confidence: number;
  readonly description: string;
  readonly anomalies: readonly Anomaly[];
};

type Anomaly = readonly {
  readonly timestamp: DateTime;
  readonly expected: number;
  readonly actual: number;
  readonly deviation: number;
  readonly significance: 'low' | 'medium' | 'high';
};
```

## Function Signatures

### Time Range Management

```typescript
type CreateTimeRange = (preset: DatePreset, timezone: string) => TimeRange;

type CreateCustomRange = (start: DateTime, end: DateTime, timezone: string) => TimeRange;

type ValidateTimeRange = (range: TimeRange) => ValidationResult;

type AdjustRangeToGranularity = (range: TimeRange, granularity: TimeGranularity) => TimeRange;

type GetRangeBoundaries = (range: TimeRange, granularity: TimeGranularity) => readonly DateTime[];
```

### Period Comparison

```typescript
type CreatePeriodComparison = (
  current: TimeRange,
  comparisonType: ComparisonType
) => PeriodComparison;

type CalculatePeriodOffset = (
  range: TimeRange,
  offset: number,
  unit: TimeUnit
) => TimeRange;

type GenerateComparisonRanges = (
  baseRange: TimeRange,
  comparisonTypes: readonly ComparisonType[]
) -> readonly PeriodComparison[];

type ComparePeriods = (
  current: readonly DataPoint[],
  previous: readonly DataPoint[],
  comparison: PeriodComparison
) -> ComparisonResult;

type ComparisonResult = readonly {
  readonly absoluteChange: number;
  readonly percentageChange: number;
  readonly statisticalSignificance: number;
  readonly insights: readonly string[];
};
```

### Trend Analysis

```typescript
type AnalyzeTrend = (
  metrics: readonly TrendMetric[],
  config: TrendAnalysis
) -> readonly TrendInsight[];

type CalculateMovingAverage = (
  data: readonly DataPoint[],
  window: number
) -> readonly DataPoint[];

type DetectSeasonality = (
  data: readonly DataPoint[],
  period: number
) -> SeasonalityResult;

type SeasonalityResult = readonly {
  readonly hasSeasonality: boolean;
  readonly period: number;
  readonly strength: number;
  readonly pattern: readonly number[];
};

type GenerateForecast = (
  historical: readonly DataPoint[],
  periods: number,
  method: ForecastMethod
) -> ForecastResult;

type ForecastMethod = 'linear' | 'exponential' | 'arima' | 'prophet';

type ForecastResult = readonly {
  readonly forecast: readonly DataPoint[];
  readonly confidenceInterval: readonly {
    readonly lower: readonly DataPoint[];
    readonly upper: readonly DataPoint[];
  };
  readonly accuracy: number;
};
```

### Time Zone and Localization

```typescript
type ConvertTimezone = (
  timestamp: DateTime,
  fromTimezone: string,
  toTimezone: string
) -> DateTime;

type ApplyBusinessHoursFilter = (
  range: TimeRange,
  config: BusinessHoursConfig
) -> TimeRange;

type AdjustForFiscalYear = (
  date: DateTime,
  config: FiscalYearConfig
) -> FiscalPeriod;

type FiscalPeriod = readonly {
  readonly year: number;
  readonly quarter: number;
  readonly period: string;
};

type GetBusinessDayCount = (
  range: TimeRange,
  excludeHolidays: boolean,
  timezone: string
) -> number;
```

### Context Management

```typescript
type CreateTemporalContext = (
  range: TimeRange,
  options: TemporalContextOptions
) -> TemporalFilterContext;

type TemporalContextOptions = readonly {
  readonly comparison?: PeriodComparison;
  readonly granularities?: readonly TimeGranularity[];
  readonly activeGranularity?: TimeGranularity;
  readonly timezone?: string;
  readonly locale?: string;
  readonly businessHours?: BusinessHoursConfig;
  readonly fiscalYearConfig?: FiscalYearConfig;
};

type UpdateContextRange = (
  context: TemporalFilterContext,
  newRange: TimeRange
) -> TemporalFilterContext;

type MergeContexts = (
  primary: TemporalFilterContext,
  secondary: TemporalFilterContext
) -> TemporalFilterContext;

type ValidateContext = (context: TemporalFilterContext) -> ValidationResult;
```

### Utility Functions

```typescript
type GetAvailablePresets = () -> readonly DatePreset[];

type GetPresetLabel = (preset: DatePreset, locale: string) -> string;

type FormatTimeRange = (
  range: TimeRange,
  format: DateFormat,
  locale: string
) -> string;

type DateFormat = 'short' | 'medium' | 'long' | 'full';

type GetGranularityOptions = (
  range: TimeRange
) -> readonly TimeGranularity[];

type GetDefaultGranularity = (
  range: TimeRange
) -> TimeGranularity;

type CalculateDateDifference = (
  start: DateTime,
  end: DateTime,
  unit: TimeUnit
) -> number;

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

type IsDateInRange = (
  date: DateTime,
  range: TimeRange
) -> boolean;

type OverlappingRanges = (
  range1: TimeRange,
  range2: TimeRange
) -> boolean;

type GetIntersection = (
  range1: TimeRange,
  range2: TimeRange
) -> TimeRange | null;
```

## Product Requirements

### Global Time Selector

**Scope**: Platform-wide time range filtering

**Features**:
- Persistent time range selection across all views
- Quick access to common presets (today, this week, this month, etc.)
- Custom date range picker with calendar interface
- Visual indication of currently selected period
- Keyboard shortcuts for rapid period selection
- Display of selected range in header/navigation

**User Experience**:
- Single click to switch between preset periods
- Intuitive custom range selection with date pickers
- Clear visual feedback on active selection
- Consistent placement across all pages
- Responsive design for mobile and desktop

### Period Comparison

**Scope**: Comparative analysis between time periods

**Features**:
- Automatic previous period calculation
- Year-over-year comparison support
- Side-by-side metric comparison
- Visual indicators for positive/negative changes
- Percentage and absolute value display
- Statistical significance indicators

**Comparison Types**:
- Compare to previous period (week, month, quarter, year)
- Compare to same period last year
- Compare to custom baseline period
- Multi-period comparison (compare 3+ periods)

**Visualizations**:
- Bar charts comparing periods
- Line charts showing trends
- Delta indicators (up/down arrows)
- Color-coded changes (green for positive, red for negative)
- Summary statistics cards

### Trend Analysis

**Scope**: Identify patterns and forecast future values

**Features**:
- Automatic trend detection (increasing, decreasing, stable)
- Moving average smoothing
- Seasonality detection
- Anomaly identification
- Forecast generation with confidence intervals
- Trend strength indicators

**Analysis Capabilities**:
- Linear trend analysis
- Seasonal decomposition
- Growth rate calculation
- Pattern recognition
- Outlier detection

**Presentation**:
- Trend lines overlaid on charts
- Forecast areas with confidence bands
- Anomaly markers on data points
- Insight descriptions in natural language
- Export trend data as CSV/Excel

### Time Zone Support

**Scope**: Multi-timezone data handling

**Features**:
- User timezone detection and selection
- Automatic timezone conversion
- Business hours filtering by timezone
- UTC and local time display options
- Timezone-aware date pickers

**Use Cases**:
- Global teams collaborating across timezones
- Regional analysis with local time context
- Reporting in specific timezone context
- International business operations

### Fiscal Calendar Support

**Scope**: Non-standard fiscal year configurations

**Features**:
- Custom fiscal year start date
- Fiscal quarter definitions
- Fiscal period labeling
- Calendar-to-fiscal date conversion
- Fiscal year aggregation

**Configuration**:
- Organization-level fiscal year settings
- Per-report fiscal calendar selection
- Automatic fiscal period calculation
- Fiscal year naming conventions

### Granularity Control

**Scope**: Time-based data aggregation levels

**Features**:
- Automatic granularity suggestion based on range
- Manual granularity override
- Multiple granularities in same view
- Granularity-dependent visualizations

**Granularity Options**:
- Hourly: for single-day analysis
- Daily: for week/month analysis
- Weekly: for quarter analysis
- Monthly: for year analysis
- Quarterly: for multi-year analysis
- Yearly: for long-term trends

### Performance and Scalability

**Data Volume Handling**:
- Efficient querying for large time ranges
- Data aggregation at database level
- Cached results for common periods
- Incremental loading for long ranges
- Sampling for visualization performance

**Caching Strategy**:
- Pre-aggregated data for common periods
- Time-based cache invalidation
- Distributed caching for multi-user scenarios
- Query result caching

### Accessibility and Usability

**Accessibility**:
- Keyboard navigation for all time controls
- Screen reader announcements for range changes
- High contrast visual indicators
- Focus management in date pickers
- Alternative text for trend charts

**Internationalization**:
- Locale-specific date formats
- Translated period names
- Right-to-left layout support
- Localized first day of week
- Regional calendar systems

## Integration Points

### Dashboard Integration
- Apply global time range to all dashboard widgets
- Individual widget time range override option
- Unified period comparison across widgets
- Consistent timezone handling

### Report Generation
- Time range selector in report configuration
- Period comparison in report headers
- Trend analysis in report sections
- Fiscal calendar support for financial reports

### Data Export
- Export filtered data within selected range
- Include comparison period data in exports
- Metadata indicating time range and filters applied
- Timezone information in export files

### API Integration
- Time range parameters in all data endpoints
- Period comparison query parameters
- Trend analysis endpoint with configuration
- Timezone context in API requests

## Security and Privacy

### Data Access Control
- Respect data retention policies
- Enforce access control based on time ranges
- Audit log of time range changes
- Prevent unauthorized period access

### Privacy Considerations
- Anonymize data for long-term trend analysis
- Aggregate data for period comparisons
- No exposure of individual timestamps in summaries
- Compliance with data privacy regulations

## Monitoring and Analytics

### Usage Metrics
- Most commonly used time ranges
- Preset vs custom range usage
- Comparison feature adoption
- Trend analysis usage patterns

### Performance Monitoring
- Query performance by time range size
- Cache hit rates for common periods
- Rendering performance for large datasets
- API response times for temporal queries

## Future Enhancements

### Advanced Features
- Machine learning-based trend prediction
- Advanced anomaly detection algorithms
- Custom period definitions (e.g., 4-4-5 calendar)
- Rolling period calculations
- Multi-dimensional time analysis (hour of day patterns)

### Integration Opportunities
- Calendar system integration (Google Calendar, Outlook)
- CRM system time zone synchronization
- ERP fiscal calendar integration
- Business intelligence platform connectivity
- Automated reporting with scheduled time ranges

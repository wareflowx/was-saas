# UI Architecture and Navigation Design

## Overview

Wareflow features a **deep exploration UI** built with shadcn/ui that enables users to navigate through data relationships seamlessly. Users start from high-level dashboards and drill down into atomic details, with rich interactivity at every level.

## Core Design Philosophy

```
Exploration, Not Just Display
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Every data element is a navigation point
Every chart reveals deeper insights on interaction
Every analysis links to its source data
```

### Key Principles

1. **Click to Explore**: Every data point is clickable and reveals more context
2. **Breadcrumbs Always Visible**: Users always know where they are and can navigate back
3. **Context Preservation**: Filters and selections persist across navigation
4. **Progressive Disclosure**: Show summaries first, details on demand
5. **Visual Continuity**: Each layer maintains visual consistency with color coding

## Navigation Architecture

### Multi-Level Drill-Down System

```
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 1: DASHBOARD                           │
│  KPIs | Trends | Alerts | Quick Actions                         │
│  → Click on any metric → Level 2                                │
└─────────────────────────────────────────────────────────────────┘
                            ↓ drill-down
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 2: AGGREGATED VIEW                    │
│  DataTable | Charts | Summaries | Filters                       │
│  → Click on row/chart point → Level 3                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓ drill-down
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 3: DETAILED VIEW                      │
│  Entity Details | Related Items | Timeline | Actions           │
│  → Click on related item → Level 4                               │
└─────────────────────────────────────────────────────────────────┘
                            ↓ drill-down
┌─────────────────────────────────────────────────────────────────┐
│                    LEVEL 4: ATOMIC VIEW                        │
│  Individual Records | Raw Data | Source Tracking              │
└─────────────────────────────────────────────────────────────────┘
```

### Navigation State Type

```typescript
type NavigationState = {
  readonly history: readonly NavigationStep[]
  readonly currentLevel: number
  readonly context: NavigationContext
  readonly canGoBack: boolean
  readonly canGoForward: boolean
}

type NavigationStep = {
  readonly level: number
  readonly title: string
  readonly entity: {
    readonly type: EntityType
    readonly id: string
    readonly data: unknown
  }
  readonly timestamp: Date
  readonly filters: readonly Filter[]
}

type EntityType =
  | 'dashboard'
  | 'product'
  | 'movement'
  | 'order'
  | 'operator'
  | 'location'
  | 'supplier'
  | 'analysis'

type NavigationContext = {
  readonly parent?: NavigationStep
  readonly filters: readonly Filter[]
  readonly sortBy?: readonly SortColumn[]
  readonly metadata: {
    readonly totalResults: number
    readonly queryDuration: number
    readonly dataSource: string
    readonly lastRefresh: Date
  }
}
```

## shadcn/ui Component Usage

### Data Display Components

#### 1. DataTable (Enhanced)

**Features**:
- Virtual scrolling for large datasets (10K+ rows)
- Multi-column sorting
- Advanced filtering
- Row click navigation
- Inline actions
- Column visibility toggle
- Export functionality

```typescript
type DataTableConfig = {
  readonly columns: readonly ColumnDef[]
  readonly data: readonly unknown[]
  readonly enableRowClick: boolean
  readonly onRowClick: (row: unknown) => void
  readonly enableMultiSort: boolean
  readonly enableFilters: boolean
  readonly enableVirtualScroll: boolean
  readonly pageSize: number
  readonly rowActions?: readonly RowAction[]
}

type RowAction = {
  readonly label: string
  readonly icon: string
  readonly onClick: (row: unknown) => void
  readonly variant?: 'default' | 'destructive'
}
```

**Usage Pattern**:
```typescript
<DataTable
  columns={productColumns}
  data={products}
  enableRowClick={true}
  onRowClick={(product) => navigateTo('product', product.id)}
  enableMultiSort={true}
  enableFilters={true}
  enableVirtualScroll={true}
  rowActions={[
    { label: 'View Details', icon: 'eye', onClick: viewDetails },
    { label: 'View Movements', icon: 'arrow-right', onClick: viewMovements }
  ]}
/>
```

#### 2. Interactive Charts (Recharts)

**Features**:
- Click to drill-down
- Zoom and pan
- Custom tooltips
- Legend filtering
- Export as image

```typescript
type ChartConfig = {
  readonly type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'heatmap'
  readonly data: readonly unknown[]
  readonly xAxis: string
  readonly yAxis: readonly string[]
  readonly enableClick: boolean
  readonly onClick?: (dataPoint: unknown) => void
  readonly enableZoom: boolean
  readonly showLegend: boolean
  readonly showTooltip: boolean
}
```

**Usage Pattern**:
```typescript
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={movementData} onClick={handleBarClick}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Legend />
    <Bar dataKey="quantity" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

#### 3. Breadcrumb Navigation

**Features**:
- Full navigation history
- Click any level to jump back
- Collapsed breadcrumbs for deep navigation
- Context menu for history

```typescript
type BreadcrumbItem = {
  readonly label: string
  readonly href?: string
  readonly onClick?: () => void
  readonly icon?: string
}
```

**Usage Pattern**:
```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>PROD-001</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Feedback Components

#### 1. Alert System

**Types**:
- `success`: Operation completed
- `warning`: Data quality issues
- `error`: Import/export failures
- `info`: Insights and recommendations

```typescript
type AlertConfig = {
  readonly type: 'success' | 'warning' | 'error' | 'info'
  readonly title: string
  readonly description: string
  readonly actions?: readonly AlertAction[]
  readonly dismissible: boolean
}

type AlertAction = {
  readonly label: string
  readonly onClick: () => void
  readonly variant?: 'default' | 'outline' | 'ghost'
}
```

**Usage Pattern**:
```typescript
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Import Warning</AlertTitle>
  <AlertDescription>
    Found 150 duplicate product IDs.
    <Button variant="outline" size="sm" className="ml-4">
      Review Duplicates
    </Button>
  </AlertDescription>
</Alert>
```

#### 2. Badge System

**Usage**:
- Status indicators (active, inactive, archived)
- Classification tags (ABC class, XYZ class)
- Count badges (notifications, errors)
- Category labels

```typescript
<Badge variant="outline" className="bg-green-100 text-green-800">
  ABC-A
</Badge>
<Badge variant="secondary">
  123 movements
</Badge>
```

#### 3. Toast Notifications

**Usage**:
- Operation success/failure
- Background task completion
- Real-time updates
- System messages

## Three-Layer Visual Design

### Layer 1: Modeling (Representation)

**Color Theme**: Blue (`#3b82f6`)
**Purpose**: Show what's happening in the warehouse

**Components**:
- **Timelines**: Movement over time
- **Heatmaps**: Zone activity intensity
- **Flow Diagrams**: Product movement paths
- **Activity Feeds**: Real-time operations

**Interactions**:
- Click timeline → View movements for that period
- Click heatmap zone → View zone details
- Click activity → View entity details

**Example Views**:
```
┌──────────────────────────────────────────────────┐
│  📊 Movement Timeline                            │
│  Jan  ████████████████████████░░░░░             │
│  Feb  ████████████████████████████              │
│  → Click on any bar → Daily breakdown           │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  🗺️ Zone Heatmap                                 │
│  Zone A: ████████ High activity (847 ops)       │
│  Zone B: ████░░░░░ Medium activity (312 ops)     │
│  Zone C: ██░░░░░░░ Low activity (124 ops)       │
│  → Click on zone → View zone movements          │
└──────────────────────────────────────────────────┘
```

### Layer 2: Analytics (Patterns)

**Color Theme**: Purple (`#8b5cf6`)
**Purpose**: Understand relationships and patterns

**Components**:
- **Scatter Plots**: Correlation analysis
- **Correlation Matrices**: Multi-variable relationships
- **ABC Analysis Charts**: Pareto distributions
- **Co-occurrence Networks**: Product relationships

**Interactions**:
- Click data point → View underlying records
- Brush selection → Filter to subset
- Click cluster → Analyze segment

**Example Views**:
```
┌──────────────────────────────────────────────────┐
│  🔗 ABC Classification                            │
│  │                                                │
│  │ 100% ┤                    *                   │
│  │  80% ┤           * * * * *                   │
│  │  60% ┤        * * *                           │
│  │  40% ┤     * * *                             │
│  │  20% ┤  * * *                                │
│  │   0% ┼────────────────────────────────────    │
│  │      0%  20%  40%  60%  80%  100%           │
│  │       A   B   C   D   E   F                  │
│  → Click on class A → View products              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  🕸️ Product Co-occurrence Network                │
│  PROD-001 ───── PROD-002                         │
│     │           │                                 │
│  PROD-003 ─── PROD-004 ─── PROD-005              │
│  → Click on product → View relationships         │
└──────────────────────────────────────────────────┘
```

### Layer 3: Predictive (Recommendations)

**Color Theme**: Amber/Green (`#f59e0b` / `#22c55e`)
**Purpose**: Suggest actions and predict outcomes

**Components**:
- **Alert Banners**: Critical recommendations
- **Suggestion Cards**: Actionable insights
- **Prediction Intervals**: Confidence ranges
- **Impact Indicators**: Expected outcomes

**Interactions**:
- Click suggestion → View analysis details
- Accept/reject recommendation
- Adjust parameters
- Export recommendation plan

**Example Views**:
```
┌──────────────────────────────────────────────────┐
│  ⚡ Recommendations                               │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ 📦 Stock Optimization                        │ │
│  │ Product PROD-001 is overstocked by 450 units │ │
│  │ Expected savings: $2,340/year               │ │
│  │                                              │ │
│  │ [View Analysis] [Apply Recommendation]      │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ 🔮 Demand Forecast                           │ │
│  │ Next week demand: +23% vs current week      │ │
│  │ Confidence: 87%                              │ │
│  │                                              │ │
│  │ [View Forecast] [Prepare Stock]             │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

## Navigation Patterns

### Pattern 1: Entity Deep Dive

**Flow**: Dashboard → Category → Entity → Details → Related Items

**Example**:
```
Dashboard
  → "Products" (click)
    → DataTable with 1,234 products
      → Click on row "PROD-001"
        → Product Detail View
          → Click on "Movements" tab
            → Movement DataTable
              → Click on movement row
                → Movement Detail (source, destination, operator)
                  → Click on operator
                    → Operator Profile
```

### Pattern 2: Analysis Deep Dive

**Flow**: Analysis Result → Data Segment → Records → Source Tracking

**Example**:
```
ABC Analysis (chart)
  → Click on Class A bar
    → Filtered products (Class A only)
      → Click on "PROD-001"
        → Product movements contributing to ABC score
          → Click on movement
            → Source order/transaction
```

### Pattern 3: Cross-Entity Navigation

**Flow**: From one entity type to related entities

**Example**:
```
Product "PROD-001" view
  → Related Orders tab
    → Order CMD-123
      → Order lines
        → Click on other product "PROD-045"
          → Navigate to product "PROD-045"
            → Compare products view
```

## Context Actions

### Right-Click Menu (Context Menu)

Every row/cell has context-aware actions:

```typescript
type ContextMenu = {
  readonly target: {
    readonly entityType: EntityType
    readonly id: string
    readonly data: unknown
  }
  readonly actions: readonly ContextAction[]
}

type ContextAction = {
  readonly label: string
  readonly icon: string
  readonly shortcut?: string
  readonly action: () => void
  readonly divider?: boolean
  readonly disabled?: boolean
}
```

**Example**:
```
Right-click on Product Row:
┌─────────────────────────────┐
│  👁️  View Details           │
│  📊 View Movements           │
│  🛒 View Orders             │
│  ─────────────────────────  │
│  📈 Analyze (ABC, XYZ...)   │
│  📤 Export Data             │
│  ─────────────────────────  │
│  🔗 Copy Link              │
└─────────────────────────────┘
```

### Inline Actions

Quick actions displayed directly in tables/cards:

```typescript
type InlineActions = {
  readonly primary?: Action   // Most common action
  readonly secondary?: readonly Action[]
}

type Action = {
  readonly label: string
  readonly icon: string
  readonly onClick: () => void
  readonly variant?: 'default' | 'ghost' | 'outline'
}
```

## State Management

### Navigation Store (Zustand)

```typescript
type NavigationStore = {
  // Current state
  readonly currentStep: NavigationStep | null
  readonly history: readonly NavigationStep[]
  readonly future: readonly NavigationStep[]  // For redo

  // Actions
  readonly navigateTo: (entity: EntityType, id: string, data: unknown) => void
  readonly goBack: () => void
  readonly goForward: () => void
  readonly clearHistory: () => void
  readonly setFilters: (filters: readonly Filter[]) => void
}
```

### Filter Persistence

Filters persist across navigation at the same level:

```typescript
type FilterPersistence = {
  readonly level: number
  readonly entityType: EntityType
  readonly filters: readonly Filter[]
  readonly sortBy?: readonly SortColumn[]
}

// When navigating to same entity type, restore filters
const navigateWithFilters = (
  entityType: EntityType,
  id: string,
  currentFilters: readonly Filter[]
): void => {
  const previousFilters = loadFilters(entityType)
  const mergedFilters = mergeFilters(currentFilters, previousFilters)
  navigate(entityType, id, mergedFilters)
}
```

## Performance Optimizations

### 1. Virtual Scrolling

For large datasets (10K+ rows):

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

const VirtualTable = ({ data, columns }: TableProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <TableRow
            key={virtualRow.index}
            data={data[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

### 2. Lazy Loading Charts

Load chart data only when visible:

```typescript
const LazyChart = ({ analysisId }: { analysisId: string }) => {
  const [data, setData] = useState<ChartData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      loadChartData(analysisId).then(setData)
    }
  }, [isVisible, analysisId])

  return (
    <div ref={ref}>
      {data ? <Chart data={data} /> : <Skeleton />}
    </div>
  )
}
```

### 3. Memoized Filtering

Cache filtered results:

```typescript
const useFilteredData = (
  data: readonly unknown[],
  filters: readonly Filter[]
): readonly unknown[] => {
  return useMemo(() => {
    return applyFilters(data, filters)
  }, [data, filters])
}
```

## Keyboard Shortcuts

Global navigation shortcuts:

```typescript
type KeyboardShortcut = {
  readonly key: string
  readonly ctrl?: boolean
  readonly shift?: boolean
  readonly action: () => void
  readonly description: string
}

const shortcuts: readonly KeyboardShortcut[] = [
  { key: 'k', ctrl: true, action: openCommandPalette, description: 'Command palette' },
  { key: 'ArrowLeft', alt: true, action: navigateBack, description: 'Go back' },
  { key: 'ArrowRight', alt: true, action: navigateForward, description: 'Go forward' },
  { key: '/', action: focusSearch, description: 'Focus search' },
  { key: 'Escape', action: closeDetail, description: 'Close detail panel' }
]
```

## Accessibility

### Keyboard Navigation

- Tab: Navigate between interactive elements
- Enter/Space: Activate buttons, links
- Arrow keys: Navigate within tables, charts
- Esc: Close modals, panels

### Screen Reader Support

```typescript
type AccessibilityMetadata = {
  readonly ariaLabel: string
  readonly ariaDescription?: string
  readonly ariaLevel?: number
  readonly ariaLive?: 'polite' | 'assertive' | 'off'
}
```

### Focus Management

- Focus visible on keyboard navigation
- Focus trap in modals
- Focus restoration after navigation

## Responsive Design

### Breakpoints

```typescript
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints: Record<Breakpoint, string> = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```

### Mobile Adaptations

- Collapsible side navigation
- Full-width tables on mobile
- Touch-optimized interactions
- Bottom navigation bar for key actions

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft

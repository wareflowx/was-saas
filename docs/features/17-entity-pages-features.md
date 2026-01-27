# Entity Pages and Features Architecture

## Overview

This document defines the **complete entity-centric architecture** for Wareflow, detailing pages, features, and analyses for each major entity: Operators (Préparateurs), Warehouses/Zones, Orders, Products, and Transaction Lines.

## Core Entities and Relationships

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Operators  │────────<│  Movements   │>────────│   Products   │
│  (Préparateurs)│  (N:1)  │              │  (1:N)  │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                       │                       │
       │ (N:1)                │ (N:1)               (1:N)
       ↓                       ↓                       ↓
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Orders    │         │   Locations  │         │   Stock      │
│              │─────────│   (Zones)     │         │  Levels      │
└──────────────┘         └──────────────┘         └──────────────┘
```

---

## 1. Operators (Préparateurs)

### 1.1 Operator Profile Page

**Route**: `/operators/:operatorId`

**Purpose**: Comprehensive view of an operator's performance, specializations, and achievements

**Page Sections**:

#### Header Section
```typescript
type OperatorProfileHeader = {
  readonly operator: {
    readonly id: string
    readonly name: string
    readonly avatar?: string
    readonly status: 'active' | 'inactive' | 'on_leave'
    readonly warehouse: string
    readonly zone?: string
  }
  readonly level: {
    readonly current: OperatorLevel
    readonly progress: number  // 0-100 to next level
    readonly xp: number
    readonly xpToNext: number
  }
  readonly specializations: readonly string[]  // e.g., ["Fragile", "High-Shelf", "Bulk"]
}
```

#### Performance Metrics
```typescript
type OperatorPerformance = {
  readonly today: DailyPerformance
  readonly thisWeek: WeeklyPerformance
  readonly thisMonth: MonthlyPerformance
  readonly allTime: AllTimePerformance
}

type DailyPerformance = {
  readonly date: Date
  readonly totalMovements: number
  readonly totalQuantity: number
  readonly avgQuantityPerMovement: number
  readonly activeHours: number
  readonly movementsPerHour: number
  readonly accuracy: number  // Percentage of error-free movements
}

type WeeklyPerformance = {
  readonly weekStart: Date
  readonly weekEnd: Date
  readonly totalMovements: number
  readonly totalQuantity: number
  readonly uniqueProducts: number
  readonly avgDailyMovements: number
  readonly bestDay: string  // Day of week
  readonly trend: 'increasing' | 'stable' | 'decreasing'
}
```

#### Achievement System
```typescript
type OperatorLevel = {
  readonly level: number
  readonly name: string  // e.g., "Novice", "Apprentice", "Expert", "Master"
  readonly badge: string
  readonly requirements: {
    readonly totalMovements: number
    readonly uniqueProducts: number
    readonly accuracyThreshold: number
  }
  readonly unlocked: boolean
  readonly unlockedAt?: Date
}

type Achievement = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly rarity: 'common' | 'rare' | 'epic' | 'legendary'
  readonly unlocked: boolean
  readonly unlockedAt?: Date
  readonly progress?: number  // For multi-step achievements
}

// Example achievements
const exampleAchievements: readonly Achievement[] = [
  {
    id: 'first-pick',
    name: 'First Pick',
    description: 'Complete your first picking operation',
    icon: '🎯',
    rarity: 'common',
    unlocked: true
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Process 100 movements in one hour',
    icon: '⚡',
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Maintain 99% accuracy for 30 days',
    icon: '💎',
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'warehouse-master',
    name: 'Warehouse Master',
    description: 'Complete 10,000 movements across all zones',
    icon: '🏆',
    rarity: 'legendary',
    unlocked: false
  }
]
```

#### Specializations
```typescript
type OperatorSpecialization = {
  readonly category: string
  readonly name: string
  readonly description: string
  readonly level: number  // 1-100
  readonly movementsInCategory: number
  readonly accuracy: number
}

// Example specializations
const exampleSpecializations: readonly OperatorSpecialization[] = [
  {
    category: 'product_type',
    name: 'Fragile Items Expert',
    description: 'Specializes in handling fragile products',
    level: 85,
    movementsInCategory: 1247,
    accuracy: 99.2
  },
  {
    category: 'location',
    name: 'High-Shelf Specialist',
    description: 'Expert at accessing elevated storage locations',
    level: 72,
    movementsInCategory: 856,
    accuracy: 97.8
  },
  {
    category: 'operation',
    name: 'Bulk Handling',
    description: 'Efficient at processing large quantity movements',
    level: 91,
    movementsInCategory: 2341,
    accuracy: 98.5
  }
]
```

### 1.2 Daily Task Analysis

**Route**: `/operators/:operatorId/daily-analysis`

**Purpose**: Detailed breakdown of an operator's tasks for a specific day

```typescript
type DailyTaskAnalysis = {
  readonly operatorId: string
  readonly date: Date
  readonly tasks: readonly Task[]
  readonly summary: TaskSummary
  readonly timeline: TaskTimeline
}

type Task = {
  readonly id: string
  readonly type: 'ENTREE' | 'SORTIE' | 'TRANSFERT'
  readonly productId: string
  readonly productName: string
  readonly quantity: number
  readonly source?: {
    readonly zone: string
    readonly location: string
  }
  readonly destination?: {
    readonly zone: string
    readonly location: string
  }
  readonly startTime: Date
  readonly endTime: Date
  readonly duration: number  // seconds
  readonly orderId?: string
  readonly accuracy: 'correct' | 'error'  // Picking errors, wrong product, etc.
}

type TaskSummary = {
  readonly totalTasks: number
  readonly totalDuration: number  // hours
  readonly tasksByType: {
    readonly ENTREE: number
    readonly SORTIE: number
    readonly TRANSFERT: number
  }
  readonly tasksByZone: Record<string, number>
  readonly accuracy: {
    readonly correct: number
    readonly errors: number
    readonly accuracyRate: number
  }
  readonly throughput: {
    readonly avgTasksPerHour: number
    readonly peakHour: string
    readonly slowestHour: string
  }
}

type TaskTimeline = {
  readonly hourlyTasks: readonly {
    readonly hour: number  // 0-23
    readonly tasks: readonly Task[]
    readonly taskCount: number
  }[]
}
```

**Visualization**: Timeline chart showing tasks throughout the day with color coding:
- Green: Correct tasks
- Red: Error tasks
- Gray: Breaks/idle time

---

## 2. Warehouses and Zones (Magasins)

### 2.1 Warehouse/Zone Profile Page

**Route**: `/warehouses/:warehouseId` or `/zones/:zoneId`

**Purpose**: View warehouse/zone performance, orders, and activity

#### Page Structure
```typescript
type WarehouseProfile = {
  readonly warehouse: {
    readonly id: string
    readonly name: string
    readonly location: string
    readonly type: 'distribution' | 'retail' | 'manufacturing'
    readonly zones: readonly Zone[]
  }
  readonly overview: WarehouseOverview
  readonly orders: WarehouseOrders
  readonly activity: WarehouseActivity
  readonly performance: WarehousePerformance
}

type Zone = {
  readonly id: string
  readonly name: string
  readonly type: 'storage' | 'picking' | 'reception' | 'shipping'
  readonly capacity: number
  readonly utilization: number
}

type WarehouseOverview = {
  readonly totalOrders: number
  readonly activeOrders: number
  readonly completedOrders: number
  readonly avgOrderFulfillmentTime: number  // hours
  readonly throughput: {
    readonly today: number
    readonly thisWeek: number
    readonly trend: 'up' | 'down' | 'stable'
  }
}
```

#### Orders Section
```typescript
type WarehouseOrders = {
  readonly pending: readonly Order[]
  readonly inProgress: readonly Order[]
  readonly completed: readonly Order[]
  readonly filters: {
    readonly status?: readonly ('pending' | 'in_progress' | 'completed')[]
    readonly dateRange?: DateRange
    readonly priority?: readonly ('low' | 'medium' | 'high')[]
  }
}

type Order = {
  readonly commande: string
  readonly type_commande: string
  readonly demandeur: string
  readonly destinataire: string
  readonly priorite: number
  readonly date_requise: Date
  readonly status: 'pending' | 'in_progress' | 'completed'
  readonly progress: {
    readonly totalLines: number
    readonly pickedLines: number
    readonly percentage: number
  }
  readonly assignee?: string  // Operator assigned
}
```

#### Activity Heatmap
```typescript
type ZoneActivityHeatmap = {
  readonly zoneId: string
  readonly timeRange: DateRange
  readonly granularity: 'hour' | 'day' | 'week'
  readonly activity: readonly {
    readonly zone: string
    readonly time: Date
    readonly movementCount: number
    readonly operators: number
  }[]
}
```

**Visualization**: Heatmap showing activity by zone and time period

---

## 3. Orders (Commandes)

### 3.1 Order Detail Page

**Route**: `/orders/:orderId`

**Purpose**: Complete order information with picking lines and operators

```typescript
type OrderDetail = {
  readonly order: OrderHeader
  readonly lines: readonly PickingLine[]
  readonly progress: OrderProgress
  readonly timeline: OrderTimeline
  readonly operators: readonly OrderOperator[]
}

type OrderHeader = {
  readonly commande: string
  readonly type_commande: string
  readonly demandeur: string
  readonly destinataire: string
  readonly priorite: number
  readonly date_requise: Date
  readonly status: 'pending' | 'in_progress' | 'partial' | 'completed' | 'cancelled'
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly metadata: {
    readonly totalLines: number
    readonly totalQuantity: number
    readonly uniqueProducts: number
  }
}

type PickingLine = {
  readonly lineNumber: number
  readonly productId: string
  readonly productName: string
  readonly quantity: number
  readonly quantityPicked: number
  readonly status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  readonly location: {
    readonly zone: string
    readonly aisle: string
    readonly bay: string
    readonly level: number
  }
  readonly picker?: {
    readonly operatorId: string
    readonly operatorName: string
    readonly startTime: Date
    readonly endTime?: Date
    readonly duration?: number
  }
  readonly notes?: readonly string[]
}

type OrderProgress = {
  readonly totalLines: number
  readonly completedLines: number
  readonly inProgressLines: number
  readonly pendingLines: number
  readonly percentage: number
  readonly estimatedCompletion: Date
}

type OrderTimeline = {
  readonly events: readonly {
    readonly timestamp: Date
    readonly eventType: 'created' | 'started' | 'line_completed' | 'completed' | 'cancelled'
    readonly description: string
    readonly operator?: string
  }[]
}
```

### 3.2 Picking Lines Sheet/Drawer

**UI Pattern**: When user clicks on a picking line in a table, open a **slide-over sheet/drawer** (not a new page)

```typescript
type PickingLineSheet = {
  readonly line: PickingLine
  readonly product: ProductDetail
  readonly history: readonly PickingHistory[]
  readonly relatedLines: readonly PickingLine[]  // Same order, same product, etc.
}

type PickingHistory = {
  readonly date: Date
  readonly operator: string
  readonly quantity: number
  readonly duration: number
  readonly accuracy: boolean
}

type ProductDetail = {
  readonly productId: string
  readonly productName: string
  readonly description?: string
  readonly stock: {
    readonly available: number
    readonly location: string
    readonly lastMovement: Date
  }
  readonly physical: {
    readonly weight: number
    readonly dimensions: {
      readonly length: number
      readonly width: number
      readonly height: number
    }
    readonly requiresEquipment?: readonly string[]
  }
}
```

**UI Component**: shadcn/ui `Sheet` component
```typescript
<Sheet>
  <SheetTrigger>
    <TableRow onClick={openSheet}>
      {/* Picking line row */}
    </TableRow>
  </SheetTrigger>
  <SheetContent side="right" className="w-[600px]">
    <SheetHeader>
      <SheetTitle>Picking Line Details</SheetTitle>
    </SheetHeader>
    {/* Line details, product info, history */}
  </SheetContent>
</Sheet>
```

---

## 4. All Picking Lines (Global View)

### 4.1 Picking Lines Table Page

**Route**: `/picking-lines`

**Purpose**: Complete view of all picking lines with advanced filtering

```typescript
type PickingLinesTable = {
  readonly lines: readonly PickingLineSummary[]
  readonly filters: PickingLineFilters
  readonly pagination: {
    readonly page: number
    readonly pageSize: number
    readonly total: number
  }
}

type PickingLineSummary = {
  readonly id: string
  readonly orderId: string
  readonly orderDate: Date
  readonly productId: string
  readonly productName: string
  readonly quantity: number
  readonly picked: number
  readonly status: PickingStatus
  readonly picker?: string
  readonly zone: string
  readonly duration?: number
}

type PickingLineFilters = {
  readonly status?: readonly PickingStatus[]
  readonly orderId?: string
  readonly productId?: string
  readonly picker?: string
  readonly zone?: string
  readonly dateRange?: DateRange
  readonly durationRange?: {
    readonly min?: number
    readonly max?: number
  }
}

type PickingStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'error'
```

**UI Components**:
- DataTable with virtual scrolling (for 10K+ lines)
- Multi-column sorting
- Advanced filters
- Export functionality
- Row click → Open sheet (not navigate)

### 4.2 Reception Lines (Same Pattern)

**Route**: `/reception-lines`

**Purpose**: View all reception/putaway lines

```typescript
type ReceptionLineSummary = {
  readonly id: string
  readonly receptionId: string
  readonly productId: string
  readonly productName: string
  readonly quantity: number
  readonly quantityReceived: number
  readonly status: 'pending' | 'in_progress' | 'completed' | 'partial'
  readonly receiver?: string
  readonly location: string
  readonly supplier?: string
  readonly date: Date
}
```

**UI Pattern**: Identical to picking lines - table with row click → sheet

---

## 5. Products Catalog

### 5.1 All Products Page

**Route**: `/products`

**Purpose**: Complete product catalog with intelligent stock management

```typescript
type ProductsCatalog = {
  readonly products: readonly ProductSummary[]
  readonly filters: ProductFilters
  readonly sortBy: ProductSortOption
  readonly pagination: Pagination
  readonly stockAlerts: StockAlerts
}

type ProductSummary = {
  readonly productId: number
  readonly productName: string
  readonly description?: string
  readonly category: {
    readonly level1: string
    readonly level2?: string
    readonly level3?: string
  }
  readonly stock: {
    readonly available: number
    readonly reserved: number
    readonly onOrder: number
    readonly totalStock: number
    readonly status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
  }
  readonly location: {
    readonly primaryZone: string
    readonly primaryLocation: string
    readonly locations: readonly string[]  // Multiple storage locations
  }
  readonly activity: {
    readonly lastMovement: Date
    readonly movementsLast30Days: number
    readonly avgDailyMovement: number
  }
  readonly popularity: {
    readonly level: 'high' | 'medium' | 'low'
    readonly score: number  // 0-100
  }
  readonly analytics: {
    readonly abcClass?: 'A' | 'B' | 'C'
    readonly xyzClass?: 'X' | 'Y' | 'Z'
    readonly trend: 'increasing' | 'stable' | 'decreasing'
  }
}

type ProductFilters = {
  readonly search?: string  // Text search in name/description
  readonly categories?: readonly string[]
  readonly stockStatus?: readonly ('in_stock' | 'low_stock' | 'out_of_stock' | 'overstock')[]
  readonly popularity?: readonly ('high' | 'medium' | 'low')[]
  readonly abcClass?: readonly ('A' | 'B' | 'C')[]
  readonly xyzClass?: readonly ('X' | 'Y' | 'Z')[]
  readonly zone?: string
  readonly lastMovementRange?: DateRange
}

type StockAlerts = {
  readonly outOfStock: number
  readonly lowStock: number
  readonly overstock: number
  readonly expired: number
  readonly expiringSoon: number
}
```

### 5.2 Product Detail Page

**Route**: `/products/:productId`

**Purpose**: Complete product information with movement history

```typescript
type ProductDetail = {
  readonly product: ProductInfo
  readonly stock: ProductStock
  readonly movements: ProductMovements
  readonly orders: ProductOrders
  readonly analytics: ProductAnalytics
  readonly popularity: ProductPopularity
}

type ProductInfo = {
  readonly no_produit: number
  readonly nom_produit: string
  readonly description?: string
  readonly categories: ProductCategories
  readonly physical: {
    readonly weight?: number
    readonly dimensions?: Dimensions
    readonly requiresEquipment?: readonly string[]
    readonly isFragile: boolean
    readonly isHazardous: boolean
  }
  readonly suppliers?: readonly Supplier[]
}

type ProductStock = {
  readonly totalAvailable: number
  readonly reserved: number  // Reserved for open orders
  readonly onOrder: number  // On order from suppliers
  readonly locations: readonly StockLocation[]
  readonly status: StockStatus
  readonly turnoverRate: number  // Days to sell stock
  readonly lastCount: Date
}

type StockLocation = {
  readonly zone: string
  readonly aisle: string
  readonly bay: string
  readonly level: number
  readonly position: string
  readonly quantity: number
  readonly lastUpdated: Date
}

type ProductMovements = {
  readonly summary: {
    readonly last90Days: number
    readonly last30Days: number
    readonly last7Days: number
    readonly today: number
  }
  readonly timeline: MovementTimeline
  readonly byZone: Record<string, number>
  readonly byType: {
    readonly ENTREE: number
    readonly SORTIE: number
    readonly TRANSFERT: number
  }
}

type ProductOrders = {
  readonly openOrders: readonly Order[]
  readonly recentOrders: readonly Order[]
  readonly orderFrequency: number  // Orders per month
}

type ProductAnalytics = {
  readonly abc: ABCClassification
  readonly xyz: XYZClassification
  readonly demandPattern: DemandPattern
  readonly seasonality: SeasonalityInfo
}

type ProductPopularity = {
  readonly score: number  // 0-100
  readonly level: 'high' | 'medium' | 'low'
  readonly rank: number  // Rank among all products
  readonly trend: 'rising' | 'stable' | 'falling'
  readonly factors: readonly {
    readonly factor: string
    readonly weight: number
    readonly value: number
  }[]
}
```

### 5.3 Popularity Score Calculation

**Multi-Factor Popularity Algorithm**:

```typescript
type PopularityFactors = {
  readonly movementFrequency: {
    readonly weight: number  // e.g., 0.40
    readonly value: number
    readonly normalized: number  // 0-100
  }
  readonly movementVolume: {
    readonly weight: number  // e.g., 0.30
    readonly value: number
    readonly normalized: number
  }
  readonly orderFrequency: {
    readonly weight: number  // e.g., 0.20
    readonly value: number
    readonly normalized: number
  }
  readonly recency: {
    readonly weight: number  // e.g., 0.10
    readonly value: number
    readonly normalized: number  // More recent = higher score
  }
}

// Calculate weighted popularity score
const calculatePopularity = (factors: PopularityFactors): number => {
  let score = 0
  for (const factor of Object.values(factors)) {
    score += factor.weight * factor.normalized
  }
  return score  // 0-100
}
```

**Factor Details**:
1. **Movement Frequency** (40%): How often the product moves
2. **Movement Volume** (30%): Total quantity moved
3. **Order Frequency** (20%): How often ordered
4. **Recency** (10%): Recent activity (decays over time)

**Popularity Levels**:
- High: Score ≥ 70
- Medium: Score 40-69
- Low: Score < 40

---

## 6. Time-Based Analysis (Contextualized)

### 6.1 Picking vs Orders Over Time

**Purpose**: Understand picking performance in context of order volume

**Critical Insight**: Don't judge picking decrease if orders decreased

```typescript
type TimeSeriesAnalysis = {
  readonly dateRange: DateRange
  readonly granularity: 'hour' | 'day' | 'week' | 'month'
  readonly orders: TimeSeriesData
  readonly picking: TimeSeriesData
  readonly analysis: ContextualAnalysis
}

type TimeSeriesData = {
  readonly timestamp: Date
  readonly value: number
  readonly movingAverage?: number
}

type ContextualAnalysis = {
  readonly correlation: CorrelationAnalysis
  readonly efficiency: EfficiencyMetrics
  readonly insights: readonly Insight[]
}

type CorrelationAnalysis = {
  readonly coefficient: number  // Pearson correlation
  readonly significance: number  // P-value
  readonly interpretation: string
  readonly relationship: 'positive' | 'negative' | 'none'
}

type EfficiencyMetrics = {
  readonly avgPickingPerOrder: number
  readonly peakPickingHour: string
  readonly peakOrderHour: string
  readonly alignment: 'aligned' | 'lagged' | 'inverted'
  readonly lag?: number  // Hours if lagged
}

type Insight = {
  readonly type: 'correlation' | 'efficiency' | 'anomaly' | 'trend'
  readonly severity: 'info' | 'warning' | 'critical'
  readonly message: string
  readonly recommendation?: string
}
```

**Example Insights**:
```
✅ "Picking volume increased 15% this week"
   "Orders increased 20% this week"
   "Correlation: Strong positive (r=0.87)"
   "Conclusion: Picking increase is due to order increase, not efficiency gain"

⚠️  "Picking decreased 10% this week"
   "Orders decreased 8% this week"
   "Picking decreased MORE than orders (-2 percentage points)"
   "Recommendation: Investigate potential bottlenecks or staffing issues"
```

### 6.2 Comparative Period Analysis

```typescript
type ComparativeAnalysis = {
  readonly period1: Period  // Current period
  readonly period2: Period  // Comparison period
  readonly metrics: ComparativeMetrics
}

type Period = {
  readonly start: Date
  readonly end: Date
  readonly name: string  // e.g., "This Week", "Last Week"
}

type ComparativeMetrics = {
  readonly orders: {
    readonly period1: number
    readonly period2: number
    readonly change: number
    readonly changePercent: number
  }
  readonly picking: {
    readonly period1: number
    readonly period2: number
    readonly change: number
    readonly changePercent: number
  }
  readonly efficiency: {
    readonly period1: number  // Orders per operator-hour
    readonly period2: number
    readonly change: number
    readonly interpretation: string
  }
}
```

---

## 7. Warehouse 3D Modeling (Advanced Feature)

**Status**: Future Enhancement

**Purpose**: Visual 3D representation of warehouse layout and product locations

```typescript
type Warehouse3DModel = {
  readonly warehouseId: string
  readonly dimensions: {
    readonly length: number
    readonly width: number
    readonly height: number
  }
  readonly zones: readonly Zone3D[]
  readonly products: readonly Product3DLocation[]
}

type Zone3D = {
  readonly id: string
  readonly name: string
  readonly position: {
    readonly x: number
    readonly y: number
    readonly z: number
  }
  readonly dimensions: {
    readonly length: number
    readonly width: number
    readonly height: number
  }
  readonly color: string
}

type Product3DLocation = {
  readonly productId: string
  readonly productName: string
  readonly quantity: number
  readonly position: {
    readonly zone: string
    readonly location: string
    readonly coordinates: { x: number; y: number; z: number }
  }
  readonly status: 'active' | 'reserved' | 'blocked'
}
```

**Features**:
- Interactive 3D navigation
- Click product to view details
- Filter by zone, product type, status
- Highlight picking paths
- Show density heatmaps on 3D model

---

## 8. UI Navigation Patterns

### 8.1 Entity Navigation Hierarchy

```
Dashboard
  ↓
┌─────────────────────────────────────┐
│  Entity Selection                    │
│  • Products (1,234)                  │
│  • Operators (45)                     │
│  • Orders (856)                       │
│  • Picking Lines (12,456)             │
│  • Reception Lines (3,245)            │
│  • Warehouses/Zones (8)                │
└─────────────────────────────────────┘
  ↓ (click entity)
Entity Detail Page
  ↓ (click related entity)
Related Entity Page
  ↓ (navigate back)
Breadcrumb navigation
```

### 8.2 Sheet/Drawer Pattern

**When to use**:
- Picking line details (click row in table)
- Reception line details
- Product quick preview
- Order preview
- Operator summary

**Implementation**: shadcn/ui `Sheet` component
```typescript
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <TableRow onClick={() => setIsOpen(true)}>
      {/* Table row */}
    </TableRow>
  </SheetTrigger>
  <SheetContent side="right" className="w-[600px] sm:w-[800px]">
    {/* Detailed content */}
  </SheetContent>
</Sheet>
```

---

## 9. Color Coding System

### 9.1 Status Colors

**Orders**:
- 🟢 Green: Completed
- 🔵 Blue: In Progress
- 🟡 Yellow: Pending
- 🔴 Red: Cancelled/Error
- ⚪ Gray: Partial

**Stock**:
- 🟢 Green: In Stock (≥ reorder point)
- 🟡 Yellow: Low Stock (< reorder point)
- 🔴 Red: Out of Stock
- 🟠 Orange: Overstock

**Picking Lines**:
- 🟢 Green: Completed
- 🔵 Blue: In Progress
- ⚪ Gray: Pending
- 🔴 Red: Error

### 9.2 Layer Colors

**Modeling (Blue)**:
- Primary: `#3b82f6`

**Analytics (Purple)**:
- Primary: `#8b5cf6`

**Predictive (Amber/Green)**:
- Primary: `#f59e0b` (warning)
- Primary: `#22c55e` (success)

---

## 10. Feature Priority Matrix

### MVP Features (Phase 1)
- ✅ Product catalog with stock levels
- ✅ Order detail pages
- ✅ Operator profile pages
- ✅ Picking lines table (global view)
- ✅ Picking line sheets (click to open)
- ✅ Daily task analysis by operator
- ✅ Time-based analysis (picking vs orders)

### Phase 2 Features
- ⏳ Warehouse/zone profile pages
- ⏳ Reception lines table and sheets
- ⏳ Popularity scoring
- ⏳ Achievement system
- ⏳ Specializations tracking

### Phase 3 Features (Advanced)
- ⏳ 3D warehouse modeling
- ⏳ Predictive analytics
- ⏳ Optimization recommendations
- ⏳ Advanced correlation analysis

---

## 11. Data Requirements by Page

### Pages and Required Tables

| Page | Required Tables | Notes |
|------|----------------|-------|
| Operator Profile | mouvements, produits | Join on no_produit |
| Daily Task Analysis | mouvements | Filter by operator + date |
| Warehouse/Zone Profile | commandes, mouvements | Filter by warehouse/zone |
| Order Detail | commandes, mouvements | Join on commande |
| Picking Lines Table | mouvements, commandes, produits | Join all three |
| Picking Line Sheet | mouvements, produits, usagers | Single line details |
| Products Catalog | produits, mouvements | Stock + activity |
| Product Detail | produits, mouvements, commandes | Complete history |

---

## 12. Performance Considerations

### Virtual Scrolling

**Required For**:
- Products catalog (1,000+ products)
- Picking lines table (10,000+ lines)
- Reception lines table (5,000+ lines)

**Implementation**: `@tanstack/react-virtual`

### Lazy Loading

**Sheet Content**:
- Load product details on sheet open
- Load movement history on-demand
- Load related records when expanded

### Caching Strategy

**Cache Duration**:
- Operator performance: 5 minutes
- Product stock: 1 minute (real-time sensitive)
- Order status: 30 seconds
- Analytics results: 1 hour

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft

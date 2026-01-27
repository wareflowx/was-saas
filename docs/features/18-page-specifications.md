# Page Specifications and Data Structures

## Overview

This document defines the **complete page specifications** for the Wareflow application, including data structures, filtering capabilities, and detailed requirements for each major page.

---

## 1. Dashboard Page (Global View)

### Route
`/dashboard`

### Purpose
Provide **global insights** and KPIs across all warehouses/operations

### Page Structure

```typescript
type DashboardPage = {
  readonly overview: DashboardOverview
  readonly kpi: KPIDashboard
  readonly alerts: readonly Alert[]
  readonly activityFeed: ActivityFeed
  readonly quickActions: readonly QuickAction[]
}
```

### Dashboard Overview

```typescript
type DashboardOverview = {
  readonly warehouses: readonly {
    readonly id: string
    readonly name: string
    readonly totalProducts: number
    readonly totalMovements: number
    readonly activeOrders: number
    readonly status: 'active' | 'inactive'
  }[]
  readonly timeRange: DateRange
  readonly period: 'today' | 'week' | 'month' | 'custom'
}
```

### KPI Dashboard

```typescript
type KPIDashboard = {
  readonly operations: OperationsKPI
  readonly inventory: InventoryKPI
  readonly performance: PerformanceKPI
  readonly orders: OrdersKPI
}

type OperationsKPI = {
  readonly totalMovements: number
  readonly avgMovementsPerDay: number
  readonly peakHour: string
  readonly trend: 'up' | 'down' | 'stable'
  readonly trendPercent: number
}

type InventoryKPI = {
  readonly totalProducts: number
  readonly totalStockValue: number  // If unit value available
  readonly lowStockCount: number
  readonly outOfStockCount: number
  readonly overstockCount: number
  readonly expiringSoonCount: number
}

type PerformanceKPI = {
  readonly avgOrderFulfillmentTime: number  // hours
  readonly onTimeDeliveryRate: number  // percentage
  readonly pickAccuracy: number  // percentage
  readonly throughput: number  // movements per hour
}

type OrdersKPI = {
  readonly totalOrders: number
  readonly pendingOrders: number
  readonly inProgressOrders: number
  readonly completedToday: number
  readonly avgLinesPerOrder: number
}
```

### Alert System

```typescript
type Alert = {
  readonly id: string
  readonly type: 'stock' | 'performance' | 'order' | 'system'
  readonly severity: 'info' | 'warning' | 'critical'
  readonly title: string
  readonly message: string
  readonly action?: {
    readonly label: string
    readonly route: string
  }
  readonly timestamp: Date
  readonly dismissible: boolean
}

// Example alerts
const exampleAlerts: readonly Alert[] = [
  {
    id: 'stock-001',
    type: 'stock',
    severity: 'critical',
    title: 'Stock Critique',
    message: '12 produits en rupture de stock',
    action: { label: 'Voir les produits', route: '/products?stock=out_of_stock' },
    timestamp: new Date(),
    dismissible: false
  },
  {
    id: 'perf-001',
    type: 'performance',
    severity: 'warning',
    title: 'Baisse d\'Efficacité',
    message: 'Taux de picking en baisse de 15% cette semaine',
    action: { label: 'Voir l\'analyse', route: '/analytics/picking-trends' },
    timestamp: new Date(),
    dismissible: true
  }
]
```

### Activity Feed

```typescript
type ActivityFeed = {
  readonly activities: readonly Activity[]
  readonly total: number
  readonly filters: ActivityFeedFilters
}

type Activity = {
  readonly id: string
  readonly type: 'movement' | 'order' | 'reception' | 'alert'
  readonly entity: {
    readonly type: string
    readonly id: string
    readonly name: string
  }
  readonly description: string
  readonly timestamp: Date
  readonly metadata?: {
    readonly warehouse?: string
    readonly zone?: string
    readonly user?: string
  }
}

type ActivityFeedFilters = {
  readonly types?: readonly ('movement' | 'order' | 'reception' | 'alert')[]
  readonly warehouses?: readonly string[]
  readonly timeRange?: DateRange
}
```

---

## 2. Products Catalog Page

### Route
`/products`

### Purpose
Complete catalog of **all products** with advanced filtering and stock management

### Page Structure

```typescript
type ProductsCatalogPage = {
  readonly filters: ProductFilters
  readonly sortBy: ProductSortOption
  readonly pagination: Pagination
  readonly products: readonly ProductCatalogItem[]
  readonly summary: ProductsSummary
}
```

### Advanced Filtering System

```typescript
type ProductFilters = {
  // Text search
  readonly search?: string  // Search in name, description, SKU

  // Category filters (multi-select)
  readonly categories?: {
    readonly level1?: readonly string[]
    readonly level2?: readonly string[]
    readonly level3?: readonly string[]
  }

  // Stock status (multi-select)
  readonly stockStatus?: readonly StockStatus[]

  // Popularity (multi-select)
  readonly popularity?: readonly ('high' | 'medium' | 'low')[]

  // Analytics classes (multi-select)
  readonly abcClass?: readonly ('A' | 'B' | 'C')[]
  readonly xyzClass?: readonly ('X' | 'Y' | 'Z')[]

  // Location filters
  readonly warehouse?: readonly string[]
  readonly zone?: readonly string[]
  readonly location?: string

  // Status
  readonly status?: readonly ('active' | 'inactive' | 'discontinued')[]

  // Activity filters
  readonly lastMovementRange?: DateRange

  // Stock level range
  readonly stockLevelRange?: {
    readonly min?: number
    readonly max?: number
  }

  // Date range
  readonly createdDateRange?: DateRange
  readonly updatedDateRange?: DateRange
}

type StockStatus =
  | 'in_stock'        // Available ≥ reorder point
  | 'low_stock'       // Available < reorder point
  | 'out_of_stock'    // Available = 0
  | 'overstock'       // Available > 3x avg monthly usage
```

### Product Catalog Item (Table Row)

```typescript
type ProductCatalogItem = {
  // Basic info
  readonly no_produit: number
  readonly nom_produit: string
  readonly description?: string
  readonly sku?: string
  readonly ean?: string

  // Categories
  readonly categorie_1: string
  readonly categorie_2?: string
  readonly categorie_3?: string

  // Stock information (aggregated across locations)
  readonly stock: {
    readonly totalAvailable: number
    readonly totalStock: number
    readonly reserved: number  // Reserved for open orders
    readonly locations: readonly string[]  // List of locations where stocked
    readonly status: StockStatus
    readonly lastCounted: Date
  }

  // Activity metrics
  readonly activity: {
    readonly lastMovementDate?: Date
    readonly movementsLast30Days: number
    readonly movementsLast90Days: number
    readonly avgDailyMovement: number
    readonly trend: 'increasing' | 'stable' | 'decreasing'
  }

  // Analytics
  readonly analytics: {
    readonly abcClass?: 'A' | 'B' | 'C'
    readonly xyzClass?: 'X' | 'Y' | 'Z'
    readonly popularityScore: number  // 0-100
    readonly popularityLevel: 'high' | 'medium' | 'low'
  }

  // Status
  readonly etat: 'active' | 'inactive' | 'discontinued'
}
```

### Product Summary (Aggregates)

```typescript
type ProductsSummary = {
  readonly totalProducts: number
  readonly activeProducts: number
  readonly inactiveProducts: number
  readonly discontinuedProducts: number

  readonly stockSummary: {
    readonly inStock: number
    readonly lowStock: number
    readonly outOfStock: number
    readonly overstock: number
  }

  readonly analyticsSummary: {
    readonly abc: {
      readonly classA: number
      readonly classB: number
      readonly classC: number
    }
    readonly xyz: {
      readonly classX: number
      readonly classY: number
      readonly classZ: number
    }
  }

  readonly categorySummary: {
    readonly byLevel1: Record<string, number>
  }
}
```

### Sort Options

```typescript
type ProductSortOption =
  | 'name_asc' | 'name_desc'
  | 'stock_asc' | 'stock_desc'
  | 'movement_asc' | 'movement_desc'
  | 'popularity_desc' | 'popularity_asc'
  | 'category_asc' | 'category_desc'
  | 'created_asc' | 'created_desc'
```

---

## 3. Product Detail Page

### Route
`/products/:productId`

### Purpose
Complete product information with **stock by location** and full history

### Page Structure

```typescript
type ProductDetailPage = {
  readonly product: ProductFullDetail
  readonly stock: ProductStockByLocation
  readonly movements: ProductMovementHistory
  readonly orders: ProductOrders
  readonly analytics: ProductAnalytics
}
```

### Product Full Detail

```typescript
type ProductFullDetail = {
  // Identity
  readonly no_produit: number
  readonly nom_produit: string
  readonly description?: string
  readonly sku?: string
  readonly ean?: string

  // Categories
  readonly categorie_1: string
  readonly categorie_2?: string
  readonly categorie_3?: string
  readonly classe_produit?: string

  // Physical characteristics
  readonly physical: {
    readonly weight?: number  // kg
    readonly dimensions?: {
      readonly length: number  // cm
      readonly width: number   // cm
      readonly height: number  // cm
    }
    readonly volume?: number    // m³
  }

  // Status
  readonly etat: 'active' | 'inactive' | 'discontinued'

  // Metadata
  readonly created_at: Date
  readonly updated_at: Date
}
```

### Stock by Location

**Critical Feature**: Stock is associated with **location + quantity + unit**

```typescript
type ProductStockByLocation = {
  readonly productId: number
  readonly productName: string
  readonly stockLocations: readonly StockLocation[]
  readonly stockSummary: StockSummary
}

type StockLocation = {
  readonly warehouse: string
  readonly zone: string
  readonly location: string  // e.g., "A-01-03-05" (Aisle-Bay-Level-Position)
  readonly quantity: number
  readonly unit: string  // e.g., "EA", "CTN", "PAL"
  readonly status: 'available' | 'reserved' | 'blocked' | 'quarantine'
  readonly reservedFor?: {
    readonly orderId: string
    readonly orderLine: number
    readonly quantity: number
  }
  readonly lastUpdated: Date
  readonly lastMovement?: {
    readonly type: 'ENTREE' | 'SORTIE' | 'TRANSFERT'
    readonly date: Date
  }
}

type StockSummary = {
  readonly totalQuantity: number
  readonly availableQuantity: number
  readonly reservedQuantity: number
  readonly totalLocations: number
  readonly occupiedLocations: number
  readonly unit: string
}
```

### Location Reference

```typescript
type LocationReference = {
  readonly warehouse: string
  readonly zone: string
  readonly aisle?: string
  readonly bay?: string
  readonly level?: number
  readonly position?: string
  readonly fullPath: string  // e.g., "Zone A / Aisle 01 / Bay 03 / Level 05 / Position 02"
}
```

---

## 4. Locations Page

### Route
`/locations`

### Purpose
Browse all warehouse locations and see **what's stored in each location**

### Page Structure

```typescript
type LocationsPage = {
  readonly filters: LocationFilters
  readonly view: 'tree' | 'grid' | 'list'
  readonly locations: readonly LocationInfo[]
  readonly summary: LocationsSummary
}
```

### Location Filters

```typescript
type LocationFilters = {
  readonly warehouse?: string
  readonly zone?: string
  readonly locationType?: readonly ('storage' | 'picking' | 'reception' | 'shipping' | 'staging')[]
  readonly occupancy?: readonly ('occupied' | 'empty' | 'partial')[]
  readonly product?: string  // Filter locations containing specific product
  readonly status?: readonly ('active' | 'inactive' | 'blocked')[]
}
```

### Location Information

**Critical Feature**: Locations **can be empty** (null products)

```typescript
type LocationInfo = {
  readonly location: Location
  readonly contents: LocationContents
  readonly status: LocationStatus
  readonly metadata: LocationMetadata
}

type Location = {
  readonly warehouse: string
  readonly zone: string
  readonly location: string  // Unique identifier
  readonly fullPath: string  // Human-readable path
  readonly type: 'storage' | 'picking' | 'reception' | 'shipping' | 'staging'
  readonly capacity?: {
    readonly maxPositions: number
    readonly maxWeight: number
  }
}

type LocationContents = {
  readonly isEmpty: boolean
  readonly products: readonly LocatedProduct[]
  readonly totalProducts: number
  readonly totalQuantity: number
  readonly utilization: number  // Percentage of capacity used
}

type LocatedProduct = {
  readonly no_produit: number
  readonly nom_produit: string
  readonly quantity: number
  readonly unit: string
  readonly status: 'available' | 'reserved'
  readonly since?: Date  // How long it's been here
}

type LocationStatus = {
  readonly status: 'active' | 'inactive' | 'blocked'
  readonly lastActivity?: Date
  readonly condition: 'good' | 'maintenance_needed' | 'damaged'
}

type LocationMetadata = {
  readonly attributes: {
    readonly climateControlled?: boolean
    readonly temperature?: string
    readonly humidity?: string
    readonly hazardous?: boolean
    readonly fragile?: boolean
  }
  readonly restrictions?: readonly string[]  // e.g., ["Fragile only", "Flammable storage"]
}
```

### Location Views

**Tree View**: Hierarchical by warehouse → zone → aisle → bay → level → position

**Grid View**: Visual representation of warehouse layout

**List View**: Tabular list of all locations with contents

---

## 5. Picking Lines Page

### Route
`/picking-lines`

### Purpose
Global picking view with **aggregate metrics** and **filterable table**

### Page Structure

```typescript
type PickingLinesPage = {
  readonly summary: PickingSummary
  readonly filters: PickingLineFilters
  readonly table: PickingLinesTable
}
```

### Picking Summary (Global Metrics)

```typescript
type PickingSummary = {
  readonly today: PickingDailySummary
  readonly thisWeek: PickingPeriodSummary
  readonly thisMonth: PickingPeriodSummary
}

type PickingDailySummary = {
  readonly date: Date
  readonly totalLines: number
  readonly completedLines: number
  readonly pendingLines: number
  readonly totalQuantity: number
  readonly pickedQuantity: number
  readonly completionRate: number  // percentage
  readonly uniqueOperators: number
  readonly avgLinesPerOperator: number
  readonly totalDuration: number  // minutes
  readonly avgDurationPerLine: number  // seconds
}

type PickingPeriodSummary = {
  readonly period: DateRange
  readonly totalLines: number
  readonly completedLines: number
  readonly totalQuantity: number
  readonly uniqueOrders: number
  readonly uniqueProducts: number
  readonly uniqueOperators: number
  readonly avgLinesPerDay: number
  readonly peakDay: string
}
```

### Picking Line Definition

**Critical Requirement**: A picking line is associated with:
- **Article** (Product)
- **Emplacement** (Location)
- **Entrepôt** (Warehouse)
- **Commande** (Order)
- **Date**
- **Utilisateur** (User/Operator)

```typescript
type PickingLine = {
  readonly id: string  // Unique picking line identifier
  readonly lineNumber: number  // Line number within order

  // Order information
  readonly commande: {
    readonly orderId: string
    readonly orderDate: Date
    readonly orderType: string
    readonly priority: number
    readonly requester: string
    readonly destination: string
  }

  // Product information
  readonly article: {
    readonly productId: number
    readonly productName: string
    readonly productDescription?: string
    readonly sku?: string
    readonly quantity: number
    readonly unit: string
  }

  // Location information
  readonly emplacement: {
    readonly warehouse: string
    readonly zone: string
    readonly aisle?: string
    readonly bay?: string
    readonly level?: number
    readonly position: string
    readonly fullPath: string
  }

  // Picking information
  readonly picking: {
    readonly status: PickingStatus
    readonly assignedTo?: string  // User ID
    readonly assignedAt?: Date
    readonly startedAt?: Date
    readonly completedAt?: Date
    readonly duration?: number  // seconds
    readonly quantityPicked: number
    readonly quantityRequired: number
    readonly progress: number  // percentage
  }

  // Metadata
  readonly entrepot: string  // Warehouse ID
  readonly date: Date  // Picking date
  readonly utilisateur?: string  // User who picked (if completed)
  readonly notes?: readonly string[]
  readonly errors?: readonly PickingError[]
}

type PickingStatus =
  | 'pending'         // Not yet assigned
  | 'assigned'        // Assigned to operator, not started
  | 'in_progress'     // Operator is picking
  | 'completed'       // Successfully completed
  | 'cancelled'       // Order cancelled
  | 'partial'         // Partial quantity picked
  | 'error'           // Picking error

type PickingError = {
  readonly type: 'wrong_product' | 'damaged' | 'not_found' | 'quantity_mismatch'
  readonly message: string
  readonly reportedAt: Date
  readonly reportedBy?: string
}
```

### Picking Line Filters

```typescript
type PickingLineFilters = {
  // Status filters
  readonly status?: readonly PickingStatus[]

  // Date range
  readonly dateRange?: DateRange

  // Warehouse/zone filters
  readonly warehouse?: readonly string[]
  readonly zone?: readonly string[]

  // Order filters
  readonly orderId?: string
  readonly orderType?: readonly string[]
  readonly priority?: readonly ('low' | 'medium' | 'high')[]
  readonly requester?: string

  // Product filters
  readonly productId?: number
  readonly productCategory?: readonly string[]

  // Operator filters
  readonly utilisateur?: string
  readonly assignedOperator?: readonly ('assigned' | 'unassigned')[]
}

// Date range helper
type DateRange = {
  readonly start: Date
  readonly end: Date
}
```

---

## 6. Restocking Lines Page

### Route
`/restocking-lines`

### Purpose
View all restocking (replenishment) operations

### Page Structure

```typescript
type RestockingLinesPage = {
  readonly summary: RestockingSummary
  readonly filters: RestockingFilters
  readonly table: RestockingLinesTable
}
```

### Restocking Line Definition

**Critical Requirement**: A restocking line is associated with:
- **Produit** (Product)
- **Localisation Initiale** (Source location)
- **Quantité** (Quantity)
- **Localisation Finale** (Destination location)

```typescript
type RestockingLine = {
  readonly id: string
  readonly lineNumber: number

  // Product information
  readonly produit: {
    readonly productId: number
    readonly productName: string
    readonly productDescription?: string
  }

  // Quantity
  readonly quantite: number
  readonly unit: string

  // Source location (where it's coming from)
  readonly localisationInitiale: {
    readonly warehouse: string
    readonly zone: string
    readonly location: string
    readonly fullPath: string
  }

  // Destination location (where it's going)
  readonly localisationFinale: {
    readonly warehouse: string
    readonly zone: string
    readonly location: string
    readonly fullPath: string
  }

  // Status and metadata
  readonly status: RestockingStatus
  readonly date: Date
  readonly utilisateur?: string  // Who performed the restocking
  readonly startedAt?: Date
  readonly completedAt?: Date
  readonly duration?: number  // seconds
  readonly notes?: readonly string[]
}

type RestockingStatus =
  | 'pending'         // Not started
  | 'in_progress'     // In transit
  | 'completed'       // Successfully moved
  | 'cancelled'       // Operation cancelled
  | 'error'           // Error occurred
```

### Restocking Filters

```typescript
type RestockingFilters = {
  // Status filters
  readonly status?: readonly RestockingStatus[]

  // Date range
  readonly dateRange?: DateRange

  // Location filters
  readonly sourceWarehouse?: readonly string[]
  readonly sourceZone?: readonly string[]
  readonly destWarehouse?: readonly string[]
  readonly destZone?: readonly string[]

  // Product filters
  readonly productId?: number
  readonly productCategory?: readonly string[]

  // Operator filter
  readonly utilisateur?: string
}

type RestockingSummary = {
  readonly totalLines: number
  readonly completedLines: number
  readonly pendingLines: number
  readonly inProgressLines: number
  readonly totalQuantity: number
  readonly avgDuration: number
}
```

---

## 7. Receptions Page

### Route
`/receptions`

### Purpose
View all goods receipt operations

### Page Structure

```typescript
type ReceptionsPage = {
  readonly summary: ReceptionsSummary
  readonly filters: ReceptionFilters
  readonly table: ReceptionsTable
}
```

### Reception Definition

**Critical Requirement**: Each reception is associated with:
- **Type de commande** (Order type)
- **Date requise** (Required date)
- **Fournisseur** (Supplier)
- **Commande fournisseur** (Supplier order)
- **Destination** (Destination location)
- **Nom** (Name/ID)
- **Date de réception** (Receipt date)
- **État** (Status)

```typescript
type Reception = {
  readonly id: string  // Reception ID
  readonly noReference: number

  // Order information
  readonly commande: {
    readonly type: string  // Type de commande
    readonly fournisseurCommande: string  // Supplier order number
    readonly dateRequise: Date  // Required date
  }

  // Supplier information
  readonly fournisseur: {
    readonly name: string
    readonly contact?: string
    readonly supplierId?: string
  }

  // Destination
  readonly destination: {
    readonly warehouse: string
    readonly zone: string
    readonly location?: string
  }

  // Receipt details
  readonly reception: {
    readonly nom: string  // Reception name/ID
    readonly dateReception: Date
    readonly dateReceptionEffective?: Date  // Actual receipt time
  }

  // Products received
  readonly produits: readonly ReceptionProduct[]

  // Status
  readonly etat: ReceptionStatus

  // Metadata
  readonly utilisateur: string  // Who received
  readonly notes?: readonly string[]
  readonly createdAt: Date
  readonly updatedAt: Date
}

type ReceptionProduct = {
  readonly productId: number
  readonly productName: string
  readonly quantity: number
  readonly unit: string
  readonly lotNumber?: string
  readonly expirationDate?: Date
  readonly location?: string  // Where stored
}

type ReceptionStatus =
  | 'pending'         // Expected, not received
  | 'in_progress'     // Partially received
  | 'completed'       // Fully received
  | 'cancelled'       // Cancelled
  | 'delayed'         // Received after required date
  | 'quality_check'   // Under quality inspection
```

### Reception Filters

```typescript
type ReceptionFilters = {
  // Status filters
  readonly etat?: readonly ReceptionStatus[]

  // Date filters
  readonly dateReceptionRange?: DateRange
  readonly dateRequiseRange?: DateRange

  // Supplier filters
  readonly fournisseur?: string
  readonly fournisseurCommande?: string

  // Destination filters
  readonly destination?: readonly string[]
  readonly warehouse?: readonly string[]
  readonly zone?: readonly string[]

  // Product filters
  readonly productId?: number
  readonly productCategory?: readonly string[]

  // Operator filter
  readonly utilisateur?: string

  // Late/early filter
  readonly timeliness?: readonly ('on_time' | 'late' | 'early')[]
}
```

### Reception Summary

```typescript
type ReceptionsSummary = {
  readonly totalReceptions: number
  readonly pendingReceptions: number
  readonly completedReceptions: number
  readonly delayedReceptions: number  // Received after required date

  readonly totalQuantity: number
  readonly uniqueSuppliers: number

  readonly avgReceiptTime: number  // Days from order to receipt

  readonly bySupplier: Record<string, number>  // Count by supplier
  readonly byWarehouse: Record<string, number>  // Count by warehouse
}
```

---

## 8. Sheet/Drawer Component Pattern

### When to Use Sheets vs Pages

**Use Sheet (Drawer)** for:
- Quick preview of related data
- Detailed view without leaving current page
- Auxiliary information
- drill-down detail (e.g., click picking line → see details)

**Use Page (Navigation)** for:
- Primary entity views (Product, Order, Operator profiles)
- Complex multi-section views
- Standalone workflows

### Sheet Specifications

```typescript
type SheetConfig = {
  readonly entity: EntityType
  readonly title: string
  readonly size: 'sm' | 'md' | 'lg' | 'xl'
  readonly content: SheetContent
}

type SheetContent = {
  readonly sections: readonly SheetSection[]
}

type SheetSection = {
  readonly type: 'header' | 'info' | 'table' | 'timeline' | 'actions'
  readonly title?: string
  readonly data?: unknown
  readonly actions?: readonly Action[]
}

type EntityType =
  | 'picking_line'
  | 'reception_line'
  | 'restocking_line'
  | 'product_preview'
  | 'order_preview'
  | 'operator_summary'
```

### Implementation (shadcn/ui Sheet)

```typescript
// Use shadcn/ui Sheet component
import { Sheet } from '@/components/ui/sheet'
import { TableRow } from '@/components/ui/table'

<Sheet>
  <SheetTrigger asChild>
    <TableRow onClick={() => setOpen(true)}>
      {/* Table row content */}
    </TableRow>
  </SheetTrigger>
  <SheetContent side="right" className="w-[600px] sm:w-[800px]">
    <SheetHeader>
      <SheetTitle>Picking Line Details</SheetTitle>
    </SheetHeader>
    <div className="py-4">
      {/* Sheet content sections */}
    </div>
  </SheetContent>
</Sheet>
```

---

## 9. Shared UI Components

### 9.1 DataTable Component

```typescript
type DataTableConfig<T> = {
  readonly data: readonly T[]
  readonly columns: readonly ColumnDef<T>[]
  readonly enableRowClick?: boolean
  readonly onRowClick?: (row: T) => void
  readonly enableSorting?: boolean
  readonly enableMultiSort?: boolean
  readonly enableFilters?: boolean
  readonly enablePagination?: boolean
  readonly enableVirtualScroll?: boolean
  readonly pageSize?: number
}

// Example: Picking lines table
const pickingLinesTable: DataTableConfig<PickingLine> = {
  data: pickingLines,
  columns: pickingLineColumns,
  enableRowClick: true,
  onRowClick: (line) => openPickingLineSheet(line),
  enableSorting: true,
  enableMultiSort: true,
  enableFilters: true,
  enablePagination: true,
  enableVirtualScroll: true,
  pageSize: 50
}
```

### 9.2 Filter Panel Component

```typescript
type FilterPanelConfig = {
  readonly filters: FilterGroup[]
  readonly onFilterChange: (filters: Record<string, unknown>) => void
  readonly onReset: () => void
}

type FilterGroup = {
  readonly title: string
  readonly type: 'text' | 'select' | 'multi-select' | 'date-range' | 'number-range'
  readonly field: string
  readonly options?: readonly { readonly label: string; readonly value: unknown }[]
  readonly placeholder?: string
}
```

### 9.3 Summary Cards Component

```typescript
type SummaryCard = {
  readonly title: string
  readonly value: string | number
  readonly unit?: string
  readonly trend?: {
    readonly value: number  // Percentage change
    readonly direction: 'up' | 'down' | 'stable'
  }
  readonly icon?: string
  readonly color?: 'blue' | 'green' | 'red' | 'yellow'
}

// Example usage
const summaryCards: readonly SummaryCard[] = [
  {
    title: 'Total Products',
    value: 1234,
    trend: { value: 5, direction: 'up' },
    icon: '📦',
    color: 'blue'
  },
  {
    title: 'Low Stock',
    value: 47,
    trend: { value: 12, direction: 'down' },
    icon: '⚠️',
    color: 'yellow'
  }
]
```

---

## 10. Navigation Architecture

### Breadcrumb Structure

```
Dashboard
  └─ Products (1,234 items)
      └─ Product PROD-001 Detail
          └─ Click "Stock by Location"
              └─ Sheet opens: Stock breakdown by location

Dashboard
  └─ Picking Lines (12,456 items)
      └─ Filter: Status=In Progress
          └─ Click line #1234
              └─ Sheet opens: Line details
```

### Back Navigation

```typescript
type NavigationHistory = {
  readonly canGoBack: boolean
  readonly canGoForward: boolean
  readonly currentPosition: NavigationStep
  readonly history: readonly NavigationStep[]
}

type NavigationStep = {
  readonly title: string
  readonly route: string
  readonly params?: Record<string, string>
  readonly filters?: Record<string, unknown>
}
```

---

## 11. Data Schema Relationships

### Entity Relationship Diagram (Revisited)

```
┌─────────────┐         ┌─────────────┐
│  Operators  │         │  Products   │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │ (picking)             │ (stock)
       │                       │
       ▼                       ▼
┌─────────────────────────────────────┐
│         Picking Lines              │
│  • article → Product              │
│  • emplacement → Location           │
│  • entrepot → Warehouse             │
│  • commande → Order                │
│  • date → Timestamp                │
│  • utilisateur → Operator           │
└─────────────────────────────────────┘
       │
       │ (belongs to)
       ▼
┌─────────────────────────────────────┐
│            Orders                   │
│  • type → Order Type               │
│  • dateRequise → Required Date       │
│  • fournisseur → Supplier            │
│  • destination → Destination         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      Restocking Lines               │
│  • produit → Product                │
│  • localisationInitiale → Source     │
│  • localisationFinale → Destination  │
│  • quantité → Quantity                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│           Receptions                 │
│  • type → Order Type                 │
│  • dateRequise → Required Date        │
│  • fournisseur → Supplier             │
│  • destination → Destination          │
│  • nom → Name/ID                     │
│  • dateReception → Receipt Date        │
│  • etat → Status                     │
└─────────────────────────────────────┘
```

---

## 12. Page Priority Matrix

### Phase 1 (MVP)
1. ✅ Dashboard (global view)
2. ✅ Products catalog (with filters)
3. ✅ Product detail (stock by location)
4. ✅ Picking lines page (global + table)
5. ✅ Locations page (with contents)

### Phase 2
6. ⏳ Picking line sheet (click from table)
7. ⏳ Order detail page
8. ⏳ Restocking lines page
9. ⏳ Receptions page
10. ⏳ Operator profile page

### Phase 3 (Advanced)
11. ⏳ Warehouse/zone profile pages
12. ⏳ Advanced analytics pages
13. ⏳ 3D warehouse modeling

---

## 13. Responsive Design

### Mobile Considerations

**Dashboard**:
- Summary cards stacked
- KPIs simplified
- Quick actions prominent

**Products Catalog**:
- Filters in collapsible sidebar
- Table → Cards on mobile
- Infinite scroll instead of pagination

**Picking Lines**:
- Essential columns only on mobile
- Detail view in full-screen sheet
- Quick filters accessible

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft

# Complete Data Flow Architecture

## Overview

This document describes the **end-to-end data flow** through the Wareflow SaaS platform, from Excel import through the three analysis layers to final Excel export. Understanding this flow is critical for implementing the system correctly.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER WORKFLOW                            │
│  1. Import Excel → 2. Explore Data → 3. Run Analyses → 4. Export │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PIPELINE                              │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │
│  │  IMPORT  │ → │  MODEL   │ → │ ANALYZE  │ → │  EXPORT  │ │
│  │  ENGINE  │    │  LAYER   │    │  LAYER   │    │  ENGINE  │ │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              LOCAL SQLITE DATABASE (Persistent State)       │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Stage 1: Import Engine

### Input

**User Action**: Upload WMS Excel file

**File Specifications**:
```typescript
type ImportInput = {
  readonly file: File
  readonly warehouseId: string
  readonly importMode: 'full' | 'incremental' | 'append'
  readonly selectedPlugin?: string  // User-selected or auto-detected
}
```

### Process Flow

```
1. FILE UPLOAD
   ↓
2. FILE VALIDATION
   • Check format (.xlsx, .xls)
   • Check size (<100MB)
   • Verify file integrity
   ↓
3. PARSE EXCEL
   • Extract sheets
   • Detect headers
   • Parse data types
   ↓
4. TEMPLATE MATCHING
   • Match columns to known templates
   • Calculate confidence scores
   • Suggest best template
   ↓
5. USER REVIEW
   • Show detected mapping
   • User adjusts if needed
   • Preview transformation
   ↓
6. DATA VALIDATION
   • Required columns present
   • Data types valid
   • Business rules satisfied
   ↓
7. TRANSFORM DATA
   • Normalize column names
   • Convert data types
   • Apply business logic
   ↓
8. LOAD TO DATABASE
   • Create/update schema
   • Batch insert
   • Update indexes
   ↓
9. POST-IMPORT
   • Update available analyses
   • Calculate statistics
   • Generate data quality report
   ↓
10. COMPLETE
    • Show summary
    • Enable analyses
```

### Data Transformation

**Input Schema** (WMS-specific):
```typescript
// Example: SAP EWM export
type SAPInputData = {
  readonly '/EWM/PRODUCT': readonly {
    readonly DOC_ID: string
    readonly DOC_CAT: string
    readonly PRODUCT: string
    // ... SAP-specific columns
  }[]

  readonly '/EWM/MOVEMENT': readonly {
    readonly DOC_ID: string
    readonly PRODUCT: string
    readonly QUANTITY: number
    readonly MovementType: string
    // ... SAP-specific columns
  }[]
}
```

**Plugin Transformation**:
```typescript
type ImportPlugin = {
  readonly id: string
  readonly wmsSystem: string
  readonly inputSchema: WMSInputSchema

  readonly validate: (input: WMSInputData) => readonly ValidationResult[]
  readonly transform: (input: WMSInputData, context: TransformContext) => Promise<NormalizedData>
}

// All plugins produce SAME output schema
type NormalizedData = {
  readonly metadata: ImportMetadata
  readonly produits: readonly Product[]
  readonly mouvements: readonly Movement[]
  readonly commandes?: readonly Order[]
  readonly receptions?: readonly Receipt[]
}
```

**Output Schema** (Normalized - same for ALL plugins):
```typescript
// Produits (Products)
type Product = {
  readonly no_produit: number
  readonly nom_produit: string
  readonly description?: string
  readonly categorie_1?: string
  readonly categorie_2?: string
  readonly categorie_3?: string
  readonly classe_produit?: string
  readonly etat: 'active' | 'inactive' | 'discontinued'
  readonly ean?: string
  readonly sku?: string
  readonly created_at: Date
  readonly updated_at: Date
}

// Mouvements (Movements)
type Movement = {
  readonly oid: number
  readonly no_produit: number
  readonly nom_produit: string
  readonly type: 'ENTREE' | 'SORTIE' | 'TRANSFERT' | 'AJUSTEMENT'
  readonly site_source?: string
  readonly zone_source?: string
  readonly localisation_source?: string
  readonly site_cible?: string
  readonly zone_cible?: string
  readonly localisation_cible?: string
  readonly quantite: number
  readonly date_heure: Date
  readonly usager?: string
  readonly raison?: string
}

// Commandes (Orders) - Optional
type Order = {
  readonly commande: string
  readonly type_commande: string
  readonly demandeur: string
  readonly destinataire: string
  readonly priorite: number
  readonly date_requise: Date
  readonly etat: string
}
```

### Database Storage

**Storage Strategy**: Local SQLite with warehouse isolation

**Option 1: Prefixed Tables** (Recommended for MVP):
```sql
-- Each warehouse has its own tables
CREATE TABLE [wh-paris]_produits (
  no_produit INTEGER PRIMARY KEY,
  nom_produit TEXT NOT NULL,
  -- ...
);

CREATE TABLE [wh-paris]_mouvements (
  oid INTEGER PRIMARY KEY,
  no_produit INTEGER NOT NULL,
  -- ...
);

CREATE TABLE [wh-lyon]_produits (
  no_produit INTEGER PRIMARY KEY,
  nom_produit TEXT NOT NULL,
  -- ...
);
```

**Option 2: Warehouse ID Column**:
```sql
-- Single tables with warehouse_id
CREATE TABLE produits (
  warehouse_id TEXT NOT NULL,
  no_produit INTEGER NOT NULL,
  nom_produit TEXT NOT NULL,
  PRIMARY KEY (warehouse_id, no_produit)
);
```

### Output

**Results**:
```typescript
type ImportResult = {
  readonly status: 'success' | 'partial' | 'failed'
  readonly warehouseId: string
  readonly pluginId: string
  readonly stats: {
    readonly rowsProcessed: number
    readonly inserted: number
    readonly updated: number
    readonly deleted: number
    readonly skipped: number
  }
  readonly duration: number  // milliseconds
  readonly errors: readonly ImportError[]
  readonly warnings: readonly ImportWarning[]
  readonly dataQuality: DataQualityMetrics
}
```

**UI Updates**:
- Show import summary
- Update available analyses (enable/disable based on imported data)
- Navigate to dashboard

---

## Stage 2: Layer 1 - Modeling (Representation)

### Purpose

Transform raw database data into **meaningful visual representations** that show what's happening in the warehouse.

### Data Access

**Query Builder**:
```typescript
type QueryBuilder = {
  readonly from: (table: string) => QueryBuilder
  readonly join: (table: string, on: string) => QueryBuilder
  readonly where: (column: string, operator: string, value: unknown) => QueryBuilder
  readonly groupBy: (...columns: string[]) => QueryBuilder
  readonly orderBy: (column: string, direction: 'asc' | 'desc') => QueryBuilder
  readonly limit: (count: number) => QueryBuilder
  readonly findMany: () => Promise<unknown[]>
  readonly count: () => Promise<number>
}
```

### Typical Queries

**Product Timeline**:
```sql
SELECT
  DATE(date_heure) as date,
  COUNT(*) as movements,
  SUM(CASE WHEN type = 'ENTREE' THEN quantite ELSE 0 END) as in_quantity,
  SUM(CASE WHEN type = 'SORTIE' THEN quantite ELSE 0 END) as out_quantity
FROM [wh-paris]_mouvements
WHERE no_produit = ?
  AND date_heure >= ? AND date_heure <= ?
GROUP BY DATE(date_heure)
ORDER BY date ASC
```

**Zone Heatmap Data**:
```sql
SELECT
  zone_cible,
  COUNT(*) as movement_count,
  SUM(quantite) as total_quantity
FROM [wh-paris]_mouvements
WHERE date_heure >= ? AND date_heure <= ?
GROUP BY zone_cible
ORDER BY movement_count DESC
```

**Operator Performance**:
```sql
SELECT
  usager,
  COUNT(*) as total_movements,
  COUNT(DISTINCT no_produit) as unique_products,
  AVG(quantite) as avg_quantity,
  MIN(date_heure) as first_movement,
  MAX(date_heure) as last_movement
FROM [wh-paris]_mouvements
WHERE usager IS NOT NULL
  AND date_heure >= ? AND date_heure <= ?
GROUP BY usager
ORDER BY total_movements DESC
```

### Processing

**Minimal Processing**: Just aggregation and formatting

```typescript
type ModelingProcessor = {
  readonly aggregate: (data: readonly unknown[], groupBy: string, aggregations: Aggregation[]) => readonly unknown[]
  readonly formatForVisualization: (data: readonly unknown[], vizType: VisualizationType) => readonly ChartDataPoint[]
  readonly calculateMetrics: (data: readonly unknown[]) => ModelingMetrics
}
```

### Output Types

**Visualizations**:
- Line charts (trends)
- Bar charts (comparisons)
- Heatmaps (spatial intensity)
- Sankey diagrams (flows)
- Activity feeds (real-time)
- Data tables with drill-down

**Example Output**:
```typescript
type ProductMovementTimeline = {
  readonly productId: string
  readonly productName: string
  readonly timeRange: DateRange
  readonly data: readonly {
    readonly date: Date
    readonly movementsIn: number
    readonly movementsOut: number
    readonly netChange: number
  }[]
  readonly metrics: {
    readonly totalMovements: number
    readonly netChange: number
    readonly averageDaily: number
    readonly peakDay: Date
  }
}
```

---

## Stage 3: Layer 2 - Analytics (Pattern Discovery)

### Purpose

Apply **statistical methods and analytical techniques** to discover relationships, patterns, and insights.

### Data Access

**More Complex Queries**:
```sql
-- ABC Analysis
WITH product_movements AS (
  SELECT
    no_produit,
    SUM(quantite) as total_quantity
  FROM [wh-paris]_mouvements
  WHERE type = 'SORTIE'
    AND date_heure >= ?
  GROUP BY no_produit
),
ranked_products AS (
  SELECT
    no_produit,
    total_quantity,
    SUM(total_quantity) OVER () as grand_total,
    SUM(total_quantity) OVER (ORDER BY total_quantity DESC) as cumulative
  FROM product_movements
)
SELECT
  p.no_produit,
  p.nom_produit,
  rp.total_quantity,
  rp.grand_total,
  (rp.total_quantity * 100.0 / rp.grand_total) as percentage,
  (rp.cumulative * 100.0 / rp.grand_total) as cumulative_percentage,
  CASE
    WHEN (rp.cumulative * 100.0 / rp.grand_total) <= 20 THEN 'A'
    WHEN (rp.cumulative * 100.0 / rp.grand_total) <= 50 THEN 'B'
    ELSE 'C'
  END as abc_class
FROM ranked_products rp
JOIN [wh-paris]_produits p ON rp.no_produit = p.no_produit
ORDER BY rp.total_quantity DESC
```

```sql
-- Product Co-occurrence
WITH order_products AS (
  SELECT
    m.commande,
    m.no_produit,
    COUNT(*) as occurrence
  FROM [wh-paris]_mouvements m
  JOIN [wh-paris]_commandes c ON m.commande = c.commande
  WHERE m.type = 'SORTIE'
    AND m.date_heure >= ?
  GROUP BY m.commande, m.no_produit
)
SELECT
  p1.no_produit as product1,
  p2.no_produit as product2,
  COUNT(*) as co_occurrence_count,
  (SELECT COUNT(*) FROM order_products) as total_orders,
  (COUNT(*) * 1.0 / (SELECT COUNT(*) FROM order_products)) as confidence
FROM order_products p1
JOIN order_products p2
  ON p1.commande = p2.commande AND p1.no_produit < p2.no_produit
GROUP BY p1.no_produit, p2.no_produit
HAVING COUNT(*) >= ?
ORDER BY co_occurrence_count DESC
```

### Processing

**Statistical Computations**:
```typescript
type AnalyticsProcessor = {
  readonly calculateABC: (data: readonly ProductMovement[], boundaries: [number, number]) => ABCClassification
  readonly calculateXYZ: (data: readonly ProductMovement[], cvThresholds: CVThresholds) => XYZClassification
  readonly calculateCorrelation: (x: readonly number[], y: readonly number[]) => CorrelationResult
  readonly detectSeasonality: (data: readonly TimeSeriesData[]) => SeasonalityResult
  readonly calculateCoOccurrence: (orders: readonly Order[], minOccurrence: number) => CoOccurrenceResult
}
```

### Output Types

**Statistical Results**:
```typescript
type ABCAnalysisResult = {
  readonly products: readonly {
    readonly productId: string
    readonly productName: string
    readonly class: 'A' | 'B' | 'C'
    readonly contribution: number
    readonly cumulative: number
  }[]
  readonly summary: {
    readonly classA: { count: number; contribution: number }
    readonly classB: { count: number; contribution: number }
    readonly classC: { count: number; contribution: number }
  }
}

type CorrelationResult = {
  readonly correlation: number  // Pearson r
  readonly pValue: number
  readonly significance: 'significant' | 'not_significant'
  readonly sampleSize: number
  readonly interpretation: string
}
```

**Visualizations**:
- Pareto charts (ABC)
- Scatter plots with trend lines
- Correlation matrices
- Network graphs (co-occurrence)
- Seasonal decomposition charts

---

## Stage 4: Layer 3 - Predictive (Recommendations)

### Purpose

Use **machine learning and optimization algorithms** to predict future outcomes and recommend specific actions.

### Data Access

**Large Historical Queries** (12+ months preferred):
```sql
-- Historical data for training
SELECT
  DATE(date_heure) as date,
  no_produit,
  SUM(quantite) as daily_quantity
FROM [wh-paris]_mouvements
WHERE type = 'SORTIE'
  AND date_heure >= DATE('now', '-12 months')
GROUP BY DATE(date_heure), no_produit
ORDER BY date ASC
```

### Processing

**ML Models and Algorithms**:
```typescript
type PredictiveProcessor = {
  readonly forecastDemand: (historicalData: readonly TimeSeriesData[], horizon: number) => DemandForecast
  readonly optimizeStock: (product: Product, demand: DemandForecast, constraints: Constraints) => StockRecommendation
  readonly detectAnomalies: (data: readonly TimeSeriesData[], method: AnomalyMethod) => AnomalyResult
  readonly optimizeLayout: (movements: readonly Movement[], constraints: LayoutConstraints) => LayoutRecommendation
  readonly predictBottlenecks: (historicalData: readonly OperationalData[], horizon: number) => BottleneckPrediction
}
```

### Example: Demand Forecasting

**Time Series Decomposition**:
```typescript
type DemandForecast = {
  readonly productId: string
  readonly historicalData: readonly {
    readonly date: Date
    readonly actual: number
  }[]
  readonly forecast: readonly {
    readonly date: Date
    readonly predicted: number
    readonly lower: number  // 95% CI
    readonly upper: number  // 95% CI
  }[]
  readonly components: {
    readonly trend: 'increasing' | 'stable' | 'decreasing'
    readonly seasonality: readonly {
      readonly period: string  // e.g., "weekly", "monthly"
      readonly strength: number
    }[]
  }
  readonly modelAccuracy: {
    readonly mape: number  // Mean Absolute Percentage Error
    readonly rmse: number  // Root Mean Squared Error
  }
}
```

### Example: Stock Optimization

**Economic Order Quantity (EOQ) Model**:
```typescript
type StockOptimizationResult = {
  readonly productId: string
  readonly currentStock: number
  readonly demand: {
    readonly mean: number  // Average daily demand
    readonly stdDev: number  // Demand variability
  }
  readonly recommendations: {
    readonly reorderPoint: number  // When to reorder
    readonly economicOrderQuantity: number  // How much to order
    readonly safetyStock: number  // Buffer stock
    readonly totalHoldingCost: number
    readonly totalOrderingCost: number
  }
  readonly action: 'order_now' | 'hold' | 'reduce'
  readonly reason: string
  readonly expectedSavings: number
}
```

### Output Types

**Forecasts**:
- Time series predictions
- Confidence intervals
- Scenario analysis

**Recommendations**:
- Specific actions
- Expected outcomes
- Risk assessments
- Priority rankings

**Alerts**:
- Anomaly warnings
- Bottleneck predictions
- Stockout risks
- Optimization opportunities

---

## Stage 5: Export Engine

### Input

**User Action**: Select analysis result and export template

```typescript
type ExportInput = {
  readonly analysisResult: AnalysisResult
  readonly template: ExportTemplate
  readonly outputPath: string
}
```

### Process Flow

```
1. SELECT RESULT
   User chooses analysis result to export
   ↓
2. SELECT TEMPLATE
   User chooses export template or uses default
   ↓
3. CONFIGURE EXPORT
   • Choose output filename
   • Choose output location
   • Configure formatting options
   ↓
4. GENERATE EXCEL
   • Create workbook
   • Apply template formatting
   • Create sheets (data, summary, charts)
   • Add metadata
   ↓
5. SAVE FILE
   Write Excel file to disk
   ↓
6. COMPLETE
   Show success, offer to open file
```

### Template Application

**Export Template Structure**:
```typescript
type ExportTemplate = {
  readonly id: string
  readonly name: string
  readonly sheets: readonly SheetConfig[]
  readonly formatting: GlobalFormatting
}

type SheetConfig = {
  readonly name: string
  readonly type: 'data' | 'summary' | 'chart'
  readonly dataSource: {
    readonly analysisId: string
    readonly tableName: string
  }
  readonly layout: SheetLayout
  readonly columns?: readonly ColumnConfig[]
  readonly charts?: readonly ChartConfig[]
  readonly highlights?: readonly HighlightRule[]
}
```

### Output

**Excel File Structure**:
```
workbook.xlsx
├── Sheet 1: Data
│   ├── Headers (formatted)
│   ├── Data rows (with conditional formatting)
│   └── Filters enabled
│
├── Sheet 2: Summary Statistics
│   ├── Key metrics
│   ├── Aggregations
│   └── Comparisons
│
├── Sheet 3: Charts
│   ├── Bar chart
│   ├── Line chart
│   └── Scatter plot
│
└── Metadata
    ├── Generated timestamp
    ├── Analysis parameters
    └── Data source info
```

---

## Complete Example: End-to-End Flow

### Scenario: User Wants to Optimize Slow-Moving Inventory

#### Step 1: Import Data

```
User uploads Excel: warehouse_data.xlsx
  ↓
Template Matcher: Detects "Generic Warehouse" template (94% confidence)
  ↓
User reviews mapping, confirms
  ↓
Import Engine transforms data to normalized schema
  ↓
Data loaded to: [wh-paris]_produits, [wh-paris]_mouvements
  ↓
Import complete: 1,234 products, 45,678 movements
```

#### Step 2: Layer 1 - Modeling (Explore)

```
User navigates to Products table
  ↓
Sorts by "Last Movement Date" ascending
  ↓
Clicks on product "PROD-001" (last movement: 45 days ago)
  ↓
View: Product Detail
  • Movement timeline chart
  • Current stock: 500 units
  • Last 90 days: Only 2 movements
```

#### Step 3: Layer 2 - Analytics (Understand)

```
User clicks "Run XYZ Analysis"
  ↓
Analysis Engine executes:
  • Mean demand: 0.33 units/day
  • StdDev: 0.47 units
  • Coefficient of Variation: 1.42
  ↓
Result: Class Z (high variability, low volume)
  ↓
User also runs ABC Analysis:
  • Total contribution: 0.02%
  • Result: Class C (low value)
```

#### Step 4: Layer 3 - Predictive (Recommend)

```
User clicks "Optimize Stock" button
  ↓
Predictive Engine:
  • Forecast demand: <5 units/month
  • Calculate EOQ: 50 units optimal
  • Current stock: 500 units (overstock by 450)
  ↓
Recommendation:
  ┌─────────────────────────────────────────┐
  │  💡 Stock Optimization                  │
  │                                        │
  │  Product: PROD-001                     │
  │  Action: Reduce stock by 450 units     │
  │  Expected savings: $2,340/year         │
  │                                        │
  │  [View Forecast] [Export Plan]         │
  └─────────────────────────────────────────┘
```

#### Step 5: Export Results

```
User clicks "Export Plan"
  ↓
Selects template: "Stock Optimization Report"
  ↓
Export Engine generates Excel:
  ├── Sheet 1: Current State
  │   • Product details
  │   • Stock levels
  │   • Movement history
  │
  ├── Sheet 2: Analysis Results
  │   • XYZ classification
  │   • ABC classification
  │   • Demand forecast chart
  │
  ├── Sheet 3: Recommendations
  │   • Action items
  │   • Expected outcomes
  │   • Implementation plan
  │
  └── Metadata
      • Generated: 2025-01-27 14:32:15
      • Analysis parameters
  ↓
File saved: PROD-001_optimization_plan.xlsx
```

---

## State Management Across Stages

### Global State (Zustand)

```typescript
type AppState = {
  // Import state
  readonly import: ImportState

  // Warehouse state
  readonly warehouse: {
    readonly currentWarehouse: string | null
    readonly availableWarehouses: readonly Warehouse[]
  }

  // Navigation state
  readonly navigation: NavigationState

  // Analysis state
  readonly analysis: {
    readonly availableAnalyses: readonly AvailableAnalysis[]
    readonly runningAnalyses: readonly string[]
    readonly completedAnalyses: readonly AnalysisResult[]
  }

  // UI state
  readonly ui: {
    readonly sidebarOpen: boolean
    readonly theme: 'light' | 'dark'
    readonly locale: string
  }
}
```

### Data Persistence

**What's Stored in Database**:
- Raw imported data (normalized schema)
- Import history
- Analysis results (optional - can cache)
- User preferences

**What's Kept in Memory**:
- Current navigation state
- Active analysis parameters
- UI state (sidebar, theme, etc.)
- Cached analysis results (TTL-based)

---

## Performance Considerations by Stage

### Stage 1 (Import)
- **Large files**: Stream processing (>50MB)
- **Batch size**: 1,000-5,000 rows per transaction
- **Expected time**: 5-60 seconds depending on file size

### Stage 2 (Modeling)
- **Queries**: Simple aggregations, indexed
- **Expected time**: <1 second
- **Caching**: Aggressive (TTL: 5 minutes)

### Stage 3 (Analytics)
- **Queries**: Complex joins, statistical computations
- **Expected time**: 1-5 seconds
- **Caching**: Moderate (TTL: 1 hour, invalidate on data refresh)

### Stage 4 (Predictive)
- **Queries**: Very large historical datasets
- **Processing**: ML model inference, optimization algorithms
- **Expected time**: 5-30 seconds
- **Caching**: Selective (TTL: 24 hours, invalidate on model retrain)

### Stage 5 (Export)
- **Generation**: Excel creation, formatting
- **Expected time**: 1-10 seconds depending on data size
- **Caching**: None (generated on-demand)

---

## Error Handling and Recovery

### By Stage

**Import Errors**:
- User-friendly error messages
- Partial import capability (continue on non-critical errors)
- Rollback on critical errors

**Modeling Errors**:
- Missing data → Show "No data available"
- Query errors → Retry with fallback query
- Timeout → Show loading indicator, offer retry

**Analytics Errors**:
- Insufficient data → Disable analysis, show why
- Computation errors → Show error, suggest fix (e.g., "Use longer time range")

**Predictive Errors**:
- Model not trained → Show "Not available", offer to train
- Low confidence → Show warning, highlight uncertainty
- Optimization fails → Show fallback recommendation

**Export Errors**:
- File write error → Offer alternative location
- Template error → Use default template
- Large data → Offer to export summary only

---

## Security and Privacy

### Data Privacy

**100% Local**:
- All data stored on user's machine
- No cloud services
- No telemetry
- No analytics tracking

**File Permissions**:
- Database file: User read/write only
- Export files: User controls location
- No automatic uploads

### Input Validation

**Import Stage**:
- Validate file types (Excel, CSV)
- Limit file size (100MB default, configurable)
- Sanitize Excel formulas/macros
- Type checking via Zod schemas

---

## Future Enhancements

### Import Enhancements
- Support for CSV with delimiter detection
- Support for JSON (API imports)
- Real-time sync from WMS via API
- Incremental auto-import

### Modeling Enhancements
- Real-time streaming updates
- 3D warehouse visualizations
- Mobile-optimized views

### Analytics Enhancements
- Natural language queries
- Automated insight generation
- Collaborative annotations

### Predictive Enhancements
- Custom model training
- A/B testing for recommendations
- What-if scenario modeling
- Reinforcement learning for continuous optimization

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft

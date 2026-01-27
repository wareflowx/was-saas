# Three-Layer Analysis Architecture

## Overview

Wareflow's analysis system is organized into **three distinct conceptual layers**, each serving a specific purpose in transforming raw warehouse data into actionable intelligence. This layered approach ensures clear separation of concerns while enabling sophisticated insights.

## The Three Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 3: PREDICTIVE                         │
│  Purpose: Recommend actions and predict outcomes                │
│  Output: Recommendations, forecasts, optimization plans         │
│  Color: Amber/Green                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↑ requires
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 2: ANALYTICS                          │
│  Purpose: Understand patterns and relationships                 │
│  Output: Insights, correlations, statistical measures           │
│  Color: Purple                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↑ requires
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER 1: MODELING                           │
│  Purpose: Represent what's happening                            │
│  Output: Visualizations, metrics, aggregations                 │
│  Color: Blue                                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↑ requires
┌─────────────────────────────────────────────────────────────────┐
│                      RAW DATA                                  │
│  produits + mouvements + commandes + receptions                │
└─────────────────────────────────────────────────────────────────┘
```

## Layer 1: Modeling (Representation)

### Purpose

**Answer the question**: "What is happening in the warehouse?"

This layer transforms raw data into **meaningful representations** without interpretation or analysis. It shows the current state and historical patterns through visualizations and aggregations.

### Key Characteristics

- **Descriptive**: Shows what happened, not why
- **Atomic or Aggregated**: Can show individual movements or daily summaries
- **Visual-First**: Emphasizes charts, timelines, heatmaps
- **Real-Time Capable**: Can display live operations

### Core Components

#### 1.1 Entity Representations

**Product View**:
- Basic information (ID, name, category)
- Current stock level
- Movement count over time
- Status (active, inactive, discontinued)

**Movement View**:
- Individual movement records
- Movement timeline
- Source → destination flow
- Operator performance

**Order View**:
- Order headers and lines
- Order status progression
- Fulfillment timeline
- Picking progress

#### 1.2 Temporal Representations

**Timeline Charts**:
```typescript
type TemporalRepresentation = {
  readonly entityType: 'product' | 'operator' | 'zone' | 'order'
  readonly entityId: string
  readonly timeRange: {
    readonly start: Date
    readonly end: Date
    readonly granularity: 'hour' | 'day' | 'week' | 'month'
  }
  readonly metrics: readonly {
    readonly metric: string
    readonly aggregation: 'count' | 'sum' | 'avg'
  }[]
}

// Example: Product movement over time
type ProductTimeline = {
  readonly productId: string
  readonly timeRange: DateRange
  readonly data: readonly {
    readonly timestamp: Date
    readonly movementsIn: number
    readonly movementsOut: number
    readonly netChange: number
  }[]
}
```

**Usage**: Show daily movement counts, operator productivity over time, zone activity patterns

#### 1.3 Spatial Representations

**Zone Heatmaps**:
```typescript
type ZoneHeatmap = {
  readonly warehouseId: string
  readonly zones: readonly {
    readonly zoneId: string
    readonly zoneName: string
    readonly activity: number
    readonly utilization: number
    readonly position: {
      readonly x: number
      readonly y: number
      readonly width: number
      readonly height: number
    }
  }[]
  readonly metric: 'movements' | 'pickCount' | 'putawayCount'
  readonly timeRange: DateRange
}
```

**Usage**: Visualize which zones are most active, identify bottlenecks, optimize layout

#### 1.4 Flow Diagrams

**Product Movement Paths**:
```typescript
type FlowDiagram = {
  readonly productId: string
  readonly flows: readonly {
    readonly from: string  // zone or location
    readonly to: string    // zone or location
    readonly count: number
    readonly percentage: number
  }[]
  readonly timeRange: DateRange
}
```

**Usage**: Understand typical product routes, optimize picking paths

### Output Types

**Visualizations**:
- Line charts (trends over time)
- Bar charts (comparisons)
- Heatmaps (spatial intensity)
- Sankey diagrams (flow)
- Activity feeds (real-time operations)

**Metrics**:
- Total movements
- Average throughput
- Peak activity times
- Utilization rates
- Current state snapshots

### Example Analyses

| Analysis Name | Description | Output |
|--------------|-------------|--------|
| Movement Timeline | Show movements over time for entity | Line chart + data table |
| Zone Activity Heatmap | Visualize activity by zone | Heatmap + zone list |
| Operator Performance | Individual operator throughput | Bar chart + stats |
| Real-Time Activity Feed | Live operations stream | Activity list + metrics |

---

## Layer 2: Analytics (Pattern Discovery)

### Purpose

**Answer the question**: "Why are these patterns occurring?"

This layer applies **statistical methods and analytical techniques** to discover relationships, patterns, and insights in the data. It goes beyond representation to understanding.

### Key Characteristics

- **Interpretive**: Explains relationships and patterns
- **Statistical**: Uses mathematical methods
- **Comparative**: Compares across dimensions
- **Insight-Driven**: Reveals non-obvious patterns

### Core Components

#### 2.1 Classification Analyses

**ABC Analysis** (Pareto Principle):
```typescript
type ABCAnalysisConfig = {
  readonly lookbackDays: number
  readonly boundaries: [number, number]  // e.g., [20, 50] for A: 0-20%, B: 20-50%
  readonly metric: 'quantity' | 'value' | 'movements'
  readonly groupBy?: 'category' | 'zone'
}

type ABCAnalysisResult = {
  readonly products: readonly {
    readonly productId: string
    readonly productName: string
    readonly class: 'A' | 'B' | 'C'
    readonly contribution: number  // Percentage to total
    readonly cumulative: number     // Cumulative percentage
  }[]
  readonly summary: {
    readonly classA: { count: number; contribution: number }
    readonly classB: { count: number; contribution: number }
    readonly classC: { count: number; contribution: number }
  }
}
```

**XYZ Analysis** (Demand Variability):
```typescript
type XYZAnalysisConfig = {
  readonly lookbackDays: number
  readonly coefficientOfVariationThresholds: {
    readonly X: number  // Low variability (CV < 0.5)
    readonly Y: number  // Medium variability (CV < 1.0)
    readonly Z: number  // High variability (CV >= 1.0)
  }
}

type XYZAnalysisResult = {
  readonly products: readonly {
    readonly productId: string
    readonly class: 'X' | 'Y' | 'Z'
    readonly mean: number
    readonly stdDev: number
    readonly coefficientOfVariation: number
  }[]
}
```

**ABC-XYZ Matrix**:
Combines both analyses for strategic inventory management:
- **AX**: High value, stable demand → Keep stocked, JIT possible
- **AZ**: High value, volatile demand → Monitor closely, buffer stock
- **CX**: Low value, stable demand → Batch orders, minimize review

#### 2.2 Relationship Analyses

**Product Co-occurrence**:
```typescript
type CoOccurrenceAnalysisConfig = {
  readonly lookbackDays: number
  readonly minOccurrences: number
  readonly topN: number
}

type CoOccurrenceAnalysisResult = {
  readonly pairs: readonly {
    readonly product1: string
    readonly product2: string
    readonly occurrences: number
    readonly confidence: number
    readonly lift: number  // How much more likely than random
  }[]
  readonly productNetwork: NetworkGraph
}
```

**Use Case**: Products frequently ordered together can be:
- Grouped in warehouse
- Marketed together
- Used for bundle recommendations

**Order-Picking Correlation**:
```typescript
type OrderPickingCorrelationConfig = {
  readonly lookbackDays: number
  readonly groupBy?: 'zone' | 'operator' | 'time'
}

type OrderPickingCorrelationResult = {
  readonly correlation: number  // Pearson correlation
  readonly significance: number  // P-value
  readonly insights: readonly string[]
}
```

**Use Case**: Understand relationship between order patterns and picking efficiency

#### 2.3 Temporal Pattern Analyses

**Seasonality Detection**:
```typescript
type SeasonalityAnalysisConfig = {
  readonly lookbackDays: number
  readonly granularity: 'day_of_week' | 'week' | 'month'
  readonly method: 'moving_average' | 'decomposition'
}

type SeasonalityAnalysisResult = {
  readonly patterns: readonly {
    readonly period: string  // e.g., "Monday", "January"
    readonly value: number
    readonly baseline: number
    readonly variance: number
  }[]
  readonly forecast: readonly number[]
}
```

**Trend Analysis**:
```typescript
type TrendAnalysisConfig = {
  readonly lookbackDays: number
  readonly method: 'linear' | 'exponential' | 'polynomial'
}

type TrendAnalysisResult = {
  readonly slope: number  // Positive = increasing, Negative = decreasing
  readonly intercept: number
  readonly rSquared: number  // Fit quality
  readonly forecast: readonly number[]
}
```

#### 2.4 Spatial Analyses

**Flux Analysis** (Movement Patterns):
```typescript
type FluxAnalysisConfig = {
  readonly type: 'temporal' | 'spatial' | 'operational'
  readonly lookbackDays: number
  readonly granularity: 'hour' | 'day' | 'week'
}

type TemporalFluxResult = {
  readonly hourlyPattern: readonly {
    readonly hour: number
    readonly movementsIn: number
    readonly movementsOut: number
  }[]
  readonly peakHours: readonly number[]
}

type SpatialFluxResult = {
  readonly zoneFlows: readonly {
    readonly from: string
    readonly to: string
    readonly count: number
  }[]
  readonly bottlenecks: readonly string[]
}

type OperationalFluxResult = {
  readonly operationTypes: readonly {
    readonly type: 'ENTREE' | 'SORTIE' | 'TRANSFERT'
    readonly count: number
    readonly avgDuration: number
  }[]
}
```

### Output Types

**Statistical Measures**:
- Mean, median, mode
- Standard deviation, variance
- Correlation coefficients
- P-values, confidence intervals

**Visualizations**:
- Scatter plots with trend lines
- Correlation matrices
- Pareto charts
- Network graphs
- Heatmaps with statistical overlays

**Insights**:
- Pattern descriptions
- Statistical significance indicators
- Exception highlighting
- Comparative analysis

### Example Analyses

| Analysis Name | Description | Method |
|--------------|-------------|---------|
| ABC Classification | Classify products by importance | Pareto principle |
| XYZ Analysis | Classify by demand variability | Coefficient of variation |
| Co-occurrence | Products ordered together | Association rules |
| Correlation Analysis | Relationships between variables | Pearson/Spearman |
| Seasonality | Time-based patterns | Time series decomposition |
| Flux Analysis | Movement patterns | Descriptive statistics |

---

## Layer 3: Predictive (Recommendations)

### Purpose

**Answer the question**: "What should we do and what will happen?"

This layer uses **advanced algorithms and machine learning** to predict future outcomes and recommend specific actions. It transforms insights into actionable recommendations.

### Key Characteristics

- **Predictive**: Forecasts future states
- **Prescriptive**: Recommends specific actions
- **Algorithmic**: Uses ML/statistical models
- **Action-Oriented**: Outputs are actionable

### Core Components

#### 3.1 Demand Forecasting

**Time Series Forecasting**:
```typescript
type DemandForecastConfig = {
  readonly productId: string
  readonly horizon: number  // Days to forecast
  readonly method: 'arima' | 'exponential_smoothing' | 'prophet' | 'lstm'
  readonly seasonality: boolean
  readonly confidenceLevel: number  // e.g., 0.95 for 95% CI
}

type DemandForecastResult = {
  readonly forecast: readonly {
    readonly date: Date
    readonly predicted: number
    readonly lower: number  // Confidence interval
    readonly upper: number
  }[]
  readonly model: {
    readonly accuracy: number  // MAPE or RMSE
    readonly trend: 'increasing' | 'stable' | 'decreasing'
    readonly seasonality: string
  }
  readonly recommendations: readonly string[]
}
```

**Use Cases**:
- Plan inventory levels
- Schedule staff
- Prepare for peak seasons

#### 3.2 Stock Optimization

**Reorder Point Calculation**:
```typescript
type StockOptimizationConfig = {
  readonly productId: string
  readonly serviceLevel: number  // e.g., 0.95 for 95% service level
  readonly leadTime: number  // Days
  readonly demandVariability: boolean
}

type StockOptimizationResult = {
  readonly currentStock: number
  readonly reorderPoint: number
  readonly economicOrderQuantity: number
  readonly safetyStock: number
  readonly recommendations: readonly {
    readonly action: 'order' | 'hold' | 'reduce'
    readonly quantity: number
    readonly reason: string
    readonly expectedSavings?: number
  }[]
}
```

**Use Cases**:
- Avoid stockouts
- Minimize holding costs
- Optimize order quantities

#### 3.3 Bottleneck Prediction

**Operational Bottleneck Detection**:
```typescript
type BottleneckPredictionConfig = {
  readonly timeHorizon: number  // Days ahead
  readonly includeZones: boolean
  readonly includeOperators: boolean
}

type BottleneckPredictionResult = {
  readonly bottlenecks: readonly {
    readonly type: 'zone' | 'operator' | 'time'
    readonly entityId: string
    readonly entityName: string
    readonly severity: 'high' | 'medium' | 'low'
    readonly predictedTime: Date
    readonly confidence: number
    readonly causes: readonly string[]
  }[]
  readonly recommendations: readonly {
    readonly priority: number
    readonly action: string
    readonly expectedImpact: string
  }[]
}
```

**Use Cases**:
- Proactively allocate resources
- Schedule maintenance
- Avoid operational constraints

#### 3.4 Anomaly Detection with Recommendations

**Anomaly Detection**:
```typescript
type AnomalyDetectionConfig = {
  readonly entityType: 'product' | 'operator' | 'zone'
  readonly method: 'isolation_forest' | 'autoencoder' | 'statistical'
  readonly threshold: number  // Sensitivity
}

type AnomalyDetectionResult = {
  readonly anomalies: readonly {
    readonly entityId: string
    readonly anomalyScore: number
    readonly type: 'spike' | 'drop' | 'pattern_change'
    readonly timestamp: Date
    readonly description: string
  }[]
  readonly recommendations: readonly {
    readonly anomalyId: string
    readonly action: 'investigate' | 'ignore' | 'fix'
    readonly urgency: 'high' | 'medium' | 'low'
    readonly steps: readonly string[]
  }[]
}
```

**Use Cases**:
- Detect theft or fraud
- Identify equipment issues
- Spot process deviations

#### 3.5 Warehouse Optimization

**Layout Recommendations**:
```typescript
type LayoutOptimizationConfig = {
  readonly objective: 'minimize_travel' | 'maximize_throughput' | 'balance_workload'
  readonly constraints: {
    readonly fixedLocations?: readonly string[]  // Can't move
    readonly zoneRestrictions?: Record<string, readonly string[]>  // Product types allowed in zones
  }
}

type LayoutOptimizationResult = {
  readonly currentLayout: Layout
  readonly recommendedLayout: Layout
  readonly improvements: {
    readonly travelDistanceReduction: number  // Percentage
    readonly throughputIncrease: number  // Percentage
    readonly estimatedSavings: number
  }
  readonly changes: readonly {
    readonly productId: string
    readonly from: string
    readonly to: string
    readonly reason: string
  }[]
}
```

**Use Cases**:
- Optimize product placement
- Reduce travel time
- Increase throughput

### Output Types

**Forecasts**:
- Time series predictions with confidence intervals
- Probability distributions
- Scenario analysis

**Recommendations**:
- Specific actions (order X units, move product Y)
- Prioritized lists
- Expected outcomes
- Risk assessments

**Alerts**:
- Early warning system
- Severity indicators
- Suggested responses

### Example Analyses

| Analysis Name | Description | Algorithm |
|--------------|-------------|-----------|
| Demand Forecasting | Predict future demand | ARIMA, Prophet, LSTM |
| Stock Optimization | Optimal inventory levels | EOQ, Newsvendor |
| Bottleneck Prediction | Predict operational constraints | Queueing theory, ML |
| Anomaly Detection | Detect unusual patterns | Isolation Forest, Autoencoders |
| Layout Optimization | Recommend warehouse layout | Optimization algorithms |

---

## Layer Interactions

### Dependency Flow

```
Raw Data
  → Layer 1 (Modeling)
      → Produces representations
      → Layer 2 (Analytics)
          → Produces insights
          → Layer 3 (Predictive)
              → Produces recommendations
```

### Example: Complete Analysis Flow

**Scenario**: Optimize slow-moving products

**Layer 1 - Modeling**:
```
1. Product "PROD-001" detail view
2. Movement timeline (last 90 days)
3. Current stock: 500 units
4. Last movement: 45 days ago
```

**Layer 2 - Analytics**:
```
1. XYZ Analysis: Class Z (high variability, low volume)
2. ABC Analysis: Class C (low value contribution)
3. Aging analysis: Products not moved in >30 days
4. Insight: PROD-001 is obsolete or overstocked
```

**Layer 3 - Predictive**:
```
1. Demand forecast: <5 units/month expected
2. Stock optimization: Reduce stock to 50 units
3. Recommendation: Liquidate 450 units, save $2,340 in holding costs
4. Action: Create clearance promotion
```

### Cross-Layer Navigation

**From Model to Analytics**:
```
User clicks on product in Layer 1 (Modeling)
  → "Run ABC Analysis" button
  → Opens Layer 2 (Analytics) with product pre-selected
  → Shows ABC classification for this product
```

**From Analytics to Predictive**:
```
User views ABC analysis in Layer 2 (Analytics)
  → Sees Class C products
  → Clicks "Optimize Stock" button
  → Opens Layer 3 (Predictive) with optimization recommendations
```

## Plugin Architecture for Each Layer

### Layer 1: Modeling Plugins

```typescript
type ModelingPlugin = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly entityType: EntityType
  readonly representation: RepresentationType
  readonly execute: (input: ModelingInput) => Promise<ModelingResult>
}

type RepresentationType =
  | 'timeline'
  | 'heatmap'
  | 'flow_diagram'
  | 'activity_feed'
  | 'summary_stats'
```

### Layer 2: Analytics Plugins

```typescript
type AnalyticsPlugin = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly category: AnalyticsCategory
  readonly requirements: DataRequirements
  readonly execute: (input: AnalyticsInput) => Promise<AnalyticsResult>
}

type AnalyticsCategory =
  | 'classification'
  | 'correlation'
  | 'temporal'
  | 'spatial'
  | 'pattern'
```

### Layer 3: Predictive Plugins

```typescript
type PredictivePlugin = {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly category: PredictiveCategory
  readonly requirements: DataRequirements
  readonly execute: (input: PredictiveInput) => Promise<PredictiveResult>
}

type PredictiveCategory =
  | 'forecasting'
  | 'optimization'
  | 'recommendation'
  | 'anomaly_detection'
```

## Output Differentiation by Layer

### Visual Design

**Layer 1 (Modeling) - Blue Theme**:
- Clean, neutral visualizations
- Emphasis on clarity and accuracy
- Minimal interpretation
- Examples: Simple line charts, basic tables

**Layer 2 (Analytics) - Purple Theme**:
- Rich visualizations with overlays
- Statistical annotations
- Pattern highlighting
- Examples: Scatter plots with trend lines, correlation matrices

**Layer 3 (Predictive) - Amber/Green Theme**:
- Action-oriented design
- Recommendations prominent
- Risk/success indicators
- Examples: Alert banners, suggestion cards, forecast ranges

### User Interaction Patterns

**Layer 1**:
- Click to view more details
- Filter and sort
- Export raw data

**Layer 2**:
- Click data points to drill down
- Adjust analysis parameters
- Compare across segments
- Share insights

**Layer 3**:
- Accept/reject recommendations
- Adjust forecast parameters
- Explore scenarios
- Implement actions

## Implementation Considerations

### Data Requirements by Layer

**Layer 1**: Raw data sufficient
- No preprocessing required
- Real-time capable

**Layer 2**: Cleaned and normalized data
- Data quality critical
- Historical data needed (typically 3-6 months minimum)

**Layer 3**: Large historical datasets
- 12+ months preferred for training
- Feature engineering required
- Model retraining needed periodically

### Performance Considerations

**Layer 1**: Sub-second response
- Simple aggregations
- Index-friendly queries

**Layer 2**: 1-5 seconds
- Statistical computations
- Correlation calculations

**Layer 3**: 5-30 seconds
- Complex model inference
- Optimization algorithms
- Can run in background

### Caching Strategy

**Layer 1**: Aggressive caching
- Cache precomputed aggregations
- Invalidate on data refresh

**Layer 2**: Moderate caching
- Cache analysis results
- Invalidate on parameter changes

**Layer 3**: Selective caching
- Cache model predictions (time-based)
- Invalidate on model retraining

## Future Enhancements

### Layer 1 Enhancements
- Real-time streaming updates
- 3D warehouse visualizations
- Augmented reality views

### Layer 2 Enhancements
- Natural language queries ("Show me products with declining demand")
- Automated insight generation
- Collaborative annotations

### Layer 3 Enhancements
- Reinforcement learning for continuous optimization
- Digital twin simulations
- Prescriptive analytics with decision automation

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft

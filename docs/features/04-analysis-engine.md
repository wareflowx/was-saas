# Analysis Engine Architecture

## Overview

The Analysis Engine is a **pure TypeScript framework** for executing warehouse analyses. It is designed to be:
- **Extensible**: Add new analyses without recompilation
- **Type-safe**: Full TypeScript type checking
- **Performant**: Optimized for large datasets
- **Testable**: Pure functions and type-based architecture

## Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Analysis Engine                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Registry   │  │   Executor   │  │   Validator  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Data Access  │  │  Transform   │  │   Result     │     │
│  │   Layer      │  │   Builder    │  │  Formatter   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Analysis Plugins                        │
├─────────────────────────────────────────────────────────────┤
│  Flux  │  Persons  │  Products  │  Custom (User-defined)   │
└─────────────────────────────────────────────────────────────┘
```

## Core Types

### Analysis Engine Type

```typescript
type AnalysisEngine = {
  // Register a new analysis
  readonly register: (analysis: AnalysisDefinition) => void

  // Unregister an analysis
  readonly unregister: (analysisId: string) => void

  // Execute an analysis
  readonly execute: (
    analysisId: string,
    context: AnalysisContext
  ) => Promise<AnalysisResult>

  // Check if an analysis can execute
  readonly canExecute: (analysisId: string, data: DataSet) => boolean

  // List all available analyses
  readonly listAvailable: (data: DataSet) -> AnalysisDefinition[]

  // List analyses by category
  readonly listByCategory: (category: AnalysisCategory, data: DataSet) => AnalysisDefinition[]

  // Get analysis metadata
  readonly getMetadata: (analysisId: string) => AnalysisDefinition | undefined
}
```

### Analysis Definition Type

```typescript
type AnalysisDefinition = {
  // Identification
  readonly id: string
  readonly name: string
  readonly description: string
  readonly version: string

  // Categorization
  readonly category: AnalysisCategory
  readonly tags: readonly string[]

  // Data requirements
  readonly requirements: {
    readonly tables: readonly string[]
    readonly columns: Record<string, readonly string[]>  // table -> columns
    readonly minRows?: number
    readonly maxRows?: number
    readonly dateRange?: {
      readonly column: string
      readonly minDays?: number
      readonly maxDays?: number
    }
  }

  // Configuration schema
  readonly configSchema: z.ZodType<any>

  // Execution function
  readonly execute: (context: AnalysisContext) => Promise<AnalysisResult>

  // Output
  readonly outputTemplate: ExportTemplate

  // UI hints
  readonly ui: {
    readonly icon: string
    readonly color: string
    readonly defaultConfig?: unknown
    readonly estimatedDuration?: (rows: number) => number
  }

  // Metadata
  readonly author?: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

type AnalysisCategory =
  | 'flux'        // Movement/flow analysis
  | 'personnes'   // People/team analysis
  | 'produits'    // Product/inventory analysis
  | 'commandes'   // Order analysis
  | 'fournisseurs' // Supplier analysis
  | 'custom'      // User-defined analyses
```

### Analysis Context Type

```typescript
type AnalysisContext = {
  // Data source
  readonly data: DataSet

  // Configuration
  readonly config: unknown

  // Execution metadata
  readonly metadata: {
    readonly analysisId: string
    readonly executedAt: Date
    readonly userId?: string
  }

  // Services
  readonly services: {
    readonly query: QueryBuilder
    readonly transform: TransformBuilder
    readonly export: ExportService
    readonly logger: Logger
  }

  // Progress callback
  readonly onProgress?: (progress: number, message: string) => void
}
```

### Data Set Type

```typescript
type DataSet = {
  // Tables available
  readonly tables: {
    readonly [tableName: string]: DataTable
  }

  // Schema information
  readonly schema: DataSchema

  // Metadata
  readonly metadata: {
    readonly importedAt: Date
    readonly sourceTemplate: string
    readonly totalRows: number
  }

  // Query builder
  readonly query: QueryBuilder
}

type DataTable = {
  readonly name: string
  readonly columns: readonly Column[]
  readonly rowCount: number

  // Query interface (functions, not methods)
  readonly findMany: (options?: FindManyOptions) => Promise<any[]>
  readonly findOne: (options: FindOneOptions) => Promise<any | null>
  readonly count: (where?: WhereClause) => Promise<number>
  readonly aggregate: (aggregations: readonly Aggregation[]) => Promise<any[]>
}

type Column = {
  readonly name: string
  readonly type: 'integer' | 'float' | 'text' | 'date' | 'boolean'
  readonly nullable: boolean
  readonly primaryKey?: boolean
  readonly foreignKey?: {
    readonly table: string
    readonly column: string
  }
}
```

### Analysis Result Type

```typescript
type AnalysisResult = {
  // Result metadata
  readonly metadata: {
    readonly analysisId: string
    readonly analysisName: string
    readonly executedAt: Date
    readonly executionTime: number  // milliseconds
    readonly dataVersion: string
  }

  // Result data
  readonly data: unknown

  // Statistics
  readonly stats: {
    readonly rowsAnalyzed: number
    readonly tablesUsed: readonly string[]
    readonly filtersApplied?: readonly Filter[]
  }

  // Visualization hints
  readonly visualization?: {
    readonly type: 'table' | 'chart' | 'heatmap' | 'distribution'
    readonly config: unknown
  }

  // Export template
  readonly exportTemplate: ExportTemplate

  // Quality indicators
  readonly quality?: {
    readonly completeness: number
    readonly confidence: number
    readonly warnings?: readonly string[]
  }
}
```

## File Structure

```
src/analysis/
├── core/
│   ├── engine.ts              # Main orchestration functions
│   ├── registry.ts            # Analysis registration (Record type)
│   ├── executor.ts            # Execution functions
│   ├── validator.ts           # Requirements validation functions
│   └── context.ts             # AnalysisContext builder functions
│
├── data/
│   ├── dataset.ts             # DataSet type
│   ├── query-builder.ts       # QueryBuilder functions
│   ├── transform-builder.ts   # TransformBuilder functions
│   └── aggregations.ts        # Common aggregation functions
│
├── results/
│   ├── result.ts              # AnalysisResult types
│   ├── formatter.ts           # Result formatting functions
│   └── exporter.ts            # Export integration functions
│
├── analyses/
│   ├── flux/
│   │   ├── temporal.ts
│   │   ├── spatial.ts
│   │   └── operational.ts
│   ├── personnes/
│   │   ├── productivity.ts
│   │   ├── teams.ts
│   │   └── performance.ts
│   ├── produits/
│   │   ├── abc.ts
│   │   ├── lifecycle.ts
│   │   └── stock.ts
│   └── commandes/
│       ├── fulfillment.ts
│       └── lead-time.ts
│
├── plugins/
│   ├── loader.ts              # Dynamic plugin loading functions
│   ├── api.ts                 # Plugin API type definitions
│   └── registry.ts            # Plugin registry (Record type)
│
├── types/
│   ├── analysis.ts
│   ├── data.ts
│   └── result.ts
│
└── utils/
    ├── validation.ts
    ├── transformations.ts
    └── statistics.ts
```

## Query Builder Architecture

**Type**: Fluent query builder using pure functions

**Capabilities**:
- Build type-safe queries incrementally
- Chain operations: `from()`, `join()`, `where()`, `groupBy()`, `orderBy()`, `limit()`
- Execute queries: `findMany()`, `findOne()`, `count()`
- Parameterized queries (SQL injection prevention)

**Example Flow**:
1. Start with query builder
2. Chain table selection and joins
3. Add filters and conditions
4. Specify grouping and sorting
5. Execute query
6. Return results

## Transform Builder Architecture

**Type**: Functional data transformation pipeline

**Capabilities**:
- Transform query results step by step
- Operations: `groupBy()`, `aggregate()`, `sort()`, `filter()`, `map()`
- Execute transformation chain: `exec()`
- Pure functional transformations (no mutations)

**Transformation Pipeline**:
1. Start with data array
2. Chain transformations
3. Execute pipeline
4. Return transformed data

## Plugin System

### Plugin Type

```typescript
type AnalysisPlugin = {
  readonly id: string
  readonly name: string
  readonly version: string

  // Analyses provided by this plugin
  readonly analyses: readonly AnalysisDefinition[]

  // Optional lifecycle functions
  readonly init?: (engine: AnalysisEngine) => Promise<void>
  readonly destroy?: () => Promise<void>
}
```

### Plugin Loading

**Loading Process**:
1. Load plugin from file path (dynamic import)
2. Validate plugin structure
3. Register all analyses from plugin
4. Call plugin init function if present
5. Store plugin in registry

**Unloading Process**:
1. Find plugin in registry
2. Call plugin destroy function if present
3. Unregister all analyses from plugin
4. Remove from registry

**Plugin Validation**:
- Verify required fields present (id, name, analyses)
- Validate analyses conform to AnalysisDefinition type
- Check plugin version compatibility

### Custom Plugin Development

Users can create custom analysis plugins by:
1. Creating a TypeScript file that exports AnalysisPlugin type
2. Defining one or more analyses
3. Implementing execute function for each analysis
4. Specifying data requirements
5. Providing export template
6. Dropping plugin file in plugins directory

## Analysis Execution Flow

**Pre-execution**:
1. User selects analysis
2. Engine checks data requirements (tables, columns, row counts)
3. Engine validates configuration
4. User confirms and starts execution

**Execution**:
1. Engine builds analysis context
2. Calls analysis execute function
3. Analysis uses query builder to fetch data
4. Analysis uses transform builder to process data
5. Analysis calculates results
6. Analysis returns AnalysisResult

**Post-execution**:
1. Engine formats results
2. Engine applies export template
3. Engine displays results in UI
4. User can export results

## Result Visualization

**Visualization Types**:
- **table**: Tabular data display
- **chart**: Bar, line, pie charts
- **heatmap**: Color-coded matrix
- **distribution**: Histogram, box plot

**Visualization Config**:
Each analysis specifies recommended visualization type and configuration for its results.

---

**Version**: 1.0.0
**Last Updated**: 2025-01-27
**Status**: Draft - Architecture & Types Only

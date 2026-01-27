# Global Search Architecture

## Overview

Global search provides unified, instant access to all entities across the Wareflow platform. Users can search for products, inventory, movements, suppliers, customers, and orders from a single search interface, with intelligent ranking, filtering, and navigation capabilities.

## Core Capabilities

### Universal Search

Search across all entity types simultaneously:
- Products (SKU, name, description, category)
- Inventory items (location, quantity, status)
- Stock movements (type, references, dates)
- Suppliers and customers (names, codes, contacts)
- Orders (numbers, references, statuses)
- Warehouses and locations
- Transactions and operations

### Intelligent Ranking

Results ranked by relevance considering:
- Text matching quality (exact, partial, fuzzy)
- Entity type priority (configurable per user)
- Recent access frequency
- Business context (current warehouse, active operations)
- Date relevance (recent items prioritized)
- User role and permissions

### Real-Time Indexing

All entities automatically indexed for fast search:
- Immediate index updates on entity changes
- Incremental index updates for performance
- Background indexing for large datasets
- Index synchronization across instances

## Type Definitions

### SearchQuery

```typescript
type SearchQuery = {
  readonly query: string;
  readonly entityTypes: EntityType[];
  readonly filters: SearchFilter[];
  readonly warehouseIds: string[];
  readonly dateRange: DateRange | null;
  readonly limit: number;
  readonly offset: number;
  readonly includeArchived: boolean;
  readonly context: SearchContext;
};
```

### SearchResult

```typescript
type SearchResult = {
  readonly id: string;
  readonly entityType: EntityType;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly relevanceScore: number;
  readonly highlights: TextHighlight[];
  readonly metadata: EntityMetadata;
  readonly url: string;
  readonly lastModified: DateTime;
  readonly warehouseId: string | null;
  readonly status: EntityStatus;
};
```

### SearchIndex

```typescript
type SearchIndex = {
  readonly entityId: string;
  readonly entityType: EntityType;
  readonly indexedFields: IndexedField[];
  readonly tokens: string[];
  readonly metadata: IndexMetadata;
  readonly lastIndexed: DateTime;
  readonly indexVersion: number;
  readonly warehouseId: string | null;
  readonly accessFrequency: number;
  readonly lastAccessed: DateTime;
};
```

### SearchFilter

```typescript
type SearchFilter = {
  readonly field: string;
  readonly operator: FilterOperator;
  readonly value: FilterValue;
  readonly label: string;
  readonly category: FilterCategory;
};
```

### SearchSuggestion

```typescript
type SearchSuggestion = {
  readonly text: string;
  readonly type: SuggestionType;
  readonly entityType: EntityType | null;
  readonly frequency: number;
  readonly lastUsed: DateTime;
  readonly icon: string | null;
};
```

## Supporting Types

```typescript
type EntityType =
  | "product"
  | "inventory"
  | "movement"
  | "supplier"
  | "customer"
  | "order"
  | "warehouse"
  | "location"
  | "transaction";

type DateRange = {
  readonly start: DateTime;
  readonly end: DateTime;
};

type SearchContext = {
  readonly currentWarehouse: string | null;
  readonly activeOperation: string | null;
  readonly userRole: string;
  readonly userId: string;
  readonly session: string;
};

type TextHighlight = {
  readonly field: string;
  readonly text: string;
  readonly offset: number;
  readonly length: number;
};

type EntityMetadata = {
  readonly reference: string | null;
  readonly tags: string[];
  readonly attributes: Record<string, unknown>;
  readonly relationships: EntityRelationship[];
};

type IndexedField = {
  readonly name: string;
  readonly value: string;
  readonly weight: number;
  readonly searchable: boolean;
  readonly filterable: boolean;
};

type IndexMetadata = {
  readonly warehouseId: string | null;
  readonly tenantId: string;
  readonly language: string;
  readonly checksum: string;
};

type FilterOperator =
  | "equals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "greaterThan"
  | "lessThan"
  | "between"
  | "in";

type FilterValue = string | number | boolean | string[] | number[] | null;

type FilterCategory =
  | "entityType"
  | "status"
  | "date"
  | "warehouse"
  | "custom";

type SuggestionType =
  | "query"
  | "entity"
  | "recent"
  | "popular";

type EntityRelationship = {
  readonly type: string;
  readonly id: string;
  readonly label: string;
};
```

## Functional Signatures

### Core Search Functions

```typescript
type SearchFunction = (query: SearchQuery) => Promise<SearchResults>;

type SearchResults = {
  readonly results: SearchResult[];
  readonly total: number;
  readonly groupedResults: GroupedResults;
  readonly facets: SearchResultFacets;
  readonly queryId: string;
  readonly executionTime: number;
};

type GroupedResults = ReadonlyMap<EntityType, SearchResult[]>;

type SearchResultFacets = {
  readonly entityTypes: EntityTypeFacet[];
  readonly warehouses: WarehouseFacet[];
  readonly statuses: StatusFacet[];
  readonly dateRanges: DateRangeFacet[];
};

type EntityTypeFacet = {
  readonly entityType: EntityType;
  readonly count: number;
  readonly label: string;
};

type WarehouseFacet = {
  readonly warehouseId: string;
  readonly count: number;
  readonly label: string;
};

type StatusFacet = {
  readonly status: string;
  readonly count: number;
  readonly entityType: EntityType;
};

type DateRangeFacet = {
  readonly range: DateRange;
  readonly count: number;
  readonly label: string;
};
```

### Index Management Functions

```typescript
type IndexEntityFunction = (
  entityType: EntityType,
  entityId: string,
  data: EntityData
) => Promise<void>;

type UpdateIndexFunction = (
  entityType: EntityType,
  entityId: string,
  changes: EntityChanges
) => Promise<void>;

type RemoveFromIndexFunction = (
  entityType: EntityType,
  entityId: string
) => Promise<void>;

type RebuildIndexFunction = (
  entityType: EntityType,
  options: RebuildOptions
) => Promise<IndexRebuildResult>;

type EntityData = Record<string, unknown>;

type EntityChanges = {
  readonly updated: Record<string, unknown>;
  readonly removed: string[];
};

type RebuildOptions = {
  readonly batchSize: number;
  readonly concurrent: boolean;
  readonly warehouseId: string | null;
};

type IndexRebuildResult = {
  readonly entitiesProcessed: number;
  readonly duration: number;
  readonly indexVersion: number;
};
```

### Suggestion Functions

```typescript
type GetSuggestionsFunction = (
  partialQuery: string,
  context: SearchContext
) => Promise<SearchSuggestion[]>;

type RecordSearchFunction = (
  query: string,
  userId: string,
  results: SearchResult[]
) => Promise<void>;

type GetRecentSearchesFunction = (
  userId: string,
  limit: number
) => Promise<SearchSuggestion[]>;

type GetPopularSearchesFunction = (
  warehouseId: string | null,
  limit: number
) => Promise<SearchSuggestion[]>;
```

### Filter Functions

```typescript
type GetAvailableFiltersFunction = (
  query: SearchQuery
) => Promise<SearchFilter[]>;

type ApplyFilterFunction = (
  query: SearchQuery,
  filter: SearchFilter
) => SearchQuery;

type RemoveFilterFunction = (
  query: SearchQuery,
  filterField: string
) => SearchQuery;

type ClearFiltersFunction = (query: SearchQuery) => SearchQuery;
```

### Navigation Functions

```typescript
type NavigateToResultFunction = (
  result: SearchResult,
  context: NavigationContext
) => NavigationAction;

type GetEntityUrlFunction = (
  entityType: EntityType,
  entityId: string,
  warehouseId: string | null
) => string;

type NavigationContext = {
  readonly newTab: boolean;
  readonly modal: boolean;
  readonly preserveState: boolean;
};

type NavigationAction = {
  readonly type: "navigate" | "modal" | "drawer";
  readonly url: string;
  readonly params: Record<string, unknown>;
};
```

## Architecture Components

### Query Processing

**Query Analysis**
- Tokenization of search terms
- Language detection and stemming
- Spell checking and suggestions
- Query intent detection
- Entity type inference

**Query Expansion**
- Synonym addition
- Abbreviation expansion
- Related term inclusion
- Fuzzy matching generation
- Wildcard expansion

**Query Optimization**
- Query plan generation
- Index selection strategy
- Cache utilization
- Parallel execution planning
- Result size estimation

### Indexing Engine

**Field Extraction**
- Identify searchable fields per entity type
- Extract text content from complex fields
- Handle multilingual content
- Process nested structures
- Generate search tokens

**Token Generation**
- Text normalization (case, accents, punctuation)
- Word segmentation for languages without spaces
- N-gram generation for partial matching
- Phonetic encoding for fuzzy matching
- Shingling for phrase matching

**Weight Calculation**
- Field importance weighting
- TF-IDF scoring
- Boost factors (recent, popular, promoted)
- Business rule adjustments
- User personalization

**Index Storage**
- Inverted index structure
- Document store for metadata
- Facet index for filtering
- Suggestion index for autocomplete
- Cache layers for performance

### Search Execution

**Query Matching**
- Term lookup in inverted index
- Phrase matching with proximity
- Fuzzy matching with edit distance
- Boolean query evaluation
- Filter application

**Result Scoring**
- Relevance score calculation
- Boost application
- Personalization adjustment
- Business rule application
- Tie-breaking logic

**Result Processing**
- Highlight generation
- Snippet extraction
- Facet calculation
- Grouping and sorting
- Pagination

### Suggestion Engine

**Autocomplete**
- Prefix-based suggestions
- Popular query completion
- Entity name suggestions
- Recent search completion
- Context-aware ranking

**Recent Searches**
- User search history tracking
- Deduplication and expiration
- Frequency-based promotion
- Context-aware filtering
- Privacy controls

**Popular Searches**
- Aggregate search statistics
- Trend detection
- Seasonal adjustments
- Warehouse-specific popularity
- Time-based decay

### Caching Strategy

**Query Cache**
- Cache frequent queries
- TTL-based expiration
- Invalidation on index updates
- Cache size management
- Hit rate optimization

**Result Cache**
- Cache paginated results
- Session-based caching
- Prefetching for navigation
- Cache warming strategies
- Distributed cache synchronization

**Index Cache**
- Hot index segments in memory
- Compression for cold segments
- Cache warming on startup
- Memory pressure management
- Eviction policies

## Product Requirements

### User Interface Requirements

**Search Input**
- Always-accessible search bar (keyboard shortcut: Cmd/Ctrl + K)
- Autocomplete dropdown with suggestions
- Query history access (down arrow)
- Clear button
- Advanced search toggle

**Search Results**
- Grouped by entity type with collapsible sections
- Relevance badges
- Highlighted matching text
- Entity type icons
- Quick preview on hover
- Keyboard navigation

**Filters**
- Facet sidebar with counts
- Multi-select for entity types
- Date range picker
- Warehouse selector
- Custom filter builder
- Active filter chips with remove

**Quick Actions**
- Open result in new tab
- Copy reference
- Add to favorites
- Share result
- View related entities

### Performance Requirements

**Response Times**
- Search results: < 200ms (p95)
- Autocomplete suggestions: < 100ms (p95)
- Index updates: < 1s after entity change
- Filter application: < 50ms
- Pagination navigation: < 100ms

**Scalability**
- Support 10M+ indexed entities
- Handle 1000+ concurrent searches
- Sub-second reindexing for single entity
- Efficient memory usage per search
- Linear performance scaling

**Indexing Performance**
- Real-time indexing for CRUD operations
- Bulk indexing: 10K entities/minute
- Incremental updates without full rebuild
- Background index optimization
- Minimal impact on write performance

### Search Quality Requirements

**Relevance**
- Exact matches appear first
- Partial matches ranked by similarity
- Recent entities weighted appropriately
- User context considered
- Business rules applied

**Completeness**
- All searchable entities indexed
- All relevant fields searchable
- No stale results
- Consistent across warehouses
- Accurate facet counts

**Functionality**
- Fuzzy matching for typos
- Phrase search with quotes
- Boolean operators (AND, OR, NOT)
- Wildcard search (*, ?)
- Field-specific search

### Security Requirements

**Access Control**
- Results filtered by user permissions
- Warehouse-level access control
- Tenant isolation
- Audit logging for searches
- PII protection in results

**Privacy**
- Search history privacy options
- No logging of sensitive queries
- Data retention policies
- Right to deletion (GDPR)
- Anonymous search aggregation

### Configuration Requirements

**Per-User Settings**
- Default entity types
- Preferred sort order
- Results per page
- Search history enabled/disabled
- Keyboard shortcuts

**Per-Tenant Settings**
- Enabled entity types
- Search result weights
- Custom filters
- Indexing schedules
- Feature flags

**Per-Warehouse Settings**
- Default warehouse filter
- Warehouse-specific boosting
- Local search priority
- Facet configuration

## Integration Points

### Entity Sources

**Product Service**
- Product catalog entities
- Category hierarchy
- Attribute values
- Variant information

**Inventory Service**
- Inventory items
- Stock levels
- Location assignments
- Status information

**Movement Service**
- Stock movements
- Transfer orders
- Transaction history
- References and documents

**Supplier Service**
- Supplier records
- Contact information
- Product associations
- Performance metrics

**Customer Service**
- Customer records
- Orders and history
- Contact information
- Account status

**Order Service**
- Order headers and lines
- Status and workflow
- References and documents
- Related entities

### External Services

**Analytics Service**
- Search usage tracking
- Popular search detection
- User behavior analysis
- Performance monitoring

**Notification Service**
- Search result alerts
- Entity change notifications
- Scheduled search updates

**Audit Service**
- Search query logging
- Result access tracking
- Filter application history
- User interaction analytics

## Monitoring and Observability

### Metrics

**Search Metrics**
- Query volume and rate
- Average result count
- Zero-result rate
- Click-through rate
- Time-to-result-click

**Performance Metrics**
- Query execution time
- Index update latency
- Cache hit rates
- Memory usage
- CPU utilization

**Quality Metrics**
- Relevance scores distribution
- Result position clicks
- Query refinement rate
- Filter usage
- Search abandonment rate

### Logging

**Query Logs**
- Full query text (with PII redaction)
- User and session context
- Applied filters
- Result counts
- Execution time

**Result Logs**
- Result IDs and types
- Relevance scores
- User interactions
- Navigation actions
- Feedback signals

**System Logs**
- Index updates
- Cache operations
- Error conditions
- Performance warnings
- Health checks

### Alerts

**Performance Alerts**
- Slow query detection (> 1s)
- High cache miss rate
- Memory pressure
- Index update delays
- Search failures

**Quality Alerts**
- High zero-result rate
- Low click-through rate
- Result staleness detected
- Index corruption
- Relevance degradation

## Future Enhancements

### Advanced Features

**Natural Language Search**
- Natural language query parsing
- Intent recognition
- Entity extraction
- Relationship queries
- Complex condition handling

**Semantic Search**
- Vector embeddings for semantic similarity
- Machine learning relevance models
- User behavior personalization
- Contextual result ranking
- Query understanding

**Visual Search**
- Image-based product search
- Barcode scanning integration
- Photo recognition
- Color and pattern matching
- Visual similarity

**Collaborative Search**
- Shared saved searches
- Team search templates
- Collaborative filters
- Search result annotations
- Collective intelligence

**Predictive Search**
- Query prediction and autocompletion
- Proactive result suggestions
- Anticipatory navigation
- Context-aware recommendations
- Task-based search assistance

### Platform Expansion

**Mobile Search**
- Voice search integration
- Camera-based search
- Location-aware results
- Gesture-based filtering
- Offline search capability

**API Access**
- RESTful search API
- GraphQL search queries
- Webhook notifications
- Bulk search operations
- Third-party integrations

**Enterprise Features**
- Advanced analytics and reporting
- Custom relevance models
- Dedicated search infrastructure
- SLA guarantees
- Premium support options

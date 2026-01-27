# Import Plugin Examples - Real World Scenarios

## Overview

This document provides architectural examples of import plugins for different WMS systems, showing how they transform WMS-specific data into the normalized Wareflow format.

## Type Definitions

```typescript
type ImportPlugin = {
  id: string;
  name: string;
  version: string;
  wmsSystem: string;
  supportedFormats: string[];
  inputSchema: {
    files: Array<{
      name: string;
      required: boolean;
      description: string;
      columns?: Array<{
        name: string;
        type: string;
        required: boolean;
      }>;
    }>;
  };
  transform?: (input: WMSInputData, context: TransformContext) => Promise<WareflowData>;
  validate?: (input: WMSInputData) => ValidationResult[];
};

type WMSInputData = {
  files: Record<string, any>;
};

type TransformContext = {
  config: {
    warehouseId: string;
  };
  batchId: string;
};

type WareflowData = {
  metadata: {
    importDate: Date;
    pluginId: string;
    pluginVersion?: string;
    wmsSystem: string;
    warehouseId: string;
  };
  products: Product[];
  locations: Location[];
  users: User[];
  orders: Order[];
  pickingLines: PickingLine[];
  replenishments: Replenishment[];
  receipts: Receipt[];
  returns: Return[];
  inventoryAdjustments: InventoryAdjustment[];
};

type ValidationResult = {
  file: string;
  error: string;
  suggestion: string;
};

type OrderType = 'sales-order' | 'transfer-order' | 'return-order' | 'purchase-order';

type OrderPriority = 'critical' | 'high' | 'medium' | 'low';

type LocationUsage = 'picking' | 'reserve' | 'shipping' | 'receiving' | 'staging';

type OrderStatus = 'confirmed' | 'completed' | 'cancelled' | 'pending';

type PickingStatus = 'confirmed' | 'short' | 'pending' | 'not-started';

type AllocationStatus = 'allocated' | 'not-allocated' | 'partially-allocated';

type ReplenishmentType = 'dynamic' | 'manual' | 'planned';

type InventoryAdjustmentType = 'correction' | 'cycle-count' | 'physical-count' | 'return';

type ReceiptType = 'purchase' | 'transfer' | 'return';

type QualityStatus = 'approved' | 'rejected' | 'quarantine';

type LocationType = 'racked' | 'floor' | 'dock' | 'staging';

type LocationOccupancy = 'empty' | 'partial' | 'full';
```

## Example 1: Movement-Based WMS Architecture

### Scenario
A legacy WMS where **everything is a movement**. The system doesn't have explicit "picking lines" or "replenishments" - just movement records with different types.

### WMS Export Structure
The system exports two files:
- **Movements sheet**: Contains all warehouse movements with types (PICK, PUTAWAY, REPL, RECEIPT, ADJUST)
- **Orders sheet**: Minimal order headers (optional)

### Plugin Architecture
The plugin must:
1. Transform movements by type into appropriate Wareflow entities
2. Handle order creation when orders are available
3. Extract master data (products, locations, users) from movements

### Entity Transformation Logic
- **PICK movements** → Picking lines with auto-generated orders
- **REPL movements** → Replenishments with dynamic type
- **PUTAWAY/RECEIPT movements** → Receipts with purchase type
- **ADJUST movements** → Inventory adjustments with correction type

### Key Architectural Considerations
- Movement types determine entity creation
- Location codes need parsing for zone/aisle/bay/level structure
- User IDs are captured but may need role mapping
- Timestamps serve as all relevant dates when specific dates aren't available

## Example 2: Order-Based WMS Architecture

### Scenario
A modern WMS with explicit order headers and lines, plus movement tracking. The system maintains separation between order management and operational events.

### WMS Export Structure
The system exports three files:
- **ORDERS table**: Order headers with customer and date information
- **ORDER_LINES table**: Order line items with allocation details
- **PICK_EVENTS table**: Timestamped events for picking operations

### Plugin Architecture
The plugin must:
1. Transform order headers into Wareflow orders
2. Transform order lines into picking lines with quantities
3. Merge pick events to determine timing and completion status
4. Handle partial picks and short shipments

### Entity Transformation Logic
- **Order headers** → Wareflow orders with priority and promise dates
- **Order lines** → Picking lines with ordered/allocated/picked quantities
- **Pick events** → Timing information and completion status
- **Short events** → Short quantity tracking

### Key Architectural Considerations
- Event timestamps provide accurate timing data
- Quantity mapping between ordered, allocated, and picked quantities
- Priority mapping from WMS-specific values to standard priorities
- Event sequence determines actual picking duration and status

## Example 3: Custom Plugin Development Workflow

### Scenario
A homegrown WMS with a completely custom JSON format. This demonstrates the development workflow for creating a new plugin.

### Plugin Development Process
1. **Analyze the Export**: Understand the JSON structure and identify key entities
2. **Define Input Schema**: Specify required files and data structure validation
3. **Implement Validation**: Ensure required data exists and is properly formatted
4. **Create Transform Logic**: Map custom format to Wareflow entities
5. **Test and Validate**: Verify all transformations work correctly

### Custom JSON Plugin Architecture
The plugin must handle:
- JSON file parsing instead of tabular data
- Nested structure with operations array
- Custom field names and data types
- Date/time parsing from string formats
- Location code extraction and normalization

### Key Architectural Considerations
- JSON structure requires different validation approach
- Custom field mapping needs to be flexible
- Date/time parsing requires custom handlers
- Nested operations need grouping and relationship mapping
- Shift information may need to be preserved in metadata

## Plugin Testing Architecture

### Validation Checklist
Before deploying a plugin, verify:

- **Data Integrity**: All required fields are properly mapped
- **Identity Preservation**: External IDs are maintained for traceability
- **Temporal Accuracy**: Dates and times are correctly parsed and preserved
- **Quantitative Accuracy**: All quantities are transformed correctly
- **User Management**: User IDs and roles are properly captured
- **Spatial Structure**: Locations are properly structured and hierarchically correct
- **Status Logic**: Status transitions follow business rules
- **Metadata Preservation**: Original source data is retained for audit purposes
- **Error Handling**: Edge cases (missing data, null values) are handled gracefully
- **Performance**: Large datasets are processed within acceptable timeframes

### Testing Architecture
The testing framework should verify:
- Transformation accuracy for all supported entity types
- Data validation against defined schemas
- Performance under various load conditions
- Error handling for malformed input data
- Consistency across multiple import runs

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Status**: Draft

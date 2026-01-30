# Implement Backend Import System with SQLite and Plugin Architecture

## Current State

The application currently has:
- Complete React frontend with routing (TanStack Router)
- UI components (shadcn/ui, Tailwind CSS)
- Onboarding pages (welcome, warehouse, import UI stub)
- TypeScript entity types defined in `src/types/entities.ts`
- Comprehensive documentation of the architecture

What's missing:
- **No backend implementation**
- **No database**
- **No import plugin system**
- Import data is mocked/demo only

## Problem

We need to implement a complete backend system to:
1. Import Excel files from various WMS (Warehouse Management Systems)
2. Transform WMS-specific data into a normalized format via plugins
3. Store data in a local SQLite database
4. Query data for analysis and visualization

The system must be:
- **100% local** - All data stored on user's machine, no cloud
- **Plugin-based** - Each WMS has its own transformation plugin
- **Functional** - Pure functions and types only, no OOP/classes/interfaces

## Requirements

### 1. Database Schema

**Global tables approach** with warehouse_id as explicit filter (not automatic, not prefixed):

```sql
-- =====================================================
-- WAREHOUSE STRUCTURE
-- =====================================================

-- Warehouses (Main entity)
CREATE TABLE warehouses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  surface REAL,                    -- square meters
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  zone_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  manager TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL,            -- 'active', 'inactive', 'maintenance'
  opening_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Zones (Hierarchical: belongs to warehouse)
CREATE TABLE zones (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'storage', 'receiving', 'shipping', 'picking', 'packing', 'cold_storage', 'hazardous'
  surface REAL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  sector_count INTEGER DEFAULT 0,
  location_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  temperature_min REAL,
  temperature_max REAL,
  status TEXT NOT NULL,            -- 'active', 'inactive', 'maintenance', 'full'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Sectors (Hierarchical: belongs to zone -> warehouse)
CREATE TABLE sectors (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'rack', 'shelf', 'floor', 'bin', 'mezzanine'
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  location_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  aisle TEXT,
  level INTEGER,
  position TEXT,
  status TEXT NOT NULL,            -- 'active', 'inactive', 'maintenance', 'full'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);

-- Locations (Hierarchical: belongs to sector -> zone -> warehouse)
CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  sector_id TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'rack', 'shelf', 'floor', 'bin', 'pallet'
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  aisle TEXT,
  level INTEGER,
  position TEXT,
  barcode TEXT,
  status TEXT NOT NULL,            -- 'available', 'occupied', 'blocked', 'reserved', 'full'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE,
  FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE
);

-- =====================================================
-- PRODUCTS & INVENTORY
-- =====================================================

-- Products (Catalog - global across all warehouses)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  unit TEXT NOT NULL,
  weight REAL,                     -- kg
  volume REAL,                     -- cubic meters
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  reorder_point INTEGER,
  reorder_quantity INTEGER,
  cost_price REAL,
  selling_price REAL,
  supplier TEXT,
  status TEXT NOT NULL,            -- 'in_stock', 'low_stock', 'out_of_stock', 'discontinued'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Inventory (Stock levels by product and location - CRITICAL TABLE)
CREATE TABLE inventory (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT,                -- NULL = unknown location
  quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,  -- quantity - reserved_quantity
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  last_received_at TEXT,
  last_shipped_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  UNIQUE(warehouse_id, product_id, location_id)
);

-- =====================================================
-- ORDERS (Sales orders)
-- =====================================================

-- Orders
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  order_date TEXT NOT NULL,
  required_date TEXT NOT NULL,
  promised_date TEXT,
  shipped_date TEXT,
  delivered_date TEXT,
  status TEXT NOT NULL,            -- 'pending', 'confirmed', 'picking', 'picked', 'packing', 'packed', 'shipped', 'delivered', 'cancelled'
  priority TEXT NOT NULL,          -- 'low', 'medium', 'high', 'urgent'
  total_quantity INTEGER DEFAULT 0,
  total_amount REAL DEFAULT 0,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  tracking_number TEXT,
  carrier TEXT,
  notes TEXT,
  picker TEXT,
  packer TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Order Lines
CREATE TABLE order_lines (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  picked_quantity INTEGER DEFAULT 0,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- PICKING OPERATIONS
-- =====================================================

-- Pickings (Picking operations linked to orders)
CREATE TABLE pickings (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  order_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  picking_number TEXT NOT NULL,
  assigned_date TEXT NOT NULL,
  started_date TEXT,
  completed_date TEXT,
  status TEXT NOT NULL,            -- 'pending', 'in_progress', 'completed', 'partial', 'cancelled'
  priority TEXT NOT NULL,          -- 'low', 'medium', 'high', 'urgent'
  total_quantity INTEGER DEFAULT 0,
  picked_quantity INTEGER DEFAULT 0,
  remaining_quantity INTEGER DEFAULT 0,
  picker TEXT,
  picker_id TEXT,
  equipment TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Picking Lines
CREATE TABLE picking_lines (
  id TEXT PRIMARY KEY,
  picking_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  location_code TEXT NOT NULL,
  zone_name TEXT,
  quantity INTEGER NOT NULL,
  picked_quantity INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,            -- 'pending', 'picked', 'partial'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (picking_id) REFERENCES pickings(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RECEIPTS (Supplier receipts)
-- =====================================================

-- Receptions
CREATE TABLE receptions (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  reception_number TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  purchase_order_number TEXT,
  expected_date TEXT NOT NULL,
  received_date TEXT,
  status TEXT NOT NULL,            -- 'pending', 'in_progress', 'completed', 'partial', 'cancelled'
  priority TEXT NOT NULL,          -- 'low', 'medium', 'high', 'urgent'
  total_quantity INTEGER DEFAULT 0,
  received_quantity INTEGER DEFAULT 0,
  rejected_quantity INTEGER DEFAULT 0,
  total_amount REAL DEFAULT 0,
  carrier TEXT,
  tracking_number TEXT,
  dock_door TEXT,
  receiver TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Reception Lines
CREATE TABLE reception_lines (
  id TEXT PRIMARY KEY,
  reception_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  ordered_quantity INTEGER NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  rejected_quantity INTEGER DEFAULT 0,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reception_id) REFERENCES receptions(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RESTOCKING (Replenishment)
-- =====================================================

-- Restockings
CREATE TABLE restockings (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  restocking_number TEXT NOT NULL,
  status TEXT NOT NULL,            -- 'pending', 'in_progress', 'completed', 'cancelled'
  priority TEXT NOT NULL,          -- 'low', 'medium', 'high', 'urgent'
  total_products INTEGER DEFAULT 0,
  restocked_products INTEGER DEFAULT 0,
  requester TEXT NOT NULL,
  assigned_to TEXT,
  requested_date TEXT NOT NULL,
  started_date TEXT,
  completed_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Restocking Lines
CREATE TABLE restocking_lines (
  id TEXT PRIMARY KEY,
  restocking_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  current_quantity INTEGER NOT NULL,
  target_quantity INTEGER NOT NULL,
  quantity_to_restock INTEGER NOT NULL,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,            -- 'pending', 'in_progress', 'completed'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (restocking_id) REFERENCES restockings(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RETURNS
-- =====================================================

-- Returns
CREATE TABLE returns (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT,
  order_number TEXT,
  return_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  return_date TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'customer', 'supplier', 'damage', 'defective', 'expired'
  status TEXT NOT NULL,            -- 'pending', 'in_progress', 'completed', 'received', 'inspecting', 'approved', 'rejected', 'refunded', 'restocked', 'disposed'
  priority TEXT NOT NULL,          -- 'low', 'medium', 'high', 'urgent'
  reason TEXT NOT NULL,            -- 'damaged', 'defective', 'product_defective', 'wrong_item', 'not_as_described', 'no_longer_needed', 'expired', 'quality_issue', 'other'
  reason_label TEXT NOT NULL,
  total_quantity INTEGER DEFAULT 0,
  total_amount REAL DEFAULT 0,
  refunded_amount REAL DEFAULT 0,
  processor TEXT,
  completed_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Return Lines
CREATE TABLE return_lines (
  id TEXT PRIMARY KEY,
  return_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  condition TEXT NOT NULL,         -- 'new', 'good', 'fair', 'poor', 'damaged'
  resolution TEXT NOT NULL,        -- 'refund', 'exchange', 'repair', 'dispose'
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- MOVEMENTS (Historical stock movements)
-- =====================================================

-- Movements (All inventory movements - inbound, outbound, transfers, adjustments)
CREATE TABLE movements (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'inbound', 'outbound', 'transfer', 'adjustment'
  source_location_id TEXT,
  source_zone TEXT,
  source_location_code TEXT,
  destination_location_id TEXT,
  destination_zone TEXT,
  destination_location_code TEXT,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  movement_date TEXT NOT NULL,
  user TEXT,
  reason TEXT,
  lot TEXT,
  expiration_date TEXT,
  reference_type TEXT,             -- 'order', 'reception', 'picking', 'restocking', 'return', 'adjustment'
  reference_id TEXT,               -- ID of the related document
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (source_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (destination_location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =====================================================
-- USERS (Warehouse operators)
-- =====================================================

-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL,              -- 'admin', 'manager', 'picker', 'packer', 'receiver', 'operator'
  status TEXT NOT NULL,            -- 'active', 'inactive'
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- =====================================================
-- IMPORT HISTORY
-- =====================================================

-- Import History
CREATE TABLE import_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_version TEXT NOT NULL,
  imported_at TEXT NOT NULL DEFAULT (datetime('now')),
  rows_processed INTEGER NOT NULL,
  status TEXT NOT NULL,            -- 'success', 'partial', 'failed'
  file_name TEXT,
  file_size INTEGER,
  duration_ms INTEGER,
  error_message TEXT,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES (Performance critical)
-- =====================================================

-- Warehouse indexes
CREATE INDEX idx_zones_warehouse ON zones(warehouse_id);
CREATE INDEX idx_sectors_warehouse ON sectors(warehouse_id);
CREATE INDEX idx_sectors_zone ON sectors(zone_id);
CREATE INDEX idx_locations_warehouse ON locations(warehouse_id);
CREATE INDEX idx_locations_zone ON locations(zone_id);
CREATE INDEX idx_locations_sector ON locations(sector_id);

-- Product & Inventory indexes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_inventory_warehouse_product ON inventory(warehouse_id, product_id);

-- Order indexes
CREATE INDEX idx_orders_warehouse ON orders(warehouse_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_lines_order ON order_lines(order_id);
CREATE INDEX idx_order_lines_product ON order_lines(product_id);

-- Picking indexes
CREATE INDEX idx_pickings_warehouse ON pickings(warehouse_id);
CREATE INDEX idx_pickings_status ON pickings(status);
CREATE INDEX idx_pickings_order ON pickings(order_id);
CREATE INDEX idx_picking_lines_picking ON picking_lines(picking_id);

-- Reception indexes
CREATE INDEX idx_receptions_warehouse ON receptions(warehouse_id);
CREATE INDEX idx_receptions_status ON receptions(status);
CREATE INDEX idx_reception_lines_reception ON reception_lines(reception_id);

-- Restocking indexes
CREATE INDEX idx_restockings_warehouse ON restockings(warehouse_id);
CREATE INDEX idx_restockings_status ON restockings(status);
CREATE INDEX idx_restocking_lines_restocking ON restocking_lines(restocking_id);

-- Return indexes
CREATE INDEX idx_returns_warehouse ON returns(warehouse_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_return_lines_return ON return_lines(return_id);

-- Movement indexes (CRITICAL for analytics)
CREATE INDEX idx_movements_warehouse ON movements(warehouse_id);
CREATE INDEX idx_movements_product ON movements(product_id);
CREATE INDEX idx_movements_date ON movements(movement_date);
CREATE INDEX idx_movements_type ON movements(type);
CREATE INDEX idx_movements_warehouse_product ON movements(warehouse_id, product_id);
CREATE INDEX idx_movements_warehouse_date ON movements(warehouse_id, movement_date);

-- User indexes
CREATE INDEX idx_users_warehouse ON users(warehouse_id);
CREATE INDEX idx_users_username ON users(username);

-- Import history indexes
CREATE INDEX idx_import_history_warehouse ON import_history(warehouse_id);
CREATE INDEX idx_import_history_date ON import_history(imported_at);
```

**Critical constraint**: NO automatic warehouse_id filtering. All queries must explicitly filter by warehouse_id passed as parameter. This design supports multiple warehouses in a single database while maintaining data isolation through explicit filtering.

### 2. Plugin System Architecture

**All plugins must produce the same normalized output schema** matching the database structure:

```typescript
// Input: WMS-specific Excel data
type WMSInputData = {
  readonly sheets: Record<string, WMSSheet>
  readonly metadata: {
    readonly filename: string
    readonly fileSize: number
  }
}

// Output: Normalized format (SAME for all plugins)
type NormalizedData = {
  readonly metadata: {
    readonly warehouseId: string
    readonly importDate: Date
    readonly pluginId: string
    readonly pluginVersion: string
  }

  // Core entities (required)
  readonly products: readonly Product[]
  readonly inventory: readonly Inventory[]
  readonly movements: readonly Movement[]

  // Location hierarchy (optional, depends on WMS)
  readonly warehouses?: readonly Warehouse[]
  readonly zones?: readonly Zone[]
  readonly sectors?: readonly Sector[]
  readonly locations?: readonly Location[]

  // Operations (optional, depends on WMS capabilities)
  readonly orders?: readonly Order[]
  readonly orderLines?: readonly OrderLine[]
  readonly pickings?: readonly Picking[]
  readonly pickingLines?: readonly PickingLine[]
  readonly receptions?: readonly Reception[]
  readonly receptionLines?: readonly ReceptionLine[]
  readonly restockings?: readonly Restocking[]
  readonly restockingLines?: readonly RestockingLine[]
  readonly returns?: readonly Return[]
  readonly returnLines?: readonly ReturnLine[]
  readonly users?: readonly User[]
}

// Plugin definition (type, not interface)
type ImportPlugin = {
  readonly id: string
  readonly name: string
  readonly version: string
  readonly wmsSystem: string
  readonly supportedFormats: readonly ('xlsx' | 'xls' | 'csv')[]
  readonly inputSchema: WMSInputSchema
  readonly validate: (input: WMSInputData) => readonly ValidationError[]
  readonly transform: (input: WMSInputData) => NormalizedData
}
```

**Plugin registry** using Record type (not classes):

```typescript
type PluginRegistry = Record<string, ImportPlugin>

const registry: PluginRegistry = {
  'generic-excel': genericExcelPlugin,
  'solochain': solochainPlugin,
  'sap-ewm': sapEwmPlugin
  // ... more plugins
}
```

**Functions only** (no methods):

```typescript
const getPlugin = (registry: PluginRegistry, pluginId: string): ImportPlugin | undefined => {
  return registry[pluginId]
}

const listPlugins = (registry: PluginRegistry): readonly ImportPlugin[] => {
  return Object.values(registry)
}
```

### 3. Import Workflow

1. **User selects plugin manually** (NO auto-detection)
   - Dropdown shows available plugins
   - Each plugin documents expected Excel format

2. **User uploads Excel file**
   - Drag & drop or file browser
   - File stored locally (not sent to server)

3. **Validation**
   - Check file format (.xlsx, .xls)
   - Validate required sheets exist
   - Validate required columns present
   - Return actionable errors/warnings

4. **Preview (optional)**
   - Show first N rows of transformed data
   - Show column mapping preview

5. **Select warehouse**
   - Choose existing warehouse or create new
   - Warehouse ID stored with all data

6. **Execute import**
   - Parse Excel using `xlsx` library
   - Transform via selected plugin
   - Batch insert to SQLite
   - Show progress

7. **Summary**
   - Show rows imported
   - Show warnings/errors
   - Navigate to dashboard

### 4. Functional Programming Constraints

**Strict requirements**:
- ✅ Use type aliases (`type`, not `interface`)
- ✅ Use pure functions
- ✅ Use `readonly` properties for immutability
- ✅ Use Record types for collections
- ❌ NO classes
- ❌ NO interfaces
- ❌ NO methods
- ❌ NO mutable state in functions

**Examples**:

```typescript
// ✅ GOOD - Type alias
type Product = {
  readonly no_produit: number
  readonly nom_produit: string
}

// ✅ GOOD - Pure function
const transformProduct = (row: unknown): Product => ({
  no_produit: Number((row as Record<string, unknown>).ProductID),
  nom_produit: String((row as Record<string, unknown>).ProductName)
})

// ❌ BAD - Interface
interface Product {
  no_produit: number
  nom_produit: string
}

// ❌ BAD - Class
class ProductTransformer {
  transform(row: unknown): Product { }
}

// ❌ BAD - Method
const transformer = {
  transform: (row: unknown) => { }
}
```

### 5. Directory Structure to Create

```
src/
├── backend/
│   ├── database/
│   │   ├── index.ts              # Connection, initialization
│   │   ├── schema.ts             # SQL schema constant
│   │   ├── migrations.ts         # Migration functions
│   │   └── queries.ts            # Query functions (with explicit filters)
│   │
│   ├── import/
│   │   ├── types.ts              # Core types
│   │   ├── normalized-schema.ts  # Output format definition
│   │   ├── parser.ts             # Excel parsing (xlsx library)
│   │   ├── validator.ts          # Validation functions
│   │   ├── transformer.ts        # Transformation pipeline
│   │   └── loader.ts             # Database loader (batch inserts)
│   │
│   ├── plugins/
│   │   ├── registry.ts           # Plugin registry (Record type)
│   │   ├── generic-excel/
│   │   │   └── index.ts          # Generic Excel plugin
│   │   └── solochain/
│   │       └── index.ts          # Solochain WMS plugin
│   │
│   └── services/
│       ├── import-service.ts     # IPC handlers for import
│       ├── database-service.ts   # IPC handlers for database queries
│       └── plugin-service.ts     # IPC handlers for plugin management
│
├── preload/
│   └── index.ts                  # IPC bridge (expose API to renderer)
│
└── electron/
    └── main.mjs                  # Add IPC handlers
```

### 6. IPC Communication

**Preload script** exposes functions to renderer:

```typescript
// src/preload/index.ts
const electronAPI = {
  // Plugins
  listPlugins: () => ipcRenderer.invoke('plugins:list'),

  // Import
  validateFile: (filePath: string, pluginId: string) =>
    ipcRenderer.invoke('import:validate', filePath, pluginId),

  executeImport: (filePath: string, warehouseId: string, pluginId: string) =>
    ipcRenderer.invoke('import:execute', filePath, warehouseId, pluginId),

  // Database (with explicit filters)
  getInventory: (filters: { warehouseId: string }) =>
    ipcRenderer.invoke('db:get-inventory', filters),

  getProducts: (filters: { warehouseId: string }) =>
    ipcRenderer.invoke('db:get-products', filters),

  getMovements: (filters: { warehouseId: string; dateFrom?: string; dateTo?: string }) =>
    ipcRenderer.invoke('db:get-movements', filters),

  getOrders: (filters: { warehouseId: string; status?: string }) =>
    ipcRenderer.invoke('db:get-orders', filters)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
```

**Main process** IPC handlers (in `electron/main.mjs`):

```javascript
import { ipcMain } from 'electron'
import { executeImport } from './backend/import/engine'
import { queryProducts, queryMovements } from './backend/database/queries'
import { listPlugins } from './backend/plugins/registry'

ipcMain.handle('plugins:list', () => listPlugins())

ipcMain.handle('import:validate', async (event, filePath, pluginId) => {
  // Validate file with selected plugin
})

ipcMain.handle('import:execute', async (event, filePath, warehouseId, pluginId) => {
  // Execute import workflow
  return executeImport(filePath, warehouseId, pluginId)
})

ipcMain.handle('db:get-products', async (event, filters) => {
  // filters.warehouseId is REQUIRED, not automatic
  return getProductsByWarehouse(db, filters)
})

ipcMain.handle('db:get-inventory', async (event, filters) => {
  return getInventoryByWarehouse(db, filters)
})

ipcMain.handle('db:get-movements', async (event, filters) => {
  return getMovementsByWarehouse(db, filters)
})

ipcMain.handle('db:get-orders', async (event, filters) => {
  return getOrdersByWarehouse(db, filters)
})
```

### 7. Database Query Functions

**Critical**: All query functions MUST require warehouse_id explicitly:

```typescript
// ✅ GOOD - Explicit filter
const getProductsByWarehouse = (
  db: Database,
  filters: { warehouseId: string }
): readonly Product[] => {
  return db
    .prepare('SELECT * FROM products p INNER JOIN inventory i ON p.id = i.product_id WHERE i.warehouse_id = ?')
    .all(filters.warehouseId)
}

const getInventoryByWarehouse = (
  db: Database,
  filters: { warehouseId: string; productId?: string }
): readonly Inventory[] => {
  let sql = 'SELECT * FROM inventory WHERE warehouse_id = ?'
  const params = [filters.warehouseId]

  if (filters.productId) {
    sql += ' AND product_id = ?'
    params.push(filters.productId)
  }

  return db.prepare(sql).all(...params)
}

const getMovementsByWarehouse = (
  db: Database,
  filters: { warehouseId: string; dateFrom?: string; dateTo?: string }
): readonly Movement[] => {
  let sql = 'SELECT * FROM movements WHERE warehouse_id = ?'
  const params = [filters.warehouseId]

  if (filters.dateFrom) {
    sql += ' AND movement_date >= ?'
    params.push(filters.dateFrom)
  }

  if (filters.dateTo) {
    sql += ' AND movement_date <= ?'
    params.push(filters.dateTo)
  }

  return db.prepare(sql).all(...params)
}

// ❌ BAD - Automatic filter (NOT ALLOWED)
const getProducts = (db: Database): readonly Product[] => {
  const warehouseId = getCurrentWarehouse() // Where does this come from??
  return db.prepare('SELECT * FROM produits WHERE warehouse_id = ?').all(warehouseId)
}
```

### 8. Dependencies to Install

```json
{
  "dependencies": {
    "better-sqlite3": "^9.0.0",
    "xlsx": "^0.18.5"
  }
}
```

**Note**: `better-sqlite3` is synchronous (better control), `xlsx` for Excel parsing.

### 9. Implementation Phases

**Phase 1: Database Foundation**
- Setup better-sqlite3 connection
- Create schema and migrations
- Implement basic query functions
- Add IPC bridge

**Phase 2: Plugin System**
- Define TypeScript types (no interfaces)
- Create plugin registry (Record type)
- Implement generic-excel plugin
- Create plugin helper functions

**Phase 3: Import Engine**
- Excel parser with xlsx library
- Validation functions
- Transformation pipeline
- Database loader with batch inserts

**Phase 4: UI Integration**
- Update import page to connect to backend
- Plugin selector dropdown
- File upload with validation
- Progress tracking
- Import summary

**Phase 5: Concrete Plugin**
- Implement solochain plugin
- Document expected Excel format
- Test with sample files

## Success Criteria

1. ✅ SQLite database created in user data directory
2. ✅ Excel files can be imported via plugins
3. ✅ Each plugin transforms to normalized schema
4. ✅ All code uses types + functions (no OOP)
5. ✅ Warehouse filtering is explicit (not automatic)
6. ✅ Plugin selection is manual (not auto-detected)
7. ✅ Import progress is visible to user
8. ✅ Data can be queried from frontend via IPC
9. ✅ Multiple warehouses can coexist in same database

## Out of Scope

For this initial implementation:
- Auto-detection of WMS from file structure
- Automatic warehouse_id filtering
- Incremental imports (full import only)
- Export functionality
- Advanced data quality checks
- Real-time sync from WMS APIs

## References

- Architecture docs: `docs/features/02-technical-architecture.md`
- Plugin system: `docs/features/11-import-plugins.md`
- Data flow: `docs/features/16-complete-data-flow.md`
- Entity types: `src/types/entities.ts`

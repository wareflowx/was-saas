// Database Schema for Wareflow
// All tables use warehouse_id as explicit filter (NOT automatic)
// Tables are named in English for consistency
export const SCHEMA_VERSION = '1.0.0';
export const DATABASE_SCHEMA = `
-- =====================================================
-- WAREHOUSE STRUCTURE
-- =====================================================

-- Warehouses (Main entity)
CREATE TABLE IF NOT EXISTS warehouses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  surface REAL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  zone_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  manager TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL,
  opening_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Zones (Hierarchical: belongs to warehouse)
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  surface REAL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  sector_count INTEGER DEFAULT 0,
  location_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  temperature_min REAL,
  temperature_max REAL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Sectors (Hierarchical: belongs to zone -> warehouse)
CREATE TABLE IF NOT EXISTS sectors (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  location_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  aisle TEXT,
  level INTEGER,
  position TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);

-- Locations (Hierarchical: belongs to sector -> zone -> warehouse)
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  sector_id TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  aisle TEXT,
  level INTEGER,
  position TEXT,
  barcode TEXT,
  status TEXT NOT NULL,
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
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  unit TEXT NOT NULL,
  weight REAL,
  volume REAL,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  reorder_point INTEGER,
  reorder_quantity INTEGER,
  cost_price REAL,
  selling_price REAL,
  supplier TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Inventory (Stock levels by product and location - CRITICAL TABLE)
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
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
-- SUPPLIERS
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  payment_terms TEXT,
  lead_time_days INTEGER,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =====================================================
-- CUSTOMERS
-- =====================================================

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  customer_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  billing_address TEXT,
  shipping_address TEXT,
  city TEXT,
  country TEXT,
  customer_type TEXT,
  credit_limit REAL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =====================================================
-- ORDERS (Sales orders)
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
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
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS order_lines (
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
-- PURCHASE ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  purchase_order_number TEXT NOT NULL UNIQUE,
  order_date TEXT NOT NULL,
  expected_date TEXT,
  status TEXT NOT NULL,
  requested_by TEXT,
  total_amount REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS purchase_order_lines (
  id TEXT PRIMARY KEY,
  purchase_order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- PICKING OPERATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS pickings (
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
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS picking_lines (
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
  status TEXT NOT NULL,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (picking_id) REFERENCES pickings(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RECEIPTS (Supplier receipts)
-- =====================================================

CREATE TABLE IF NOT EXISTS receptions (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  reception_number TEXT NOT NULL,
  purchase_order_number TEXT,
  expected_date TEXT NOT NULL,
  received_date TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
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
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS reception_lines (
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
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reception_id) REFERENCES receptions(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RESTOCKING (Replenishment)
-- =====================================================

CREATE TABLE IF NOT EXISTS restockings (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  restocking_number TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS restocking_lines (
  id TEXT PRIMARY KEY,
  restocking_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  source_location_id TEXT,
  destination_location_id TEXT,
  current_quantity INTEGER NOT NULL,
  target_quantity INTEGER NOT NULL,
  quantity_to_restock INTEGER NOT NULL,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (restocking_id) REFERENCES restockings(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (source_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (destination_location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =====================================================
-- RETURNS
-- =====================================================

CREATE TABLE IF NOT EXISTS returns (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT,
  order_number TEXT,
  return_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  return_date TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  reason TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS return_lines (
  id TEXT PRIMARY KEY,
  return_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  condition TEXT NOT NULL,
  resolution TEXT NOT NULL,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- SHIPMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  shipment_number TEXT NOT NULL,
  shipment_date TEXT NOT NULL,
  carrier TEXT NOT NULL,
  tracking_number TEXT,
  status TEXT NOT NULL,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  estimated_delivery_date TEXT,
  actual_delivery_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shipment_lines (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- MOVEMENTS (Historical stock movements)
-- =====================================================

CREATE TABLE IF NOT EXISTS movements (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT NOT NULL,
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
  reference_type TEXT,
  reference_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (source_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (destination_location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =====================================================
-- USERS (Warehouse operators)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- =====================================================
-- IMPORT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS import_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_version TEXT NOT NULL,
  imported_at TEXT NOT NULL DEFAULT (datetime('now')),
  rows_processed INTEGER NOT NULL,
  status TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_zones_warehouse ON zones(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_sectors_warehouse ON sectors(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_sectors_zone ON sectors(zone_id);
CREATE INDEX IF NOT EXISTS idx_locations_warehouse ON locations(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_locations_zone ON locations(zone_id);
CREATE INDEX IF NOT EXISTS idx_locations_sector ON locations(sector_id);

-- Product & Inventory indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_product ON inventory(warehouse_id, product_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_warehouse ON orders(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_lines_order ON order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_order_lines_product ON order_lines(product_id);

-- Picking indexes
CREATE INDEX IF NOT EXISTS idx_pickings_warehouse ON pickings(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_pickings_status ON pickings(status);
CREATE INDEX IF NOT EXISTS idx_pickings_order ON pickings(order_id);
CREATE INDEX IF NOT EXISTS idx_picking_lines_picking ON picking_lines(picking_id);
CREATE INDEX IF NOT EXISTS idx_picking_lines_user ON picking_lines(processed_by_user_id);

-- Reception indexes
CREATE INDEX IF NOT EXISTS idx_receptions_warehouse ON receptions(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_receptions_status ON receptions(status);
CREATE INDEX IF NOT EXISTS idx_reception_lines_reception ON reception_lines(reception_id);

-- Restocking indexes
CREATE INDEX IF NOT EXISTS idx_restockings_warehouse ON restockings(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_restockings_status ON restockings(status);
CREATE INDEX IF NOT EXISTS idx_restocking_lines_restocking ON restocking_lines(restocking_id);

-- Return indexes
CREATE INDEX IF NOT EXISTS idx_returns_warehouse ON returns(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);
CREATE INDEX IF NOT EXISTS idx_return_lines_return ON return_lines(return_id);

-- Shipment indexes
CREATE INDEX IF NOT EXISTS idx_shipments_warehouse ON shipments(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_lines_shipment ON shipment_lines(shipment_id);

-- Movement indexes (CRITICAL for analytics)
CREATE INDEX IF NOT EXISTS idx_movements_warehouse ON movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(movement_date);
CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse_product ON movements(warehouse_id, product_id);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse_date ON movements(warehouse_id, movement_date);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_warehouse ON users(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Import history indexes
CREATE INDEX IF NOT EXISTS idx_import_history_warehouse ON import_history(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_import_history_date ON import_history(imported_at);
`;
// Database file location configuration
export const getDatabasePath = (userDataPath) => {
    const path = require('path');
    return path.join(userDataPath, 'wareflow.db');
};
// Default warehouse ID (used when no warehouse specified)
export const DEFAULT_WAREHOUSE_ID = 'default';
//# sourceMappingURL=schema.js.map
# Wareflow Development Plan

## 📋 Overview

**Goal**: Build a local-first warehouse analysis system with plugin-based import from WMS Excel files.

**Core Philosophy**:
- Complete database schema → All analyses possible
- Plugins populate what they can → Adaptive analysis availability
- Start with ABC + Dead Stock → Add progressive features

---

## 🎯 Development Phases

### **Phase 0: Foundation Setup** (1-2 days)
**Goal**: Project structure and development environment

#### Tasks:
1. **Install Dependencies**
   ```bash
   npm install better-sqlite3 xlsx
   npm install -D @types/better-sqlite3
   ```

2. **Create Directory Structure**
   ```
   src/
   ├── backend/
   │   ├── database/
   │   ├── import/
   │   ├── plugins/
   │   └── services/
   ├── preload/
   └── electron/
   ```

3. **Setup TypeScript Configuration**
   - Ensure strict mode
   - Configure path aliases

**Deliverable**:
- ✅ Dependencies installed
- ✅ Directory structure created
- ✅ Project builds without errors

---

### **Phase 1: Database Foundation** (3-5 days)
**Goal**: SQLite database with complete schema

#### 1.1 Schema Definition (Day 1)
**Tasks**:
- Create `src/backend/database/schema.ts` with complete SQL schema
- Include ALL tables (warehouses, products, inventory, movements, orders, pickings, receptions, restockings, returns, users, suppliers, customers, shipments)
- Add all indexes for performance

**Decision Point**:
- ✅ Add suppliers, customers, shipments to core schema?
- ✅ Add purchase_orders table?

#### 1.2 Database Connection (Day 1-2)
**Tasks**:
- Create `src/backend/database/index.ts`
- Implement connection function
- Implement database initialization
- Auto-create database file in userData directory

#### 1.3 Migrations System (Day 2)
**Tasks**:
- Create `src/backend/database/migrations.ts`
- Implement schema versioning
- Add migration functions

#### 1.4 Query Functions (Day 2-3)
**Tasks**:
- Create `src/backend/database/queries.ts`
- Implement basic CRUD functions (with explicit warehouse_id filters)
- Functions needed for MVP:
  - `getProductsByWarehouse()`
  - `getInventoryByWarehouse()`
  - `getMovementsByWarehouse()`
  - `getOrdersByWarehouse()`

**Deliverable**:
- ✅ Database file created automatically
- ✅ All tables created with proper indexes
- ✅ Query functions working
- ✅ Can insert/query sample data

---

### **Phase 2: Plugin System Foundation** (3-4 days)
**Goal**: Plugin types, registry, and first plugin

#### 2.1 Type Definitions (Day 1)
**Tasks**:
- Create `src/backend/import/types.ts`
- Define WMSInputData, NormalizedData, ImportPlugin types
- Match normalized schema to database schema

**Decision Point**:
- Which entities are REQUIRED in normalized output?
  - Minimum: products, inventory, movements
  - Optional: orders, pickings, receptions, restockings, returns, suppliers, customers, shipments

#### 2.2 Plugin Registry (Day 1-2)
**Tasks**:
- Create `src/backend/import/plugins/registry.ts`
- Implement plugin registry (Record type, not classes)
- Add helper functions: `getPlugin()`, `listPlugins()`

#### 2.3 Generic Excel Plugin (Day 2-3)
**Tasks**:
- Create `src/backend/import/plugins/generic-excel/index.ts`
- Implement validate function
- Implement transform function
- User manually maps columns to normalized schema

#### 2.4 Plugin Testing (Day 3-4)
**Tasks**:
- Create sample Excel files
- Test import with generic plugin
- Verify data in database

**Deliverable**:
- ✅ Plugin system working
- ✅ Can import basic Excel files
- ✅ Data correctly normalized and stored

---

### **Phase 3: Import Engine** (4-5 days)
**Goal**: Complete import workflow

#### 3.1 Excel Parser (Day 1)
**Tasks**:
- Create `src/backend/import/parser.ts`
- Parse Excel files using `xlsx` library
- Extract sheets and data
- Error handling for malformed files

#### 3.2 Transformer (Day 1-2)
**Tasks**:
- Create `src/backend/import/transformer.ts`
- Pipeline: parse → validate → transform → load
- Progress reporting callbacks

#### 3.3 Database Loader (Day 2-3)
**Tasks**:
- Create `src/backend/import/loader.ts`
- Batch inserts with transactions
- Handle warehouse_id correctly
- Update inventory table

#### 3.4 Import History (Day 3)
**Tasks**:
- Record all imports in `import_history` table
- Track performance metrics

**Deliverable**:
- ✅ Can import Excel files end-to-end
- ✅ Data correctly in database
- ✅ Import history tracked

---

### **Phase 4: IPC Bridge** (2-3 days)
**Goal**: Communication between renderer and main process

#### 4.1 Preload Script (Day 1)
**Tasks**:
- Create `src/preload/index.ts`
- Expose safe API to renderer process
- Define electronAPI interface

#### 4.2 IPC Handlers - Main Process (Day 1-2)
**Tasks**:
- Update `electron/main.mjs`
- Add ipcMain handlers:
  - `plugins:list`
  - `import:validate`
  - `import:execute`
  - `db:get-products`
  - `db:get-inventory`
  - `db:get-movements`

**Deliverable**:
- ✅ Renderer can call backend functions
- ✅ Secure IPC communication

---

### **Phase 5: MVP Analyses** (5-7 days)
**Goal**: ABC Analysis + Dead Stock Analysis

#### 5.1 Analysis Engine Foundation (Day 1)
**Tasks**:
- Create `src/backend/analysis/`
- Define Analysis type
- Create analysis registry

#### 5.2 ABC Analysis (Day 2-3)
**Tasks**:
- Create `src/backend/analysis/abc-analysis.ts`
- Query movements or order_lines
- Calculate cumulative contribution
- Classify A/B/C
- Return results with statistics

**Data Flow**:
```
1. Query: SELECT product_id, SUM(quantity) FROM movements WHERE type='outbound' AND warehouse_id=? GROUP BY product_id
2. Calculate contribution % and cumulative %
3. Assign ABC class based on cumulative %
4. Return: [{product, quantity, contribution, cumulative, abc_class}]
```

#### 5.3 Dead Stock Analysis (Day 3-4)
**Tasks**:
- Create `src/backend/analysis/dead-stock-analysis.ts`
- Query movements for last movement date per product
- Join with inventory for current stock
- Calculate days since last move
- Calculate tied-up capital (quantity * cost_price)

**Data Flow**:
```
1. Query: SELECT p.id, p.name, p.cost_price, i.quantity, MAX(m.movement_date) as last_move
   FROM products p
   JOIN inventory i ON p.id = i.product_id
   LEFT JOIN movements m ON p.id = m.product_id
   WHERE i.warehouse_id=?
   GROUP BY p.id
2. Calculate: days_since_last_move = TODAY - last_move
3. Calculate: tied_capital = quantity * cost_price
4. Filter: days_since_last_move > threshold
5. Return: [{product, days_since_last_move, quantity, tied_capital}]
```

#### 5.4 IPC for Analyses (Day 4)
**Tasks**:
- Add IPC handlers: `analysis:abc`, `analysis:dead-stock`
- Expose in preload script

**Deliverable**:
- ✅ ABC Analysis working
- ✅ Dead Stock Analysis working
- ✅ Can be triggered from frontend (manually for now)

---

### **Phase 6: Import UI** (4-5 days)
**Goal**: User interface for importing data

#### 6.1 Import Page (Day 1-2)
**Tasks**:
- Update `src/routes/import/index.tsx`
- Plugin selector (dropdown)
- File uploader (drag & drop)
- Validation display
- Import progress tracking

#### 6.2 Warehouse Management (Day 1)
**Tasks**:
- Create warehouse selector/creator
- Store current warehouse in state

#### 6.3 Import Summary (Day 2-3)
**Tasks**:
- Show import results
- Navigate to dashboard

**Deliverable**:
- ✅ Can import data via UI
- ✅ User sees progress and results

---

### **Phase 7: Dashboard + Results Display** (5-7 days)
**Goal**: Show ABC and Dead Stock results

#### 7.1 Dashboard Update (Day 1-2)
**Tasks**:
- Update existing dashboard
- Add "Analyses" section
- Links to ABC and Dead Stock pages

#### 7.2 ABC Analysis Page (Day 2-4)
**Tasks**:
- Create `src/routes/abc-analysis/` (already exists as stub)
- Table with ABC classification
- Summary statistics (Class A/B/C counts)
- Charts (Pareto, distribution)
- Filters (by category, date range)

#### 7.3 Dead Stock Analysis Page (Day 3-5)
**Tasks**:
- Create `src/routes/dead-stock/` (already exists as stub)
- Table with dead stock items
- Summary statistics (total tied capital, items count)
- Filters (by days threshold, category)
- Charts (distribution by days, by value)

**Deliverable**:
- ✅ ABC Analysis page functional
- ✅ Dead Stock Analysis page functional
- ✅ Export to Excel

---

### **Phase 8: Concret Plugin - Solochain** (3-4 days)
**Goal**: Real-world WMS plugin

#### 8.1 Solochain Plugin (Day 1-3)
**Tasks**:
- Create `src/backend/import/plugins/solochain/index.ts`
- Define input schema (what Solochain exports)
- Implement transformation (Solochain → Normalized)
- Test with real Solochain export

#### 8.2 Documentation (Day 3)
**Tasks**:
- Document expected Excel format
- Add examples
- Error messages

**Deliverable**:
- ✅ Working Solochain plugin
- ✅ Documented format

---

### **Phase 9: Performance Tracking (5-7 days)
**Goal**: Individual performance analytics

#### 9.1 Schema Updates (Day 1)
**Tasks**:
- Add per-line timestamps to picking_lines, restocking_lines, return_lines
  - `started_at TEXT`
  - `completed_at TEXT`
  - `duration_ms INTEGER`
- Add processed_by_user_id to line tables

**IMPORTANT**: This requires database migration

#### 9.2 Performance Queries (Day 2-3)
**Tasks**:
- Create `src/backend/database/performance-queries.ts`
- Query individual performance by type
- Calculate averages by category
- Compare individual vs average

#### 9.3 Performance Dashboard (Day 3-5)
**Tasks**:
- Create performance pages
- Individual performance dashboard
- Category benchmarks
- Charts and comparisons

**Deliverable**:
- ✅ Per-line timestamps working
- ✅ Individual performance tracking
- ✅ Performance dashboards

---

### **Phase 10: Advanced Analytics** (5-7 days)
**Goal**: Articles mal placés + other analyses

#### 10.1 Location Analysis (Day 1-2)
**Tasks**:
- Analyze location attributes (aisle, level, zone)
- Calculate distance metrics
- Classify locations (far/close, high/low)

#### 10.2 Popular Items in Poor Locations (Day 2-3)
**Tasks**:
- Combine ABC Analysis + Location Analysis
- Identify Class A items in "far" or "high" locations
- Recommendations for relocation

#### 10.3 Other Analyses (Day 3-5)
**Tasks**:
- Stockout Analysis
- Fill Rate / Service Level
- Returns Rate Analysis
- Inventory Turnover

**Deliverable**:
- ✅ Articles mal placés analysis
- ✅ Additional analytics

---

## 📅 Timeline Estimate

| Phase | Duration | Cumulative | Working Days |
|-------|----------|------------|-------------|
| Phase 0: Foundation | 1-2 days | 1-2 days | 2 |
| Phase 1: Database | 3-5 days | 4-7 days | 5 |
| Phase 2: Plugin System | 3-4 days | 7-11 days | 4 |
| Phase 3: Import Engine | 4-5 days | 11-16 days | 5 |
| Phase 4: IPC Bridge | 2-3 days | 13-19 days | 3 |
| Phase 5: MVP Analyses | 5-7 days | 18-26 days | 7 |
| Phase 6: Import UI | 4-5 days | 22-31 days | 5 |
| Phase 7: Dashboard | 5-7 days | 27-38 days | 7 |
| Phase 8: Solochain Plugin | 3-4 days | 30-42 days | 4 |
| Phase 9: Performance Tracking | 5-7 days | 35-49 days | 7 |
| Phase 10: Advanced Analytics | 5-7 days | 40-56 days | 7 |

**Total Estimate**: 40-56 working days (~8-11 weeks)

---

## 🚴 Critical Dependencies & Decision Points

### **Must Decide Before Starting**:

1. **Schema Finalization**
   - ✅ Add suppliers, customers, shipments to core schema?
   - ✅ Add purchase_orders table?
   - ✅ Add per-line timestamps from Day 1 or Phase 9?

2. **Normalized Schema**
   - Which entities are REQUIRED in plugin output?
   - Minimum: products, inventory, movements
   - Recommended: All entities that WMS can provide

3. **First Plugin**
   - Start with Generic Excel or build Solochain first?
   - Recommendation: Generic Excel first (simpler, testable)

### **Can Decide Later**:

4. **Additional Analyses**
   - After MVP, prioritize based on user feedback
   - XYZ Analysis, Stockout Analysis, etc.

5. **Additional Plugins**
   - SAP EWM, Manhattan, etc.
   - Build as needed

---

## ✅ MVP Definition (Phase 1-7)

**What constitutes MVP**:
- ✅ Complete database schema
- ✅ Plugin system with Generic Excel plugin
- ✅ Import workflow functional
- ✅ ABC Analysis working
- ✅ Dead Stock Analysis working
- ✅ Basic UI for import and viewing results

**MVP Timeline**: ~27-38 working days (5-7 weeks)

**MVP Success Criteria**:
1. Can import Excel file from any WMS (via Generic Excel plugin)
2. See ABC classification of products
3. Identify dead stock and tied-up capital
4. Filter by warehouse
5. Export results to Excel
6. System works 100% offline

---

## 🎯 Next Steps

1. **Review and approve this plan**
2. **Answer critical decision points**
3. **Create issues in GitHub for each phase**
4. **Start Phase 0: Foundation Setup**

---

## 📝 Notes

- **Parallel development possible**:
  - Frontend UI can be built in parallel with backend
  - Plugin system can be developed while schema is finalized
  - Analyses can be developed independently

- **Testing strategy**:
  - Create sample Excel files for each phase
  - Test with real data as soon as possible
  - Manual testing before automated tests

- **Documentation**:
  - Document database schema
  - Document plugin development
  - Document API (IPC endpoints)

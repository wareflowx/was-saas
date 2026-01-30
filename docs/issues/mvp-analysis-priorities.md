## 🎯 MVP Analysis Priorities - Starting with ABC & Dead Stock

Based on the business requirements, we will start by implementing **two foundational analyses** that unlock the most value:

### 🚨 MVP Priority 1: ABC Analysis

**What it does**: Classifies products into categories (A, B, C) based on their contribution to total order volume/value.
- **Class A**: ~20% of products = ~80% of value (critical products)
- **Class B**: ~30% of products = ~15% of value
- **Class C**: ~50% of products = ~5% of value

**Why it's first**:
1. **Foundational for everything else** - All other analyses can be segmented by ABC class
2. **Enables "Popular Articles" analysis** (requirement #3) - Class A products ARE the popular ones
3. **Critical for business decisions** - Where to focus inventory management efforts

**Data required**:
- ✅ `products` table
- ✅ `movements` table (type='outbound') OR `order_lines` table
- ✅ `warehouse_id` for filtering

**Output example**:
```
Product  | SKU  | Total Quantity | % Total | Cumulative % | ABC Class
-----------------------------------------------------------------
Widget A | W001 | 50,000         | 45.2%   | 45.2%        | A
Widget B | W002 | 30,000         | 27.1%   | 72.3%        | A
Widget C | W003 | 15,000         | 13.6%   | 85.9%        | B
Widget D | W004 | 8,000          | 7.2%    | 93.1%        | B
Widget E | W005 | 5,000          | 4.5%    | 97.6%        | C
...
```

---

### 🚨 MVP Priority 2: Dead Stock Analysis

**What it does**: Identifies products that haven't moved in X days, showing capital tied up in non-moving inventory.

**Why it's second**:
1. **Direct financial impact** - Shows exactly where money is wasted
2. **Supports "Popular Articles"** (requirement #3) - Dead stock is the opposite of popular
3. **Enables "Articles Mal Placés"** (requirement #4) - Should prioritize moving popular items, not dead stock

**Data required**:
- ✅ `products` table
- ✅ `inventory` table (current stock levels)
- ✅ `movements` table (last movement date per product)
- ✅ `warehouse_id` for filtering

**Output example**:
```
Product  | SKU  | Days Since Last Move | Current Stock | Unit Cost | Tied Capital | Action
--------------------------------------------------------------------------------
Obsolete | W999 | 456                 | 5,000         | $10.00    | $50,000      | Liquidate
Slow     | W888 | 180                 | 2,000         | $25.00    | $50,000      | Discount
...
```

---

## 📊 How These Support Our Core Requirements

### Requirement 1: Performance Averages by Category
- ABC segmentation allows us to benchmark: "Are pickers faster with Class A items (frequently picked) vs Class C?"

### Requirement 2: Individual Performance Tracking
- We can measure: "Does picker X perform better on Class A items compared to team average?"

### Requirement 3: Article Popularity
- **ABC Analysis = Popularity ranking**
- Dead Stock = Unpopular items (inverse metric)

### Requirement 4: Popular Items in Poor Locations
- ABC tells us which items are popular (Class A)
- We then check if Class A items are in "far" or "high" locations
- This becomes: "ABC Analysis + Location Analysis"

---

## ✅ What This Means for Implementation

**Phase 1 (Current Focus)**:
1. Implement database schema with all required tables
2. Build ABC Analysis
3. Build Dead Stock Analysis
4. Validate with sample data

**Phase 2 (Performance Analysis)**:
5. Add per-line timestamps and user tracking to schema
6. Build individual performance dashboards
7. Build category performance benchmarks

**Phase 3 (Advanced Analytics)**:
8. Build "Articles Mal Placés" (ABC + Location analysis)
9. Add more analyses as needed

---

## 🎯 Success Criteria for MVP

After Phase 1, users should be able to:
- ✅ See ABC classification of their products
- ✅ Identify dead stock and tied-up capital
- ✅ Filter by warehouse
- ✅ Export results to Excel
- ✅ Drill down from ABC/Dead Stock to product details

This provides immediate business value while we build the more complex performance tracking features.
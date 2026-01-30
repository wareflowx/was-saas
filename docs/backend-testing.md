# Backend Testing Guide

This guide explains how to test the backend system with mock data.

## Quick Start

### 1. Build the Backend

```bash
# Compile backend TypeScript
pnpm tsc -p tsconfig.backend.json

# Compile Electron TypeScript
pnpm tsc -p tsconfig.electron.json
```

### 2. Generate Mock Data

```bash
# Generate test data for warehouse WH-001
node scripts/generate-mock-data.js WH-001
```

This will create:
- **50 products** across 10 categories (Electronics, Clothing, Food, etc.)
- **50 inventory records** with varying stock levels
- **200 movements** over the last 90 days

### 3. Run Analyses

Once you have mock data, you can run analyses through the Electron app's IPC API:

```javascript
// In Electron main process or renderer via preload API

// ABC Analysis
const abcResult = await ipcRenderer.invoke('analysis:abc', {
  warehouseId: 'WH-001',
  dateFrom: '2025-01-01',
  dateTo: '2025-01-30'
})

// Dead Stock Analysis
const deadStockResult = await ipcRenderer.invoke('analysis:dead-stock', {
  warehouseId: 'WH-001',
  thresholdDays: 90,
  criticalThreshold: 180,
  warningThreshold: 90
})
```

## Mock Data Characteristics

### Products
- **Class A (20%)**: High value (€50-€500), high rotation products
- **Class B (30%)**: Medium value (€10-€100), medium rotation products
- **Class C (50%)**: Low value (€1-€50), low rotation products

### Movements
- Distributed over last 90 days
- **Recent movements (<30 days)**: Mostly outbound (sales)
- **Medium age (30-60 days)**: Balanced inbound/outbound
- **Old movements (>60 days)**: Mostly inbound (receipts)

### Analysis Testing
- **ABC Analysis**: Will show proper A/B/C classification based on movement quantity
- **Dead Stock Analysis**: Will show products with no recent movement as critical/warning

## Available Plugins

### 1. Mock Data Generator (`mock-data-generator`)
- Generates realistic test data
- No file input required
- Perfect for development and testing

### 2. Generic Excel (`generic-excel`)
- Imports from any Excel format
- Requires sheets: Products, Inventory, Movements
- Manual column mapping required

## Database Location

The database is stored in:
- **Windows**: `%APPDATA%/wareflow/database.db`
- **macOS**: `~/Library/Application Support/wareflow/database.db`
- **Linux**: `~/.config/wareflow/database.db`

You can inspect the database using any SQLite browser:
```bash
# Open database with SQLite CLI
sqlite3 "%APPDATA%\wareflow\database.db"

# View products
SELECT * FROM products LIMIT 10;

# View inventory
SELECT * FROM inventory WHERE warehouse_id = 'WH-001';

# View movements
SELECT * FROM movements WHERE warehouse_id = 'WH-001' ORDER BY movement_date DESC LIMIT 10;
```

## Testing Workflow

1. **Clean database** (optional):
   ```bash
   # Delete database to start fresh
   rm "%APPDATA%\wareflow\database.db"
   ```

2. **Generate mock data**:
   ```bash
   node scripts/generate-mock-data.js WH-001
   ```

3. **Run app**:
   ```bash
   pnpm dev
   ```

4. **Test analyses** in the app

5. **Verify results** in database

## Common Issues

### Database locked
- Close all Electron app instances
- Wait a few seconds for connections to close

### No data in analyses
- Verify warehouse ID matches
- Check database has data: `SELECT COUNT(*) FROM movements WHERE warehouse_id = 'WH-001'`
- Ensure movements have `type = 'outbound'` for ABC analysis

### TypeScript errors
```bash
# Rebuild backend
pnpm tsc -p tsconfig.backend.json
pnpm tsc -p tsconfig.electron.json
```

## Next Steps

After testing with mock data:
1. Build frontend UI for analyses
2. Create import UI for Excel files
3. Implement Solochain plugin for real WMS data
4. Add more analysis types (XYZ, turnover, etc.)

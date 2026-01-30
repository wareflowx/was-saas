import type Database from 'better-sqlite3'
import type { NormalizedData, Product, Inventory, Movement } from '../types'
import { getDatabase } from '../database/index'

/**
 * Insert products into database
 * @param products - Array of products to insert
 * @returns Number of products inserted
 */
export const insertProducts = (products: readonly Product[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, sku, name, description, category, subcategory, brand, unit,
      weight, volume, min_stock, max_stock, reorder_point, reorder_quantity,
      cost_price, selling_price, supplier, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      try {
        stmt.run(
          product.id,
          product.sku,
          product.name,
          product.description || null,
          product.category,
          product.subcategory || null,
          product.brand || null,
          product.unit,
          product.weight || null,
          product.volume || null,
          product.minStock || null,
          product.maxStock || null,
          product.reorderPoint || null,
          product.reorderQuantity || null,
          product.costPrice || null,
          product.sellingPrice || null,
          product.supplier || null,
          product.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting product ${product.sku}:`, error)
      }
    }
  })

  insertMany(products)
  return inserted
}

/**
 * Insert inventory records into database
 * @param warehouseId - Warehouse ID
 * @param inventory - Array of inventory records
 * @returns Number of records inserted
 */
export const insertInventory = (
  warehouseId: string,
  inventory: readonly Inventory[]
): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO inventory (
      id, warehouse_id, product_id, location_id,
      quantity, available_quantity, reserved_quantity,
      last_received_at, last_shipped_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((inventory) => {
    for (const inv of inventory) {
      try {
        const id = `${warehouseId}-${inv.productId}-${inv.locationId || 'default'}`
        stmt.run(
          id,
          warehouseId,
          inv.productId,
          inv.locationId || null,
          inv.quantity,
          inv.availableQuantity,
          inv.reservedQuantity,
          inv.lastReceivedAt || null,
          inv.lastShippedAt || null
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting inventory for product ${inv.productId}:`, error)
      }
    }
  })

  insertMany(inventory)
  return inserted
}

/**
 * Insert movements into database
 * @param movements - Array of movements to insert
 * @returns Number of movements inserted
 */
export const insertMovements = (movements: readonly Movement[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO movements (
      id, warehouse_id, product_id, product_sku, product_name,
      type, source_location_id, source_zone, source_location_code,
      destination_location_id, destination_zone, destination_location_code,
      quantity, unit, movement_date, user, reason,
      lot, expiration_date, reference_type, reference_id,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  let inserted = 0

  const insertMany = db.transaction((movements) => {
    for (const movement of movements) {
      try {
        const id = `${movement.warehouseId}-${movement.productId}-${movement.movementDate.getTime()}-${Math.random().toString(36).substring(2, 15)}`

        stmt.run(
          id,
          movement.warehouseId,
          movement.productId,
          movement.productSku,
          movement.productName,
          movement.type,
          movement.sourceLocationId || null,
          movement.sourceZone || null,
          movement.sourceLocationCode || null,
          movement.destinationLocationId || null,
          movement.destinationZone || null,
          movement.destinationLocationCode || null,
          movement.quantity,
          movement.unit,
          formatDate(movement.movementDate),
          movement.user || null,
          movement.reason || null,
          movement.lot || null,
          movement.expirationDate ? formatDate(movement.expirationDate) : null,
          movement.referenceType || null,
          movement.referenceId || null
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting movement:`, error)
      }
    }
  })

  insertMany(movements)
  return inserted
}

/**
 * Load normalized data into database
 * @param data - Normalized data from plugin
 * @returns Import statistics
 */
export const loadToDatabase = (data: NormalizedData): {
  productsImported: number
  inventoryImported: number
  movementsImported: number
  ordersImported?: number
  pickingsImported?: number
  receptionsImported?: number
  restockingsImported?: number
  returnsImported?: number
} => {
  const stats = {
    productsImported: 0,
    inventoryImported: 0,
    movementsImported: 0,
    ordersImported: 0,
    pickingsImported: 0,
    receptionsImported: 0,
    restockingsImported: 0,
    returnsImported: 0,
  }

  // Insert products
  if (data.products.length > 0) {
    stats.productsImported = insertProducts(data.products)
  }

  // Insert inventory
  if (data.inventory.length > 0) {
    stats.inventoryImported = insertInventory(data.metadata.warehouseId, data.inventory)
  }

  // Insert movements
  if (data.movements.length > 0) {
    stats.movementsImported = insertMovements(data.movements)
  }

  // TODO: Insert orders, pickings, receptions, restockings, returns
  // These will be implemented as needed

  return stats
}

/**
 * Format date to SQLite string format
 */
function formatDate(date: Date): string {
  return date.toISOString()
}

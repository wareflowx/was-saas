import type { NormalizedData, Product, Inventory, Movement, Location, Zone, Sector, Order, OrderLine, Picking, PickingLine, Reception, ReceptionLine, Restocking, RestockingLine, Return, ReturnLine, Warehouse, Supplier, Customer, User, PurchaseOrder, PurchaseOrderLine, Shipment, ShipmentLine } from './types'
import { getDatabase } from '../database/index'

/**
 * Insert products into database
 * @param products - Array of products to insert
 * @returns Number of products inserted
 */

/**
 * Insert warehouses into database
 * @param warehouses - Array of warehouses to insert
 * @returns Number of warehouses inserted
 */
export const insertWarehouses = (warehouses: readonly Warehouse[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO warehouses (
      id, code, name, city, country, surface, capacity,
      manager, email, phone, status, opening_date,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((warehouses: readonly Warehouse[]) => {
    for (const warehouse of warehouses) {
      try {
        stmt.run(
          warehouse.id,
          warehouse.code,
          warehouse.name,
          warehouse.city,
          warehouse.country,
          warehouse.surface || null,
          warehouse.capacity || null,
          warehouse.manager || null,
          warehouse.email || null,
          warehouse.phone || null,
          warehouse.status,
          warehouse.openingDate ? formatDate(warehouse.openingDate) : null
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting warehouse ${warehouse.code}:`, error)
      }
    }
  })

  insertMany(warehouses)
  return inserted
}

/**
 * Insert users into database
 * @param users - Array of users to insert
 * @returns Number of users inserted
 */
export const insertUsers = (users: readonly User[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (
      id, warehouse_id, username, full_name, email, role, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((users: readonly User[]) => {
    for (const user of users) {
      try {
        stmt.run(
          user.id,
          user.warehouseId,
          user.username,
          user.fullName,
          user.email || null,
          user.role,
          user.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting user ${user.username}:`, error)
      }
    }
  })

  insertMany(users)
  return inserted
}

/**
 * Insert suppliers into database
 * @param suppliers - Array of suppliers to insert
 * @returns Number of suppliers inserted
 */
export const insertSuppliers = (suppliers: readonly Supplier[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO suppliers (
      id, code, name, contact_person, email, phone, address, city, country,
      payment_terms, lead_time_days, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((suppliers: readonly Supplier[]) => {
    for (const supplier of suppliers) {
      try {
        stmt.run(
          supplier.id,
          supplier.code,
          supplier.name,
          supplier.contactPerson || null,
          supplier.email || null,
          supplier.phone || null,
          supplier.address || null,
          supplier.city || null,
          supplier.country || null,
          supplier.paymentTerms || null,
          supplier.leadTimeDays || null,
          supplier.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting supplier ${supplier.code}:`, error)
      }
    }
  })

  insertMany(suppliers)
  return inserted
}

/**
 * Insert customers into database
 * @param customers - Array of customers to insert
 * @returns Number of customers inserted
 */
export const insertCustomers = (customers: readonly Customer[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO customers (
      id, customer_code, name, email, phone, billing_address, shipping_address,
      city, country, customer_type, credit_limit, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((customers: readonly Customer[]) => {
    for (const customer of customers) {
      try {
        stmt.run(
          customer.id,
          customer.customerCode,
          customer.name,
          customer.email || null,
          customer.phone || null,
          customer.billingAddress || null,
          customer.shippingAddress || null,
          customer.city || null,
          customer.country || null,
          customer.customerType || null,
          customer.creditLimit || null,
          customer.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting customer ${customer.customerCode}:`, error)
      }
    }
  })

  insertMany(customers)
  return inserted
}

/**
 * Insert purchase orders into database
 * @param purchaseOrders - Array of purchase orders to insert
 * @returns Number of purchase orders inserted
 */
export const insertPurchaseOrders = (purchaseOrders: readonly PurchaseOrder[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO purchase_orders (
      id, warehouse_id, supplier_id, purchase_order_number, order_date, expected_date,
      status, total_amount,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((purchaseOrders: readonly PurchaseOrder[]) => {
    for (const po of purchaseOrders) {
      try {
        stmt.run(
          po.id,
          po.warehouseId,
          po.supplierId,
          po.purchaseOrderNumber,
          formatDate(po.orderDate),
          po.expectedDate ? formatDate(po.expectedDate) : null,
          po.status,
          po.totalAmount
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting purchase order ${po.purchaseOrderNumber}:`, error)
      }
    }
  })

  insertMany(purchaseOrders)
  return inserted
}

/**
 * Insert purchase order lines into database
 * @param purchaseOrderLines - Array of purchase order lines to insert
 * @returns Number of purchase order lines inserted
 */
export const insertPurchaseOrderLines = (purchaseOrderLines: readonly PurchaseOrderLine[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO purchase_order_lines (
      id, purchase_order_id, product_id, quantity, received_quantity,
      unit_price, total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  let inserted = 0

  const insertMany = db.transaction((lines: readonly PurchaseOrderLine[]) => {
    for (const line of lines) {
      try {
        stmt.run(
          line.id,
          line.purchaseOrderId,
          line.productId,
          line.quantity,
          line.receivedQuantity,
          line.unitPrice,
          line.totalPrice
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting purchase order line ${line.id}:`, error)
      }
    }
  })

  insertMany(purchaseOrderLines)
  return inserted
}

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

  const insertMany = db.transaction((products: readonly Product[]) => {
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
 * Insert zones into database
 * @param zones - Array of zones to insert
 * @returns Number of zones inserted
 */
export const insertZones = (zones: readonly Zone[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO zones (
      id, warehouse_id, code, name, type,
      surface, capacity, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((zones: readonly Zone[]) => {
    for (const zone of zones) {
      try {
        stmt.run(
          zone.id,
          zone.warehouseId,
          zone.code,
          zone.name,
          zone.type,
          zone.surface || null,
          zone.capacity || null,
          zone.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting zone ${zone.code}:`, error)
      }
    }
  })

  insertMany(zones)
  return inserted
}

/**
 * Insert sectors into database
 * @param sectors - Array of sectors to insert
 * @returns Number of sectors inserted
 */
export const insertSectors = (sectors: readonly Sector[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO sectors (
      id, warehouse_id, zone_id, code, name, type,
      capacity, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((sectors: readonly Sector[]) => {
    for (const sector of sectors) {
      try {
        stmt.run(
          sector.id,
          sector.warehouseId,
          sector.zoneId,
          sector.code,
          sector.name,
          sector.type,
          sector.capacity || null,
          sector.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting sector ${sector.code}:`, error)
      }
    }
  })

  insertMany(sectors)
  return inserted
}

/**
 * Insert locations into database
 * @param locations - Array of locations to insert
 * @returns Number of locations inserted
 */
export const insertLocations = (locations: readonly Location[]): number => {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO locations (
      id, warehouse_id, zone_id, sector_id, code, type,
      capacity, used_capacity, product_count, picker_count,
      aisle, level, position, barcode, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let inserted = 0

  const insertMany = db.transaction((locations: readonly Location[]) => {
    for (const location of locations) {
      try {
        stmt.run(
          location.id,
          location.warehouseId,
          location.zoneId,
          location.sectorId,
          location.code,
          location.type,
          location.capacity || null,
          location.usedCapacity || null,
          location.productCount || null,
          location.pickerCount || null,
          location.aisle || null,
          location.level || null,
          location.position || null,
          location.barcode || null,
          location.status
        )
        inserted++
      } catch (error) {
        console.error(`Error inserting location ${location.code}:`, error)
      }
    }
  })

  insertMany(locations)
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

  const insertMany = db.transaction((inventory: readonly Inventory[]) => {
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
          null, // last_received_at
          null  // last_shipped_at
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

  const insertMany = db.transaction((movements: readonly Movement[]) => {
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
 * Insert orders and order lines into database
 * @param orders - Array of orders to insert
 * @param orderLines - Array of order lines to insert
 * @returns Number of orders inserted
 */
export const insertOrders = (orders: readonly Order[], orderLines: readonly OrderLine[]): { orders: number, lines: number } => {
  const db = getDatabase()
  const orderStmt = db.prepare(`
    INSERT OR REPLACE INTO orders (
      id, order_number, customer_id, customer_name, customer_email,
      warehouse_id, order_date, required_date, promised_date,
      status, priority, total_quantity, total_amount,
      shipping_address, shipping_city, shipping_country,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  const lineStmt = db.prepare(`
    INSERT OR REPLACE INTO order_lines (
      id, order_id, warehouse_id, product_id, product_sku, product_name,
      quantity, picked_quantity, unit_price, total_price,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let ordersInserted = 0
  let linesInserted = 0

  const insertMany = db.transaction((orders: readonly Order[]) => {
    for (const order of orders) {
      try {
        orderStmt.run(
          order.id,
          order.orderNumber,
          order.customerId,
          order.customerName,
          order.customerEmail || null,
          order.warehouseId,
          formatDate(order.orderDate),
          formatDate(order.requiredDate),
          order.promisedDate ? formatDate(order.promisedDate) : null,
          order.status,
          order.priority,
          order.totalQuantity,
          order.totalAmount,
          order.shippingAddress || null,
          order.shippingCity || null,
          order.shippingCountry || null
        )
        ordersInserted++
      } catch (error) {
        console.error(`Error inserting order ${order.orderNumber}:`, error)
      }
    }
  })

  insertMany(orders)

  // Insert order lines
  const insertLines = db.transaction((lines: readonly OrderLine[]) => {
    for (const line of lines) {
      try {
        lineStmt.run(
          line.id,
          line.orderId,
          line.warehouseId,
          line.productId,
          line.productSku,
          line.productName,
          line.quantity,
          line.pickedQuantity,
          line.unitPrice,
          line.totalPrice
        )
        linesInserted++
      } catch (error) {
        console.error(`Error inserting order line ${line.id}:`, error)
      }
    }
  })

  insertLines(orderLines)

  return { orders: ordersInserted, lines: linesInserted }
}

/**
 * Insert pickings and picking lines into database
 * @param pickings - Array of pickings to insert
 * @param pickingLines - Array of picking lines to insert
 * @returns Number of pickings inserted
 */
export const insertPickings = (pickings: readonly Picking[], pickingLines: readonly PickingLine[]): { pickings: number, lines: number } => {
  const db = getDatabase()
  const pickingStmt = db.prepare(`
    INSERT OR REPLACE INTO pickings (
      id, order_id, order_number, customer_id, customer_name,
      warehouse_id, picking_number, assigned_date, completed_date,
      status, priority, total_quantity, picked_quantity,
      picker, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  const lineStmt = db.prepare(`
    INSERT OR REPLACE INTO picking_lines (
      id, picking_id, warehouse_id, product_id, product_sku, product_name,
      location_code, zone_name, quantity, picked_quantity, unit, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let pickingsInserted = 0
  let linesInserted = 0

  const insertPickings = db.transaction((pickings: readonly Picking[]) => {
    for (const picking of pickings) {
      try {
        pickingStmt.run(
          picking.id,
          picking.orderId,
          picking.orderNumber,
          picking.customerId,
          picking.customerName,
          picking.warehouseId,
          picking.pickingNumber,
          formatDate(picking.assignedDate),
          null, // completed_date
          picking.status,
          picking.priority,
          picking.totalQuantity,
          picking.pickedQuantity,
          picking.picker || null
        )
        pickingsInserted++
      } catch (error) {
        console.error(`Error inserting picking ${picking.pickingNumber}:`, error)
      }
    }
  })

  insertPickings(pickings)

  // Insert picking lines
  const insertLines = db.transaction((lines: readonly PickingLine[]) => {
    for (const line of lines) {
      try {
        lineStmt.run(
          line.id,
          line.pickingId,
          line.warehouseId,
          line.productId,
          line.productSku,
          line.productName,
          line.locationCode,
          line.zoneName || null,
          line.quantity,
          line.pickedQuantity,
          line.unit,
          line.status
        )
        linesInserted++
      } catch (error) {
        console.error(`Error inserting picking line ${line.id}:`, error)
      }
    }
  })

  insertLines(pickingLines)

  return { pickings: pickingsInserted, lines: linesInserted }
}

/**
 * Insert receptions and reception lines into database
 * @param receptions - Array of receptions to insert
 * @param receptionLines - Array of reception lines to insert
 * @returns Number of receptions inserted
 */
export const insertReceptions = (receptions: readonly Reception[], receptionLines: readonly ReceptionLine[]): { receptions: number, lines: number } => {
  const db = getDatabase()
  const receptionStmt = db.prepare(`
    INSERT OR REPLACE INTO receptions (
      id, supplier_id, supplier_name, warehouse_id, reception_number,
      expected_date, received_date, status, priority,
      total_quantity, received_quantity,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  const lineStmt = db.prepare(`
    INSERT OR REPLACE INTO reception_lines (
      id, reception_id, warehouse_id, product_id, product_sku, product_name,
      ordered_quantity, received_quantity, rejected_quantity, unit_price,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let receptionsInserted = 0
  let linesInserted = 0

  const insertReceptions = db.transaction((receptions: readonly Reception[]) => {
    for (const reception of receptions) {
      try {
        receptionStmt.run(
          reception.id,
          reception.supplierId,
          reception.supplierName,
          reception.warehouseId,
          reception.receptionNumber,
          formatDate(reception.expectedDate),
          reception.receivedDate ? formatDate(reception.receivedDate) : null,
          reception.status,
          reception.priority,
          reception.totalQuantity,
          reception.receivedQuantity
        )
        receptionsInserted++
      } catch (error) {
        console.error(`Error inserting reception ${reception.receptionNumber}:`, error)
      }
    }
  })

  insertReceptions(receptions)

  // Insert reception lines
  const insertLines = db.transaction((lines: readonly ReceptionLine[]) => {
    for (const line of lines) {
      try {
        lineStmt.run(
          line.id,
          line.receptionId,
          line.warehouseId,
          line.productId,
          line.productSku,
          line.productName,
          line.orderedQuantity,
          line.receivedQuantity,
          line.rejectedQuantity,
          line.unitPrice
        )
        linesInserted++
      } catch (error) {
        console.error(`Error inserting reception line ${line.id}:`, error)
      }
    }
  })

  insertLines(receptionLines)

  return { receptions: receptionsInserted, lines: linesInserted }
}

/**
 * Insert restockings and restocking lines into database
 * @param restockings - Array of restockings to insert
 * @param restockingLines - Array of restocking lines to insert
 * @returns Number of restockings inserted
 */
export const insertRestockings = (restockings: readonly Restocking[], restockingLines: readonly RestockingLine[]): { restockings: number, lines: number } => {
  const db = getDatabase()
  const restockingStmt = db.prepare(`
    INSERT OR REPLACE INTO restockings (
      id, warehouse_id, restocking_number, status, priority,
      requester, assigned_to, requested_date, started_date, completed_date,
      total_products, restocked_products,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  const lineStmt = db.prepare(`
    INSERT OR REPLACE INTO restocking_lines (
      id, restocking_id, warehouse_id, product_id, product_sku, product_name,
      current_quantity, target_quantity, quantity_to_restock, unit, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let restockingsInserted = 0
  let linesInserted = 0

  const insertRestockings = db.transaction((restockings: readonly Restocking[]) => {
    for (const restocking of restockings) {
      try {
        restockingStmt.run(
          restocking.id,
          restocking.warehouseId,
          restocking.restockingNumber,
          restocking.status,
          restocking.priority,
          restocking.requester,
          null, // assigned_to
          formatDate(restocking.requestedDate),
          null, // started_date
          null, // completed_date
          0, // total_products
          0  // restocked_products
        )
        restockingsInserted++
      } catch (error) {
        console.error(`Error inserting restocking ${restocking.restockingNumber}:`, error)
      }
    }
  })

  insertRestockings(restockings)

  // Insert restocking lines
  const insertLines = db.transaction((lines: readonly RestockingLine[]) => {
    for (const line of lines) {
      try {
        lineStmt.run(
          line.id,
          line.restockingId,
          line.warehouseId,
          line.productId,
          line.productSku,
          line.productName,
          line.currentQuantity,
          line.targetQuantity,
          line.quantityToRestock,
          line.unit,
          line.status
        )
        linesInserted++
      } catch (error) {
        console.error(`Error inserting restocking line ${line.id}:`, error)
      }
    }
  })

  insertLines(restockingLines)

  return { restockings: restockingsInserted, lines: linesInserted }
}

/**
 * Insert returns and return lines into database
 * @param returns - Array of returns to insert
 * @param returnLines - Array of return lines to insert
 * @returns Number of returns inserted
 */
export const insertReturns = (returns: readonly Return[], returnLines: readonly ReturnLine[]): { returns: number, lines: number } => {
  const db = getDatabase()
  const returnStmt = db.prepare(`
    INSERT OR REPLACE INTO returns (
      id, order_id, order_number, customer_id, customer_name,
      warehouse_id, return_date, status, priority, reason, reason_label,
      total_quantity, returned_quantity, total_amount, refunded_amount,
      processor, completed_date,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  const lineStmt = db.prepare(`
    INSERT OR REPLACE INTO return_lines (
      id, return_id, warehouse_id, product_id, product_sku, product_name,
      quantity, unit_price, total_price, condition, resolution,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `)

  let returnsInserted = 0
  let linesInserted = 0

  const insertReturns = db.transaction((returns: readonly Return[]) => {
    for (const ret of returns) {
      try {
        returnStmt.run(
          ret.id,
          ret.orderId,
          ret.orderNumber,
          ret.customerId,
          ret.customerName,
          ret.warehouseId,
          formatDate(ret.returnDate),
          ret.status,
          ret.priority,
          ret.reason,
          ret.reasonLabel,
          ret.totalQuantity,
          ret.returnedQuantity,
          ret.totalAmount,
          ret.refundedAmount,
          ret.processor || null,
          ret.completedDate ? formatDate(ret.completedDate) : null
        )
        returnsInserted++
      } catch (error) {
        console.error(`Error inserting return ${ret.id}:`, error)
      }
    }
  })

  insertReturns(returns)

  // Insert return lines
  const insertLines = db.transaction((lines: readonly ReturnLine[]) => {
    for (const line of lines) {
      try {
        lineStmt.run(
          line.id,
          line.returnId,
          line.warehouseId,
          line.productId,
          line.productSku,
          line.productName,
          line.quantity,
          line.unitPrice,
          line.totalPrice,
          line.condition,
          line.resolution
        )
        linesInserted++
      } catch (error) {
        console.error(`Error inserting return line ${line.id}:`, error)
      }
    }
  })

  insertLines(returnLines)

  return { returns: returnsInserted, lines: linesInserted }
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
  warehousesImported?: number
  usersImported?: number
  suppliersImported?: number
  customersImported?: number
  purchaseOrdersImported?: number
  zonesImported?: number
  sectorsImported?: number
  locationsImported?: number
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
    warehousesImported: 0,
    usersImported: 0,
    suppliersImported: 0,
    customersImported: 0,
    purchaseOrdersImported: 0,
    zonesImported: 0,
    sectorsImported: 0,
    locationsImported: 0,
    ordersImported: 0,
    pickingsImported: 0,
    receptionsImported: 0,
    restockingsImported: 0,
    returnsImported: 0,
  }

  // Insert warehouses first (zones reference them)
  if (data.warehouses && data.warehouses.length > 0) {
    stats.warehousesImported = insertWarehouses(data.warehouses)
  }

  // Insert users
  if (data.users && data.users.length > 0) {
    stats.usersImported = insertUsers(data.users)
  }

  // Insert suppliers
  if (data.suppliers && data.suppliers.length > 0) {
    stats.suppliersImported = insertSuppliers(data.suppliers)
  }

  // Insert customers
  if (data.customers && data.customers.length > 0) {
    stats.customersImported = insertCustomers(data.customers)
  }

  // Insert purchase orders
  if (data.purchaseOrders && data.purchaseOrders.length > 0) {
    stats.purchaseOrdersImported = insertPurchaseOrders(data.purchaseOrders)
  }

  // Insert purchase order lines
  if (data.purchaseOrderLines && data.purchaseOrderLines.length > 0) {
    insertPurchaseOrderLines(data.purchaseOrderLines)
  }

  // Insert zones first (locations reference them)
  if (data.zones && data.zones.length > 0) {
    stats.zonesImported = insertZones(data.zones)
  }

  // Insert sectors (locations reference them)
  if (data.sectors && data.sectors.length > 0) {
    stats.sectorsImported = insertSectors(data.sectors)
  }

  // Insert locations (products and inventory reference them)
  if (data.locations && data.locations.length > 0) {
    stats.locationsImported = insertLocations(data.locations)
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

  // Insert orders and order lines
  if (data.orders && data.orders.length > 0) {
    const orderResults = insertOrders(data.orders, data.orderLines || [])
    stats.ordersImported = orderResults.orders
  }

  // Insert pickings and picking lines
  if (data.pickings && data.pickings.length > 0) {
    const pickingResults = insertPickings(data.pickings, data.pickingLines || [])
    stats.pickingsImported = pickingResults.pickings
  }

  // Insert receptions and reception lines
  if (data.receptions && data.receptions.length > 0) {
    const receptionResults = insertReceptions(data.receptions, data.receptionLines || [])
    stats.receptionsImported = receptionResults.receptions
  }

  // Insert restockings and restocking lines
  if (data.restockings && data.restockings.length > 0) {
    const restockingResults = insertRestockings(data.restockings, data.restockingLines || [])
    stats.restockingsImported = restockingResults.restockings
  }

  // Insert returns and return lines
  if (data.returns && data.returns.length > 0) {
    const returnResults = insertReturns(data.returns, data.returnLines || [])
    stats.returnsImported = returnResults.returns
  }

  return stats
}

/**
 * Format date to SQLite string format
 */
function formatDate(date: Date): string {
  return date.toISOString()
}

import type { NormalizedData, Product, Inventory, Movement, Location, Zone, Sector, Order, OrderLine, Picking, PickingLine, Reception, ReceptionLine, Restocking, RestockingLine, Return, ReturnLine, Warehouse, Supplier, Customer, User, PurchaseOrder, PurchaseOrderLine, Shipment, ShipmentLine } from './types';
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
export declare const insertWarehouses: (warehouses: readonly Warehouse[]) => number;
/**
 * Insert users into database
 * @param users - Array of users to insert
 * @returns Number of users inserted
 */
export declare const insertUsers: (users: readonly User[]) => number;
/**
 * Insert suppliers into database
 * @param suppliers - Array of suppliers to insert
 * @returns Number of suppliers inserted
 */
export declare const insertSuppliers: (suppliers: readonly Supplier[]) => number;
/**
 * Insert customers into database
 * @param customers - Array of customers to insert
 * @returns Number of customers inserted
 */
export declare const insertCustomers: (customers: readonly Customer[]) => number;
/**
 * Insert purchase orders into database
 * @param purchaseOrders - Array of purchase orders to insert
 * @returns Number of purchase orders inserted
 */
export declare const insertPurchaseOrders: (purchaseOrders: readonly PurchaseOrder[]) => number;
/**
 * Insert purchase order lines into database
 * @param purchaseOrderLines - Array of purchase order lines to insert
 * @returns Number of purchase order lines inserted
 */
export declare const insertPurchaseOrderLines: (purchaseOrderLines: readonly PurchaseOrderLine[]) => number;
/**
 * Insert products into database
 * @param products - Array of products to insert
 * @returns Number of products inserted
 */
export declare const insertProducts: (products: readonly Product[]) => number;
/**
 * Insert zones into database
 * @param zones - Array of zones to insert
 * @returns Number of zones inserted
 */
export declare const insertZones: (zones: readonly Zone[]) => number;
/**
 * Insert sectors into database
 * @param sectors - Array of sectors to insert
 * @returns Number of sectors inserted
 */
export declare const insertSectors: (sectors: readonly Sector[]) => number;
/**
 * Insert locations into database
 * @param locations - Array of locations to insert
 * @returns Number of locations inserted
 */
export declare const insertLocations: (locations: readonly Location[]) => number;
/**
 * Insert inventory records into database
 * @param warehouseId - Warehouse ID
 * @param inventory - Array of inventory records
 * @returns Number of records inserted
 */
export declare const insertInventory: (warehouseId: string, inventory: readonly Inventory[]) => number;
/**
 * Insert movements into database
 * @param movements - Array of movements to insert
 * @returns Number of movements inserted
 */
export declare const insertMovements: (movements: readonly Movement[]) => number;
/**
 * Insert orders and order lines into database
 * @param orders - Array of orders to insert
 * @param orderLines - Array of order lines to insert
 * @returns Number of orders inserted
 */
export declare const insertOrders: (orders: readonly Order[], orderLines: readonly OrderLine[]) => {
    orders: number;
    lines: number;
};
/**
 * Insert pickings and picking lines into database
 * @param pickings - Array of pickings to insert
 * @param pickingLines - Array of picking lines to insert
 * @returns Number of pickings inserted
 */
export declare const insertPickings: (pickings: readonly Picking[], pickingLines: readonly PickingLine[]) => {
    pickings: number;
    lines: number;
};
/**
 * Insert receptions and reception lines into database
 * @param receptions - Array of receptions to insert
 * @param receptionLines - Array of reception lines to insert
 * @returns Number of receptions inserted
 */
export declare const insertReceptions: (receptions: readonly Reception[], receptionLines: readonly ReceptionLine[]) => {
    receptions: number;
    lines: number;
};
/**
 * Insert restockings and restocking lines into database
 * @param restockings - Array of restockings to insert
 * @param restockingLines - Array of restocking lines to insert
 * @returns Number of restockings inserted
 */
export declare const insertRestockings: (restockings: readonly Restocking[], restockingLines: readonly RestockingLine[]) => {
    restockings: number;
    lines: number;
};
/**
 * Insert returns and return lines into database
 * @param returns - Array of returns to insert
 * @param returnLines - Array of return lines to insert
 * @returns Number of returns inserted
 */
export declare const insertReturns: (returns: readonly Return[], returnLines: readonly ReturnLine[]) => {
    returns: number;
    lines: number;
};
/**
 * Insert shipments and shipment lines into database
 * @param shipments - Array of shipments to insert
 * @param shipmentLines - Array of shipment lines to insert
 * @returns Number of shipments inserted
 */
export declare const insertShipments: (shipments: readonly Shipment[], shipmentLines: readonly ShipmentLine[]) => {
    shipments: number;
    lines: number;
};
/**
 * Load normalized data into database
 * @param data - Normalized data from plugin
 * @returns Import statistics
 */
export declare const loadToDatabase: (data: NormalizedData) => {
    productsImported: number;
    inventoryImported: number;
    movementsImported: number;
    warehousesImported?: number;
    usersImported?: number;
    suppliersImported?: number;
    customersImported?: number;
    purchaseOrdersImported?: number;
    zonesImported?: number;
    sectorsImported?: number;
    locationsImported?: number;
    ordersImported?: number;
    pickingsImported?: number;
    receptionsImported?: number;
    restockingsImported?: number;
    returnsImported?: number;
    shipmentsImported?: number;
};

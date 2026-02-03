/**
 * Data Loader using Drizzle ORM
 * Handles bulk insertion of normalized data into SQLite database
 */
import type { NormalizedData } from './types';
export declare const insertWarehouses: (warehouses: readonly any[]) => number;
export declare const insertUsers: (users: readonly any[]) => number;
export declare const insertSuppliers: (suppliers: readonly any[]) => number;
export declare const insertCustomers: (customers: readonly any[]) => number;
export declare const insertPurchaseOrders: (purchaseOrders: readonly any[]) => number;
export declare const insertPurchaseOrderLines: (purchaseOrderLines: readonly any[]) => number;
export declare const insertZones: (zones: readonly any[]) => number;
export declare const insertSectors: (sectors: readonly any[]) => number;
export declare const insertLocations: (locations: readonly any[]) => number;
export declare const insertProducts: (products: readonly any[]) => number;
export declare const insertInventory: (_warehouseId: string, inventory: readonly any[]) => number;
export declare const insertMovements: (movements: readonly any[]) => number;
export declare const insertOrders: (orders: readonly any[], orderLines: readonly any[]) => {
    orders: number;
    lines: number;
};
export declare const insertPickings: (pickings: readonly any[], pickingLines: readonly any[]) => {
    pickings: number;
    lines: number;
};
export declare const insertReceptions: (receptions: readonly any[], receptionLines: readonly any[]) => {
    receptions: number;
    lines: number;
};
export declare const insertRestockings: (restockings: readonly any[], restockingLines: readonly any[]) => {
    restockings: number;
    lines: number;
};
export declare const insertReturns: (returns: readonly any[], returnLines: readonly any[]) => {
    returns: number;
    lines: number;
};
export declare const insertShipments: (shipments: readonly any[], shipmentLines: readonly any[]) => {
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

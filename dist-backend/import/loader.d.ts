import type { NormalizedData, Product, Inventory, Movement } from '../types';
/**
 * Insert products into database
 * @param products - Array of products to insert
 * @returns Number of products inserted
 */
export declare const insertProducts: (products: readonly Product[]) => number;
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
 * Load normalized data into database
 * @param data - Normalized data from plugin
 * @returns Import statistics
 */
export declare const loadToDatabase: (data: NormalizedData) => {
    productsImported: number;
    inventoryImported: number;
    movementsImported: number;
    ordersImported?: number;
    pickingsImported?: number;
    receptionsImported?: number;
    restockingsImported?: number;
    returnsImported?: number;
};
//# sourceMappingURL=loader.d.ts.map
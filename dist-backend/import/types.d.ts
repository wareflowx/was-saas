/**
 * Raw sheet data from Excel file
 */
type WMSSheet = {
    readonly headers: readonly string[];
    readonly rows: readonly unknown[];
};
/**
 * Raw WMS input data
 */
type WMSInputData = {
    readonly sheets: Record<string, WMSSheet>;
    readonly metadata: {
        readonly filename: string;
        readonly fileSize: number;
        readonly uploadedAt: Date;
    };
};
/**
 * Column type definition
 */
type ColumnType = 'string' | 'number' | 'date' | 'boolean';
/**
 * Column definition for input schema
 */
type ColumnDefinition = {
    readonly name: string;
    readonly type: ColumnType;
    readonly required: boolean;
    readonly description: string;
};
/**
 * Sheet definition for input schema
 */
type SheetDefinition = {
    readonly name: string;
    readonly required: boolean;
    readonly description: string;
    readonly columns: readonly ColumnDefinition[];
};
/**
 * WMS Input Schema - defines what plugin expects
 */
type WMSInputSchema = {
    readonly sheets: readonly SheetDefinition[];
};
/**
 * Validation severity level
 */
type ValidationSeverity = 'error' | 'warning' | 'info';
/**
 * Validation result
 */
type ValidationResult = {
    readonly severity: ValidationSeverity;
    readonly sheet?: string;
    readonly row?: number;
    readonly column?: string;
    readonly message: string;
    readonly suggestion?: string;
    readonly canContinue: boolean;
};
/**
 * Product entity (normalized)
 */
type Product = {
    readonly id: string;
    readonly sku: string;
    readonly name: string;
    readonly description?: string;
    readonly category: string;
    readonly subcategory?: string;
    readonly brand?: string;
    readonly unit: string;
    readonly weight?: number;
    readonly volume?: number;
    readonly minStock?: number;
    readonly maxStock?: number;
    readonly reorderPoint?: number;
    readonly reorderQuantity?: number;
    readonly costPrice?: number;
    readonly sellingPrice?: number;
    readonly supplier?: string;
    readonly status: string;
};
/**
 * Inventory entity (normalized)
 */
type Inventory = {
    readonly warehouseId: string;
    readonly productId: string;
    readonly locationId?: string;
    readonly quantity: number;
    readonly availableQuantity: number;
    readonly reservedQuantity: number;
};
/**
 * Movement entity (normalized)
 */
type Movement = {
    readonly warehouseId: string;
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
    readonly sourceLocationId?: string;
    readonly sourceZone?: string;
    readonly sourceLocationCode?: string;
    readonly destinationLocationId?: string;
    readonly destinationZone?: string;
    readonly destinationLocationCode?: string;
    readonly quantity: number;
    readonly unit: string;
    readonly movementDate: Date;
    readonly user?: string;
    readonly reason?: string;
    readonly lot?: string;
    readonly expirationDate?: Date;
    readonly referenceType?: string;
    readonly referenceId?: string;
};
/**
 * Warehouse entity (normalized)
 */
type Warehouse = {
    readonly id: string;
    readonly code: string;
    readonly name: string;
    readonly city: string;
    readonly country: string;
    readonly surface?: number;
    readonly capacity?: number;
    readonly manager?: string;
    readonly email?: string;
    readonly phone?: string;
    readonly status: string;
    readonly openingDate?: Date;
};
/**
 * Zone entity (normalized)
 */
type Zone = {
    readonly id: string;
    readonly warehouseId: string;
    readonly code: string;
    readonly name: string;
    readonly type: string;
    readonly surface?: number;
    readonly capacity?: number;
    readonly status: string;
};
/**
 * Sector entity (normalized)
 */
type Sector = {
    readonly id: string;
    readonly warehouseId: string;
    readonly zoneId: string;
    readonly code: string;
    readonly name: string;
    readonly type: string;
    readonly capacity?: number;
    readonly status: string;
};
/**
 * Location entity (normalized)
 */
type Location = {
    readonly id: string;
    readonly warehouseId: string;
    readonly zoneId: string;
    readonly sectorId: string;
    readonly code: string;
    readonly type: string;
    readonly capacity?: number;
    readonly aisle?: string;
    readonly level?: number;
    readonly position?: string;
    readonly status: string;
};
/**
 * Order entity (normalized)
 */
type Order = {
    readonly id: string;
    readonly warehouseId: string;
    readonly orderNumber: string;
    readonly customerId: string;
    readonly customerName: string;
    readonly customerEmail?: string;
    readonly orderDate: Date;
    readonly requiredDate: Date;
    readonly promisedDate?: Date;
    readonly status: string;
    readonly priority: string;
    readonly totalQuantity: number;
    readonly totalAmount: number;
    readonly shippingAddress?: string;
    readonly shippingCity?: string;
    readonly shippingCountry?: string;
};
/**
 * Order Line entity (normalized)
 */
type OrderLine = {
    readonly id: string;
    readonly orderId: string;
    readonly warehouseId: string;
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly quantity: number;
    readonly pickedQuantity: number;
    readonly unitPrice: number;
    readonly totalPrice: number;
};
/**
 * Picking entity (normalized)
 */
type Picking = {
    readonly id: string;
    readonly warehouseId: string;
    readonly orderId: string;
    readonly orderNumber: string;
    readonly customerId: string;
    readonly customerName: string;
    readonly pickingNumber: string;
    readonly assignedDate: Date;
    readonly status: string;
    readonly priority: string;
    readonly totalQuantity: number;
    readonly pickedQuantity: number;
    readonly picker?: string;
};
/**
 * Picking Line entity (normalized)
 */
type PickingLine = {
    readonly id: string;
    readonly pickingId: string;
    readonly warehouseId: string;
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly locationCode: string;
    readonly zoneName?: string;
    readonly quantity: number;
    readonly pickedQuantity: number;
    readonly unit: string;
    readonly status: string;
};
/**
 * Reception entity (normalized)
 */
type Reception = {
    readonly id: string;
    readonly warehouseId: string;
    readonly supplierId: string;
    readonly supplierName: string;
    readonly receptionNumber: string;
    readonly expectedDate: Date;
    readonly receivedDate?: Date;
    readonly status: string;
    readonly priority: string;
    readonly totalQuantity: number;
    readonly receivedQuantity: number;
};
/**
 * Reception Line entity (normalized)
 */
type ReceptionLine = {
    readonly id: string;
    readonly receptionId: string;
    readonly warehouseId: string;
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly orderedQuantity: number;
    readonly receivedQuantity: number;
    readonly rejectedQuantity: number;
    readonly unitPrice: number;
};
/**
 * Restocking entity (normalized)
 */
type Restocking = {
    readonly id: string;
    readonly warehouseId: string;
    readonly restockingNumber: string;
    readonly status: string;
    readonly priority: string;
    readonly requester: string;
    readonly requestedDate: Date;
};
/**
 * Restocking Line entity (normalized)
 */
type RestockingLine = {
    readonly id: string;
    readonly restockingId: string;
    readonly warehouseId: string;
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly sourceLocationId?: string;
    readonly destinationLocationId?: string;
    readonly currentQuantity: number;
    readonly targetQuantity: number;
    readonly quantityToRestock: number;
    readonly unit: string;
};
/**
 * Return entity (normalized)
 */
type Return = {
    readonly id: string;
    readonly warehouseId: string;
    readonly orderNumber?: string;
    readonly returnNumber: string;
    readonly customerId: string;
    readonly customerName: string;
    readonly returnDate: Date;
    readonly type: string;
    readonly status: string;
    readonly priority: string;
    readonly reason: string;
};
/**
 * Return Line entity (normalized)
 */
type ReturnLine = {
    readonly id: string;
    readonly returnId: string;
    readonly warehouseId: string;
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly quantity: number;
    readonly unitPrice: number;
};
/**
 * Supplier entity (normalized)
 */
type Supplier = {
    readonly id: string;
    readonly code: string;
    readonly name: string;
    readonly contactPerson?: string;
    readonly email?: string;
    readonly phone?: string;
    readonly address?: string;
    readonly city?: string;
    readonly country?: string;
};
/**
 * Customer entity (normalized)
 */
type Customer = {
    readonly id: string;
    readonly customerCode: string;
    readonly name: string;
    readonly email?: string;
    readonly phone?: string;
    readonly billingAddress?: string;
    readonly shippingAddress?: string;
    readonly city?: string;
    readonly country?: string;
    readonly customerType?: string;
};
/**
 * User entity (normalized)
 */
type User = {
    readonly id: string;
    readonly warehouseId: string;
    readonly username: string;
    readonly fullName: string;
    readonly email?: string;
    readonly role: string;
    readonly status: string;
};
/**
 * Normalized data output - ALL plugins produce this format
 */
type NormalizedData = {
    readonly metadata: {
        readonly warehouseId: string;
        readonly importDate: Date;
        readonly pluginId: string;
        readonly pluginVersion: string;
        readonly wmsSystem: string;
    };
    readonly products: readonly Product[];
    readonly inventory: readonly Inventory[];
    readonly movements: readonly Movement[];
    readonly warehouses?: readonly Warehouse[];
    readonly zones?: readonly Zone[];
    readonly sectors?: readonly Sector[];
    readonly locations?: readonly Location[];
    readonly orders?: readonly Order[];
    readonly orderLines?: readonly OrderLine[];
    readonly pickings?: readonly Picking[];
    readonly pickingLines?: readonly PickingLine[];
    readonly receptions?: readonly Reception[];
    readonly receptionLines?: readonly ReceptionLine[];
    readonly restockings?: readonly Restocking[];
    readonly restockingLines?: readonly RestockingLine[];
    readonly returns?: readonly Return[];
    readonly returnLines?: readonly ReturnLine[];
    readonly suppliers?: readonly Supplier[];
    readonly customers?: readonly Customer[];
    readonly users?: readonly User[];
};
/**
 * File format type
 */
type FileFormat = 'xlsx' | 'xls' | 'csv';
/**
 * Transform context passed to plugin
 */
type TransformContext = {
    readonly warehouseId: string;
    readonly pluginId: string;
    readonly onProgress?: (progress: number, message: string) => void;
};
/**
 * Import Plugin - Every WMS plugin implements this type
 */
type ImportPlugin = {
    readonly id: string;
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly author: string;
    readonly wmsSystem: string;
    readonly wmsVersions?: readonly string[];
    readonly supportedFormats: readonly FileFormat[];
    readonly inputSchema: WMSInputSchema;
    readonly validate: (input: WMSInputData) => readonly ValidationResult[];
    readonly transform: (input: WMSInputData, context: TransformContext) => NormalizedData;
};
/**
 * Plugin registry - Record of all available plugins
 */
type PluginRegistry = Record<string, ImportPlugin>;
/**
 * Import result returned after import execution
 */
type ImportResult = {
    readonly status: 'success' | 'partial' | 'failed';
    readonly warehouseId: string;
    readonly pluginId: string;
    readonly stats: {
        readonly rowsProcessed: number;
        readonly productsImported: number;
        readonly inventoryImported: number;
        readonly movementsImported: number;
        readonly ordersImported?: number;
        readonly pickingsImported?: number;
        readonly receptionsImported?: number;
        readonly restockingsImported?: number;
        readonly returnsImported?: number;
    };
    readonly duration: number;
    readonly errors: readonly ValidationResult[];
    readonly warnings: readonly ValidationResult[];
};
export type { WMSInputData, WMSSheet, WMSInputSchema, ColumnDefinition, SheetDefinition, ColumnType, ValidationResult, ValidationSeverity, ImportPlugin, PluginRegistry, NormalizedData, TransformContext, ImportResult, FileFormat, Product, Inventory, Movement, Warehouse, Zone, Sector, Location, Order, OrderLine, Picking, PickingLine, Reception, ReceptionLine, Restocking, RestockingLine, Return, ReturnLine, Supplier, Customer, User, };
//# sourceMappingURL=types.d.ts.map
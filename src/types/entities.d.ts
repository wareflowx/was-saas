/**
 * Types for all primitive entities in the warehouse management system
 */
export type WarehouseStatus = "active" | "inactive" | "maintenance";
export interface Warehouse {
    id: string;
    code: string;
    name: string;
    city: string;
    country: string;
    surface: number;
    capacity: number;
    usedCapacity: number;
    zoneCount: number;
    pickerCount: number;
    manager: string;
    email: string;
    phone: string;
    status: WarehouseStatus;
    openingDate: string;
    lastUpdated: string;
}
export interface WarehousesKPIs {
    totalWarehouses: number;
    activeWarehouses: number;
    totalSurface: number;
    totalCapacity: number;
    usedCapacity: number;
    averageOccupancy: number;
    trackedPickers: number;
}
export interface WarehousesData {
    kpis: WarehousesKPIs;
    warehouses: Warehouse[];
}
export type ZoneType = "storage" | "receiving" | "shipping" | "picking" | "packing" | "cold_storage" | "hazardous";
export type ZoneStatus = "active" | "inactive" | "maintenance" | "full";
export interface Zone {
    id: string;
    code: string;
    name: string;
    warehouseId: string;
    warehouseName: string;
    type: ZoneType;
    surface: number;
    capacity: number;
    usedCapacity: number;
    sectorCount: number;
    locationCount: number;
    pickerCount: number;
    temperatureMin?: number;
    temperatureMax?: number;
    status: ZoneStatus;
    lastUpdated: string;
}
export interface ZonesKPIs {
    totalZones: number;
    activeZones: number;
    totalSurface: number;
    totalCapacity: number;
    usedCapacity: number;
    averageOccupancy: number;
    zoneTypes: Record<ZoneType, number>;
}
export interface ZonesData {
    kpis: ZonesKPIs;
    zones: Zone[];
}
export type SectorType = "rack" | "shelf" | "floor" | "bin" | "mezzanine";
export type SectorStatus = "active" | "inactive" | "maintenance" | "full";
export interface Sector {
    id: string;
    code: string;
    name: string;
    zoneId: string;
    zoneName: string;
    warehouseId: string;
    warehouseName: string;
    type: SectorType;
    capacity: number;
    usedCapacity: number;
    locationCount: number;
    pickerCount: number;
    aisle: string;
    level: number;
    position: string;
    status: SectorStatus;
    lastUpdated: string;
}
export interface SectorsKPIs {
    totalSectors: number;
    activeSectors: number;
    totalCapacity: number;
    usedCapacity: number;
    averageOccupancy: number;
    sectorTypes: Record<SectorType, number>;
}
export interface SectorsData {
    kpis: SectorsKPIs;
    sectors: Sector[];
}
export type LocationType = "rack" | "shelf" | "floor" | "bin" | "pallet";
export type LocationStatus = "available" | "occupied" | "blocked" | "reserved" | "full";
export interface LocationProduct {
    id: string;
    sku: string;
    name: string;
    quantity: number;
}
export interface Location {
    id: string;
    code: string;
    sectorId: string;
    sectorName: string;
    zoneId: string;
    zoneName: string;
    warehouseId: string;
    warehouseName: string;
    type: LocationType;
    capacity: number;
    usedCapacity: number;
    productCount: number;
    pickerCount: number;
    aisle: string;
    level: number;
    position: string;
    barcode?: string;
    products: LocationProduct[];
    status: LocationStatus;
    lastUpdated: string;
}
export interface LocationsKPIs {
    totalLocations: number;
    availableLocations: number;
    occupiedLocations: number;
    blockedLocations: number;
    reservedLocations: number;
    totalCapacity: number;
    usedCapacity: number;
    averageOccupancy: number;
}
export interface LocationsData {
    kpis: LocationsKPIs;
    locations: Location[];
}
export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: string;
    subcategory?: string;
    brand?: string;
    unit: string;
    weight?: number;
    volume?: number;
    quantity: number;
    minStock: number;
    maxStock: number;
    reorderPoint: number;
    reorderQuantity: number;
    locationCode?: string;
    locationId?: string;
    zoneName?: string;
    sectorName?: string;
    warehouseName?: string;
    costPrice: number;
    sellingPrice: number;
    supplier?: string;
    lastReceivedDate?: string;
    lastShippedDate?: string;
    status: ProductStatus;
    createdAt: string;
    lastUpdated: string;
}
export interface ProductsKPIs {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    totalQuantity: number;
    totalValue: number;
    categories: number;
}
export interface ProductsData {
    kpis: ProductsKPIs;
    products: Product[];
}
export type OrderStatus = "pending" | "confirmed" | "picking" | "picked" | "packing" | "packed" | "shipped" | "delivered" | "cancelled";
export type OrderPriority = "low" | "medium" | "high" | "urgent";
export interface OrderLine {
    id: string;
    productId: string;
    productSku: string;
    productName: string;
    quantity: number;
    pickedQuantity: number;
    unitPrice: number;
    totalPrice: number;
}
export interface Order {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    customerEmail?: string;
    warehouseId: string;
    warehouseName: string;
    orderDate: string;
    requiredDate: string;
    promisedDate?: string;
    shippedDate?: string;
    deliveredDate?: string;
    status: OrderStatus;
    priority: OrderPriority;
    lines: OrderLine[];
    totalQuantity: number;
    totalAmount: number;
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    trackingNumber?: string;
    carrier?: string;
    notes?: string;
    picker?: string;
    packer?: string;
    createdAt: string;
    lastUpdated: string;
}
export interface OrdersKPIs {
    totalOrders: number;
    pendingOrders: number;
    inProgressOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalValue: number;
    averageOrderValue: number;
}
export interface OrdersData {
    kpis: OrdersKPIs;
    orders: Order[];
}
export type ReceptionStatus = "pending" | "in_progress" | "completed" | "partial" | "cancelled";
export type ReceptionPriority = "low" | "medium" | "high" | "urgent";
export interface ReceptionLine {
    id: string;
    productId: string;
    productSku: string;
    productName: string;
    orderedQuantity: number;
    receivedQuantity: number;
    rejectedQuantity: number;
    unitPrice: number;
    totalPrice: number;
    reason?: string;
}
export interface Reception {
    id: string;
    receptionNumber: string;
    supplierId: string;
    supplierName: string;
    warehouseId: string;
    warehouseName: string;
    purchaseOrderNumber?: string;
    expectedDate: string;
    receivedDate?: string;
    status: ReceptionStatus;
    priority: ReceptionPriority;
    lines: ReceptionLine[];
    totalQuantity: number;
    receivedQuantity: number;
    rejectedQuantity: number;
    totalAmount: number;
    carrier?: string;
    trackingNumber?: string;
    dockDoor?: string;
    receiver?: string;
    notes?: string;
    createdAt: string;
    lastUpdated: string;
}
export interface ReceptionsKPIs {
    totalReceptions: number;
    pendingReceptions: number;
    inProgressReceptions: number;
    completedReceptions: number;
    totalQuantity: number;
    receivedQuantity: number;
    pendingQuantity: number;
}
export interface ReceptionsData {
    kpis: ReceptionsKPIs;
    receptions: Reception[];
}
export type PickingStatus = "pending" | "in_progress" | "completed" | "partial" | "cancelled";
export type PickingPriority = "low" | "medium" | "high" | "urgent";
export interface PickingLine {
    id: string;
    productId: string;
    productSku: string;
    productName: string;
    locationCode: string;
    zoneName: string;
    quantity: number;
    pickedQuantity: number;
    unit: string;
    status: "pending" | "picked" | "partial";
}
export interface Picking {
    id: string;
    pickingNumber: string;
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    warehouseId: string;
    warehouseName: string;
    assignedDate: string;
    startedDate?: string;
    completedDate?: string;
    status: PickingStatus;
    priority: PickingPriority;
    lines: PickingLine[];
    totalQuantity: number;
    pickedQuantity: number;
    remainingQuantity: number;
    picker?: string;
    pickerId?: string;
    equipment?: string;
    notes?: string;
    createdAt: string;
    lastUpdated: string;
}
export interface PickingsKPIs {
    totalPickings: number;
    pendingPickings: number;
    inProgressPickings: number;
    completedPickings: number;
    totalLines: number;
    pickedLines: number;
    completionRate: number;
}
export interface PickingsData {
    kpis: PickingsKPIs;
    pickings: Picking[];
}
export type RestockingStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type RestockingPriority = "low" | "medium" | "high" | "urgent";
export interface RestockingLine {
    id: string;
    productId: string;
    productSku: string;
    productName: string;
    currentQuantity: number;
    targetQuantity: number;
    quantityToRestock: number;
    unit: string;
    status: "pending" | "in_progress" | "completed";
}
export interface Restocking {
    id: string;
    restockingNumber: string;
    warehouseId: string;
    warehouseName: string;
    status: RestockingStatus;
    priority: RestockingPriority;
    lines: RestockingLine[];
    totalProducts: number;
    restockedProducts: number;
    requester: string;
    assignedTo?: string;
    requestedDate: string;
    startedDate?: string;
    completedDate?: string;
    createdAt: string;
    lastUpdated: string;
}
export interface RestockingsKPIs {
    totalRestockings: number;
    pendingRestockings: number;
    inProgressRestockings: number;
    completedRestockings: number;
    totalProducts: number;
    restockedProducts: number;
    pendingProducts: number;
}
export interface RestockingsData {
    kpis: RestockingsKPIs;
    restockings: Restocking[];
}
export type ReturnType = "customer" | "supplier" | "damage" | "defective" | "expired";
export type ReturnStatus = "pending" | "in_progress" | "completed" | "received" | "inspecting" | "approved" | "rejected" | "refunded" | "restocked" | "disposed";
export type ReturnReason = "damaged" | "defective" | "product_defective" | "wrong_item" | "not_as_described" | "no_longer_needed" | "expired" | "quality_issue" | "other";
export interface ReturnLine {
    id: string;
    productId: string;
    productSku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    condition: "new" | "good" | "fair" | "poor" | "damaged";
    resolution: "refund" | "exchange" | "repair" | "dispose";
}
export interface Return {
    id: string;
    returnNumber: string;
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    warehouseId: string;
    warehouseName: string;
    returnDate: string;
    status: ReturnStatus;
    priority: RestockingPriority;
    reason: ReturnReason;
    reasonLabel: string;
    lines: ReturnLine[];
    totalQuantity: number;
    totalAmount: number;
    refundedAmount: number;
    processor?: string;
    completedDate?: string;
    createdAt: string;
    lastUpdated: string;
}
export interface ReturnsKPIs {
    totalReturns: number;
    pendingReturns: number;
    inProgressReturns: number;
    completedReturns: number;
    totalQuantity: number;
    returnedQuantity: number;
    pendingQuantity: number;
    totalValue: number;
    refundedValue: number;
}
export interface ReturnsData {
    kpis: ReturnsKPIs;
    returns: Return[];
}
export interface FilterState {
    search: string;
    status?: string[];
    type?: string[];
    warehouse?: string[];
    zone?: string[];
    sector?: string[];
    dateFrom?: string;
    dateTo?: string;
    priority?: string[];
}
export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
}
//# sourceMappingURL=entities.d.ts.map
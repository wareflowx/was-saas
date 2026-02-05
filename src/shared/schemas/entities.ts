/**
 * Zod Schemas - Runtime validation for all entities
 *
 * All data entering/exiting the application must be validated with these schemas.
 */

import { z } from 'zod'

// ============================================================================
// SHARED SCHEMAS
// ============================================================================

/**
 * Common status type
 */
export const statusSchema = z.enum(['active', 'inactive', 'pending', 'blocked', 'archived'])

/**
 * Common priority type
 */
export const prioritySchema = z.enum(['low', 'normal', 'high', 'urgent'])

// ============================================================================
// WAREHOUSE SCHEMAS
// ============================================================================

export const warehouseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  surface: z.number().nullable(),
  capacity: z.number().nullable(),
  usedCapacity: z.number().nullable(),
  zoneCount: z.number().nullable(),
  pickerCount: z.number().nullable(),
  manager: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  status: statusSchema,
  openingDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Warehouse = z.infer<typeof warehouseSchema>

// ============================================================================
// ZONE SCHEMAS
// ============================================================================

export const zoneSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  surface: z.number().nullable(),
  capacity: z.number().nullable(),
  usedCapacity: z.number().nullable(),
  sectorCount: z.number().nullable(),
  locationCount: z.number().nullable(),
  pickerCount: z.number().nullable(),
  temperatureMin: z.number().nullable(),
  temperatureMax: z.number().nullable(),
  status: statusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  warehouseName: z.string().nullable(),
  warehouseCode: z.string().nullable(),
})

export type Zone = z.infer<typeof zoneSchema>

// ============================================================================
// SECTOR SCHEMAS
// ============================================================================

export const sectorSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  zoneId: z.string(),
  code: z.string(),
  name: z.string(),
  type: z.string(),
  capacity: z.number().nullable(),
  usedCapacity: z.number().nullable(),
  locationCount: z.number().nullable(),
  pickerCount: z.number().nullable(),
  aisle: z.string().nullable(),
  level: z.number().nullable(),
  position: z.string().nullable(),
  status: statusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  zoneName: z.string().nullable(),
  zoneCode: z.string().nullable(),
  warehouseName: z.string().nullable(),
  warehouseCode: z.string().nullable(),
})

export type Sector = z.infer<typeof sectorSchema>

// ============================================================================
// LOCATION SCHEMAS
// ============================================================================

export const locationSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  zoneId: z.string(),
  sectorId: z.string(),
  code: z.string(),
  type: z.string(),
  capacity: z.number().nullable(),
  usedCapacity: z.number().nullable(),
  productCount: z.number().nullable(),
  pickerCount: z.number().nullable(),
  aisle: z.string().nullable(),
  level: z.number().nullable(),
  position: z.string().nullable(),
  barcode: z.string().nullable(),
  status: statusSchema,
  updatedAt: z.string().datetime().nullable(),
  zoneName: z.string().nullable(),
  zoneCode: z.string().nullable(),
  sectorName: z.string().nullable(),
  sectorCode: z.string().nullable(),
  warehouseName: z.string().nullable(),
  warehouseCode: z.string().nullable(),
  products: z.array(z.object({
    id: z.string(),
    sku: z.string(),
    name: z.string(),
    quantity: z.number(),
  })).optional(),
})

export type Location = z.infer<typeof locationSchema>

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const productSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  subcategory: z.string().nullable(),
  brand: z.string().nullable(),
  unit: z.string(),
  weight: z.number().nullable(),
  volume: z.number().nullable(),
  minStock: z.number().nullable(),
  maxStock: z.number().nullable(),
  reorderPoint: z.number().nullable(),
  reorderQuantity: z.number().nullable(),
  costPrice: z.number().nullable(),
  sellingPrice: z.number().nullable(),
  supplier: z.string().nullable(),
  status: statusSchema,
  currentQuantity: z.number().nullable(),
  availableQuantity: z.number().nullable(),
  reservedQuantity: z.number().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Product = z.infer<typeof productSchema>

// ============================================================================
// INVENTORY SCHEMAS
// ============================================================================

export const inventorySchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  productId: z.string(),
  productSku: z.string(),
  productName: z.string(),
  locationId: z.string().nullable(),
  locationCode: z.string().nullable(),
  quantity: z.number(),
  availableQuantity: z.number(),
  reservedQuantity: z.number(),
  lastReceivedAt: z.string().datetime().nullable(),
  lastShippedAt: z.string().datetime().nullable(),
})

export type Inventory = z.infer<typeof inventorySchema>

// ============================================================================
// KPI SCHEMAS
// ============================================================================

export const locationKpiSchema = z.object({
  totalLocations: z.number(),
  availableLocations: z.number(),
  occupiedLocations: z.number(),
  blockedLocations: z.number(),
  reservedLocations: z.number(),
  totalCapacity: z.number(),
  usedCapacity: z.number(),
  averageOccupancy: z.number(),
})

export type LocationKpi = z.infer<typeof locationKpiSchema>

export const zoneKpiSchema = z.object({
  totalZones: z.number(),
  activeZones: z.number(),
  totalSurface: z.number(),
  totalCapacity: z.number(),
  usedCapacity: z.number(),
  averageOccupancy: z.number(),
  zoneTypes: z.record(z.string(), z.number()),
})

export type ZoneKpi = z.infer<typeof zoneKpiSchema>

export const sectorKpiSchema = z.object({
  totalSectors: z.number(),
  activeSectors: z.number(),
  totalCapacity: z.number(),
  usedCapacity: z.number(),
  averageOccupancy: z.number(),
  sectorTypes: z.record(z.string(), z.number()),
})

export type SectorKpi = z.infer<typeof sectorKpiSchema>

// ============================================================================
// DATA RESPONSE SCHEMAS
// ============================================================================

export const locationsDataSchema = z.object({
  kpis: locationKpiSchema,
  locations: z.array(locationSchema),
})

export type LocationsData = z.infer<typeof locationsDataSchema>

export const zonesDataSchema = z.object({
  kpis: zoneKpiSchema,
  zones: z.array(zoneSchema),
})

export type ZonesData = z.infer<typeof zonesDataSchema>

export const sectorsDataSchema = z.object({
  kpis: sectorKpiSchema,
  sectors: z.array(sectorSchema),
})

export type SectorsData = z.infer<typeof sectorsDataSchema>

export const warehousesDataSchema = z.object({
  kpis: z.object({
    totalWarehouses: z.number(),
    activeWarehouses: z.number(),
    totalSurface: z.number(),
    totalCapacity: z.number(),
    usedCapacity: z.number(),
    averageOccupancy: z.number(),
    trackedPickers: z.number(),
  }),
  warehouses: z.array(warehouseSchema),
})

export type WarehousesData = z.infer<typeof warehousesDataSchema>

// ============================================================================
// PRODUCTS DATA SCHEMA
// ============================================================================

export const productsDataSchema = z.object({
  kpis: z.object({
    totalProducts: z.number(),
    inStock: z.number(),
    lowStock: z.number(),
    outOfStock: z.number(),
    totalQuantity: z.number(),
    totalValue: z.number(),
    categories: z.number(),
  }),
  products: z.array(productSchema),
})

export type ProductsData = z.infer<typeof productsDataSchema>

// ============================================================================
// DASHBOARD SCHEMAS
// ============================================================================

export const dashboardKpiSchema = z.object({
  totalProducts: z.number(),
  totalLocations: z.number(),
  lowStockItems: z.number(),
  activeOrders: z.number(),
  movementsThisWeek: z.number(),
})

export const stockEvolutionPointSchema = z.object({
  date: z.string(),
  quantity: z.number(),
  value: z.number(),
})

export const movementByTypeSchema = z.object({
  type: z.string(),
  count: z.number(),
  quantity: z.number(),
})

export const topProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  totalMovements: z.number(),
  totalQuantity: z.number(),
})

export const lowStockAlertSchema = z.object({
  sku: z.string(),
  name: z.string(),
  currentQuantity: z.number(),
  minStock: z.number(),
  shortage: z.number(),
})

export const recentMovementSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.string(),
  productSku: z.string(),
  productName: z.string(),
  quantity: z.number(),
  locationCode: z.string().nullable(),
})

export const dashboardDataSchema = z.object({
  kpis: dashboardKpiSchema,
  stockEvolution: z.array(stockEvolutionPointSchema),
  movementsByType: z.array(movementByTypeSchema),
  topProducts: z.array(topProductSchema),
  lowStockAlerts: z.array(lowStockAlertSchema),
  recentMovements: z.array(recentMovementSchema),
})

export type DashboardData = z.infer<typeof dashboardDataSchema>

// ============================================================================
// IMPORT HISTORY SCHEMA
// ============================================================================

export const importHistoryEntrySchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  pluginId: z.string(),
  pluginName: z.string(),
  status: z.enum(['success', 'partial', 'failed']),
  rowsProcessed: z.number(),
  productsImported: z.number(),
  inventoryImported: z.number(),
  movementsImported: z.number(),
  duration: z.number(),
  createdAt: z.string().datetime(),
})

export type ImportHistoryEntry = z.infer<typeof importHistoryEntrySchema>

// ============================================================================
// RECEPTION SCHEMAS
// ============================================================================

export const receptionSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  receptionNumber: z.string(),
  supplierName: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  totalQuantity: z.number(),
  receivedQuantity: z.number(),
  pendingQuantity: z.number(),
  receptionDate: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type Reception = z.infer<typeof receptionSchema>

export const receptionsDataSchema = z.object({
  kpis: z.object({
    totalReceptions: z.number(),
    pendingReceptions: z.number(),
    inProgressReceptions: z.number(),
    completedReceptions: z.number(),
    totalQuantity: z.number(),
    receivedQuantity: z.number(),
    pendingQuantity: z.number(),
  }),
  receptions: z.array(receptionSchema),
})

export type ReceptionsData = z.infer<typeof receptionsDataSchema>

// ============================================================================
// PICKING SCHEMAS
// ============================================================================

export const pickingSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  pickingNumber: z.string(),
  customerName: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  totalLines: z.number(),
  pickedLines: z.number(),
  totalQuantity: z.number(),
  pickedQuantity: z.number(),
  pickingDate: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type Picking = z.infer<typeof pickingSchema>

export const pickingsDataSchema = z.object({
  kpis: z.object({
    totalPickings: z.number(),
    pendingPickings: z.number(),
    inProgressPickings: z.number(),
    completedPickings: z.number(),
    totalLines: z.number(),
    pickedLines: z.number(),
    completionRate: z.number(),
  }),
  pickings: z.array(pickingSchema),
})

export type PickingsData = z.infer<typeof pickingsDataSchema>

// ============================================================================
// RETURN SCHEMAS
// ============================================================================

export const returnSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  returnNumber: z.string(),
  customerName: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  totalQuantity: z.number(),
  returnedQuantity: z.number(),
  pendingQuantity: z.number(),
  totalValue: z.number(),
  refundedValue: z.number(),
  returnDate: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type Return = z.infer<typeof returnSchema>

export const returnsDataSchema = z.object({
  kpis: z.object({
    totalReturns: z.number(),
    pendingReturns: z.number(),
    inProgressReturns: z.number(),
    completedReturns: z.number(),
    totalQuantity: z.number(),
    returnedQuantity: z.number(),
    pendingQuantity: z.number(),
    totalValue: z.number(),
    refundedValue: z.number(),
  }),
  returns: z.array(returnSchema),
})

export type ReturnsData = z.infer<typeof returnsDataSchema>

// ============================================================================
// RESTOCKING SCHEMAS
// ============================================================================

export const restockingSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  restockingNumber: z.string(),
  requester: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  totalProducts: z.number(),
  restockedProducts: z.number(),
  pendingProducts: z.number(),
  restockingDate: z.string().datetime(),
  createdAt: z.string().datetime(),
})

export type Restocking = z.infer<typeof restockingSchema>

export const restockingsDataSchema = z.object({
  kpis: z.object({
    totalRestockings: z.number(),
    pendingRestockings: z.number(),
    inProgressRestockings: z.number(),
    completedRestockings: z.number(),
    totalProducts: z.number(),
    restockedProducts: z.number(),
    pendingProducts: z.number(),
  }),
  restockings: z.array(restockingSchema),
})

export type RestockingsData = z.infer<typeof restockingsDataSchema>

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

export const orderLineSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productSku: z.string(),
  productName: z.string(),
  quantity: z.number(),
  price: z.number(),
})

export type OrderLine = z.infer<typeof orderLineSchema>

export const orderSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  orderNumber: z.string(),
  customerName: z.string(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'shipped', 'delivered', 'cancelled']),
  totalLines: z.number(),
  totalValue: z.number(),
  orderDate: z.string().datetime(),
  lines: z.array(orderLineSchema),
})

export type Order = z.infer<typeof orderSchema>

export const ordersDataSchema = z.object({
  kpis: z.object({
    totalOrders: z.number(),
    pendingOrders: z.number(),
    inProgressOrders: z.number(),
    shippedOrders: z.number(),
    deliveredOrders: z.number(),
    cancelledOrders: z.number(),
    totalValue: z.number(),
    averageOrderValue: z.number(),
  }),
  orders: z.array(orderSchema),
})

export type OrdersData = z.infer<typeof ordersDataSchema>

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const userSchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  username: z.string(),
  fullName: z.string(),
  email: z.string().nullable(),
  role: z.string(),
  status: statusSchema,
  lastLoginAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  warehouseName: z.string().nullable(),
  warehouseCode: z.string().nullable(),
})

export type User = z.infer<typeof userSchema>

export const usersDataSchema = z.object({
  kpis: z.object({
    totalUsers: z.number(),
    activeUsers: z.number(),
    inactiveUsers: z.number(),
    pendingUsers: z.number(),
    operatorsCount: z.number(),
    managersCount: z.number(),
    adminsCount: z.number(),
  }),
  users: z.array(userSchema),
})

export type UsersData = z.infer<typeof usersDataSchema>

// ============================================================================
// ANALYSIS SCHEMAS
// ============================================================================

export const abcProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  totalQuantity: z.number(),
  totalValue: z.number(),
  movementCount: z.number(),
  contribution: z.number(),
  abcClass: z.enum(['A', 'B', 'C']),
})

export type ABCProduct = z.infer<typeof abcProductSchema>

export const abcAnalysisResultSchema = z.object({
  products: z.array(abcProductSchema),
  summary: z.object({
    totalProducts: z.number(),
    classA: z.object({
      count: z.number(),
      contribution: z.number(),
    }),
    classB: z.object({
      count: z.number(),
      contribution: z.number(),
    }),
    classC: z.object({
      count: z.number(),
      contribution: z.number(),
    }),
  }),
  totalQuantity: z.number(),
  totalValue: z.number(),
  analysisDate: z.string().datetime(),
  parameters: z.object({
    warehouseId: z.string(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
})

export type ABCAnalysisResult = z.infer<typeof abcAnalysisResultSchema>

export const deadStockProductSchema = z.object({
  sku: z.string(),
  name: z.string(),
  currentQuantity: z.number(),
  lastMovementDate: z.string().datetime(),
  daysSinceLastMovement: z.number(),
  value: z.number(),
  category: z.string(),
  level: z.enum(['critical', 'warning', 'monitor']),
})

export type DeadStockProduct = z.infer<typeof deadStockProductSchema>

export const deadStockAnalysisResultSchema = z.object({
  products: z.array(deadStockProductSchema),
  summary: z.object({
    totalProducts: z.number(),
    deadStockProducts: z.number(),
    totalTiedCapital: z.number(),
    criticalLevel: z.object({
      count: z.number(),
      tiedCapital: z.number(),
    }),
    warningLevel: z.object({
      count: z.number(),
      tiedCapital: z.number(),
    }),
    monitorLevel: z.object({
      count: z.number(),
      tiedCapital: z.number(),
    }),
  }),
  analysisDate: z.string().datetime(),
  parameters: z.object({
    warehouseId: z.string(),
    thresholdDays: z.number(),
    criticalThreshold: z.number(),
    warningThreshold: z.number(),
  }),
})

export type DeadStockAnalysisResult = z.infer<typeof deadStockAnalysisResultSchema>

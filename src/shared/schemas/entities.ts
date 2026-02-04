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

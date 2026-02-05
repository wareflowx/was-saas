/**
 * Type validation test for typedElectronAPI
 *
 * This file validates that all types are correctly imported and usable.
 * If TypeScript compiles this file without errors, the types are working correctly.
 */

import type { Result, AppError } from '../shared/types'
import type {
  WarehousesData,
  LocationsData,
  ZonesData,
  SectorsData,
  ProductsData,
  DashboardData,
  ImportHistoryEntry,
  ReceptionsData,
  PickingsData,
  ReturnsData,
  RestockingsData,
  OrdersData,
  ABCAnalysisResult,
  DeadStockAnalysisResult,
} from '../shared/schemas/entities'
import type { ImportResult } from '../backend/import/types'

// ============================================================================
// TYPE INFERENCE TESTS
// ============================================================================

// Test that window.typedElectronAPI is properly typed
declare const api: typeof window.typedElectronAPI

// Warehouses
const warehousesResult: Promise<Result<WarehousesData, AppError>> = api.warehouses.getAll()
const warehousesWithKPIs: Promise<Result<WarehousesData, AppError>> = api.warehouses.getWithKPIs()

// Locations
const locationsResult: Promise<Result<LocationsData, AppError>> = api.locations.getAll()
const locationsWithWarehouse: Promise<Result<LocationsData, AppError>> = api.locations.getAll({ warehouseId: 'WH-001' })

// Zones
const zonesResult: Promise<Result<ZonesData, AppError>> = api.zones.getAll()
const zonesWithWarehouse: Promise<Result<ZonesData, AppError>> = api.zones.getAll({ warehouseId: 'WH-001' })

// Sectors
const sectorsResult: Promise<Result<SectorsData, AppError>> = api.sectors.getAll()

// Products
const productsResult: Promise<Result<ProductsData, AppError>> = api.products.getAll({ warehouseId: 'WH-001' })

// Dashboard
const dashboardResult: Promise<Result<DashboardData, AppError>> = api.dashboard.getKPIs()
const dashboardWithWarehouse: Promise<Result<DashboardData, AppError>> = api.dashboard.getKPIs({ warehouseId: 'WH-001' })

// Import History
const importHistoryResult: Promise<Result<readonly ImportHistoryEntry[], AppError>> = api.importHistory.getAll()

// Import
const importResult: Promise<ImportResult> = api.import.generateMockData('WH-001')

// Receptions
const receptionsResult: Promise<Result<ReceptionsData, AppError>> = api.receptions.getAll({ warehouseId: 'WH-001' })

// Pickings
const pickingsResult: Promise<Result<PickingsData, AppError>> = api.pickings.getAll({ warehouseId: 'WH-001' })

// Returns
const returnsResult: Promise<Result<ReturnsData, AppError>> = api.returns.getAll({ warehouseId: 'WH-001' })

// Restockings
const restockingsResult: Promise<Result<RestockingsData, AppError>> = api.restockings.getAll({ warehouseId: 'WH-001' })

// Orders
const ordersResult: Promise<Result<OrdersData, AppError>> = api.orders.getWithLines({ warehouseId: 'WH-001' })

// Analysis
const abcResult: Promise<Result<ABCAnalysisResult, AppError>> = api.analysis.abc({
  warehouseId: 'WH-001',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
})

const deadStockResult: Promise<Result<DeadStockAnalysisResult, AppError>> = api.analysis.deadStock({
  warehouseId: 'WH-001',
  thresholdDays: 90,
  criticalThreshold: 365,
  warningThreshold: 180,
})

// ============================================================================
// RESULT TYPE TESTS
// ============================================================================

async function testResultHandling() {
  // Test successful result
  const warehouses = await api.warehouses.getAll()
  if (warehouses.success) {
    const data: WarehousesData = warehouses.data
    const kpis = data.kpis
    const warehouseList = data.warehouses
  }

  // Test error result
  if (!warehouses.success) {
    const error: AppError = warehouses.error
    const message: string = error.message
  }
}

// ============================================================================
// EXPORT VALIDATION
// ============================================================================

export type TypedElectronAPI = typeof window.typedElectronAPI

// This export ensures all types are accessible from other parts of the app
export { typedElectronAPI } from './typed-api'

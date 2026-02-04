/**
 * Typed Electron API Types
 *
 * Type definitions for the typedElectronAPI exposed via contextBridge.
 * These types are inferred from the IPC contract and provide full type safety.
 */
import type { Result, AppError } from '../shared/types';
import type { WarehousesData, LocationsData, ZonesData, SectorsData, ProductsData, DashboardData, ImportHistoryEntry, ReceptionsData, PickingsData, ReturnsData, RestockingsData, OrdersData, ABCAnalysisResult, DeadStockAnalysisResult } from '../shared/schemas/entities';
import type { ImportResult } from '../backend/import/types';
/**
 * Typed Electron API - Type-safe communication with Result<T, AppError>
 * All methods return Promise<Result<T, AppError>> for explicit error handling
 */
export interface TypedElectronAPI {
    readonly warehouses: {
        readonly getAll: () => Promise<Result<WarehousesData, AppError>>;
        readonly getWithKPIs: () => Promise<Result<WarehousesData, AppError>>;
    };
    readonly locations: {
        readonly getAll: (params?: {
            warehouseId?: string;
        }) => Promise<Result<LocationsData, AppError>>;
    };
    readonly zones: {
        readonly getAll: (params?: {
            warehouseId?: string;
        }) => Promise<Result<ZonesData, AppError>>;
    };
    readonly sectors: {
        readonly getAll: (params?: {
            warehouseId?: string;
        }) => Promise<Result<SectorsData, AppError>>;
    };
    readonly products: {
        readonly getAll: (params: {
            warehouseId: string;
        }) => Promise<Result<ProductsData, AppError>>;
    };
    readonly dashboard: {
        readonly getKPIs: (params: {
            warehouseId?: string;
        }) => Promise<Result<DashboardData, AppError>>;
    };
    readonly importHistory: {
        readonly getAll: (params?: {
            warehouseId?: string;
        }) => Promise<Result<readonly ImportHistoryEntry[], AppError>>;
    };
    readonly import: {
        readonly generateMockData: (warehouseId: string) => Promise<ImportResult>;
    };
    readonly receptions: {
        readonly getAll: (params: {
            warehouseId: string;
        }) => Promise<Result<ReceptionsData, AppError>>;
    };
    readonly pickings: {
        readonly getAll: (params: {
            warehouseId: string;
        }) => Promise<Result<PickingsData, AppError>>;
    };
    readonly returns: {
        readonly getAll: (params: {
            warehouseId: string;
        }) => Promise<Result<ReturnsData, AppError>>;
    };
    readonly restockings: {
        readonly getAll: (params: {
            warehouseId: string;
        }) => Promise<Result<RestockingsData, AppError>>;
    };
    readonly orders: {
        readonly getWithLines: (params: {
            warehouseId: string;
        }) => Promise<Result<OrdersData, AppError>>;
    };
    readonly analysis: {
        readonly abc: (params: {
            warehouseId: string;
            dateFrom?: string;
            dateTo?: string;
        }) => Promise<Result<ABCAnalysisResult, AppError>>;
        readonly deadStock: (params: {
            warehouseId: string;
            thresholdDays?: number;
            criticalThreshold?: number;
            warningThreshold?: number;
        }) => Promise<Result<DeadStockAnalysisResult, AppError>>;
    };
}

/**
 * Analysis types
 *
 * This file contains shared types for all analysis modules.
 * Each analysis module should re-export its specific types.
 */
/**
 * ABC Classification type
 */
export type ABCClass = 'A' | 'B' | 'C';
/**
 * Product with ABC classification
 */
export type ABCProduct = {
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly category: string;
    readonly totalQuantity: number;
    readonly contribution: number;
    readonly cumulativeContribution: number;
    readonly abcClass: ABCClass;
};
/**
 * ABC Analysis result
 */
export type ABCAnalysisResult = {
    readonly products: readonly ABCProduct[];
    readonly summary: {
        readonly totalProducts: number;
        readonly classA: {
            count: number;
            contribution: number;
        };
        readonly classB: {
            count: number;
            contribution: number;
        };
        readonly classC: {
            count: number;
            contribution: number;
        };
    };
    readonly totalQuantity: number;
    readonly analysisDate: Date;
    readonly parameters: {
        readonly warehouseId: string;
        readonly dateFrom?: string;
        readonly dateTo?: string;
    };
};
/**
 * Dead Stock product classification
 */
export type DeadStockLevel = 'critical' | 'warning' | 'monitor';
/**
 * Product with dead stock classification
 */
export type DeadStockProduct = {
    readonly productId: string;
    readonly productSku: string;
    readonly productName: string;
    readonly category: string;
    readonly currentQuantity: number;
    readonly lastMovementDate: Date | null;
    readonly daysSinceLastMovement: number | null;
    readonly unitCost: number;
    readonly tiedCapital: number;
    readonly deadStockLevel: DeadStockLevel;
};
/**
 * Dead Stock Analysis result
 */
export type DeadStockAnalysisResult = {
    readonly products: readonly DeadStockProduct[];
    readonly summary: {
        readonly totalProducts: number;
        readonly deadStockProducts: number;
        readonly totalTiedCapital: number;
        readonly criticalLevel: {
            count: number;
            tiedCapital: number;
        };
        readonly warningLevel: {
            count: number;
            tiedCapital: number;
        };
        readonly monitorLevel: {
            count: number;
            tiedCapital: number;
        };
    };
    readonly analysisDate: Date;
    readonly parameters: {
        readonly warehouseId: string;
        readonly thresholdDays: number;
        readonly criticalThreshold: number;
        readonly warningThreshold: number;
    };
};

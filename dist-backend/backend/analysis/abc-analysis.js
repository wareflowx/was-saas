"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runABCAnalysis = void 0;
/**
 * Run ABC Analysis on warehouse movements
 * @param warehouseId - Warehouse ID
 * @param dateFrom - Optional date range start
 * @param dateTo - Optional date range end
 * @returns ABC analysis result
 */
const runABCAnalysis = (warehouseId, dateFrom, dateTo) => {
    const { getProductMovementTotals } = require('../database/queries');
    // Get product movement totals (outbound = sales/picking)
    const movements = getProductMovementTotals(warehouseId, 'outbound', dateFrom, dateTo);
    if (movements.length === 0) {
        return {
            products: [],
            summary: {
                totalProducts: 0,
                classA: { count: 0, contribution: 0 },
                classB: { count: 0, contribution: 0 },
                classC: { count: 0, contribution: 0 },
            },
            totalQuantity: 0,
            analysisDate: new Date(),
            parameters: {
                warehouseId,
                dateFrom,
                dateTo,
            },
        };
    }
    // Calculate totals
    const totalQuantity = movements.reduce((sum, movement) => sum + movement.total_quantity, 0);
    // Calculate contribution and cumulative contribution for each product
    let cumulativeContribution = 0;
    const productsWithABC = movements.map((movement) => {
        const quantity = movement.total_quantity;
        const contribution = (quantity / totalQuantity) * 100;
        cumulativeContribution += contribution;
        let abcClass;
        if (cumulativeContribution <= 20) {
            abcClass = 'A';
        }
        else if (cumulativeContribution <= 50) {
            abcClass = 'B';
        }
        else {
            abcClass = 'C';
        }
        return {
            productId: movement.product_id,
            productSku: movement.sku,
            productName: movement.name,
            category: '',
            totalQuantity: quantity,
            contribution,
            cumulativeContribution,
            abcClass,
        };
    });
    // Calculate summary statistics
    const summary = {
        totalProducts: productsWithABC.length,
        classA: {
            count: productsWithABC.filter((p) => p.abcClass === 'A').length,
            contribution: productsWithABC
                .filter((p) => p.abcClass === 'A')
                .reduce((sum, p) => sum + p.contribution, 0),
        },
        classB: {
            count: productsWithABC.filter((p) => p.abcClass === 'B').length,
            contribution: productsWithABC
                .filter((p) => p.abcClass === 'B')
                .reduce((sum, p) => sum + p.contribution, 0),
        },
        classC: {
            count: productsWithABC.filter((p) => p.abcClass === 'C').length,
            contribution: productsWithABC
                .filter((p) => p.abcClass === 'C')
                .reduce((sum, p) => sum + p.contribution, 0),
        },
    };
    return {
        products: productsWithABC,
        summary,
        totalQuantity,
        analysisDate: new Date(),
        parameters: {
            warehouseId,
            dateFrom,
            dateTo,
        },
    };
};
exports.runABCAnalysis = runABCAnalysis;

import type { DeadStockAnalysisResult, DeadStockProduct, DeadStockLevel } from './types'

// ============================================================================
// DEAD STOCK ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Run Dead Stock Analysis on warehouse inventory
 * @param warehouseId - Warehouse ID
 * @param thresholdDays - Days threshold for dead stock classification (default: 90)
 * @param criticalThreshold - Days for critical level (default: 180)
 * @param warningThreshold - Days for warning level (default: 90)
 * @returns Dead stock analysis result
 */
export const runDeadStockAnalysis = (
  warehouseId: string,
  thresholdDays: number = 90,
  criticalThreshold: number = 180,
  warningThreshold: number = 90
): DeadStockAnalysisResult => {
  const { getDeadStock } = require('../database/queries')

  // Get dead stock data
  const deadStockData = getDeadStock(warehouseId)

  if (deadStockData.length === 0) {
    return {
      products: [],
      summary: {
        totalProducts: 0,
        deadStockProducts: 0,
        totalTiedCapital: 0,
        criticalLevel: { count: 0, tiedCapital: 0 },
        warningLevel: { count: 0, tiedCapital: 0 },
        monitorLevel: { count: 0, tiedCapital: 0 },
      },
      analysisDate: new Date(),
      parameters: {
        warehouseId,
        thresholdDays,
        criticalThreshold,
        warningThreshold,
      },
    }
  }

  const currentDate = new Date()

  // Calculate dead stock classification for each product
  const productsWithDeadStock = deadStockData.map((item: any) => {
    const lastMovementDate = item.last_movement_date
      ? new Date(item.last_movement_date)
      : null

    let daysSinceLastMovement: number | null = null
    if (lastMovementDate) {
      const diffTime = Math.abs(currentDate.getTime() - lastMovementDate.getTime())
      daysSinceLastMovement = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    }

    const currentQuantity = item.quantity as number
    const unitCost = (item.cost_price as number) || 0
    const tiedCapital = currentQuantity * unitCost

    let deadStockLevel: DeadStockLevel
    if (daysSinceLastMovement === null) {
      // No movement ever recorded
      deadStockLevel = 'critical'
    } else if (daysSinceLastMovement >= criticalThreshold) {
      deadStockLevel = 'critical'
    } else if (daysSinceLastMovement >= warningThreshold) {
      deadStockLevel = 'warning'
    } else {
      deadStockLevel = 'monitor'
    }

    return {
      productId: item.product_id,
      productSku: item.sku,
      productName: item.name,
      category: item.category || '',
      currentQuantity,
      lastMovementDate,
      daysSinceLastMovement,
      unitCost,
      tiedCapital,
      deadStockLevel,
    }
  })

  // Filter products by threshold
  const filteredProducts = productsWithDeadStock.filter((p: DeadStockProduct) => {
    if (p.daysSinceLastMovement === null) {
      // Include products with no movement ever
      return true
    }
    return p.daysSinceLastMovement >= thresholdDays
  })

  // Sort by tied capital descending (most capital tied up first)
  const sortedProducts = filteredProducts.sort((a: DeadStockProduct, b: DeadStockProduct) => b.tiedCapital - a.tiedCapital)

  // Calculate summary statistics
  const summary = {
    totalProducts: productsWithDeadStock.length,
    deadStockProducts: sortedProducts.length,
    totalTiedCapital: sortedProducts.reduce((sum: number, p: DeadStockProduct) => sum + p.tiedCapital, 0),
    criticalLevel: {
      count: sortedProducts.filter((p: DeadStockProduct) => p.deadStockLevel === 'critical').length,
      tiedCapital: sortedProducts
        .filter((p: DeadStockProduct) => p.deadStockLevel === 'critical')
        .reduce((sum: number, p: DeadStockProduct) => sum + p.tiedCapital, 0),
    },
    warningLevel: {
      count: sortedProducts.filter((p: DeadStockProduct) => p.deadStockLevel === 'warning').length,
      tiedCapital: sortedProducts
        .filter((p: DeadStockProduct) => p.deadStockLevel === 'warning')
        .reduce((sum: number, p: DeadStockProduct) => sum + p.tiedCapital, 0),
    },
    monitorLevel: {
      count: sortedProducts.filter((p: DeadStockProduct) => p.deadStockLevel === 'monitor').length,
      tiedCapital: sortedProducts
        .filter((p: DeadStockProduct) => p.deadStockLevel === 'monitor')
        .reduce((sum: number, p: DeadStockProduct) => sum + p.tiedCapital, 0),
    },
  }

  return {
    products: sortedProducts,
    summary,
    analysisDate: currentDate,
    parameters: {
      warehouseId,
      thresholdDays,
      criticalThreshold,
      warningThreshold,
    },
  }
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type { DeadStockAnalysisResult, DeadStockProduct, DeadStockLevel } from './types'

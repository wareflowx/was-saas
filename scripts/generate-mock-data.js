/**
 * Mock Data Generator Script
 *
 * Run this script to generate test data in the database
 * Usage: node scripts/generate-mock-data.js <warehouseId>
 *
 * Example: node scripts/generate-mock-data.js WH-001
 */

import { initializeDatabase } from '../dist-backend/database/index.js'
import { mockDataGeneratorPlugin } from '../dist-backend/import/plugins/mock-data-generator/index.js'
import { loadToDatabase } from '../dist-backend/import/loader.js'

async function main() {
  const warehouseId = process.argv[2] || 'WH-001'

  console.log('🚀 Mock Data Generator')
  console.log('======================')
  console.log(`Warehouse ID: ${warehouseId}`)
  console.log('')

  try {
    // Initialize database
    console.log('📦 Initializing database...')
    initializeDatabase()
    console.log('✅ Database initialized')
    console.log('')

    // Generate mock data
    console.log('🎲 Generating mock data...')
    const normalizedData = mockDataGeneratorPlugin.transform(
      {},
      { warehouseId, pluginId: 'mock-data-generator', onProgress: () => {} }
    )

    console.log(`   - ${normalizedData.products.length} products`)
    console.log(`   - ${normalizedData.inventory.length} inventory records`)
    console.log(`   - ${normalizedData.movements.length} movements`)
    console.log('')

    // Load to database
    console.log('💾 Loading data into database...')
    const stats = loadToDatabase(normalizedData)

    console.log(`   - ${stats.productsImported} products imported`)
    console.log(`   - ${stats.inventoryImported} inventory records imported`)
    console.log(`   - ${stats.movementsImported} movements imported`)
    console.log('')

    console.log('✅ Mock data generated successfully!')
    console.log('')
    console.log('You can now run ABC and Dead Stock analyses on this warehouse.')
    console.log(`Warehouse ID: ${warehouseId}`)

  } catch (error) {
    console.error('❌ Error generating mock data:', error)
    process.exit(1)
  }
}

main()

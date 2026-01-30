import type {
  ImportPlugin,
  NormalizedData,
  TransformContext,
  Product,
  Inventory,
  Movement,
  Location,
  Zone,
  Sector,
} from '../../types'

// ============================================================================
// MOCK DATA GENERATOR PLUGIN
// Generates realistic test data for development and testing
// ============================================================================

/**
 * Product categories for realistic data
 */
const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
  'Tools & Hardware',
  'Health & Beauty',
  'Toys & Games',
  'Automotive',
  'Office Supplies',
] as const

/**
 * Unit of measures
 */
const UNITS = ['ea', 'kg', 'lb', 'm', 'l', 'gal', 'box', 'pallet'] as const

// ============================================================================
// MOCK DATA GENERATOR PLUGIN DEFINITION
// ============================================================================

export const mockDataGeneratorPlugin: ImportPlugin = {
  // Identification
  id: 'mock-data-generator',
  name: 'Mock Data Generator',
  version: '1.0.0',
  description: 'Generates realistic test data for development and testing',
  author: 'Wareflow',

  // WMS compatibility
  wmsSystem: 'Mock',
  supportedFormats: [], // No file input needed

  // Input schema - not applicable for mock generator
  inputSchema: {
    sheets: [],
  },

  /**
   * Validate - always returns empty for mock generator
   */
  validate: () => {
    return []
  },

  /**
   * Transform - generates mock data
   */
  transform: (
    _input: unknown,
    context: TransformContext
  ): NormalizedData => {
    const { warehouseId } = context

    // Generate mock data (zones, sectors, locations first, then products, inventory, movements)
    const zones = generateMockZones(warehouseId)
    const sectors = generateMockSectors(warehouseId, zones)
    const locations = generateMockLocations(warehouseId, zones, sectors)
    const products = generateMockProducts(50)
    const inventory = generateMockInventory(warehouseId, products, locations)
    const movements = generateMockMovements(warehouseId, products, locations, 200)

    return {
      metadata: {
        warehouseId,
        importDate: new Date(),
        pluginId: 'mock-data-generator',
        pluginVersion: '1.0.0',
        wmsSystem: 'Mock',
      },
      products,
      inventory,
      movements,
      locations,
      zones,
      sectors,
    }
  },
}

// ============================================================================
// DATA GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate mock zones
 */
function generateMockZones(warehouseId: string): Zone[] {
  const zones: Zone[] = []
  const zoneNames = ['Storage Zone A', 'Storage Zone B', 'Storage Zone C', 'Storage Zone D', 'Storage Zone E']

  for (let i = 0; i < 5; i++) {
    zones.push({
      id: `ZONE-${i + 1}`,
      warehouseId,
      code: `ZONE-${String(i + 1).padStart(3, '0')}`,
      name: zoneNames[i],
      type: 'storage',
      surface: getRandomInt(500, 2000),
      capacity: getRandomInt(1000, 5000),
      status: 'active',
    })
  }

  return zones
}

/**
 * Generate mock sectors
 */
function generateMockSectors(warehouseId: string, zones: readonly Zone[]): Sector[] {
  const sectors: Sector[] = []
  const sectorTypes = ['PICKING', 'STORAGE', 'RECEPTION', 'SHIPPING', 'RESERVED']

  let sectorIndex = 0
  for (const zone of zones) {
    for (const sectorType of sectorTypes) {
      sectorIndex++

      sectors.push({
        id: `SECTOR-${sectorIndex}`,
        warehouseId,
        zoneId: zone.id,
        code: `${zone.code}-${sectorType.substring(0, 3)}`,
        name: `${zone.name} - ${sectorType.charAt(0) + sectorType.slice(1).toLowerCase()}`,
        type: sectorType.toLowerCase(),
        capacity: getRandomInt(200, 1000),
        status: 'active',
      })
    }
  }

  return sectors
}

/**
 * Generate mock locations with realistic warehouse structure
 */
function generateMockLocations(
  warehouseId: string,
  zones: readonly Zone[],
  sectors: readonly Sector[]
): Location[] {
  const locations: Location[] = []

  let locationIndex = 0
  for (let zoneIdx = 0; zoneIdx < zones.length; zoneIdx++) {
    const zone = zones[zoneIdx]

    for (let sectorIdx = 0; sectorIdx < sectors.length; sectorIdx++) {
      const sector = sectors[sectorIdx]

      // Only create locations for sectors in this zone
      if (sector.zoneId !== zone.id) continue

      // Generate 2 locations per sector
      for (let locIdx = 0; locIdx < 2; locIdx++) {
        locationIndex++

        const locationId = `LOC-${String(locationIndex).padStart(2, '0')}`
        const aisle = String.fromCharCode(65 + zoneIdx) // A, B, C, D, E
        const level = (sectorIdx % 3) + 1
        const position = locIdx + 1

        // Determine status based on sector type
        let status: 'available' | 'occupied' | 'blocked' | 'reserved'
        if (sector.type === 'reserved') {
          status = 'reserved'
        } else if (sector.type === 'reception') {
          status = Math.random() < 0.5 ? 'occupied' : 'available'
        } else if (sector.type === 'storage') {
          status = Math.random() < 0.7 ? 'occupied' : 'available'
        } else {
          status = 'available'
        }

        const capacity = getRandomInt(50, 500)
        const usedCapacity = status === 'occupied' ? getRandomInt(10, capacity) : 0
        const productCount = status === 'occupied' ? getRandomInt(1, 5) : 0
        const pickerCount = sector.type === 'picking' ? getRandomInt(1, 3) : 0

        locations.push({
          id: locationId,
          code: `${aisle}-${level.toString().padStart(2, '0')}-${position.toString().padStart(2, '0')}`,
          type: sector.type,
          capacity,
          usedCapacity,
          productCount,
          pickerCount,
          aisle,
          level,
          position: position.toString(),
          barcode: `LOC-${locationId}`,
          status,
          zoneId: zone.id,
          sectorId: sector.id,
          warehouseId,
          updatedAt: new Date(),
        })
      }
    }
  }

  return locations
}



/**
 * Generate mock products with realistic data
 * Ensures different rotation levels for ABC analysis
 */
function generateMockProducts(count: number): Product[] {
  const products: Product[] = []

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]
    const unit = UNITS[getRandomInt(0, UNITS.length - 1)]

    // Determine rotation level (for ABC analysis testing)
    const rotationLevel = Math.random()
    let costPrice: number
    let minStock: number

    if (rotationLevel < 0.2) {
      // Class A: High value, high rotation
      costPrice = getRandomFloat(50, 500)
      minStock = getRandomInt(50, 200)
    } else if (rotationLevel < 0.5) {
      // Class B: Medium value, medium rotation
      costPrice = getRandomFloat(10, 100)
      minStock = getRandomInt(20, 100)
    } else {
      // Class C: Low value, low rotation
      costPrice = getRandomFloat(1, 50)
      minStock = getRandomInt(5, 50)
    }

    products.push({
      id: `PROD-${String(i + 1).padStart(4, '0')}`,
      sku: `SKU-${category.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
      name: `${category} Product ${i + 1}`,
      description: `High-quality ${category.toLowerCase()} product for various applications`,
      category,
      subcategory: getRandomSubcategory(category),
      brand: getRandomBrand(),
      unit,
      weight: getRandomFloat(0.1, 50),
      volume: getRandomFloat(0.01, 2),
      minStock,
      maxStock: minStock * getRandomInt(2, 5),
      reorderPoint: Math.floor(minStock * 0.2),
      reorderQuantity: minStock,
      costPrice,
      sellingPrice: costPrice * getRandomFloat(1.3, 2.5),
      supplier: getRandomSupplier(),
      status: 'in_stock',
    })
  }

  return products
}

/**
 * Generate mock inventory data
 * Ensures some products have low stock for testing
 */
function generateMockInventory(
  warehouseId: string,
  products: readonly Product[],
  locations: readonly Location[]
): Inventory[] {
  const inventory: Inventory[] = []

  for (const product of products) {
    const quantity = getRandomInt(0, (product.maxStock || 100) * 2)

    // Pick a random location that exists
    const location = locations[getRandomInt(0, locations.length - 1)]

    inventory.push({
      warehouseId,
      productId: product.id,
      locationId: location.id,
      quantity,
      availableQuantity: Math.floor(quantity * getRandomFloat(0.7, 1)),
      reservedQuantity: Math.floor(quantity * getRandomFloat(0, 0.3)),
    })
  }

  return inventory
}

/**
 * Generate mock movements with realistic patterns
 * Ensures different movement frequencies for ABC and Dead Stock analysis
 */
function generateMockMovements(
  warehouseId: string,
  products: readonly Product[],
  locations: readonly Location[],
  count: number
): Movement[] {
  const movements: Movement[] = []
  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < count; i++) {
    const product = products[getRandomInt(0, products.length - 1)]
    const movementDate = getRandomDate(ninetyDaysAgo, now)

    // Determine movement type based on product rotation
    // Class A products: more movements, more recent
    // Class C products: fewer movements, older dates
    const daysSinceMovement = Math.floor((now.getTime() - movementDate.getTime()) / (24 * 60 * 60 * 1000))

    let type: 'inbound' | 'outbound' | 'transfer' | 'adjustment'

    if (daysSinceMovement < 30) {
      // Recent movements: mostly outbound (sales)
      type = Math.random() < 0.7 ? 'outbound' : 'inbound'
    } else if (daysSinceMovement < 60) {
      // Medium age: balanced
      type = getRandomType()
    } else {
      // Old movements: mostly inbound
      type = Math.random() < 0.6 ? 'inbound' : 'transfer'
    }

    const quantity = getRandomInt(1, 100)

    // Pick random locations that actually exist
    const sourceLoc = locations[getRandomInt(0, locations.length - 1)]
    const destLoc = locations[getRandomInt(0, locations.length - 1)]

    movements.push({
      warehouseId,
      productId: product.id,
      productSku: product.sku,
      productName: product.name,
      type,
      sourceLocationId: type === 'outbound' ? sourceLoc.id : undefined,
      sourceZone: type === 'outbound' ? sourceLoc.zoneId : undefined,
      sourceLocationCode: type === 'outbound' ? sourceLoc.code : undefined,
      destinationLocationId: type === 'inbound' ? destLoc.id : undefined,
      destinationZone: type === 'inbound' ? destLoc.zoneId : undefined,
      destinationLocationCode: type === 'inbound' ? destLoc.code : undefined,
      quantity,
      unit: product.unit,
      movementDate,
      user: `User-${getRandomInt(1, 10)}`,
      reason: getRandomReason(type),
    })
  }

  // Sort by date
  return movements.sort((a, b) => a.movementDate.getTime() - b.movementDate.getTime())
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function getRandomSubcategory(category: string): string {
  const subcategories: Record<string, readonly string[]> = {
    'Electronics': ['Computers', 'Phones', 'Tablets', 'Accessories', 'Audio'],
    'Clothing': ['Men', 'Women', 'Kids', 'Shoes', 'Accessories'],
    'Food & Beverages': ['Snacks', 'Beverages', 'Canned Goods', 'Dairy', 'Frozen'],
    'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Garden', 'Tools'],
    'Sports & Outdoors': ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports'],
    'Tools & Hardware': ['Power Tools', 'Hand Tools', 'Hardware', 'Safety', 'Storage'],
    'Health & Beauty': ['Skincare', 'Haircare', 'Vitamins', 'Personal Care', 'Wellness'],
    'Toys & Games': ['Educational', 'Outdoor', 'Board Games', 'Electronic', 'Infant'],
    'Automotive': ['Parts', 'Accessories', 'Tools', 'Fluids', 'Electronics'],
    'Office Supplies': ['Paper', 'Writing', 'Desk Accessories', 'Filing', 'Technology'],
  }

  const cats = subcategories[category] || ['General']
  return cats[getRandomInt(0, cats.length - 1)]
}

function getRandomBrand(): string {
  const brands = [
    'TechPro', 'HomeMaster', 'QualityFirst', 'PremiumBrand', 'ValueLine',
    'EliteSeries', 'Professional', 'Standard', 'Essential', 'Ultra'
  ]
  return brands[getRandomInt(0, brands.length - 1)]
}

function getRandomSupplier(): string {
  const suppliers = [
    'Global Supplies Inc', 'Quality Distributors Ltd', 'Premium Wholesalers',
    'International Trading Co', 'Metro Supplies', 'National Distribution',
    'WorldWide Logistics', 'Prime Suppliers', 'Atlantic Trading', 'Pacific Imports'
  ]
  return suppliers[getRandomInt(0, suppliers.length - 1)]
}

function getRandomType(): 'inbound' | 'outbound' | 'transfer' | 'adjustment' {
  const types = ['inbound', 'outbound', 'transfer', 'adjustment'] as const
  return types[getRandomInt(0, types.length - 1)]
}

function getRandomReason(type: string): string {
  const reasons: Record<string, readonly string[]> = {
    'inbound': ['Purchase receipt', 'Return', 'Transfer in', 'Correction'],
    'outbound': ['Sale', 'Transfer out', 'Damage', 'Expiration'],
    'transfer': ['Location transfer', 'Zone transfer', 'Replenishment'],
    'adjustment': ['Inventory count', 'Damage correction', 'System adjustment'],
  }

  const typeReasons = reasons[type] || ['Other']
  return typeReasons[getRandomInt(0, typeReasons.length - 1)]
}

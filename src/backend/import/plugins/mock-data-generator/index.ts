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
  Warehouse,
  User,
  Supplier,
  Customer,
  PurchaseOrder,
  PurchaseOrderLine,
  Order,
  OrderLine,
  Picking,
  PickingLine,
  Reception,
  ReceptionLine,
  Return,
  ReturnLine,
  Shipment,
  ShipmentLine,
  Restocking,
  RestockingLine,
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

    // Generate warehouses first (generates 2-3 warehouses)
    const warehouses = generateMockWarehouses()

    // Always use the first warehouse for zones, sectors, locations
    // This ensures that the default warehouse used by hooks has data
    const primaryWarehouseId = warehouses[0].id
    const effectiveWarehouseId = primaryWarehouseId

    // Generate mock data (zones, sectors, locations first, then products, inventory, movements)
    const zones = generateMockZones(effectiveWarehouseId)
    const sectors = generateMockSectors(effectiveWarehouseId, zones)
    const locations = generateMockLocations(effectiveWarehouseId, zones, sectors)
    const products = generateMockProducts(50)
    const inventory = generateMockInventory(effectiveWarehouseId, products, locations)
    const movements = generateMockMovements(effectiveWarehouseId, products, locations, 200)
    const users = generateMockUsers(effectiveWarehouseId)
    const suppliers = generateMockSuppliers()
    const customers = generateMockCustomers()

    // Generate purchase orders and their lines
    const purchaseOrdersResult = generateMockPurchaseOrdersAndLines(effectiveWarehouseId, suppliers, products)

    // Generate receptions and their lines (for received purchase orders)
    const receptionsResult = generateMockReceptionsAndLines(
      effectiveWarehouseId,
      suppliers,
      purchaseOrdersResult.orders,
      purchaseOrdersResult.lines
    )

    // Generate orders and their lines
    const ordersResult = generateMockOrdersAndLines(effectiveWarehouseId, customers, products)

    // Generate pickings and their lines (for orders in PICKING/SHIPPED status)
    const pickingsResult = generateMockPickingsAndLines(effectiveWarehouseId, users, ordersResult.orders, ordersResult.lines)

    // Generate shipments and their lines (for shipped orders)
    const shipmentsResult = generateMockShipmentsAndLines(effectiveWarehouseId, ordersResult.orders, ordersResult.lines)

    // Generate returns and their lines
    const returnsResult = generateMockReturnsAndLines(effectiveWarehouseId, customers, ordersResult.orders, products)

    // Generate restockings and their lines
    const restockingsResult = generateMockRestockingsAndLines(effectiveWarehouseId, users, products, locations)

    return {
      metadata: {
        warehouseId: effectiveWarehouseId,
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
      warehouses,
      users,
      suppliers,
      customers,
      purchaseOrders: purchaseOrdersResult.orders,
      purchaseOrderLines: purchaseOrdersResult.lines,
      receptions: receptionsResult.receptions,
      receptionLines: receptionsResult.lines,
      orders: ordersResult.orders,
      orderLines: ordersResult.lines,
      pickings: pickingsResult.pickings,
      pickingLines: pickingsResult.lines,
      shipments: shipmentsResult.shipments,
      shipmentLines: shipmentsResult.lines,
      returns: returnsResult.returns,
      returnLines: returnsResult.lines,
      restockings: restockingsResult.restockings,
      restockingLines: restockingsResult.lines,
    }
  },
}

// ============================================================================
// DATA GENERATION FUNCTIONS
// ============================================================================

/**
 * Generate mock warehouses
 */
function generateMockWarehouses(): Warehouse[] {
  const warehouses: Warehouse[] = []

  const warehouseData = [
    {
      id: 'WH-FR-01',
      code: 'WH-FR-01',
      name: 'Paris Distribution Center',
      city: 'Paris',
      country: 'France',
      surface: 15000,
      capacity: 50000,
      manager: 'Jean Dupont',
      email: 'jean.dupont@wareflow.com',
      phone: '+33 1 23 45 67 89',
      status: 'active',
      openingDate: new Date('2020-01-15'),
    },
    {
      id: 'WH-ES-02',
      code: 'WH-ES-02',
      name: 'Madrid Logistics Hub',
      city: 'Madrid',
      country: 'Spain',
      surface: 12000,
      capacity: 40000,
      manager: 'Maria Garcia',
      email: 'maria.garcia@wareflow.com',
      phone: '+34 91 123 45 67',
      status: 'active',
      openingDate: new Date('2021-03-20'),
    },
    {
      id: 'WH-BE-03',
      code: 'WH-BE-03',
      name: 'Brussels Storage Facility',
      city: 'Brussels',
      country: 'Belgium',
      surface: 8000,
      capacity: 25000,
      manager: 'Peter Van Der Berg',
      email: 'peter.vandenberg@wareflow.com',
      phone: '+32 2 123 45 67',
      status: 'active',
      openingDate: new Date('2022-06-10'),
    },
  ]

  for (const wh of warehouseData) {
    warehouses.push(wh)
  }

  return warehouses
}

/**
 * Generate mock users
 */
function generateMockUsers(warehouseId: string): User[] {
  const users: User[] = []

  const userData = [
    { id: 'USER-001', username: 'admin', fullName: 'System Administrator', email: 'admin@wareflow.com', role: 'Administrator' },
    { id: 'USER-002', username: 'jdupont', fullName: 'Jean Dupont', email: 'jdupont@wareflow.com', role: 'Manager' },
    { id: 'USER-003', username: 'mgarcia', fullName: 'Maria Garcia', email: 'mgarcia@wareflow.com', role: 'Manager' },
    { id: 'USER-004', username: 'pberg', fullName: 'Peter Van Der Berg', email: 'pberg@wareflow.com', role: 'Manager' },
    { id: 'USER-005', username: 'picker1', fullName: 'John Smith', email: 'john.smith@wareflow.com', role: 'Picker' },
    { id: 'USER-006', username: 'picker2', fullName: 'Emma Wilson', email: 'emma.wilson@wareflow.com', role: 'Picker' },
    { id: 'USER-007', username: 'receiver1', fullName: 'Lucas Martin', email: 'lucas.martin@wareflow.com', role: 'Receiver' },
    { id: 'USER-008', username: 'operator1', fullName: 'Sophie Bernard', email: 'sophie.bernard@wareflow.com', role: 'Warehouse Operator' },
  ]

  for (const user of userData) {
    users.push({
      id: user.id,
      warehouseId,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: 'active',
    })
  }

  return users
}

/**
 * Generate mock suppliers
 */
function generateMockSuppliers(): Supplier[] {
  const suppliers: Supplier[] = []

  const supplierData = [
    {
      id: 'SUP-001',
      code: 'TECH-PRO',
      name: 'TechPro Electronics',
      contactPerson: 'Hans Mueller',
      email: 'hans.mueller@techpro.de',
      phone: '+49 30 1234567',
      address: 'Mittenwalder Str. 25',
      city: 'Berlin',
      country: 'Germany',
      paymentTerms: 'NET 30',
      leadTimeDays: 14,
    },
    {
      id: 'SUP-002',
      code: 'ASIA-SRC',
      name: 'Asia Source Corp',
      contactPerson: 'Li Wei',
      email: 'liwei@asiasource.cn',
      phone: '+86 21 87654321',
      address: '123 Nanjing Road',
      city: 'Shanghai',
      country: 'China',
      paymentTerms: 'NET 45',
      leadTimeDays: 30,
    },
    {
      id: 'SUP-003',
      code: 'EU-WHS',
      name: 'European Wholesale Ltd',
      contactPerson: 'Jean-Pierre Martin',
      email: 'jpmartin@euwholesale.fr',
      phone: '+33 1 23 45 67 89',
      address: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      country: 'France',
      paymentTerms: 'NET 30',
      leadTimeDays: 7,
    },
    {
      id: 'SUP-004',
      code: 'GLO-TRD',
      name: 'Global Trading Partners',
      contactPerson: 'Sarah Johnson',
      email: 'sjohnson@globaltrading.us',
      phone: '+1 212 555 0123',
      address: '350 Fifth Avenue',
      city: 'New York',
      country: 'USA',
      paymentTerms: 'NET 60',
      leadTimeDays: 21,
    },
    {
      id: 'SUP-005',
      code: 'LOCAL-SUP',
      name: 'Local Suppliers Coop',
      contactPerson: 'Carlos Rodriguez',
      email: 'crodriguez@localsuppliers.es',
      phone: '+34 93 123 45 67',
      address: 'Carrer de la Capacita',
      city: 'Barcelona',
      country: 'Spain',
      paymentTerms: 'COD',
      leadTimeDays: 3,
    },
    {
      id: 'SUP-006',
      code: 'PRE-MFG',
      name: 'Premium Manufacturing',
      contactPerson: 'Tom Anderson',
      email: 'tanderson@premiummfg.uk',
      phone: '+44 20 7123 4567',
      address: '123 Industrial Way',
      city: 'Manchester',
      country: 'United Kingdom',
      paymentTerms: 'NET 30',
      leadTimeDays: 10,
    },
    {
      id: 'SUP-007',
      code: 'FAST-DIST',
      name: 'Fast Distribution',
      contactPerson: 'Maria Santos',
      email: 'msantos@fastdist.pt',
      phone: '+351 21 123 4567',
      address: 'Rua do Comércio',
      city: 'Lisbon',
      country: 'Portugal',
      paymentTerms: 'NET 15',
      leadTimeDays: 5,
    },
    {
      id: 'SUP-008',
      code: 'NORD-SUP',
      name: 'Nordic Supplies AB',
      contactPerson: 'Erik Lindqvist',
      email: 'elindqvist@nordicsup.se',
      phone: '+46 8 123 45 67',
      address: 'Box 12345',
      city: 'Stockholm',
      country: 'Sweden',
      paymentTerms: 'NET 30',
      leadTimeDays: 12,
    },
  ]

  for (const supplier of supplierData) {
    suppliers.push({
      id: supplier.id,
      code: supplier.code,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      city: supplier.city,
      country: supplier.country,
      paymentTerms: supplier.paymentTerms,
      leadTimeDays: supplier.leadTimeDays,
      status: 'active',
    })
  }

  return suppliers
}

/**
 * Generate mock customers
 */
function generateMockCustomers(): Customer[] {
  const customers: Customer[] = []

  const customerData = [
    {
      id: 'CUST-001',
      customerCode: 'RET-001',
      name: 'RetailMax Solutions',
      email: 'orders@retailmax.com',
      phone: '+1 555-0101',
      billingAddress: '123 Commerce Street, Suite 100',
      shippingAddress: '456 Warehouse Ave',
      city: 'New York',
      country: 'USA',
      customerType: 'Wholesale',
      creditLimit: 50000,
    },
    {
      id: 'CUST-002',
      customerCode: 'EU-DIST-002',
      name: 'EuroDistributors GmbH',
      email: ' procurement@eurodistributors.de',
      phone: '+49 40 123456',
      billingAddress: 'Messeplatz 1',
      shippingAddress: 'Hafenstrasse 25',
      city: 'Hamburg',
      country: 'Germany',
      customerType: 'Wholesale',
      creditLimit: 75000,
    },
    {
      id: 'CUST-003',
      customerCode: 'SHOP-ONLINE',
      name: 'ShopOnline E-commerce',
      email: 'warehouse@shoponline.fr',
      phone: '+33 4 12 34 56 78',
      billingAddress: '15 Rue de la Paix',
      shippingAddress: '8 Boulevard du Commerce',
      city: 'Lyon',
      country: 'France',
      customerType: 'E-commerce',
      creditLimit: 30000,
    },
    {
      id: 'CUST-004',
      customerCode: 'RETAIL-ES',
      name: 'Tiendas Express SA',
      email: 'compras@tiendasexpress.es',
      phone: '+34 91 876 54 32',
      billingAddress: 'Calle Mayor 45',
      shippingAddress: 'Poligono Industrial, Nave 12',
      city: 'Madrid',
      country: 'Spain',
      customerType: 'Retail Chain',
      creditLimit: 100000,
    },
    {
      id: 'CUST-005',
      customerCode: 'TECH-RESELLER',
      name: 'TechResellers Italia',
      email: 'ordini@techresellers.it',
      phone: '+39 02 1234 5678',
      billingAddress: 'Via Roma 123',
      shippingAddress: 'Ver dell\'Industria 45',
      city: 'Milan',
      country: 'Italy',
      customerType: 'Wholesale',
      creditLimit: 60000,
    },
    {
      id: 'CUST-006',
      customerCode: 'BENELUX-BV',
      name: 'Benelux Trading BV',
      email: 'info@beneluxtrading.nl',
      phone: '+31 20 123 4567',
      billingAddress: 'Keizersgracht 123',
      shippingAddress: 'Havenweg 5',
      city: 'Amsterdam',
      country: 'Netherlands',
      customerType: 'Distributor',
      creditLimit: 80000,
    },
    {
      id: 'CUST-007',
      customerCode: 'SCAN-TRADE',
      name: 'Scandinavian Trade AB',
      email: 'orders@scantrade.se',
      phone: '+46 8 654 32 10',
      billingAddress: 'Box 12345',
      shippingAddress: 'Hamngatan 15',
      city: 'Gothenburg',
      country: 'Sweden',
      customerType: 'Wholesale',
      creditLimit: 55000,
    },
    {
      id: 'CUST-008',
      customerCode: 'UK-RETAIL',
      name: 'British Retail Partners Ltd',
      email: 'sales@britishretail.co.uk',
      phone: '+44 161 123 4567',
      billingAddress: '123 Market Street',
      shippingAddress: '456 Dock Road',
      city: 'Manchester',
      country: 'United Kingdom',
      customerType: 'Retail Chain',
      creditLimit: 120000,
    },
    {
      id: 'CUST-009',
      customerCode: 'PL-Retail',
      name: 'Polska Detal SA',
      email: 'zamowienia@polskadetal.pl',
      phone: '+48 22 123 45 67',
      billingAddress: 'ul. Handlowa 15',
      shippingAddress: 'ul. Magazynowa 30',
      city: 'Warsaw',
      country: 'Poland',
      customerType: 'Retail Chain',
      creditLimit: 40000,
    },
    {
      id: 'CUST-010',
      customerCode: 'AT-LOGIST',
      name: 'Logistik Austria GmbH',
      email: 'bestellung@logistik-at.at',
      phone: '+43 1 123 45 67',
      billingAddress: 'Mariahilfer Strasse 123',
      shippingAddress: 'Handelskai 50',
      city: 'Vienna',
      country: 'Austria',
      customerType: 'Wholesale',
      creditLimit: 45000,
    },
    {
      id: 'CUST-011',
      customerCode: 'CH-TRADING',
      name: 'Suisse Trading Sarl',
      email: 'commandes@suissetrading.ch',
      phone: '+41 22 123 45 67',
      billingAddress: 'Rue du Rhône 123',
      shippingAddress: 'Zone Industrielle A',
      city: 'Geneva',
      country: 'Switzerland',
      customerType: 'Distributor',
      creditLimit: 70000,
    },
    {
      id: 'CUST-012',
      customerCode: 'CZ-DIST',
      name: 'Czech Distribution sro',
      email: 'objednavky@czechdistribution.cz',
      phone: '+420 2 1234 5678',
      billingAddress: 'Národní 123',
      shippingAddress: 'Skladová 5',
      city: 'Prague',
      country: 'Czech Republic',
      customerType: 'Wholesale',
      creditLimit: 35000,
    },
  ]

  for (const customer of customerData) {
    customers.push({
      id: customer.id,
      customerCode: customer.customerCode,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.shippingAddress,
      city: customer.city,
      country: customer.country,
      customerType: customer.customerType,
      creditLimit: customer.creditLimit,
      status: 'active',
    })
  }

  return customers
}

/**
 * Generate mock purchase orders and their lines
 */
function generateMockPurchaseOrdersAndLines(
  warehouseId: string,
  suppliers: readonly Supplier[],
  products: readonly Product[]
): { orders: PurchaseOrder[]; lines: PurchaseOrderLine[] } {
  const purchaseOrders: PurchaseOrder[] = []
  const purchaseOrderLines: PurchaseOrderLine[] = []

  const statuses: Array<'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED'> = ['DRAFT', 'CONFIRMED', 'RECEIVED', 'CANCELLED']
  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Generate 15-20 purchase orders
  const orderCount = getRandomInt(15, 20)

  for (let i = 0; i < orderCount; i++) {
    const supplier = suppliers[getRandomInt(0, suppliers.length - 1)]
    const orderDate = getRandomDate(ninetyDaysAgo, now)
    const status = statuses[getRandomInt(0, statuses.length - 1)]
    const expectedDate = new Date(orderDate.getTime() + getRandomInt(7, 30) * 24 * 60 * 60 * 1000)

    const poId = `PO-${String(i + 1).padStart(4, '0')}`
    const poNumber = `PO-${new Date(orderDate).getFullYear()}-${String(i + 1).padStart(4, '0')}`

    // Generate 3-10 lines per purchase order
    const lineCount = getRandomInt(3, 10)
    let totalAmount = 0

    for (let j = 0; j < lineCount; j++) {
      const product = products[getRandomInt(0, products.length - 1)]
      const quantity = getRandomInt(10, 500)
      const unitPrice = product.costPrice || getRandomFloat(5, 100)
      const totalPrice = quantity * unitPrice
      totalAmount += totalPrice

      const receivedQuantity = status === 'RECEIVED' ? quantity : (status === 'CONFIRMED' ? getRandomInt(0, quantity) : 0)

      purchaseOrderLines.push({
        id: `POL-${i + 1}-${j + 1}`,
        purchaseOrderId: poId,
        productId: product.id,
        productSku: product.sku,
        productName: product.name,
        quantity,
        receivedQuantity,
        unitPrice,
        totalPrice,
      })
    }

    purchaseOrders.push({
      id: poId,
      warehouseId,
      supplierId: supplier.id,
      purchaseOrderNumber: poNumber,
      orderDate,
      expectedDate,
      status,
      totalAmount,
    })
  }

  return { orders: purchaseOrders, lines: purchaseOrderLines }
}

/**
 * Generate mock receptions and their lines
 */
function generateMockReceptionsAndLines(
  warehouseId: string,
  suppliers: readonly Supplier[],
  purchaseOrders: readonly PurchaseOrder[],
  purchaseOrderLines: readonly PurchaseOrderLine[]
): { receptions: Reception[]; lines: ReceptionLine[] } {
  const receptions: Reception[] = []
  const receptionLines: ReceptionLine[] = []

  // Only generate receptions for received purchase orders
  const receivedPOs = purchaseOrders.filter(po => po.status === 'RECEIVED')

  for (const po of receivedPOs) {
    const supplier = suppliers.find(s => s.id === po.supplierId)
    if (!supplier) continue

    const receptionDate = new Date(po.orderDate.getTime() + getRandomInt(7, 30) * 24 * 60 * 60 * 1000)
    const receptionId = `REC-${po.id.split('-')[1]}`
    const receptionNumber = `REC-${new Date(po.orderDate).getFullYear()}-${po.id.split('-')[1]}`

    // Get all lines for this PO
    const poLines = purchaseOrderLines.filter(pol => pol.purchaseOrderId === po.id)
    let totalQuantity = 0
    let receivedQuantity = 0

    for (const pol of poLines) {
      totalQuantity += pol.quantity
      receivedQuantity += pol.receivedQuantity

      const rejectedQuantity = pol.quantity - pol.receivedQuantity

      receptionLines.push({
        id: `REL-${receptionId}-${pol.id.split('-')[2]}`,
        receptionId,
        warehouseId,
        productId: pol.productId,
        productSku: pol.productSku,
        productName: pol.productName,
        orderedQuantity: pol.quantity,
        receivedQuantity: pol.receivedQuantity,
        rejectedQuantity,
        unitPrice: pol.unitPrice,
      })
    }

    receptions.push({
      id: receptionId,
      warehouseId,
      supplierId: po.supplierId,
      supplierName: supplier.name,
      receptionNumber,
      expectedDate: po.expectedDate || po.orderDate,
      receivedDate: receptionDate,
      status: 'COMPLETED',
      priority: 'NORMAL',
      totalQuantity,
      receivedQuantity,
    })
  }

  return { receptions, lines: receptionLines }
}

/**
 * Generate mock orders and their lines
 */
function generateMockOrdersAndLines(
  warehouseId: string,
  customers: readonly Customer[],
  products: readonly Product[]
): { orders: Order[]; lines: OrderLine[] } {
  const orders: Order[] = []
  const orderLines: OrderLine[] = []

  const statuses: Array<'DRAFT' | 'CONFIRMED' | 'PICKING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'> = ['DRAFT', 'CONFIRMED', 'PICKING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  const priorities: Array<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'> = ['LOW', 'NORMAL', 'HIGH', 'URGENT']

  const now = new Date()
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Generate 30-40 orders
  const orderCount = getRandomInt(30, 40)

  for (let i = 0; i < orderCount; i++) {
    const customer = customers[getRandomInt(0, customers.length - 1)]
    const orderDate = getRandomDate(ninetyDaysAgo, now)
    const status = statuses[getRandomInt(0, statuses.length - 1)]
    const priority = priorities[getRandomInt(0, priorities.length - 1)]
    const requiredDate = new Date(orderDate.getTime() + getRandomInt(2, 14) * 24 * 60 * 60 * 1000)

    const orderId = `ORD-${String(i + 1).padStart(4, '0')}`
    const orderNumber = `SO-${new Date(orderDate).getFullYear()}-${String(i + 1).padStart(4, '0')}`

    // Generate 1-15 lines per order
    const lineCount = getRandomInt(1, 15)
    let totalQuantity = 0
    let totalAmount = 0

    for (let j = 0; j < lineCount; j++) {
      const product = products[getRandomInt(0, products.length - 1)]
      const quantity = getRandomInt(1, 50)
      const unitPrice = product.sellingPrice || getRandomFloat(10, 500)
      const totalPrice = quantity * unitPrice
      totalQuantity += quantity
      totalAmount += totalPrice

      const pickedQuantity = (status === 'SHIPPED' || status === 'DELIVERED') ? quantity : (status === 'PICKING' ? getRandomInt(0, quantity) : 0)

      orderLines.push({
        id: `ORL-${orderId}-${j + 1}`,
        orderId,
        warehouseId,
        productId: product.id,
        productSku: product.sku,
        productName: product.name,
        quantity,
        pickedQuantity,
        unitPrice,
        totalPrice,
      })
    }

    orders.push({
      id: orderId,
      warehouseId,
      orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      orderDate,
      requiredDate,
      promisedDate: requiredDate,
      status,
      priority,
      totalQuantity,
      totalAmount,
      shippingAddress: customer.shippingAddress,
      shippingCity: customer.city,
      shippingCountry: customer.country,
    })
  }

  return { orders, lines: orderLines }
}

/**
 * Generate mock pickings and their lines
 */
function generateMockPickingsAndLines(
  warehouseId: string,
  users: readonly User[],
  orders: readonly Order[],
  orderLines: readonly OrderLine[]
): { pickings: Picking[]; lines: PickingLine[] } {
  const pickings: Picking[] = []
  const pickingLines: PickingLine[] = []

  // Only generate pickings for orders in PICKING or SHIPPED status
  const pickableOrders = orders.filter(o => o.status === 'PICKING' || o.status === 'SHIPPED' || o.status === 'DELIVERED')

  for (const order of pickableOrders) {
    const pickingId = `PIC-${order.id.split('-')[1]}`
    const pickingNumber = `PIC-${new Date(order.orderDate).getFullYear()}-${order.id.split('-')[1]}`

    const picker = users.find(u => u.role === 'Picker' || u.role === 'Warehouse Operator')
    const priority = order.priority as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

    // Get all lines for this order
    const orderLinesForOrder = orderLines.filter(ol => ol.orderId === order.id)
    let totalQuantity = 0
    let pickedQuantity = 0

    for (const ol of orderLinesForOrder) {
      totalQuantity += ol.quantity
      pickedQuantity += ol.pickedQuantity

      const lineStatus = ol.pickedQuantity >= ol.quantity ? 'COMPLETED' : (ol.pickedQuantity > 0 ? 'IN_PROGRESS' : 'PENDING')

      pickingLines.push({
        id: `PIL-${pickingId}-${ol.id.split('-')[2]}`,
        pickingId,
        warehouseId,
        productId: ol.productId,
        productSku: ol.productSku,
        productName: ol.productName,
        locationCode: `LOC-${getRandomInt(1, 50).toString().padStart(2, '0')}`,
        zoneName: `Zone ${getRandomInt(1, 5)}`,
        quantity: ol.quantity,
        pickedQuantity: ol.pickedQuantity,
        unit: 'ea',
        status: lineStatus,
      })
    }

    pickings.push({
      id: pickingId,
      warehouseId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      pickingNumber,
      assignedDate: order.orderDate,
      status: order.status === 'DELIVERED' ? 'COMPLETED' : (order.status === 'SHIPPED' ? 'COMPLETED' : 'IN_PROGRESS'),
      priority,
      totalQuantity,
      pickedQuantity,
      picker: picker?.username,
    })
  }

  return { pickings, lines: pickingLines }
}

/**
 * Generate mock shipments and their lines
 */
function generateMockShipmentsAndLines(
  warehouseId: string,
  orders: readonly Order[],
  orderLines: readonly OrderLine[]
): { shipments: Shipment[]; lines: ShipmentLine[] } {
  const shipments: Shipment[] = []
  const shipmentLines: ShipmentLine[] = []

  const carriers = ['DHL', 'UPS', 'FedEx', 'TNT', 'DPD', 'GLS']

  // Only generate shipments for shipped orders
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED' || o.status === 'DELIVERED')

  for (const order of shippedOrders) {
    const shipmentId = `SHP-${order.id.split('-')[1]}`
    const shipmentNumber = `SHP-${new Date(order.orderDate).getFullYear()}-${order.id.split('-')[1]}`
    const shipmentDate = new Date(order.orderDate.getTime() + getRandomInt(1, 5) * 24 * 60 * 60 * 1000)
    const carrier = carriers[getRandomInt(0, carriers.length - 1)]
    const trackingNumber = `${carrier.substring(0, 2).toUpperCase()}${getRandomInt(100000000, 999999999)}`

    // Get all lines for this order
    const orderLinesForOrder = orderLines.filter(ol => ol.orderId === order.id)

    for (const ol of orderLinesForOrder) {
      shipmentLines.push({
        id: `SHL-${shipmentId}-${ol.id.split('-')[2]}`,
        shipmentId,
        productId: ol.productId,
        quantity: ol.quantity,
      })
    }

    shipments.push({
      id: shipmentId,
      warehouseId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      shipmentNumber,
      shipmentDate,
      carrier,
      trackingNumber,
      status: order.status === 'DELIVERED' ? 'DELIVERED' : 'IN_TRANSIT',
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingCountry: order.shippingCountry,
    })
  }

  return { shipments, lines: shipmentLines }
}

/**
 * Generate mock returns and their lines
 */
function generateMockReturnsAndLines(
  warehouseId: string,
  customers: readonly Customer[],
  orders: readonly Order[],
  products: readonly Product[]
): { returns: Return[]; lines: ReturnLine[] } {
  const returns: Return[] = []
  const returnLines: ReturnLine[] = []

  const reasons: Array<'DAMAGED' | 'WRONG_ITEM' | 'CUSTOMER_REQUEST' | 'DEFECTIVE' | 'EXPIRED'> = ['DAMAGED', 'WRONG_ITEM', 'CUSTOMER_REQUEST', 'DEFECTIVE', 'EXPIRED']
  const reasonLabels: Record<string, string> = {
    'DAMAGED': 'Item arrived damaged',
    'WRONG_ITEM': 'Wrong item shipped',
    'CUSTOMER_REQUEST': 'Customer no longer wants item',
    'DEFECTIVE': 'Product defective',
    'EXPIRED': 'Product expired',
  }

  const conditions: Array<'NEW' | 'OPENED' | 'DAMAGED' | 'DEFECTIVE'> = ['NEW', 'OPENED', 'DAMAGED', 'DEFECTIVE']
  const resolutions: Array<'REFUND' | 'REPLACE' | 'REPAIR' | 'CREDIT'> = ['REFUND', 'REPLACE', 'REPAIR', 'CREDIT']

  // Generate 5-10 returns from delivered orders
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED')
  const returnCount = Math.min(getRandomInt(5, 10), deliveredOrders.length)

  for (let i = 0; i < returnCount; i++) {
    const order = deliveredOrders[i]
    const customer = customers.find(c => c.id === order.customerId)
    if (!customer) continue

    const returnDate = new Date(order.orderDate.getTime() + getRandomInt(7, 30) * 24 * 60 * 60 * 1000)
    const reason = reasons[getRandomInt(0, reasons.length - 1)]
    const returnId = `RTN-${String(i + 1).padStart(4, '0')}`
    const returnNumber = `RTN-${new Date(returnDate).getFullYear()}-${String(i + 1).padStart(4, '0')}`

    // Generate 1-5 lines per return
    const lineCount = getRandomInt(1, 5)
    let totalQuantity = 0
    let totalAmount = 0
    let returnedQuantity = 0
    let refundedAmount = 0

    for (let j = 0; j < lineCount; j++) {
      const product = products[getRandomInt(0, products.length - 1)]
      const quantity = getRandomInt(1, 10)
      const unitPrice = product.sellingPrice || getRandomFloat(10, 500)
      const totalPrice = quantity * unitPrice
      totalQuantity += quantity
      totalAmount += totalPrice
      returnedQuantity += quantity

      const isRefunded = Math.random() < 0.7
      if (isRefunded) {
        refundedAmount += totalPrice
      }

      returnLines.push({
        id: `RTL-${returnId}-${j + 1}`,
        returnId,
        warehouseId,
        productId: product.id,
        productSku: product.sku,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice,
        condition: conditions[getRandomInt(0, conditions.length - 1)],
        resolution: resolutions[getRandomInt(0, resolutions.length - 1)],
      })
    }

    returns.push({
      id: returnId,
      warehouseId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      returnNumber,
      customerId: customer.id,
      customerName: customer.name,
      returnDate,
      type: 'CUSTOMER_RETURN',
      status: Math.random() < 0.5 ? 'COMPLETED' : 'PROCESSING',
      priority: 'NORMAL',
      reason,
      reasonLabel: reasonLabels[reason],
      totalQuantity,
      returnedQuantity,
      totalAmount,
      refundedAmount,
      processor: `User-${getRandomInt(1, 10)}`,
      completedDate: Math.random() < 0.5 ? returnDate : undefined,
    })
  }

  return { returns, lines: returnLines }
}

/**
 * Generate mock restockings and their lines
 */
function generateMockRestockingsAndLines(
  warehouseId: string,
  users: readonly User[],
  products: readonly Product[],
  locations: readonly Location[]
): { restockings: Restocking[]; lines: RestockingLine[] } {
  const restockings: Restocking[] = []
  const restockingLines: RestockingLine[] = []

  const priorities: Array<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'> = ['LOW', 'NORMAL', 'HIGH', 'URGENT']

  // Generate 10-15 restockings
  const restockingCount = getRandomInt(10, 15)

  for (let i = 0; i < restockingCount; i++) {
    const requester = users[getRandomInt(0, users.length - 1)]
    const requestedDate = new Date(Date.now() - getRandomInt(1, 60) * 24 * 60 * 60 * 1000)
    const priority = priorities[getRandomInt(0, priorities.length - 1)]

    const restockingId = `RST-${String(i + 1).padStart(4, '0')}`
    const restockingNumber = `RST-${new Date(requestedDate).getFullYear()}-${String(i + 1).padStart(4, '0')}`

    // Generate 3-8 lines per restocking
    const lineCount = getRandomInt(3, 8)

    for (let j = 0; j < lineCount; j++) {
      const product = products[getRandomInt(0, products.length - 1)]
      const sourceLocation = locations[getRandomInt(0, locations.length - 1)]
      const destLocation = locations[getRandomInt(0, locations.length - 1)]

      const currentQuantity = getRandomInt(0, 50)
      const targetQuantity = getRandomInt(100, 500)
      const quantityToRestock = targetQuantity - currentQuantity

      restockingLines.push({
        id: `RSL-${restockingId}-${j + 1}`,
        restockingId,
        warehouseId,
        productId: product.id,
        productSku: product.sku,
        productName: product.name,
        sourceLocationId: sourceLocation.id,
        destinationLocationId: destLocation.id,
        currentQuantity,
        targetQuantity,
        quantityToRestock,
        unit: product.unit,
        status: Math.random() < 0.5 ? 'COMPLETED' : 'PENDING',
      })
    }

    restockings.push({
      id: restockingId,
      warehouseId,
      restockingNumber,
      status: Math.random() < 0.5 ? 'COMPLETED' : 'IN_PROGRESS',
      priority,
      requester: requester.username,
      requestedDate,
    })
  }

  return { restockings, lines: restockingLines }
}

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

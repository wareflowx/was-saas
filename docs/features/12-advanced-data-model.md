# Advanced Data Model - Warehouse Operations

## Overview

This document defines the **normalized data model** that all import plugins must produce. This model is designed to capture the complexity of real warehouse operations with full traceability.

## Core Philosophy

```
Every movement must be traceable:
  → WHO did it
  → WHAT they moved
  → FROM where
  → TO where
  → WHEN they did it
  → WHY (if applicable)
```

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MASTER DATA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Products   │    │  Locations   │    │    Users     │      │
│  │              │    │              │    │              │      │
│  │ • productId  │    │ • locationId │    │ • userId     │      │
│  │ • code       │    │ • zone       │    │ • name       │      │
│  │ • description│    │ • aisle      │    │ • team       │      │
│  │ • batch/lot  │    │ • bay        │    │ • role       │      │
│  │ • categories │    │ • level      │    │ • active     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    OPERATIONAL DATA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                              │
│  │    Orders    │                                              │
│  │              │                                              │
│  │ • orderId    │──┐                                           │
│  │ • type       │  │                                           │
│  │ • status     │  │                                           │
│  │ • priority   │  │                                           │
│  │ • dates      │  │                                           │
│  └──────────────┘  │                                           │
│         │          │                                           │
│         └──────────┼───┐                                       │
│                    │   │                                       │
│         ┌──────────▼───▼─────────┐                            │
│         │   Picking Lines        │                            │
│         │                        │                            │
│         │ • lineId               │                            │
│         │ • productId            │                            │
│         │ • quantity             │                            │
│         │ • sourceLocation       │←──┐                         │
│         │ • destLocation         │   │                         │
│         │ • pickerId ────────────┼───┼───┐                    │
│         │ • pickStartTime        │   │   │                    │
│         │ • pickEndTime          │   │   │                    │
│         │ • duration             │   │   │                    │
│         └────────────────────────┘   │   │                    │
│                                     │   │                    │
│         ┌───────────────────────────┘   │                    │
│         │                               │                    │
│  ┌──────────────┐               ┌──────────────┐            │
│  │Replenishments│               │   Receipts   │            │
│  │              │               │              │            │
│  │ • replenId   │               │ • receiptId  │            │
│  │ • sourceLoc  │               │ • supplierId │            │
│  │ • destLoc    │               │ • lines      │            │
│  │ • productId  │               │ • receivedBy │            │
│  │ • movedBy    │               │ • date       │            │
│  │ • dates      │               │ • status     │            │
│  └──────────────┘               └──────────────┘            │
│                                                              │
│  ┌──────────────┐               ┌──────────────┐            │
│  │   Returns    │               │  Adjustments │            │
│  │              │               │              │            │
│  │ • returnId   │               │ • adjId      │            │
│  │ • customerId │               │ • productId  │            │
│  │ • reason     │               │ • quantity   │            │
│  │ • lines      │               │ • reason     │            │
│  │ • processedBy│               │ • adjustedBy │            │
│  └──────────────┘               └──────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Entity Definitions

### Product (Master Data)

```typescript
type Product = {
  // Identification
  readonly productId: string                  // Internal unique ID
  readonly productCode: string                // SKU/EAN/UPC
  readonly alternateCodes?: string[]          // Other codes (EAN, UPC, etc.)
  readonly description: string
  readonly extendedDescription?: string

  // Classification
  readonly category: ProductCategory
  readonly productFamily?: string
  readonly productGroup?: string
  readonly commodityCode?: string

  // Physical characteristics
  readonly unitOfMeasure: string              // EA, CS, PAL, etc.
  readonly weight?: {
    readonly gross: number                    // With packaging
    readonly net: number                      // Product only
    readonly uom: string                      // KG, LB
  }
  readonly dimensions?: {
    readonly length: number
    readonly width: number
    readonly height: number
    readonly uom: string                      // CM, IN
  }
  readonly volume?: number                    // Cubic units

  // Handling
  readonly handlingCodes?: string[]           // Hazardous, fragile, etc.
  readonly storageConditions?: StorageCondition[]
  readonly stackingInfo?: {
    readonly maxStackHeight: number
    readonly stackable: boolean
    readonly rotate: boolean                  // Can rotate for stacking
  }

  // Inventory
  readonly inventoryStatus: InventoryStatus
  readonly lotControl: boolean               // Requires lot tracking
  readonly expirationControl: boolean         // Requires expiration tracking
  readonly serialControl: boolean             // Requires serial tracking

  // Cost
  readonly unitCost?: number
  readonly averageCost?: number
  readonly lastCost?: number

  // Supplier
  readonly primarySupplierId?: string
  readonly suppliers?: ProductSupplier[]

  // Metadata
  readonly createdDate: Date
  readonly modifiedDate: Date
  readonly status: ProductStatus

  // Source tracking
  readonly source: {
    readonly wmsSystem: string
    readonly externalProductId: string
    readonly importBatch: string
  }
}

type ProductCategory = {
  readonly level1: string                    // Required
  readonly level2?: string
  readonly level3?: string
  readonly level4?: string
}

type StorageCondition = {
  readonly type: 'temperature' | 'humidity' | 'security' | 'other'
  readonly requirement: string
  readonly min?: number
  readonly max?: number
  readonly uom?: string
}

type ProductSupplier = {
  readonly supplierId: string
  readonly supplierProductCode: string
  readonly leadTimeDays: number
  readonly minimumOrderQuantity: number
  readonly preferred: boolean
}

type InventoryStatus =
  | 'active'
  | 'inactive'
  | 'discontinued'
  | 'obsolete'

type ProductStatus =
  | 'draft'
  | 'active'
  | 'pending-approval'
  | 'blocked'
```

### Location (Master Data)

```typescript
type Location = {
  // Identification
  readonly locationId: string                // Unique location code
  readonly barcode?: string

  // Hierarchy
  readonly warehouse: string                 // Warehouse code
  readonly zone: string                      // Zone code (e.g., "PICK-A", "RESERVE-B")
  readonly aisle?: string                    // Aisle number
  readonly bay?: string                      // Bay number
  readonly level?: string                    // Level number
  readonly position?: string                 // Position within level

  // Full location path
  readonly locationPath: string              // e.g., "WH01/ZONE-PICK-AISLE01-BAY03-LVL02-POS01"

  // Type
  readonly locationType: LocationType
  readonly locationUsage: LocationUsage

  // Characteristics
  readonly capacityInfo?: {
    readonly volume: number                  // Cubic units
    readonly weight: number                  // Max weight
    readonly uom: string
  }

  // Constraints
  readonly constraints?: {
    readonly allowedProductTypes?: string[]  // Product categories allowed
    readonly forbiddenProductTypes?: string[] // Product categories forbidden
    readonly mixedProducts: boolean          // Can store multiple products
  }

  // Equipment
  readonly equipmentRequired?: string[]      // Forklift, cherry picker, etc.

  // Status
  readonly status: LocationStatus
  readonly occupancy: LocationOccupancy

  // Metadata
  readonly source: {
    readonly wmsSystem: string
    readonly externalLocationId: string
  }
}

type LocationType =
  | 'floor'           // Floor storage
  | 'racked'          // Rack storage
  | 'shelf'           // Shelf storage
  | 'bin'             // Bin storage
  | 'bulk'            // Bulk storage
  | 'mezzanine'       // Mezzanine
  | 'container'       // Container/storage container
  | 'vehicle'         // Truck/trailer

type LocationUsage =
  | 'receiving'       // Receiving area
  | 'shipping'        // Shipping area
  | 'picking'         // Primary picking
  | 'reserve'         // Reserve storage
  | 'bulk'            // Bulk storage
  | 'cross-dock'      // Cross-docking
  | 'quality'         // Quality inspection
  | 'quarantine'      // Quarantine area
  | 'damage'          // Damaged goods
  | 'staging'         // Staging area
  | 'packing'         // Packing station

type LocationStatus =
  | 'active'
  | 'inactive'
  | 'blocked'
  | 'under-maintenance'

type LocationOccupancy =
  | 'empty'
  | 'partial'
  | 'full'
  | 'reserved'
```

### User (Master Data)

```typescript
type User = {
  // Identification
  readonly userId: string
  readonly employeeId?: string
  readonly username: string
  readonly firstName: string
  readonly lastName: string
  readonly fullName: string

  // Contact
  readonly email?: string
  readonly phone?: string

  // Organization
  readonly team?: string
  readonly department?: string
  readonly manager?: string                   // userId of manager
  readonly directReports?: string[]           // userIds of direct reports

  // Role
  readonly role: UserRole
  readonly permissions?: string[]

  // Capabilities
  readonly equipment?: {
    readonly forklift: boolean
    readonly cherryPicker: boolean
    readonly palletJack: boolean
    readonly other?: string[]
  }

  // Performance
  readonly hireDate: Date
  readonly status: UserStatus
  readonly active: boolean

  // Metadata
  readonly source: {
    readonly wmsSystem: string
    readonly externalUserId: string
  }
}

type UserRole =
  | 'picker'
  | 'packer'
  | 'receiver'
  | 'shipper'
  | 'forklift-operator'
  | 'inventory-specialist'
  | 'supervisor'
  | 'manager'
  | 'admin'

type UserStatus =
  | 'active'
  | 'on-leave'
  | 'terminated'
  | 'suspended'
```

### Order (Operational)

```typescript
type Order = {
  // Identification
  readonly orderId: string                   // Unique internal ID
  readonly externalOrderId: string           // WMS order ID (preserve!)
  readonly orderNumber: string               // Human-readable order number

  // Type and classification
  readonly orderType: OrderType
  readonly orderCategory: OrderCategory
  readonly priority: OrderPriority

  // Status
  readonly orderStatus: OrderStatus
  readonly waveId?: string                   // If part of wave

  // Dates
  readonly orderDate: Date                   // When order was created
  readonly requestedDate: Date               // Requested delivery date
  readonly promisedDate: Date                // Promised delivery date
  readonly scheduledDate?: Date              // Scheduled processing date
  readonly startDate?: Date                  // When processing started
  readonly completedDate?: Date              // When completed
  readonly cancelledDate?: Date              // If cancelled

  // Parties
  readonly customer: {
    readonly customerId: string
    readonly customerName: string
    readonly customerCode?: string
  }
  readonly shipTo: {
    readonly locationId: string
    readonly name: string
    readonly address: Address
  }
  readonly billTo?: {
    readonly locationId: string
    readonly name: string
    readonly address: Address
  }

  // Shipping
  readonly shipping: {
    readonly carrier?: string
    readonly serviceLevel?: string           // Ground, Next Day, etc.
    readonly shippingTerms?: string          // FOB, etc.
    readonly trackingNumber?: string
  }

  // Picking
  readonly picking: {
    readonly status: PickingStatus
    readonly startDate?: Date
    readonly completedDate?: Date
    readonly pickerId?: string
    readonly pickZone?: string
  }

  // Totals
  readonly summary: {
    readonly totalLines: number
    readonly totalQuantity: number
    readonly totalWeight?: number
    readonly totalVolume?: number
    readonly totalValue?: number
  }

  // Progress
  readonly progress: {
    readonly linesPicked: number
    readonly linesConfirmed: number
    readonly linesShipped: number
  }

  // Holds
  readonly holds?: OrderHold[]

  // Metadata
  readonly metadata: {
    readonly sourceWarehouse: string
    readonly sourceWMS: string
    readonly importBatch: string
    readonly externalData?: any              // Preserve original WMS data
  }
}

type Address = {
  readonly line1: string
  readonly line2?: string
  readonly city: string
  readonly state: string
  readonly postalCode: string
  readonly country: string
}

type OrderHold = {
  readonly holdCode: string
  readonly holdReason: string
  readonly holdDate: Date
  readonly releasedDate?: Date
  readonly releasedBy?: string
}

type OrderType =
  | 'sales-order'      // Customer order (outbound)
  | 'transfer-order'   // Warehouse transfer
  | 'return-order'     // Customer return
  | 'replenishment'    // Replenishment order
  | 'adjustment'       // Inventory adjustment
  | 'assembly'         // Kit assembly

type OrderCategory =
  | 'regular'
  | 'emergency'
  | 'backorder'
  | 'future'
  | 'blanket'
  | 'standing'

type OrderPriority =
  | 'critical'
  | 'urgent'
  | 'high'
  | 'medium'
  | 'low'
  | 'deferred'

type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'confirmed'
  | 'released'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'on-hold'

type PickingStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed'
  | 'partial'
```

### Picking Line (Operational)

```typescript
type PickingLine = {
  // Identification
  readonly lineId: string                    // Unique line ID
  readonly orderId: string                   // FK to Order
  readonly externalLineId?: string           // WMS line ID
  readonly lineNumber: number                // Line number on order

  // Product
  readonly productId: string
  readonly productCode: string
  readonly productDescription?: string

  // Batch/Lot
  readonly batchLot?: string
  readonly serialNumbers?: string[]

  // Quantities
  readonly quantities: {
    readonly ordered: number                 // Original order qty
    readonly allocated: number               // Allocated to pick
    readonly picked: number                  // Actually picked
    readonly confirmed: number               // Confirmed/shipped
    readonly cancelled: number               // Cancelled
    readonly short: number                   // Short quantity
    readonly damaged: number                 // Damaged quantity
  }

  // Locations
  readonly locations: {
    readonly source: string                  // Pick location
    readonly destination: string             // Usually shipping/packing
    readonly current?: string                // Current location (if in transit)
  }

  // Dates
  readonly dates: {
    readonly allocatedDate?: Date
    readonly pickStartDate?: Date            // WHEN picker started
    readonly pickEndDate?: Date              // WHEN picker finished
    readonly confirmedDate?: Date
  }

  // People
  readonly people: {
    readonly allocatedBy?: string            // WHO allocated
    readonly pickerId?: string               // WHO picked
    readonly confirmedBy?: string            // WHO confirmed
  }

  // Duration
  readonly timing: {
    readonly estimatedDuration?: number      // Estimated seconds
    readonly actualDuration?: number         // Actual seconds
    readonly variance?: number               // Difference (+/-)
  }

  // Status
  readonly status: PickingLineStatus
  readonly allocationStatus: AllocationStatus

  // Priority
  readonly priority: OrderPriority
  readonly sequence?: number                 // Pick sequence number

  // Conditions
  readonly conditions?: {
    readonly frozen: boolean
    readonly hazardous: boolean
    readonly fragile: boolean
    readonly controlled: boolean               // Controlled substance
    readonly qualityHold: boolean
    readonly requiresVerification: boolean
    readonly requiresDoubleCheck: boolean
    readonly specialInstructions?: string
  }

  // Cost
  readonly cost?: {
    readonly unitCost: number
    readonly extendedCost: number
  }

  // Metadata
  readonly metadata: {
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type PickingLineStatus =
  | 'pending'
  | 'allocated'
  | 'in-progress'
  | 'picked'
  | 'confirmed'
  | 'short'
  | 'damaged'
  | 'cancelled'
  | 'verified'

type AllocationStatus =
  | 'not-allocated'
  | 'allocated'
  | 'depleted'
  | 'reallocated'
```

### Replenishment (Operational)

```typescript
type Replenishment = {
  // Identification
  readonly replenishmentId: string
  readonly externalReplenishmentId?: string

  // Type
  readonly type: ReplenishmentType
  readonly triggerReason: string
  readonly triggerReasonCode?: string

  // Movement
  readonly movement: {
    readonly productId: string
    readonly productCode: string
    readonly sourceLocation: string          // FROM (bulk/reserve)
    readonly destinationLocation: string     // TO (pick face)
  }

  // Quantities
  readonly quantities: {
    readonly requested: number               // Needed
    readonly moved: number                   // Actually moved
    readonly remaining: number               // Still to move
  }

  // People
  readonly people: {
    readonly requestedBy?: string            // WHO requested
    readonly movedBy?: string                // WHO moved
    readonly confirmedBy?: string
  }

  // Dates
  readonly dates: {
    readonly requestDate: Date
    readonly scheduledDate?: Date
    readonly startDate?: Date
    readonly completedDate?: Date
    readonly cancelledDate?: Date
  }

  // Duration
  readonly timing: {
    readonly estimatedDuration?: number      // Seconds
    readonly actualDuration?: number         // Seconds
    readonly cycleTime?: number              // From request to complete
  }

  // Priority
  readonly priority: OrderPriority

  // Status
  readonly status: ReplenishmentStatus

  // Wave/Batch
  readonly waveId?: string
  readonly batchId?: string

  // Metadata
  readonly metadata: {
    readonly warehouse: string
    readonly zone: string
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type ReplenishmentType =
  | 'dynamic'         // Auto-triggered by min/max
  | 'manual'          // User-initiated
  | 'wave'            // Wave-based
  | 'forward'         // Forward pick area
  | 'emergency'       // Emergency refill
  | 'cycle-count'     // During cycle count

type ReplenishmentStatus =
  | 'pending'
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'partial'
  | 'cancelled'
  | 'on-hold'
```

### Receipt (Operational)

```typescript
type Receipt = {
  // Identification
  readonly receiptId: string
  readonly externalReceiptId?: string
  readonly receiptNumber: string

  // Type
  readonly receiptType: ReceiptType

  // Supplier
  readonly supplier: {
    readonly supplierId: string
    readonly supplierCode: string
    readonly supplierName: string
  }

  // Reference
  readonly purchaseOrderNumber?: string
  readonly supplierInvoiceNumber?: string
  readonly deliveryNoteNumber?: string

  // Dates
  readonly dates: {
    readonly orderDate?: Date               // PO date
    readonly expectedDate: Date              // Expected delivery
    readonly actualDate: Date                // Actual receipt date
    readonly postedDate?: Date               // Posted to inventory
  }

  // Delivery
  readonly delivery: {
    readonly carrier?: string
    readonly vehicleRegistration?: string
    readonly driverName?: string
    readonly sealNumber?: string
    readonly deliveryNotes?: string
  }

  // Location
  readonly receivingLocation: {
    readonly door: string
    readonly locationId: string
  }

  // Lines
  readonly lines: ReceiptLine[]

  // Status
  readonly status: ReceiptStatus

  // People
  readonly people: {
    readonly receivedBy?: string
    readonly verifiedBy?: string
    readonly postedBy?: string
  }

  // Totals
  readonly summary: {
    readonly totalLines: number
    readonly totalQuantity: number
    readonly totalValue?: number
  }

  // Quality
  readonly qualityControl: {
    readonly required: boolean
    readonly completed: boolean
    readonly passed: boolean
    readonly quarantineCount: number
  }

  // Metadata
  readonly metadata: {
    readonly warehouse: string
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type ReceiptLine = {
  // Identification
  readonly lineId: string
  readonly receiptId: string
  readonly lineNumber: number

  // Product
  readonly product: {
    readonly productId: string
    readonly productCode: string
    readonly description?: string
  }

  // Batch/Lot
  readonly batchLot: string
  readonly expirationDate?: Date
  readonly productionDate?: Date
  readonly serialNumbers?: string[]

  // Quantities
  readonly quantities: {
    readonly ordered: number                 // On PO
    readonly expected: number                // Expected delivery
    readonly received: number                // Actually received
    readonly accepted: number                // After QC
    readonly rejected: number                // QC rejected
    readonly damaged: number                 // Damaged on receipt
  }

  // Location
  readonly locations: {
    readonly temporary: string               // Receiving location
    readonly final: string                   // Put-away location
  }

  // Dates
  readonly dates: {
    readonly receivedDate: Date
    readonly inspectedDate?: Date
    readonly putawayDate?: Date
  }

  // Cost
  readonly cost: {
    readonly unitCost: number
    readonly totalCost: number
    readonly currency: string
  }

  // Quality
  readonly quality: {
    readonly status: QualityStatus
    readonly inspectedBy?: string
    readonly inspectionDate?: Date
    readonly rejectionReasons?: string[]
    readonly quarantineUntil?: Date
  }

  // People
  readonly people: {
    readonly receivedBy?: string
    readonly inspectedBy?: string
    readonly putawayBy?: string
  }

  // Metadata
  readonly metadata: {
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type ReceiptType =
  | 'purchase'         // From supplier
  | 'transfer'         // From another warehouse
  | 'return'           // Customer return
  | 'manufacture'      // From production
  | 'consignment'      // Consignment stock

type ReceiptStatus =
  | 'expected'
  | 'in-transit'
  | 'received'
  | 'inspected'
  | 'posted'
  | 'cancelled'

type QualityStatus =
  | 'pending'
  | 'approved'
  | 'quarantine'
  | 'rejected'
  | 'requires-inspection'
```

### Return (Operational)

```typescript
type Return = {
  // Identification
  readonly returnId: string
  readonly externalReturnId?: string
  readonly returnNumber: string
  readonly authorizationNumber?: string     // RMA number

  // Type
  readonly returnType: ReturnType

  // Customer
  readonly customer: {
    readonly customerId: string
    readonly customerName: string
    readonly customerCode?: string
  }

  // Reference
  readonly originalOrderId?: string
  readonly originalOrderDate?: Date

  // Reason
  readonly reason: {
    readonly code: string
    readonly description: string
    readonly detail?: string
  }

  // Dates
  readonly dates: {
    readonly requestDate: Date
    readonly approvedDate?: Date
    readonly receivedDate?: Date
    readonly processedDate?: Date
    readonly completedDate?: Date
  }

  // Resolution
  readonly resolution: {
    readonly type: ReturnResolution
    readonly creditIssued: boolean
    readonly creditAmount?: number
    readonly replacementSent: boolean
    readonly replacementOrderId?: string
  }

  // Lines
  readonly lines: ReturnLine[]

  // Status
  readonly status: ReturnStatus

  // People
  readonly people: {
    readonly processedBy?: string
    readonly approvedBy?: string
  }

  // Totals
  readonly summary: {
    readonly totalLines: number
    readonly totalQuantity: number
    readonly totalValue: number
  }

  // Shipping (for returns to vendor)
  readonly shipping?: {
    readonly carrier?: string
    readonly trackingNumber?: string
    readonly shipDate?: Date
  }

  // Metadata
  readonly metadata: {
    readonly warehouse: string
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type ReturnLine = {
  // Identification
  readonly lineId: string
  readonly returnId: string
  readonly lineNumber: number

  // Reference
  readonly originalOrderLineId?: string

  // Product
  readonly product: {
    readonly productId: string
    readonly productCode: string
    readonly description?: string
  }

  // Batch/Lot
  readonly batchLot?: string
  readonly serialNumbers?: string[]

  // Quantities
  readonly quantities: {
    readonly returned: number                // Quantity returned
    readonly restockable: number             // Can be restocked
    readonly damaged: number                 // Damaged
    readonly defective: number               // Defective
    readonly wrongItem: number               // Wrong item sent
  }

  // Condition
  readonly condition: ReturnCondition
  readonly conditionNotes?: string

  // Location
  readonly locations: {
    readonly returnLocation: string
    readonly restockLocation?: string
    readonly quarantineLocation?: string
    readonly scrapLocation?: string
  }

  // Dates
  readonly dates: {
    readonly receivedDate: Date
    readonly processedDate?: Date
  }

  // Resolution
  readonly resolution: {
    readonly action: ReturnResolution
    readonly restocked: boolean
    readonly credited: boolean
    readonly replaced: boolean
  }

  // Cost
  readonly cost: {
    readonly unitCost: number
    readonly totalCost: number
    readonly restockValue: number
    readonly scrapValue: number
  }

  // People
  readonly people: {
    readonly processedBy?: string
    readonly inspectedBy?: string
  }

  // Customer feedback
  readonly customerFeedback?: {
    readonly reason: string
    readonly detail?: string
    readonly photos?: string[]
  }

  // Metadata
  readonly metadata: {
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type ReturnType =
  | 'customer-return'
  | 'rtv'             // Return to vendor
  | 'field-return'    // Field return
  | 'recall'          // Product recall
  | 'internal'

type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'pending-receipt'
  | 'received'
  | 'inspected'
  | 'processed'
  | 'completed'
  | 'rejected'
  | 'cancelled'

type ReturnCondition =
  | 'new'             // Unopened
  | 'opened'          // Opened box
  | 'damaged'         // Damaged in transit
  | 'defective'       // Product defective
  | 'wrong-item'      // Wrong item sent
  | 'incomplete'      // Missing parts
  | 'expired'         // Past expiration
  | 'no-receipt'

type ReturnResolution =
  | 'restock'         // Return to inventory
  | 'scrap'           // Scrap/write-off
  | 'return-to-vendor' // Send back to supplier
  | 'refurbish'       // Refurbish
  | 'quarantine'      // Hold for inspection
  | 'credit-only'     // Credit only, no return
```

### Inventory Adjustment (Operational)

```typescript
type InventoryAdjustment = {
  // Identification
  readonly adjustmentId: string
  readonly externalAdjustmentId?: string
  readonly adjustmentNumber: string

  // Type
  readonly type: AdjustmentType

  // Reason
  readonly reason: {
    readonly code: string
    readonly description: string
    readonly detail?: string
  }

  // Product
  readonly product: {
    readonly productId: string
    readonly productCode: string
    readonly description?: string
  }

  // Batch/Lot
  readonly batchLot?: string

  // Location
  readonly location: string

  // Quantities
  readonly quantities: {
    readonly expected: number                 // System expected
    readonly actual: number                   // Physical count
    readonly adjustment: number               // Difference (actual - expected)
  }

  // Value
  readonly value: {
    readonly unitCost: number
    readonly totalCost: number
    readonly currency: string
  }

  // Dates
  readonly dates: {
    readonly requestDate: Date
    readonly countDate: Date
    readonly approvedDate?: Date
    readonly postedDate?: Date
  }

  // Approval
  readonly approval: {
    readonly requestedBy: string
    readonly approvedBy?: string
    readonly approvalDate?: Date
    readonly status: ApprovalStatus
  }

  // Status
  readonly status: AdjustmentStatus

  // People
  readonly people: {
    readonly countedBy?: string
    readonly adjustedBy?: string
    readonly verifiedBy?: string
  }

  // Accounting
  readonly accounting: {
    readonly glAccount?: string
    readonly costCenter?: string
    readonly postedToGL: boolean
    readonly postingDate?: Date
  }

  // Metadata
  readonly metadata: {
    readonly warehouse: string
    readonly zone?: string
    readonly sourceWMS: string
    readonly originalData?: any
  }
}

type AdjustmentType =
  | 'cycle-count'      // Cycle count adjustment
  | 'physical-inventory' // Annual physical inventory
  | 'damage'           // Damaged goods
  | 'loss'             // Shrinkage/loss
  | 'found'            // Found goods (positive adjustment)
  | 'expiration'       // Expired goods
  | 'recall'           // Product recall
  | 'transfer'         // Transfer adjustment
  | 'correction'       // System correction

type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'escalated'

type AdjustmentStatus =
  | 'pending'
  | 'approved'
  | 'posted'
  | 'rejected'
  | 'cancelled'
```

## Data Quality Rules

### Required Fields

Every entity MUST have:
- ✅ Unique identifier
- ✅ External identifier (from WMS)
- ✅ Timestamps (created, modified)
- ✅ Source system tracking
- ✅ Status

### Traceability Requirements

Every operation MUST record:
- ✅ WHO performed it (userId)
- ✅ WHAT was affected (productId, locationId)
- ✅ WHEN it happened (timestamp)
- ✅ WHERE it happened (location)
- ✅ WHY (reason, if applicable)

### Data Consistency

- ✅ All foreign keys must reference existing entities
- ✅ Quantities must be >= 0
- ✅ Dates must be logical (end >= start)
- ✅ Status transitions must be valid

---

**Version**: 1.0.0
**Last Updated**: 2025-01-26
**Status**: Draft
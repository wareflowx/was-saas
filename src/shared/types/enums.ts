/**
 * Enum definitions for hard-coded string literals
 *
 * These replace magic strings throughout the codebase with type-safe constants.
 * All enums are readonly to prevent mutation.
 */

// ============================================================================
// ENTITY STATUS
// ============================================================================

/**
 * Status values for warehouse, zone, sector, location entities
 */
export const EntityStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
  MAINTENANCE: 'maintenance',
} as const

export type EntityStatus = typeof EntityStatus[keyof typeof EntityStatus]

// ============================================================================
// LOCATION TYPE
// ============================================================================

/**
 * Location types within warehouse
 */
export const LocationType = {
  STORAGE: 'storage',
  PICKING: 'picking',
  RECEIVING: 'receiving',
  SHIPPING: 'shipping',
  STAGING: 'staging',
  RETURNS: 'returns',
  QUARANTINE: 'quarantine',
  CROSS_DOCK: 'cross_dock',
} as const

export type LocationType = typeof LocationType[keyof typeof LocationType]

// ============================================================================
// ZONE TYPE
// ============================================================================

/**
 * Zone types within warehouse
 */
export const ZoneType = {
  STORAGE: 'storage',
  PICKING: 'picking',
  RECEIVING: 'receiving',
  SHIPPING: 'shipping',
  STAGING: 'staging',
  COLD_STORAGE: 'cold_storage',
  HAZARDOUS: 'hazardous',
  VALUABLES: 'valuables',
  BULK: 'bulk',
} as const

export type ZoneType = typeof ZoneType[keyof typeof ZoneType]

// ============================================================================
// SECTOR TYPE
// ============================================================================

/**
 * Sector types within zones
 */
export const SectorType = {
  SHELVING: 'shelving',
  RACKING: 'racking',
  FLOOR_STACKING: 'floor_stacking',
  BIN: 'bin',
  MEZZANINE: 'mezzanine',
  DRIVE_IN: 'drive_in',
} as const

export type SectorType = typeof SectorType[keyof typeof SectorType]

// ============================================================================
// MOVEMENT TYPE
// ============================================================================

/**
 * Movement/inventory transaction types
 */
export const MovementType = {
  INBOUND: 'inbound',
  OUTBOUND: 'outbound',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
  COUNT: 'count',
} as const

export type MovementType = typeof MovementType[keyof typeof MovementType]

// ============================================================================
// ORDER STATUS
// ============================================================================

/**
 * Order status values
 */
export const OrderStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PARTIALLY_PICKED: 'partially_picked',
  PICKED: 'picked',
  PARTIALLY_SHIPPED: 'partially_shipped',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

// ============================================================================
// PICKING STATUS
// ============================================================================

/**
 * Picking order status values
 */
export const PickingStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold',
} as const

export type PickingStatus = typeof PickingStatus[keyof typeof PickingStatus]

// ============================================================================
// RECEPTION STATUS
// ============================================================================

/**
 * Purchase order reception status values
 */
export const ReceptionStatus = {
  PENDING: 'pending',
  PARTIALLY_RECEIVED: 'partially_received',
  RECEIVED: 'received',
  CANCELLED: 'cancelled',
} as const

export type ReceptionStatus = typeof ReceptionStatus[keyof typeof ReceptionStatus]

// ============================================================================
// RETURN STATUS
// ============================================================================

/**
 * Customer return status values
 */
export const ReturnStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  RECEIVED: 'received',
  REJECTED: 'rejected',
  PROCESSED: 'processed',
  REFUNDED: 'refunded',
} as const

export type ReturnStatus = typeof ReturnStatus[keyof typeof ReturnStatus]

// ============================================================================
// RETURN REASON TYPE
// ============================================================================

/**
 * Customer return reason types
 */
export const ReturnReasonType = {
  DAMAGED: 'damaged',
  DEFECTIVE: 'defective',
  WRONG_ITEM: 'wrong_item',
  NO_LONGER_NEEDED: 'no_longer_needed',
  BETTER_PRICE: 'better_price',
  DISSATISFIED: 'dissatisfied',
  OTHER: 'other',
} as const

export type ReturnReasonType = typeof ReturnReasonType[keyof typeof ReturnReasonType]

// ============================================================================
// RESTOCKING STATUS
// ============================================================================

/**
 * Internal restocking status values
 */
export const RestockingStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type RestockingStatus = typeof RestockingStatus[keyof typeof RestockingStatus]

// ============================================================================
// PRODUCT STATUS
// ============================================================================

/**
 * Product status values
 */
export const ProductStatus = {
  ACTIVE: 'active',
  DISCONTINUED: 'discontinued',
  OUT_OF_STOCK: 'out_of_stock',
  PREORDER: 'preorder',
} as const

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus]

// ============================================================================
// IMPORT STATUS
// ============================================================================

/**
 * Import job status values
 */
export const ImportStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PARTIAL: 'partial',
} as const

export type ImportStatus = typeof ImportStatus[keyof typeof ImportStatus]

// ============================================================================
// USER ROLE
// ============================================================================

/**
 * User role types
 */
export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  PICKER: 'picker',
  OPERATOR: 'operator',
  VIEWER: 'viewer',
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

// ============================================================================
// ABC ANALYSIS CLASS
// ============================================================================

/**
 * ABC analysis classification
 */
export const ABCClass = {
  A: 'A',  // High value, high turnover
  B: 'B',  // Medium value, medium turnover
  C: 'C',  // Low value, low turnover
} as const

export type ABCClass = typeof ABCClass[keyof typeof ABCClass]

// ============================================================================
// DEAD STOCK LEVEL
// ============================================================================

/**
 * Dead stock severity levels
 */
export const DeadStockLevel = {
  CRITICAL: 'critical',  // > 365 days
  WARNING: 'warning',    // > 180 days
  MONITOR: 'monitor',    // > 90 days
} as const

export type DeadStockLevel = typeof DeadStockLevel[keyof typeof DeadStockLevel]

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

/**
 * Priority levels for orders, tasks
 */
export const Priority = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const

export type Priority = typeof Priority[keyof typeof Priority]

// ============================================================================
// ERROR DOMAINS
// ============================================================================

/**
 * Error domain categorization
 */
export const ErrorDomain = {
  DATABASE: 'DATABASE',
  IPC: 'IPC',
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  BUSINESS: 'BUSINESS',
  FILESYSTEM: 'FILESYSTEM',
} as const

export type ErrorDomain = typeof ErrorDomain[keyof typeof ErrorDomain]

// ============================================================================
// IMPORT RESULT STATUS
// ============================================================================

/**
 * Import operation result status
 */
export const ImportResultStatus = {
  SUCCESS: 'success',
  PARTIAL: 'partial',
  FAILED: 'failed',
} as const

export type ImportResultStatus = typeof ImportResultStatus[keyof typeof ImportResultStatus]

// ============================================================================
// VALIDATION SEVERITY
// ============================================================================

/**
 * Validation result severity levels
 */
export const ValidationSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

export type ValidationSeverity = typeof ValidationSeverity[keyof typeof ValidationSeverity]

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if a value is a valid enum member
 */
export const isValidEnum = <T extends Record<string, string>>(
  enumObj: T,
  value: string
): value is T[keyof T] => {
  return Object.values(enumObj).includes(value)
}

/**
 * Get all enum values as array
 */
export const enumValues = <T extends Record<string, string>>(
  enumObj: T
): readonly T[keyof T][] => {
  return Object.values(enumObj) as unknown as readonly T[keyof T][]
}

/**
 * Get all enum keys as array
 */
export const enumKeys = <T extends Record<string, string>>(
  enumObj: T
): readonly (keyof T)[] => {
  return Object.keys(enumObj) as (keyof T)[]
}

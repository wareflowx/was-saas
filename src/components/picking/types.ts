export type PickingStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "partial"
  | "error"

export type Priority = "low" | "medium" | "high"

export interface PickingError {
  type: "wrong_product" | "damaged" | "not_found" | "quantity_mismatch"
  message: string
  reportedAt: Date
  reportedBy?: string
}

export interface PickingLine {
  id: string
  lineNumber: number
  commande: {
    orderId: string
    orderDate: Date
    orderType: string
    priority: Priority
    requester: string
    destination: string
  }
  article: {
    productId: number
    productName: string
    productDescription?: string
    sku?: string
    quantity: number
    unit: string
  }
  emplacement: {
    warehouse: string
    zone: string
    aisle?: string
    bay?: string
    level?: number
    position: string
    fullPath: string
  }
  picking: {
    status: PickingStatus
    assignedTo?: string
    assignedAt?: Date
    startedAt?: Date
    completedAt?: Date
    duration?: number
    quantityPicked: number
    quantityRequired: number
    progress: number
  }
  entrepot: string
  date: Date
  utilisateur?: string
  notes?: string[]
  errors?: PickingError[]
}

export interface PickingDailySummary {
  date: Date
  totalLines: number
  completedLines: number
  pendingLines: number
  totalQuantity: number
  pickedQuantity: number
  completionRate: number
  uniqueOperators: number
  avgLinesPerOperator: number
  totalDuration: number
  avgDurationPerLine: number
}

export interface PickingPeriodSummary {
  period: DateRange
  totalLines: number
  completedLines: number
  totalQuantity: number
  uniqueOrders: number
  uniqueProducts: number
  uniqueOperators: number
  avgLinesPerDay: number
  peakDay: string
}

export interface DateRange {
  start: Date
  end: Date
}

export interface PickingSummary {
  today: PickingDailySummary
  thisWeek: PickingPeriodSummary
  thisMonth: PickingPeriodSummary
}

export interface PickingStatusDistribution {
  status: PickingStatus
  count: number
  fill: string
}

export interface PickingOperatorPerformance {
  operator: string
  lines: number
  avgDuration: number
}

export interface PickingTrendData {
  date: string
  totalLines: number
  completedLines: number
  avgDuration: number
}

export interface PickingPriorityDistribution {
  priority: Priority
  count: number
  avgDuration: number
}

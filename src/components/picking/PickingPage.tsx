import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PickingKPICards } from "./PickingKPICards"
import { PickingTable } from "./PickingTable"
import { PickingLineSheet } from "./PickingLineSheet"
import { PickingStatusChart } from "./PickingStatusChart"
import { PickingByOperatorChart } from "./PickingByOperatorChart"
import { PickingTrendsChart } from "./PickingTrendsChart"
import { PickingByPriorityChart } from "./PickingByPriorityChart"
import type {
  PickingLine,
  PickingStatus,
  Priority,
  PickingSummary,
  PickingStatusDistribution,
  PickingOperatorPerformance,
  PickingTrendData,
  PickingPriorityDistribution,
} from "./types"

type StatusFilter = "all" | PickingStatus
type PriorityFilter = "all" | Priority
type WarehouseFilter = "all" | "Warehouse 1" | "Warehouse 2" | "Warehouse 3"
type ZoneFilter = "all" | "Zone A" | "Zone B" | "Zone C" | "Zone D"

interface PickingPageProps {
  data: {
    summary: PickingSummary
    pickingLines: PickingLine[]
    statusDistribution: PickingStatusDistribution[]
    operatorPerformance: PickingOperatorPerformance[]
    trends: PickingTrendData[]
    priorityDistribution: PickingPriorityDistribution[]
  }
}

export function PickingPage({ data }: PickingPageProps) {
  const [selectedLine, setSelectedLine] = useState<PickingLine | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Filter states
  const [search, setSearch] = useState("")
  const [sortStatus, setSortStatus] = useState<StatusFilter>("all")
  const [sortPriority, setSortPriority] = useState<PriorityFilter>("all")
  const [sortWarehouse, setSortWarehouse] = useState<WarehouseFilter>("all")
  const [sortZone, setSortZone] = useState<ZoneFilter>("all")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  // Filter picking lines
  const filteredLines = useMemo(() => {
    return data.pickingLines.filter((line) => {
      if (sortStatus !== "all" && line.picking.status !== sortStatus) return false
      if (sortPriority !== "all" && line.commande.priority !== sortPriority) return false
      if (sortWarehouse !== "all" && line.emplacement.warehouse !== sortWarehouse) return false
      if (sortZone !== "all" && line.emplacement.zone !== sortZone.replace("Zone ", "")) return false
      if (
        search &&
        !line.commande.orderId.toLowerCase().includes(search.toLowerCase()) &&
        !line.article.productName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [data.pickingLines, sortStatus, sortPriority, sortWarehouse, sortZone, search])

  const handleViewDetails = (line: PickingLine) => {
    setSelectedLine(line)
    setIsSheetOpen(true)
  }

  const handleStartPicking = (line: PickingLine) => {
    console.log("Starting picking for line:", line.id)
  }

  const handleCompletePicking = (line: PickingLine, qty: number) => {
    console.log("Completing picking for line:", line.id, "quantity:", qty)
  }

  const handleReportError = (line: PickingLine, error: any) => {
    console.log("Reporting error for line:", line.id, error)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Monitor picking operations</span> and track order fulfillment progress across all zones in real-time.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPIs */}
      <PickingKPICards
        totalLines={data.summary.today.totalLines}
        completedLines={data.summary.today.completedLines}
        pendingLines={data.summary.today.pendingLines}
        completionRate={data.summary.today.completionRate}
      />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <PickingStatusChart data={data.statusDistribution} />
        <PickingByOperatorChart data={data.operatorPerformance} />
      </div>

      {/* Picking Table */}
      <PickingTable
        pickingLines={filteredLines}
        search={search}
        onSearchChange={setSearch}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        sortPriority={sortPriority}
        onSortPriorityChange={setSortPriority}
        sortWarehouse={sortWarehouse}
        onSortWarehouseChange={setSortWarehouse}
        sortZone={sortZone}
        onSortZoneChange={setSortZone}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onViewDetails={handleViewDetails}
      />

      {/* Detail Sheet */}
      <PickingLineSheet
        pickingLine={selectedLine}
        open={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false)
          setSelectedLine(null)
        }}
        onStartPicking={handleStartPicking}
        onCompletePicking={handleCompletePicking}
        onReportError={handleReportError}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Picking Overview</DialogTitle>
            <DialogDescription>
              Comprehensive view of warehouse picking operations and order fulfillment status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Key Metrics Section */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">KPIs</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Total Lines</p>
                      <p className="text-muted-foreground">Complete count of all picking lines</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Completion Rate</p>
                      <p className="text-muted-foreground">Percentage of orders fulfilled</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Pending & Completed</p>
                      <p className="text-muted-foreground">Track picking progress status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Charts</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Status Distribution</p>
                      <p className="text-muted-foreground">Visual breakdown by picking status</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Operator Performance</p>
                      <p className="text-muted-foreground">Track picker efficiency</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Picking Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Browse and manage all picking lines with powerful filtering options by status, priority, warehouse, and zone.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Expand Row</p>
                      <p className="text-muted-foreground">View detailed line information</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by order ID or product</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Status, priority, warehouse, zone</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

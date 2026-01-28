import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PickingLine, PickingStatus, Priority } from "./types"

type StatusFilter = "all" | PickingStatus
type PriorityFilter = "all" | Priority
type WarehouseFilter = "all" | "Warehouse 1" | "Warehouse 2" | "Warehouse 3"
type ZoneFilter = "all" | "Zone A" | "Zone B" | "Zone C" | "Zone D"

interface PickingTableProps {
  pickingLines: PickingLine[]
  search: string
  onSearchChange: (search: string) => void
  sortStatus: StatusFilter
  onSortStatusChange: (status: StatusFilter) => void
  sortPriority: PriorityFilter
  onSortPriorityChange: (priority: PriorityFilter) => void
  sortWarehouse: WarehouseFilter
  onSortWarehouseChange: (warehouse: WarehouseFilter) => void
  sortZone: ZoneFilter
  onSortZoneChange: (zone: ZoneFilter) => void
  currentPage: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onViewDetails?: (line: PickingLine) => void
  className?: string
}

export function PickingTable({
  pickingLines,
  search,
  onSearchChange,
  sortStatus,
  onSortStatusChange,
  sortPriority,
  onSortPriorityChange,
  sortWarehouse,
  onSortWarehouseChange,
  sortZone,
  onSortZoneChange,
  currentPage,
  onPageChange,
  itemsPerPage,
  onViewDetails,
  className,
}: PickingTableProps) {
  // Calculate pagination
  const totalPages = Math.ceil(pickingLines.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLines = pickingLines.slice(startIndex, endIndex)

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search orders or products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sortStatus} onValueChange={onSortStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortPriority} onValueChange={onSortPriorityChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortWarehouse} onValueChange={onSortWarehouseChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            <SelectItem value="Warehouse 1">Warehouse 1</SelectItem>
            <SelectItem value="Warehouse 2">Warehouse 2</SelectItem>
            <SelectItem value="Warehouse 3">Warehouse 3</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortZone} onValueChange={onSortZoneChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            <SelectItem value="Zone A">Zone A</SelectItem>
            <SelectItem value="Zone B">Zone B</SelectItem>
            <SelectItem value="Zone C">Zone C</SelectItem>
            <SelectItem value="Zone D">Zone D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Order ID</TableHead>
              <TableHead className="text-muted-foreground">Product</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Operator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pickingLines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No picking lines found
                </TableCell>
              </TableRow>
            ) : (
              paginatedLines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>
                    <button
                      onClick={() => onViewDetails && onViewDetails(line)}
                      className="font-medium text-left text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {line.commande.orderId}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="space-y-0.5">
                      <div className="truncate">{line.article.productName}</div>
                      {line.article.sku && (
                        <div className="text-xs">#{line.lineNumber} • {line.article.sku}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{line.emplacement.zone}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{line.picking.status.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-muted-foreground">{line.picking.assignedTo || "Unassigned"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

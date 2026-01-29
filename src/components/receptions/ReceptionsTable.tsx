import { useMemo, useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Reception } from "@/types/entities"

interface ReceptionsTableProps {
  receptions: Reception[]
}

export function ReceptionsTable({ receptions }: ReceptionsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(receptions.map((r) => r.status))
    return Array.from(statuses)
  }, [receptions])

  const uniquePriorities = useMemo(() => {
    const priorities = new Set(receptions.map((r) => r.priority))
    return Array.from(priorities)
  }, [receptions])

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(receptions.map((r) => r.warehouseName))
    return Array.from(warehouses)
  }, [receptions])

  const filteredReceptions = useMemo(() => {
    return receptions.filter((reception) => {
      const matchesSearch =
        search === "" ||
        reception.receptionNumber.toLowerCase().includes(search.toLowerCase()) ||
        reception.supplierName.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || reception.status === statusFilter
      const matchesPriority = priorityFilter === "all" || reception.priority === priorityFilter
      const matchesWarehouse = warehouseFilter === "all" || reception.warehouseName === warehouseFilter
      return matchesSearch && matchesStatus && matchesPriority && matchesWarehouse
    })
  }, [receptions, search, statusFilter, priorityFilter, warehouseFilter])

  // Pagination
  const totalPages = Math.ceil(filteredReceptions.length / itemsPerPage)
  const paginatedReceptions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredReceptions.slice(start, start + itemsPerPage)
  }, [filteredReceptions, currentPage, itemsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, priorityFilter, warehouseFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: {
        label: "Pending",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      },
      in_progress: {
        label: "In Progress",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500",
      },
      completed: {
        label: "Completed",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500",
      },
      partial: {
        label: "Partial",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500",
      },
      cancelled: {
        label: "Cancelled",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500",
      },
    }

    const config = statusConfig[status] || { label: status, className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500" }
    return <span className={config.className}>{config.label}</span>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; className: string }> = {
      urgent: {
        label: "Urgent",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500",
      },
      high: {
        label: "High",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500",
      },
      medium: {
        label: "Medium",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      },
      low: {
        label: "Low",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500",
      },
    }

    const config = priorityConfig[priority] || { label: priority, className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500" }
    return <span className={config.className}>{config.label}</span>
  }

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by number or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {uniqueWarehouses.map((warehouse) => (
              <SelectItem key={warehouse} value={warehouse}>
                {warehouse.length > 20 ? warehouse.substring(0, 20) + "..." : warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {uniquePriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority === "low" ? "Low" : priority === "medium" ? "Medium" : priority === "high" ? "High" : "Urgent"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "pending" ? "Pending" : status === "in_progress" ? "In Progress" : status === "completed" ? "Completed" : status === "partial" ? "Partial" : "Cancelled"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expected Date</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Lines</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReceptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No receptions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedReceptions.map((reception) => (
                <TableRow key={reception.id}>
                  <TableCell className="font-medium">{reception.receptionNumber}</TableCell>
                  <TableCell>{reception.supplierName}</TableCell>
                  <TableCell>{new Date(reception.expectedDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-muted-foreground">{reception.warehouseName}</TableCell>
                  <TableCell className="text-right">{reception.lines.length}</TableCell>
                  <TableCell className="text-right">{reception.totalQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{reception.receivedQuantity.toLocaleString()}</TableCell>
                  <TableCell>{getPriorityBadge(reception.priority)}</TableCell>
                  <TableCell>{getStatusBadge(reception.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredReceptions.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReceptions.length)} of {filteredReceptions.length} receptions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

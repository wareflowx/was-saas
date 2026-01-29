import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Picking } from "@/types/entities"

interface PickingTableProps {
  pickings: Picking[]
}

export function PickingTable({ pickings }: PickingTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(pickings.map((p) => p.status))
    return Array.from(statuses)
  }, [pickings])

  const uniquePriorities = useMemo(() => {
    const priorities = new Set(pickings.map((p) => p.priority))
    return Array.from(priorities)
  }, [pickings])

  const filteredPickings = useMemo(() => {
    return pickings.filter((picking) => {
      const matchesSearch =
        search === "" ||
        picking.pickingNumber.toLowerCase().includes(search.toLowerCase()) ||
        picking.orderNumber.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || picking.status === statusFilter
      const matchesPriority = priorityFilter === "all" || picking.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [pickings, search, statusFilter, priorityFilter])

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
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by number or order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
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
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[160px]">
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
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Picking #</TableHead>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Lines</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Picked</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPickings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No pickings found
                </TableCell>
              </TableRow>
            ) : (
              filteredPickings.map((picking) => (
                <TableRow key={picking.id}>
                  <TableCell className="font-medium">{picking.pickingNumber}</TableCell>
                  <TableCell>{picking.orderNumber}</TableCell>
                  <TableCell>{picking.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">{picking.warehouseName}</TableCell>
                  <TableCell className="text-right">{picking.lines.length}</TableCell>
                  <TableCell className="text-right">{picking.totalQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{picking.pickedQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{picking.remainingQuantity.toLocaleString()}</TableCell>
                  <TableCell>{getPriorityBadge(picking.priority)}</TableCell>
                  <TableCell>{getStatusBadge(picking.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

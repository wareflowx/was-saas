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
import type { Restocking } from "@/types/entities"

interface RestockingsTableProps {
  restockings: Restocking[]
}

export function RestockingsTable({ restockings }: RestockingsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(restockings.map((r) => r.status))
    return Array.from(statuses)
  }, [restockings])

  const filteredRestockings = useMemo(() => {
    return restockings.filter((restocking) => {
      const matchesSearch =
        search === "" ||
        restocking.restockingNumber.toLowerCase().includes(search.toLowerCase()) ||
        restocking.warehouseName.toLowerCase().includes(search.toLowerCase()) ||
        (restocking.assignedTo && restocking.assignedTo.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = statusFilter === "all" || restocking.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [restockings, search, statusFilter])

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
      high: {
        label: "High",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500",
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
            placeholder="Search by number, warehouse, assignee..."
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
                {status === "pending" ? "Pending" : status === "in_progress" ? "In Progress" : status === "completed" ? "Completed" : "Cancelled"}
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
              <TableHead>Number</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Products</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Request Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestockings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No restockings found
                </TableCell>
              </TableRow>
            ) : (
              filteredRestockings.map((restocking) => (
                <TableRow key={restocking.id}>
                  <TableCell className="font-medium">{restocking.restockingNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{restocking.warehouseName}</TableCell>
                  <TableCell>{getStatusBadge(restocking.status)}</TableCell>
                  <TableCell>{getPriorityBadge(restocking.priority)}</TableCell>
                  <TableCell className="text-right">
                    {restocking.restockedProducts} / {restocking.totalProducts}
                  </TableCell>
                  <TableCell>{restocking.assignedTo || "-"}</TableCell>
                  <TableCell>{new Date(restocking.requestedDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

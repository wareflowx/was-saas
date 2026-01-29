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
import type { Order } from "@/types/entities"

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(orders.map((o) => o.status))
    return Array.from(statuses)
  }, [orders])

  const uniquePriorities = useMemo(() => {
    const priorities = new Set(orders.map((o) => o.priority))
    return Array.from(priorities)
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        search === "" ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [orders, search, statusFilter, priorityFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: {
        label: "Pending",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      },
      confirmed: {
        label: "Confirmed",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500",
      },
      picking: {
        label: "Picking",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-500",
      },
      picked: {
        label: "Picked",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-500",
      },
      packing: {
        label: "Packing",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-500",
      },
      packed: {
        label: "Packed",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-teal-500/10 border border-teal-500/20 text-teal-500",
      },
      shipped: {
        label: "Shipped",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500",
      },
      delivered: {
        label: "Delivered",
        className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-500",
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
            placeholder="Search by number or customer..."
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
                {status === "pending" ? "Pending" : status === "confirmed" ? "Confirmed" : status === "picking" ? "Picking" : status === "picked" ? "Picked" : status === "packing" ? "Packing" : status === "packed" ? "Packed" : status === "shipped" ? "Shipped" : status === "delivered" ? "Delivered" : "Cancelled"}
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
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Lines</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-muted-foreground">{order.warehouseName}</TableCell>
                  <TableCell className="text-right">{order.lines.length}</TableCell>
                  <TableCell className="text-right">{order.totalQuantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

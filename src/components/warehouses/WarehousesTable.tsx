import { useMemo } from "react"
import { Search } from "lucide-react"
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
import type { Warehouse } from "@/types/entities"

interface WarehousesTableProps {
  warehouses: Warehouse[]
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export function WarehousesTable({
  warehouses,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: WarehousesTableProps) {
  // Get unique statuses
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(warehouses.map((w) => w.status))
    return Array.from(statuses)
  }, [warehouses])

  // Filter warehouses
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      const matchesSearch =
        search === "" ||
        warehouse.name.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "" || warehouse.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [warehouses, search, statusFilter])

  const getStatusBadge = (status: Warehouse["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
            Active
          </span>
        )
      case "inactive":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500">
            Inactive
          </span>
        )
      case "maintenance":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            Maintenance
          </span>
        )
    }
  }

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "active" ? "Active" : status === "inactive" ? "Inactive" : "Maintenance"}
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
              <TableHead>Name</TableHead>
              <TableHead>Pickers</TableHead>
              <TableHead>Zones</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWarehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No warehouses found
                </TableCell>
              </TableRow>
            ) : (
              filteredWarehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.pickerCount}</TableCell>
                  <TableCell>{warehouse.zoneCount}</TableCell>
                  <TableCell>{warehouse.manager}</TableCell>
                  <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

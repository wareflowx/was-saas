import { useState, useMemo, useEffect } from "react"
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
import type { Zone } from "@/types/entities"

interface ZonesTableProps {
  zones: Zone[]
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
}

export function ZonesTable({
  zones,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: ZonesTableProps) {
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Get unique statuses and types
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(zones.map((z) => z.status))
    return Array.from(statuses)
  }, [zones])

  const uniqueTypes = useMemo(() => {
    const types = new Set(zones.map((z) => z.type))
    return Array.from(types)
  }, [zones])

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(zones.map((z) => z.warehouseName))
    return Array.from(warehouses)
  }, [zones])

  // Filter zones
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => {
      const matchesSearch =
        search === "" ||
        zone.name.toLowerCase().includes(search.toLowerCase()) ||
        zone.code.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "" || zone.status === statusFilter
      const matchesType = typeFilter === "" || zone.type === typeFilter
      const matchesWarehouse = warehouseFilter === "all" || zone.warehouseName === warehouseFilter

      return matchesSearch && matchesStatus && matchesType && matchesWarehouse
    })
  }, [zones, search, statusFilter, typeFilter, warehouseFilter])

  // Pagination
  const totalPages = Math.ceil(filteredZones.length / itemsPerPage)
  const paginatedZones = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredZones.slice(start, start + itemsPerPage)
  }, [filteredZones, currentPage, itemsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, typeFilter, warehouseFilter])

  const getStatusBadge = (status: Zone["status"]) => {
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
      case "full":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500">
            Full
          </span>
        )
    }
  }

  const getTypeLabel = (type: Zone["type"]): string => {
    const labels: Record<Zone["type"], string> = {
      storage: "Storage",
      receiving: "Receiving",
      shipping: "Shipping",
      picking: "Picking",
      packing: "Packing",
      cold_storage: "Cold Storage",
      hazardous: "Hazardous",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
                {warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter || "all"} onValueChange={(value) => onTypeChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getTypeLabel(type as Zone["type"])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter || "all"} onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === "active" ? "Active" : status === "inactive" ? "Inactive" : status === "maintenance" ? "Maintenance" : "Full"}
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
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Pickers</TableHead>
              <TableHead>Sectors</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedZones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No zones found
                </TableCell>
              </TableRow>
            ) : (
              paginatedZones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>{getTypeLabel(zone.type)}</TableCell>
                  <TableCell>{zone.pickerCount}</TableCell>
                  <TableCell>{zone.sectorCount}</TableCell>
                  <TableCell>{getStatusBadge(zone.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredZones.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredZones.length)} of {filteredZones.length} zones
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

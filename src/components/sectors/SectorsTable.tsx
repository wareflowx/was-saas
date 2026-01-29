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
import type { Sector } from "@/types/entities"

interface SectorsTableProps {
  sectors: Sector[]
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
}

export function SectorsTable({
  sectors,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: SectorsTableProps) {
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(sectors.map((s) => s.status))
    return Array.from(statuses)
  }, [sectors])

  const uniqueTypes = useMemo(() => {
    const types = new Set(sectors.map((s) => s.type))
    return Array.from(types)
  }, [sectors])

  const uniqueZones = useMemo(() => {
    const zones = new Set(sectors.map((s) => s.zoneName))
    return Array.from(zones)
  }, [sectors])

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(sectors.map((s) => s.warehouseName))
    return Array.from(warehouses)
  }, [sectors])

  // Filter sectors
  const filteredSectors = useMemo(() => {
    return sectors.filter((sector) => {
      const matchesSearch =
        search === "" ||
        sector.name.toLowerCase().includes(search.toLowerCase()) ||
        sector.code.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "all" || sector.status === statusFilter
      const matchesType = typeFilter === "all" || sector.type === typeFilter
      const matchesZone = zoneFilter === "all" || sector.zoneName === zoneFilter
      const matchesWarehouse = warehouseFilter === "all" || sector.warehouseName === warehouseFilter

      return matchesSearch && matchesStatus && matchesType && matchesZone && matchesWarehouse
    })
  }, [sectors, search, statusFilter, typeFilter, zoneFilter, warehouseFilter])

  // Pagination
  const totalPages = Math.ceil(filteredSectors.length / itemsPerPage)
  const paginatedSectors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredSectors.slice(start, start + itemsPerPage)
  }, [filteredSectors, currentPage, itemsPerPage])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, typeFilter, zoneFilter, warehouseFilter])

  const getStatusBadge = (status: string) => {
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
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500">
            {status}
          </span>
        )
    }
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
                {warehouse.length > 20 ? warehouse.substring(0, 20) + "..." : warehouse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {uniqueZones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                {zone.length > 20 ? zone.substring(0, 20) + "..." : zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getTypeLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusChange}>
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
              <TableHead className="text-right">Pickers</TableHead>
              <TableHead className="text-right">Locations</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No sectors found
                </TableCell>
              </TableRow>
            ) : (
              paginatedSectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sector.name}</div>
                      <div className="text-xs text-muted-foreground">{sector.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeLabel(sector.type)}</TableCell>
                  <TableCell className="text-right">{sector.pickerCount || 0}</TableCell>
                  <TableCell className="text-right">{sector.locationCount}</TableCell>
                  <TableCell>{getStatusBadge(sector.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredSectors.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSectors.length)} of {filteredSectors.length} sectors
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

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    rack: "Rack",
    shelf: "Shelf",
    floor: "Floor",
    bin: "Bin",
    mezzanine: "Mezzanine",
  }
  return labels[type] || type
}

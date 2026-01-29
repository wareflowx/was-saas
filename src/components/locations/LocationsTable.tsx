import { useState, useMemo } from "react"
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
import type { Location } from "@/types/entities"

interface LocationsTableProps {
  locations: Location[]
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export function LocationsTable({
  locations,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: LocationsTableProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [zoneFilter, setZoneFilter] = useState<string>("all")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Get unique values for filters
  const uniqueTypes = useMemo(() => {
    const types = new Set(locations.map((l) => l.type))
    return Array.from(types)
  }, [locations])

  const uniqueZones = useMemo(() => {
    const zones = new Set(locations.map((l) => l.zoneName))
    return Array.from(zones)
  }, [locations])

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(locations.map((l) => l.warehouseName))
    return Array.from(warehouses)
  }, [locations])

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesSearch =
        !search ||
        location.code.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "all" || location.status === statusFilter
      const matchesType = typeFilter === "all" || location.type === typeFilter
      const matchesZone = zoneFilter === "all" || location.zoneName === zoneFilter
      const matchesWarehouse = warehouseFilter === "all" || location.warehouseName === warehouseFilter

      return matchesSearch && matchesStatus && matchesType && matchesZone && matchesWarehouse
    })
  }, [locations, search, statusFilter, typeFilter, zoneFilter, warehouseFilter])

  // Pagination
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage)
  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLocations.slice(start, start + itemsPerPage)
  }, [filteredLocations, currentPage, itemsPerPage])
  const getStatusBadge = (status: Location["status"]) => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
            Available
          </span>
        )
      case "occupied":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500">
            Occupied
          </span>
        )
      case "full":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500">
            Full
          </span>
        )
      case "blocked":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            Blocked
          </span>
        )
      case "reserved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/10 border border-purple-500/20 text-purple-500">
            Reserved
          </span>
        )
    }
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      rack: "Rack",
      shelf: "Shelf",
      floor: "Floor",
      bin: "Bin",
      pallet: "Pallet",
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
            placeholder="Search by location code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
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
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No locations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.code}</TableCell>
                  <TableCell>{getTypeLabel(location.type)}</TableCell>
                  <TableCell className="text-muted-foreground">{location.zoneName}</TableCell>
                  <TableCell className="text-muted-foreground">{location.warehouseName}</TableCell>
                  <TableCell>{getStatusBadge(location.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLocations.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLocations.length)} of {filteredLocations.length} locations
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


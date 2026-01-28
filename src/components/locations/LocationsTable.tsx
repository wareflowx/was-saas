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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type LocationType = "rack" | "shelf" | "floor" | "bin"
export type LocationStatus = "available" | "medium" | "full"

export interface Product {
  id: string
  name: string
  sku: string
  quantity: number
}

interface Location {
  id: string
  code: string
  zone: string
  warehouse?: string
  type: LocationType
  capacity: number
  used: number
  productsCount: number
  status: LocationStatus
  products?: Product[]
}

interface LocationsTableProps {
  locations: Location[]
  search: string
  onSearchChange: (search: string) => void
  sortZone: string
  onSortZoneChange: (zone: string) => void
  sortWarehouse: string
  onSortWarehouseChange: (warehouse: string) => void
  sortType: string
  onSortTypeChange: (type: string) => void
  currentPage: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onViewDetails?: (location: Location) => void
  className?: string
}

export function LocationsTable({
  locations,
  search,
  onSearchChange,
  sortZone,
  onSortZoneChange,
  sortWarehouse,
  onSortWarehouseChange,
  sortType,
  onSortTypeChange,
  currentPage,
  onPageChange,
  itemsPerPage,
  onViewDetails,
  className,
}: LocationsTableProps) {
  // Calculate pagination
  const totalPages = Math.ceil(locations.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLocations = locations.slice(startIndex, endIndex)

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={sortZone} onValueChange={onSortZoneChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            <SelectItem value="A">Zone A</SelectItem>
            <SelectItem value="B">Zone B</SelectItem>
            <SelectItem value="C">Zone C</SelectItem>
            <SelectItem value="D">Zone D</SelectItem>
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

        <Select value={sortType} onValueChange={onSortTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="rack">Rack</SelectItem>
            <SelectItem value="shelf">Shelf</SelectItem>
            <SelectItem value="floor">Floor</SelectItem>
            <SelectItem value="bin">Bin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Location Code</TableHead>
              <TableHead className="text-muted-foreground">Zone</TableHead>
              <TableHead className="text-muted-foreground">Warehouse</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No locations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <button
                      onClick={() => onViewDetails && onViewDetails(location)}
                      className="font-medium text-left text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {location.code}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{location.zone}</TableCell>
                  <TableCell className="text-muted-foreground">{location.warehouse || "-"}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{location.type}</TableCell>
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

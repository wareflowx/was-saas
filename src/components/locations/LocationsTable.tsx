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
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
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
            {locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No locations found
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => {
                const occupancyRate = (location.usedCapacity / location.capacity) * 100
                return (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.code}</TableCell>
                    <TableCell>{getTypeLabel(location.type)}</TableCell>
                    <TableCell className="text-muted-foreground">{location.zoneName}</TableCell>
                    <TableCell className="text-muted-foreground">{location.warehouseName}</TableCell>
                    <TableCell>{getStatusBadge(location.status)}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


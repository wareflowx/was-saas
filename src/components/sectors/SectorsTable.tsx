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
  // Get unique values for filters
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(sectors.map((s) => s.status))
    return Array.from(statuses)
  }, [sectors])

  const uniqueTypes = useMemo(() => {
    const types = new Set(sectors.map((s) => s.type))
    return Array.from(types)
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

      return matchesSearch && matchesStatus && matchesType
    })
  }, [sectors, search, statusFilter, typeFilter])

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
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px]">
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
        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[160px]">
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
      </div>

      {/* Table */}
      <div className="border rounded-lg">
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
            {filteredSectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No sectors found
                </TableCell>
              </TableRow>
            ) : (
              filteredSectors.map((sector) => (
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

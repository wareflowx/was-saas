import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

type Zone = "all" | "A" | "B" | "C" | "D"
type LocationType = "all" | "rack" | "shelf" | "floor" | "bin"
type Status = "all" | "available" | "medium" | "full"

interface LocationFiltersProps {
  zone: Zone
  onZoneChange: (zone: Zone) => void
  type: LocationType
  onTypeChange: (type: LocationType) => void
  status: Status
  onStatusChange: (status: Status) => void
  search: string
  onSearchChange: (search: string) => void
  className?: string
}

export function LocationFilters({
  zone,
  onZoneChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  search,
  onSearchChange,
  className,
}: LocationFiltersProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Select value={zone} onValueChange={(value) => onZoneChange(value as Zone)}>
          <SelectTrigger className="w-[180px]">
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

        <Select value={type} onValueChange={(value) => onTypeChange(value as LocationType)}>
          <SelectTrigger className="w-[180px]">
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

        <Select value={status} onValueChange={(value) => onStatusChange(value as Status)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="full">Full</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

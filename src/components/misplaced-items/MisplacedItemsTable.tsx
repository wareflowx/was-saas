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
import { ArrowRight } from "lucide-react"
import type { MisplacedItem } from "./MisplacedItemsPage"

interface MisplacedItemsTableProps {
  items: MisplacedItem[]
  search: string
  onSearchChange: (value: string) => void
  popularityFilter: "all" | "high" | "medium"
  onPopularityChange: (value: "all" | "high" | "medium") => void
  zoneFilter: string
  onZoneChange: (value: string) => void
  zones: string[]
}

export function MisplacedItemsTable({
  items,
  search,
  onSearchChange,
  popularityFilter,
  onPopularityChange,
  zoneFilter,
  onZoneChange,
  zones,
}: MisplacedItemsTableProps) {
  const getPopularityBadge = (popularity: number) => {
    if (popularity >= 5) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
          High
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
        Medium
      </span>
    )
  }

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "A":
        return "bg-green-500/10 text-green-500 border border-green-500/20"
      case "B":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20"
      case "C":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
      case "D":
        return "bg-red-500/10 text-red-500 border border-red-500/20"
      default:
        return "bg-muted text-muted-foreground border"
    }
  }

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={popularityFilter} onValueChange={(value) => onPopularityChange(value as "all" | "high" | "medium")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Popularities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Popularities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={zoneFilter} onValueChange={onZoneChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Zones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones.map((zone) => (
              <SelectItem key={zone} value={zone}>
                Zone {zone}
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
            <TableHead>SKU</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Popularity</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Movements/Mo</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Suggested Move</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{getPopularityBadge(item.popularity)}</TableCell>
              <TableCell>{item.currentLocation}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded ${getZoneColor(item.zone)}`}>
                  Zone {item.zone}
                </span>
              </TableCell>
              <TableCell className="text-right">{item.movementsPerMonth}</TableCell>
              <TableCell className="text-right font-medium">{item.inefficiencyScore}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">{item.currentLocation}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-green-600">{item.suggestedLocation}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                {item.reason}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

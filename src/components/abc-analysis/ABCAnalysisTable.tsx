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
import { AlertTriangle } from "lucide-react"
import type { ABCItem } from "./ABCAnalysisPage"

interface ABCAnalysisTableProps {
  items: ABCItem[]
  search: string
  onSearchChange: (value: string) => void
  classFilter: "all" | "A" | "B" | "C"
  onClassChange: (value: "all" | "A" | "B" | "C") => void
  zoneFilter: string
  onZoneChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  zones: string[]
  categories: string[]
}

export function ABCAnalysisTable({
  items,
  search,
  onSearchChange,
  classFilter,
  onClassChange,
  zoneFilter,
  onZoneChange,
  categoryFilter,
  onCategoryChange,
  zones,
  categories,
}: ABCAnalysisTableProps) {
  const getClassBadge = (abcClass: string) => {
    if (abcClass === "A") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
          Class A
        </span>
      )
    }
    if (abcClass === "B") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500">
          Class B
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500">
        Class C
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

  const getWrongZoneWarning = (item: ABCItem) => {
    if (item.abcClass === "A" && (item.currentZone === "C" || item.currentZone === "D")) {
      return (
        <div className="flex items-center gap-1 text-orange-600" title="Should be in Zone A or B">
          <AlertTriangle className="h-3 w-3" />
          <span className="text-xs">Wrong zone</span>
        </div>
      )
    }
    if (item.abcClass === "B" && item.currentZone === "D") {
      return (
        <div className="flex items-center gap-1 text-yellow-600" title="Should be in Zone A, B, or C">
          <AlertTriangle className="h-3 w-3" />
          <span className="text-xs">Far zone</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={classFilter} onValueChange={(value) => onClassChange(value as "all" | "A" | "B" | "C")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="A">Class A</SelectItem>
            <SelectItem value="B">Class B</SelectItem>
            <SelectItem value="C">Class C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={zoneFilter} onValueChange={onZoneChange}>
          <SelectTrigger className="w-[140px]">
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
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
              <TableHead>ABC Class</TableHead>
              <TableHead>Stock Value</TableHead>
              <TableHead>Movements/Mo</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Current Zone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{getClassBadge(item.abcClass)}</TableCell>
                <TableCell className="text-right">${item.stockValue.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.movementsPerMonth}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded ${getZoneColor(item.currentZone)}`}>
                    Zone {item.currentZone}
                  </span>
                </TableCell>
                <TableCell>{getWrongZoneWarning(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

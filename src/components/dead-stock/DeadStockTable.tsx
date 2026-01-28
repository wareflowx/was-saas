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
import type { DeadStockItem } from "./DeadStockPage"

interface DeadStockTableProps {
  items: DeadStockItem[]
  search: string
  onSearchChange: (value: string) => void
  severityFilter: "all" | "high" | "medium" | "low"
  onSeverityChange: (value: "all" | "high" | "medium" | "low") => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function DeadStockTable({
  items,
  search,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: DeadStockTableProps) {
  const getSeverityBadge = (severity: DeadStockItem["severity"]) => {
    switch (severity) {
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500">
            High
          </span>
        )
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            Medium
          </span>
        )
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500">
            Low
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
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={severityFilter} onValueChange={(value) => onSeverityChange(value as "all" | "high" | "medium" | "low")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
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
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Days Idle</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead>Severity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-muted-foreground">{item.location}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{item.daysWithoutMovement}</TableCell>
              <TableCell className="text-right">${item.totalValue.toFixed(2)}</TableCell>
              <TableCell>{getSeverityBadge(item.severity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

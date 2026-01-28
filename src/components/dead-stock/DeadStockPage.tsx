import { useState, useMemo } from "react"
import { Sparkles, Info, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DeadStockKPICards } from "./DeadStockKPICards"
import { DeadStockByCategoryChart } from "./DeadStockByCategoryChart"
import { DeadStockBySeverityChart } from "./DeadStockBySeverityChart"
import { DeadStockTable } from "./DeadStockTable"

interface DeadStockItem {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  location: string
  lastMoved: string
  daysWithoutMovement: number
  valuePerUnit: number
  totalValue: number
  severity: "high" | "medium" | "low"
}

interface DeadStockData {
  items: DeadStockItem[]
  kpis: {
    totalDeadStock: number
    totalDeadStockValue: number
    highSeverityCount: number
    mediumSeverityCount: number
  }
  valueByCategory: Array<{
    category: string
    value: number
    fill: string
  }>
  bySeverity: Array<{
    severity: string
    count: number
    fill: string
  }>
}

interface DeadStockPageProps {
  data: DeadStockData
}

export function DeadStockPage({ data }: DeadStockPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter dead stock
  const filteredItems = useMemo(() => {
    return data.items.filter((item) => {
      if (severityFilter !== "all" && item.severity !== severityFilter) return false
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.sku.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [data.items, search, severityFilter, categoryFilter])

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(data.items.map((item) => item.category)))
  }, [data.items])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Identify dead stock</span> and take action to recover value tied up in inactive inventory.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPIs */}
      <DeadStockKPICards
        totalDeadStock={data.kpis.totalDeadStock}
        totalDeadStockValue={data.kpis.totalDeadStockValue}
        highSeverityCount={data.kpis.highSeverityCount}
        mediumSeverityCount={data.kpis.mediumSeverityCount}
      />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <DeadStockByCategoryChart data={data.valueByCategory} />
        <DeadStockBySeverityChart data={data.bySeverity} />
      </div>

      {/* Dead Stock Table */}
      <DeadStockTable
          items={filteredItems}
          search={search}
          onSearchChange={setSearch}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={categories}
        />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dead Stock Analysis</DialogTitle>
            <DialogDescription>
              Identify products that haven't moved in a while and take action
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">KPIs</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Dead Stock Items</p>
                      <p className="text-muted-foreground">Products inactive 60+ days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Value Locked</p>
                      <p className="text-muted-foreground">Capital tied in dead stock</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Charts</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">By Category</p>
                      <p className="text-muted-foreground">Value distribution by category</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">By Severity</p>
                      <p className="text-muted-foreground">Priority level breakdown</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Dead Stock Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Review all inactive products with detailed metrics and severity levels.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Severity and category</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by name or SKU</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Actions</p>
                      <p className="text-muted-foreground">Apply discount or write-off</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export type { DeadStockItem, DeadStockData }

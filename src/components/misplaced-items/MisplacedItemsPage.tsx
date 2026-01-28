import { useState, useMemo } from "react"
import { Sparkles, Info, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MisplacedItemsKPICards } from "./MisplacedItemsKPICards"
import { MisplacedItemsByZoneChart } from "./MisplacedItemsByZoneChart"
import { InefficiencyByPopularityChart } from "./InefficiencyByPopularityChart"
import { MisplacedItemsTable } from "./MisplacedItemsTable"

interface MisplacedItem {
  id: string
  sku: string
  name: string
  category: string
  popularity: number
  currentLocation: string
  zone: string
  movementsPerMonth: number
  inefficiencyScore: number
  suggestedLocation: string
  suggestedZone: string
  reason: string
}

interface MisplacedItemsData {
  items: MisplacedItem[]
  kpis: {
    totalMisplacedItems: number
    highPriorityCount: number
    mediumPriorityCount: number
    avgInefficiencyScore: number
  }
  byZone: Array<{
    zone: string
    count: number
    fill: string
  }>
  inefficiencyByPopularity: Array<{
    popularity: string
    score: number
    fill: string
  }>
}

interface MisplacedItemsPageProps {
  data: MisplacedItemsData
}

export function MisplacedItemsPage({ data }: MisplacedItemsPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [popularityFilter, setPopularityFilter] = useState<"all" | "high" | "medium">("all")
  const [zoneFilter, setZoneFilter] = useState("all")

  // Filter misplaced items
  const filteredItems = useMemo(() => {
    return data.items.filter((item) => {
      if (popularityFilter === "high" && item.popularity < 5) return false
      if (popularityFilter === "medium" && (item.popularity < 4 || item.popularity >= 5)) return false
      if (zoneFilter !== "all" && item.zone !== zoneFilter) return false
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.sku.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [data.items, search, popularityFilter, zoneFilter])

  // Get unique zones
  const zones = useMemo(() => {
    return Array.from(new Set(data.items.map((item) => item.zone)))
  }, [data.items])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Optimize warehouse layout</span> by relocating high-demand items to more accessible positions.
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
      <MisplacedItemsKPICards
        totalMisplacedItems={data.kpis.totalMisplacedItems}
        highPriorityCount={data.kpis.highPriorityCount}
        mediumPriorityCount={data.kpis.mediumPriorityCount}
        avgInefficiencyScore={data.kpis.avgInefficiencyScore}
      />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <MisplacedItemsByZoneChart data={data.byZone} />
        <InefficiencyByPopularityChart data={data.inefficiencyByPopularity} />
      </div>

      {/* Misplaced Items Table */}
      <MisplacedItemsTable
          items={filteredItems}
          search={search}
          onSearchChange={setSearch}
          popularityFilter={popularityFilter}
          onPopularityChange={setPopularityFilter}
          zoneFilter={zoneFilter}
          onZoneChange={setZoneFilter}
          zones={zones}
        />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Misplaced Items Analysis</DialogTitle>
            <DialogDescription>
              Identify high-demand items in poor locations and optimize positioning
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
                      <p className="font-medium text-foreground">Misplaced Items</p>
                      <p className="text-muted-foreground">High-demand in poor zones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">High Priority</p>
                      <p className="text-muted-foreground">Requires immediate action</p>
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
                      <p className="font-medium text-foreground">By Zone</p>
                      <p className="text-muted-foreground">Current zone distribution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Inefficiency Score</p>
                      <p className="text-muted-foreground">Impact by popularity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Items Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Review all misplaced items with efficiency scores and relocation suggestions.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Popularity and zone</p>
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
                      <p className="font-medium text-foreground">Relocate</p>
                      <p className="text-muted-foreground">Execute move orders</p>
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

export type { MisplacedItem, MisplacedItemsData }

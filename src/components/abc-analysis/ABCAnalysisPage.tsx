import { useState, useMemo } from "react"
import { Sparkles, Info, BarChart3 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ABCKPICards } from "./ABCKPICards"
import { ParetoChart } from "./ParetoChart"
import { ValueByABCChart } from "./ValueByABCChart"
import { ABCAnalysisTable } from "./ABCAnalysisTable"

interface ABCItem {
  id: string
  sku: string
  name: string
  category: string
  abcClass: "A" | "B" | "C"
  stockValue: number
  movementsPerMonth: number
  quantity: number
  currentZone: string
  suggestedZone?: string
}

interface ABCAnalysisData {
  items: ABCItem[]
  kpis: {
    classACount: number
    classBCount: number
    classCCount: number
    aInWrongZoneCount: number
  }
  paretoData: Array<{
    product: string
    cumulativePercent: number
    value: number
  }>
  valueByABC: Array<{
    abc: string
    value: number
    fill: string
  }>
}

interface ABCAnalysisPageProps {
  data: ABCAnalysisData
}

export function ABCAnalysisPage({ data }: ABCAnalysisPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState<"all" | "A" | "B" | "C">("all")
  const [zoneFilter, setZoneFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter items
  const filteredItems = useMemo(() => {
    return data.items.filter((item) => {
      if (classFilter !== "all" && item.abcClass !== classFilter) return false
      if (zoneFilter !== "all" && item.currentZone !== zoneFilter) return false
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.sku.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [data.items, search, classFilter, zoneFilter, categoryFilter])

  // Get unique zones and categories
  const zones = useMemo(() => {
    return Array.from(new Set(data.items.map((item) => item.currentZone)))
  }, [data.items])

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
            <span className="font-medium">ABC Analysis</span> - Classify products by value and velocity to optimize warehouse layout.
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
      <ABCKPICards
        classACount={data.kpis.classACount}
        classBCount={data.kpis.classBCount}
        classCCount={data.kpis.classCCount}
        aInWrongZoneCount={data.kpis.aInWrongZoneCount}
      />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <ParetoChart data={data.paretoData} />
        <ValueByABCChart data={data.valueByABC} />
      </div>

      {/* ABC Analysis Table */}
      <ABCAnalysisTable
        items={filteredItems}
        search={search}
        onSearchChange={setSearch}
        classFilter={classFilter}
        onClassChange={setClassFilter}
        zoneFilter={zoneFilter}
        onZoneChange={setZoneFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        zones={zones}
        categories={categories}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>ABC Analysis</DialogTitle>
            <DialogDescription>
              Optimize your warehouse with Pareto principle (80/20 rule)
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
                      <p className="font-medium text-foreground">Class Distribution</p>
                      <p className="text-muted-foreground">Count of A/B/C products</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Wrong Placement</p>
                      <p className="text-muted-foreground">A products in bad zones</p>
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
                      <p className="font-medium text-foreground">Pareto Chart</p>
                      <p className="text-muted-foreground">Visualize 80/20 rule</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Value by ABC</p>
                      <p className="text-muted-foreground">Value distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">ABC Classification</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Class A: Top 20% products = 80% value. Should be in prime locations (Zones A/B).
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Class A</p>
                      <p className="text-muted-foreground">High priority, track daily</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Classes B/C</p>
                      <p className="text-muted-foreground">Standard/minimal tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Actions</p>
                      <p className="text-muted-foreground">Optimize placement</p>
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

export type { ABCItem, ABCAnalysisData }

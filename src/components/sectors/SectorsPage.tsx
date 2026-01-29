import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SectorsKPICards } from "./SectorsKPICards"
import { SectorsTable } from "./SectorsTable"
import { SectorCapacityChart } from "./SectorCapacityChart"
import { SectorTypesDistributionChart } from "./SectorTypesDistributionChart"
import type { SectorsData, Sector } from "@/types/entities"

interface SectorsPageProps {
  data: SectorsData
}

export function SectorsPage({ data }: SectorsPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Calculate capacity utilization by sector
  const capacityBySector = useMemo(() => {
    const sectorsWithOccupancy = data.sectors.map((sector) => ({
      sector: sector.name.length > 20 ? sector.name.substring(0, 20) + "..." : sector.name,
      occupancy: sector.capacity > 0 ? (sector.usedCapacity / sector.capacity) * 100 : 0,
    }))

    // Sort by occupancy and take top 3 highest and bottom 2 lowest
    sectorsWithOccupancy.sort((a, b) => b.occupancy - a.occupancy)
    return [
      ...sectorsWithOccupancy.slice(0, 3),
      ...sectorsWithOccupancy.slice(-2).reverse(),
    ]
  }, [data.sectors])

  // Calculate sector types distribution
  const sectorTypesDistribution = useMemo(() => {
    const colors = [
      "hsl(221, 83%, 53%)",
      "hsl(280, 65%, 60%)",
      "hsl(160, 60%, 45%)",
      "hsl(30, 80%, 55%)",
      "hsl(340, 75%, 55%)",
    ]

    const typeLabels: Record<string, string> = {
      rack: "Rack",
      shelf: "Shelf",
      floor: "Floor",
      bin: "Bin",
      mezzanine: "Mezzanine",
    }

    return Object.entries(data.kpis.sectorTypes)
      .map(([type, count], index) => ({
        type: typeLabels[type] || type,
        count,
        fill: colors[index % colors.length],
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [data.kpis.sectorTypes])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Manage warehouse sectors</span> and monitor storage capacity, occupancy rates, and operational status.
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
      <SectorsKPICards kpis={data.kpis} />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <SectorCapacityChart data={capacityBySector} />
        <SectorTypesDistributionChart data={sectorTypesDistribution} />
      </div>

      {/* Sectors Table */}
      <SectorsTable
        sectors={data.sectors}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sectors Management</DialogTitle>
            <DialogDescription>
              Monitor and manage all warehouse sectors with detailed metrics
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
                      <p className="font-medium text-foreground">Total Sectors</p>
                      <p className="text-muted-foreground">Number of warehouse sectors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Occupancy Rate</p>
                      <p className="text-muted-foreground">Capacity utilization</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Sector Types</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Rack Systems</p>
                      <p className="text-muted-foreground">Pallet racking storage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Shelving & Floor</p>
                      <p className="text-muted-foreground">Various storage types</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Sectors Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    View and manage all sectors with detailed capacity and occupancy information.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Status and type</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by name or code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Actions</p>
                      <p className="text-muted-foreground">View sector details</p>
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

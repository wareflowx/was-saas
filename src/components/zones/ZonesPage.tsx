import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ZonesKPICards } from "./ZonesKPICards"
import { ZonesTable } from "./ZonesTable"
import { ZoneCapacityChart } from "./ZoneCapacityChart"
import { ZoneTypesDistributionChart } from "./ZoneTypesDistributionChart"
import type { ZonesData } from "@/types/entities"

interface ZonesPageProps {
  data: ZonesData
}

export function ZonesPage({ data }: ZonesPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")

  // Calculate capacity utilization by zone
  const capacityByZone = useMemo(() => {
    const zonesWithOccupancy = data.zones.map((zone) => ({
      zone: zone.name.length > 20 ? zone.name.substring(0, 20) + "..." : zone.name,
      occupancy: zone.capacity > 0 ? (zone.usedCapacity / zone.capacity) * 100 : 0,
    }))

    // Sort by occupancy and take top 3 highest and bottom 2 lowest
    zonesWithOccupancy.sort((a, b) => b.occupancy - a.occupancy)
    return [
      ...zonesWithOccupancy.slice(0, 3),
      ...zonesWithOccupancy.slice(-2).reverse(),
    ]
  }, [data.zones])

  // Calculate zone types distribution
  const zoneTypesDistribution = useMemo(() => {
    const colors = [
      "hsl(221, 83%, 53%)",
      "hsl(280, 65%, 60%)",
      "hsl(160, 60%, 45%)",
      "hsl(30, 80%, 55%)",
      "hsl(340, 75%, 55%)",
      "hsl(142, 76%, 36%)",
      "hsl(0, 84%, 60%)",
    ]

    const typeLabels: Record<string, string> = {
      storage: "Storage",
      receiving: "Receiving",
      shipping: "Shipping",
      picking: "Picking",
      packing: "Packing",
      cold_storage: "Cold Storage",
      hazardous: "Hazardous",
    }

    return Object.entries(data.kpis.zoneTypes)
      .map(([type, count], index) => ({
        type: typeLabels[type] || type,
        count,
        fill: colors[index % colors.length],
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [data.kpis.zoneTypes])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Manage zones</span> and monitor storage areas, capacity, and occupancy across all warehouses.
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
      <ZonesKPICards kpis={data.kpis} />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <ZoneCapacityChart data={capacityByZone} />
        <ZoneTypesDistributionChart data={zoneTypesDistribution} />
      </div>

      {/* Zones Table */}
      <ZonesTable
        zones={data.zones}
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
            <DialogTitle>Zone Management</DialogTitle>
            <DialogDescription>
              Monitor and manage all zones in your warehouses
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
                      <p className="font-medium text-foreground">Total Zones</p>
                      <p className="text-muted-foreground">All warehouse zones</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Active Zones</p>
                      <p className="text-muted-foreground">Currently operational</p>
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
                  <h4 className="font-semibold text-sm">Zone Types</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Storage</p>
                      <p className="text-muted-foreground">General storage areas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Operations</p>
                      <p className="text-muted-foreground">Receiving, shipping, picking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Special</p>
                      <p className="text-muted-foreground">Cold storage, hazardous</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Zones Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    View detailed information about all zones including type, capacity, and picker assignments.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Filter by status and type</p>
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
                      <p className="font-medium text-foreground">Pickers</p>
                      <p className="text-muted-foreground">Assigned picker count</p>
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

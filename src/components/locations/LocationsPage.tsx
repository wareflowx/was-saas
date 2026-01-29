import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LocationsKPICards } from "./LocationsKPICards"
import { LocationsTable } from "./LocationsTable"
import { CapacityUtilizationChart } from "./CapacityUtilizationChart"
import { OccupancyByTypeChart } from "./OccupancyByTypeChart"
import type { LocationsData } from "@/types/entities"

interface LocationsPageProps {
  data: LocationsData
}

export function LocationsPage({ data }: LocationsPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Calculate capacity utilization by zone
  const capacityByZone = useMemo(() => {
    const zoneMap = new Map<string, { total: number; used: number }>()

    data.locations.forEach((location) => {
      const existing = zoneMap.get(location.zoneName) || { total: 0, used: 0 }
      zoneMap.set(location.zoneName, {
        total: existing.total + location.capacity,
        used: existing.used + location.usedCapacity,
      })
    })

    const zonesWithOccupancy = Array.from(zoneMap.entries()).map(([zone, stats]) => ({
      zone: zone.length > 20 ? zone.substring(0, 20) + "..." : zone,
      occupancy: stats.total > 0 ? (stats.used / stats.total) * 100 : 0,
    }))

    // Sort by occupancy and take top 3 highest and bottom 2 lowest
    zonesWithOccupancy.sort((a, b) => b.occupancy - a.occupancy)
    return [
      ...zonesWithOccupancy.slice(0, 3),
      ...zonesWithOccupancy.slice(-2).reverse(),
    ]
  }, [data.locations])

  // Calculate occupancy by type
  const occupancyByType = useMemo(() => {
    const typeMap = new Map<string, number>()

    data.locations.forEach((location) => {
      typeMap.set(location.type, (typeMap.get(location.type) || 0) + 1)
    })

    const colors = [
      "hsl(221, 83%, 53%)",
      "hsl(280, 65%, 60%)",
      "hsl(160, 60%, 45%)",
      "hsl(30, 80%, 55%)",
      "hsl(340, 75%, 55%)",
    ]

    return Array.from(typeMap.entries())
      .map(([type, count], index) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        fill: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count)
  }, [data.locations])

  // Note: Filtering and pagination are now handled in LocationsTable
  const allLocations = data.locations

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Manage locations</span> and monitor storage capacity across your warehouse.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <LocationsKPICards kpis={data.kpis} />

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <CapacityUtilizationChart data={capacityByZone} />
        <OccupancyByTypeChart data={occupancyByType} />
      </div>

      {/* Locations Table */}
      <LocationsTable
        locations={allLocations}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Locations Management</DialogTitle>
            <DialogDescription>
              Monitor and manage all warehouse storage locations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">KPIs</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Total Locations</p>
                    <p className="text-muted-foreground">All storage locations in warehouse</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Occupancy Rate</p>
                    <p className="text-muted-foreground">Percentage of used capacity</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Available Locations</p>
                    <p className="text-muted-foreground">Ready for new stock</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Locations Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    View all locations with real-time status, capacity, and product information.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by location code</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filter by Status</p>
                      <p className="text-muted-foreground">Available, occupied, full</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">View Details</p>
                      <p className="text-muted-foreground">Products and capacity</p>
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

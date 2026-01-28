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
import { OccupancyByZoneChart } from "./OccupancyByZoneChart"
import { OccupancyTrendsChart } from "./OccupancyTrendsChart"
import { LocationsTable, type Location } from "./LocationsTable"
import { LocationDetailSheet } from "./LocationDetailSheet"
import type { LocationType, LocationStatus } from "./LocationsTable"

type Zone = "all" | "A" | "B" | "C" | "D"
type FilterType = "all" | "rack" | "shelf" | "floor" | "bin"
type FilterStatus = "all" | "available" | "medium" | "full"

interface LocationsData {
  kpis: {
    totalLocations: number
    occupancyRate: number
    availableLocations: number
    fullLocations: number
    activeZones: number
  }
  occupancyByZone: Array<{
    zone: string
    occupancy: number
    fill: string
  }>
  locationTypeDistribution: Array<{
    type: string
    count: number
    fill: string
  }>
  occupancyTrends: Array<{
    date: string
    occupancy: number
  }>
  locations: Location[]
}

interface LocationsPageProps {
  data: LocationsData
}

export function LocationsPage({ data }: LocationsPageProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Filter states for table
  const [tableSearch, setTableSearch] = useState("")
  const [sortZone, setSortZone] = useState("all")
  const [sortWarehouse, setSortWarehouse] = useState("all")
  const [sortType, setSortType] = useState("all")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  // Filter locations
  const filteredLocations = useMemo(() => {
    return data.locations.filter((location) => {
      if (sortZone !== "all" && location.zone !== sortZone) return false
      if (sortWarehouse !== "all" && location.warehouse !== sortWarehouse) return false
      if (sortType !== "all" && location.type !== sortType) return false
      if (tableSearch && !location.code.toLowerCase().includes(tableSearch.toLowerCase())) return false
      return true
    })
  }, [data.locations, sortZone, sortWarehouse, sortType, tableSearch])

  // Demo data for modal
  const demoProducts = selectedLocation
    ? [
        {
          id: "1",
          name: "Widget XL",
          sku: "WID-XL-001",
          quantity: 50,
          dateAdded: "2024-01-15",
        },
        {
          id: "2",
          name: "Gadget Pro",
          sku: "GAD-PRO-002",
          quantity: 30,
          dateAdded: "2024-01-18",
        },
      ]
    : []

  const demoMovements = selectedLocation
    ? [
        {
          id: "MOV-001",
          date: "2024-01-28",
          product: "Widget XL",
          type: "in" as const,
          quantity: 20,
        },
        {
          id: "MOV-002",
          date: "2024-01-27",
          product: "Gadget Pro",
          type: "out" as const,
          quantity: 10,
        },
      ]
    : []

  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Monitor warehouse occupancy</span> and track location utilization across all zones in real-time.
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
      <LocationsKPICards
        totalLocations={data.kpis.totalLocations}
        occupancyRate={data.kpis.occupancyRate}
        availableLocations={data.kpis.availableLocations}
        fullLocations={data.kpis.fullLocations}
      />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <OccupancyByZoneChart data={data.occupancyByZone} />
        <OccupancyTrendsChart data={data.occupancyTrends} />
      </div>

      {/* Locations Table */}
      <LocationsTable
        locations={filteredLocations}
        search={tableSearch}
        onSearchChange={setTableSearch}
        sortZone={sortZone}
        onSortZoneChange={setSortZone}
        sortWarehouse={sortWarehouse}
        onSortWarehouseChange={setSortWarehouse}
        sortType={sortType}
        onSortTypeChange={setSortType}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onViewDetails={handleViewDetails}
      />

      {/* Detail Sheet */}
      <LocationDetailSheet
        location={selectedLocation}
        products={demoProducts}
        movements={demoMovements}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedLocation(null)
        }}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Locations Overview</DialogTitle>
            <DialogDescription>
              Comprehensive view of warehouse locations and their occupancy status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Key Metrics Section */}
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
                      <p className="text-muted-foreground">Complete count of all storage locations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Occupancy Rate</p>
                      <p className="text-muted-foreground">Percentage of total warehouse capacity used</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Available & Full</p>
                      <p className="text-muted-foreground">Track location availability and capacity</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Charts</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Occupancy by Zone</p>
                      <p className="text-muted-foreground">Visual breakdown per warehouse zone</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Occupancy Trends</p>
                      <p className="text-muted-foreground">Historical capacity tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Location Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Browse and search all warehouse locations with powerful filtering options by zone, warehouse, and type.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Click Location Code</p>
                      <p className="text-muted-foreground">View details, products, and movements</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find locations by code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Zone, warehouse, and type</p>
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

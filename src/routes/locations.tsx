import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { LocationsPage } from "@/components/locations/LocationsPage"
import { useLocations, useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/locations")({
  component: LocationsRoute,
})

function LocationsRoute() {
  const navigate = useNavigate()

  // Fetch warehouses to get default warehouse ID
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses()

  // Fetch locations data from backend
  const defaultWarehouseId = warehouses?.[0]?.id
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error,
  } = useLocations(defaultWarehouseId)

  // Redirect to onboarding if no warehouses exist
  if (!isLoadingWarehouses && warehouses?.length === 0) {
    navigate({ to: "/onboarding/welcome" })
  }

  // Loading state
  if (isLoadingWarehouses || isLoadingLocations) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading locations...</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // Error state
  if (error) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-destructive">Error loading locations: {error.message}</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  if (!locationsData || !warehouses?.length) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No locations found. Please complete the setup first.
              </div>
              <button
                onClick={() => navigate({ to: "/onboarding/welcome" })}
                className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Go to Setup
              </button>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[back-filter]:bg-background/60 px-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <div className="p-8">
            <LocationsPage data={locationsData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ZonesPage } from "@/components/zones/ZonesPage"
import { useZones, useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/zones")({
  component: ZonesRoute,
})

function ZonesRoute() {
  const navigate = useNavigate()

  // Fetch warehouses to get default warehouse ID
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses()

  // Fetch zones data from backend
  const defaultWarehouseId = warehouses?.[0]?.id
  const {
    data: zonesData,
    isLoading: isLoadingZones,
    error,
  } = useZones(defaultWarehouseId)

  // Redirect to onboarding if no warehouses exist
  // Commented out: zones can exist independently
  // useEffect(() => {
  //   if (!isLoadingWarehouses && warehouses?.length === 0) {
  //     navigate({ to: "/onboarding/welcome" })
  //   }
  // }, [isLoadingWarehouses, warehouses, navigate])

  // Loading state
  if (isLoadingWarehouses || isLoadingZones) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading zones...</div>
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
            <div className="text-destructive">Error loading zones: {error.message}</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  if (!zonesData || !warehouses?.length) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No zones found. Please complete the setup first.
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
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <div className="p-8">
            <ZonesPage data={zonesData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { WarehousesPage } from "@/components/warehouses/WarehousesPage"
import { useWarehousesWithKPIs } from "@/hooks/use-locations"

export const Route = createFileRoute("/warehouses")({
  component: WarehousesRoute,
})

function WarehousesRoute() {
  const navigate = useNavigate()

  // Fetch warehouses data from backend with KPIs
  const {
    data: warehousesData,
    isLoading,
    error,
  } = useWarehousesWithKPIs()

  // Loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading warehouses...</div>
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
            <div className="text-destructive">Error loading warehouses: {error.message}</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  if (!warehousesData || !warehousesData.warehouses.length) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No warehouses found. Please complete the setup first.
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
            <WarehousesPage data={warehousesData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { RestockingsPage } from "@/components/restockings/RestockingsPage"
import { useRestockings } from "@/hooks/use-locations"
import { useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/restockings")({
  component: RestockingsRoute,
})

function RestockingsRoute() {
  const { data: warehouses } = useWarehouses()
  const warehouseId = warehouses?.[0]?.id

  const { data: restockingsData, isLoading, error } = useRestockings(warehouseId)

  // Loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
              <SidebarTrigger />
              <div className="flex-1" />
            </header>
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading restockings...</div>
            </div>
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
          <main className="flex-1">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
              <SidebarTrigger />
              <div className="flex-1" />
            </header>
            <div className="flex items-center justify-center p-8">
              <div className="text-destructive">Error loading restockings: {error.message}</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  const data = restockingsData || {
    kpis: {
      totalRestockings: 0,
      pendingRestockings: 0,
      inProgressRestockings: 0,
      completedRestockings: 0,
      totalProducts: 0,
      restockedProducts: 0,
      pendingProducts: 0,
    },
    restockings: [],
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
            <RestockingsPage data={data} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

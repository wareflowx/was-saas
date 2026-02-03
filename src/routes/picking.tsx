import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { PickingPage } from "@/components/picking/PickingPage"
import { usePickings } from "@/hooks/use-locations"
import { useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/picking")({
  component: PickingRoute,
})

function PickingRoute() {
  const { data: warehouses } = useWarehouses()
  const warehouseId = warehouses?.[0]?.id

  const { data: pickingsData, isLoading, error } = usePickings(warehouseId)

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
              <div className="text-muted-foreground">Loading pickings...</div>
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
              <div className="text-destructive">Error loading pickings: {error.message}</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  const data = pickingsData || {
    kpis: {
      totalPickings: 0,
      pendingPickings: 0,
      inProgressPickings: 0,
      completedPickings: 0,
      totalLines: 0,
      pickedLines: 0,
      completionRate: 0,
    },
    pickings: [],
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
            <PickingPage data={data} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

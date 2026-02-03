import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ReceptionsPage } from "@/components/receptions/ReceptionsPage"
import { useReceptions } from "@/hooks/use-locations"
import { useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/receptions")({
  component: ReceptionsRoute,
})

function ReceptionsRoute() {
  const { data: warehouses } = useWarehouses()
  const warehouseId = warehouses?.[0]?.id

  const { data: receptionsData, isLoading, error } = useReceptions(warehouseId)

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
              <div className="text-muted-foreground">Loading receptions...</div>
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
              <div className="text-destructive">Error loading receptions: {error.message}</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  const data = receptionsData || {
    kpis: {
      totalReceptions: 0,
      pendingReceptions: 0,
      inProgressReceptions: 0,
      completedReceptions: 0,
      totalQuantity: 0,
      receivedQuantity: 0,
      pendingQuantity: 0,
    },
    receptions: [],
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
            <ReceptionsPage data={data} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

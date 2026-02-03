import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ReturnsPage } from "@/components/returns/ReturnsPage"
import { useReturns } from "@/hooks/use-locations"
import { useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/returns")({
  component: ReturnsRoute,
})

function ReturnsRoute() {
  const { data: warehouses } = useWarehouses()
  const warehouseId = warehouses?.[0]?.id

  const { data: returnsData, isLoading, error } = useReturns(warehouseId)

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
              <div className="text-muted-foreground">Loading returns...</div>
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
              <div className="text-destructive">Error loading returns: {error.message}</div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  const data = returnsData || {
    kpis: {
      totalReturns: 0,
      pendingReturns: 0,
      inProgressReturns: 0,
      completedReturns: 0,
      totalQuantity: 0,
      returnedQuantity: 0,
      pendingQuantity: 0,
      totalValue: 0,
      refundedValue: 0,
    },
    returns: [],
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
            <ReturnsPage data={data} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { DashboardHome } from "@/components/dashboard"
import { useDashboardKPIs } from "@/hooks/use-locations"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  // Fetch dashboard data from backend
  const { data: dashboardData, isLoading, error } = useDashboardKPIs()

  // Loading state
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading dashboard...</div>
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
            <div className="text-destructive">Error loading dashboard: {error.message}</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state - provide empty data structure
  const data = dashboardData || {
    kpis: {
      totalProducts: 0,
      totalLocations: 0,
      lowStockItems: 0,
      activeOrders: 0,
      movementsThisWeek: 0,
    },
    stockEvolution: [],
    movementsByType: [],
    topProducts: [],
    lowStockAlerts: [],
    recentMovements: [],
  }

  // Add recentOrders as empty array (not implemented yet in backend)
  const dashboardDataWithOrders = {
    ...data,
    recentOrders: [],
  }

  // Debug log to verify dashboard data
  console.log('📊 [UI] Dashboard rendering with data:', {
    totalProducts: data?.kpis?.totalProducts || 0,
    totalLocations: data?.kpis?.totalLocations || 0,
    lowStockItems: data?.kpis?.lowStockItems || 0,
    activeOrders: data?.kpis?.activeOrders || 0,
    movementsThisWeek: data?.kpis?.movementsThisWeek || 0,
    stockEvolutionPoints: data?.stockEvolution?.length || 0,
    topProductsCount: data?.topProducts?.length || 0,
  })

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
            <DashboardHome data={dashboardDataWithOrders} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

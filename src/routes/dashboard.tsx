import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { DashboardHome } from "@/components/dashboard"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  // Demo data - replace with actual data from your backend
  const dashboardData = {
    kpis: {
      totalProducts: 1248,
      totalLocations: 156,
      lowStockItems: 23,
      activeOrders: 45,
      movementsThisWeek: 312,
    },
    stockEvolution: [
      { date: "Jan 22", stock: 11500 },
      { date: "Jan 23", stock: 11800 },
      { date: "Jan 24", stock: 11650 },
      { date: "Jan 25", stock: 12100 },
      { date: "Jan 26", stock: 12300 },
      { date: "Jan 27", stock: 12200 },
      { date: "Jan 28", stock: 12480 },
    ],
    movementsByType: [
      { movementType: "Inbound", movements: 145, fill: "hsl(var(--chart))" },
      { movementType: "Outbound", movements: 128, fill: "hsl(142, 76%, 36%)" },
      { movementType: "Transfer", movements: 39, fill: "hsl(25, 95%, 53%)" },
    ],
    topProducts: [
      { product: "Product A", movements: 48 },
      { product: "Product B", movements: 42 },
      { product: "Product C", movements: 35 },
      { product: "Product D", movements: 28 },
      { product: "Product E", movements: 21 },
    ],
    lowStockAlerts: [
      {
        id: "1",
        product: "Widget XL",
        currentStock: 5,
        minStock: 20,
        location: "Zone A-12",
        severity: "critical" as const,
      },
      {
        id: "2",
        product: "Gadget Pro",
        currentStock: 15,
        minStock: 25,
        location: "Zone B-05",
        severity: "warning" as const,
      },
      {
        id: "3",
        product: "Component Z",
        currentStock: 8,
        minStock: 15,
        location: "Zone C-08",
        severity: "critical" as const,
      },
    ],
    recentMovements: [
      {
        id: "MOV-001",
        date: "2024-01-28",
        product: "Widget XL",
        type: "in" as const,
        quantity: 50,
        to: "Zone A-12",
      },
      {
        id: "MOV-002",
        date: "2024-01-28",
        product: "Gadget Pro",
        type: "out" as const,
        quantity: 25,
        from: "Zone B-05",
      },
      {
        id: "MOV-003",
        date: "2024-01-27",
        product: "Component Z",
        type: "transfer" as const,
        quantity: 30,
        from: "Zone A-01",
        to: "Zone C-08",
      },
      {
        id: "MOV-004",
        date: "2024-01-27",
        product: "Product A",
        type: "in" as const,
        quantity: 100,
        to: "Zone A-01",
      },
    ],
    recentOrders: [
      {
        id: "ORD-001",
        date: "2024-01-28",
        customer: "Acme Corp",
        status: "processing" as const,
        items: 12,
      },
      {
        id: "ORD-002",
        date: "2024-01-28",
        customer: "Tech Solutions",
        status: "pending" as const,
        items: 8,
      },
      {
        id: "ORD-003",
        date: "2024-01-27",
        customer: "Global Industries",
        status: "completed" as const,
        items: 25,
      },
      {
        id: "ORD-004",
        date: "2024-01-26",
        customer: "StartUp Inc",
        status: "completed" as const,
        items: 5,
      },
    ],
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
            <DashboardHome data={dashboardData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

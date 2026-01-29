import { useState } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { KPICard } from "./KPICard"
import { StockEvolutionChart } from "./StockEvolutionChart"
import { MovementsByTypeChart } from "./MovementsByTypeChart"
import { TopProductsChart } from "./TopProductsChart"
import { LowStockAlerts } from "./LowStockAlerts"
import { RecentMovements } from "./RecentMovements"
import { RecentOrders } from "./RecentOrders"
import {
  Package,
  MapPin,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"

// Types
interface DashboardData {
  kpis: {
    totalProducts: number
    totalLocations: number
    lowStockItems: number
    activeOrders: number
    movementsThisWeek: number
  }
  stockEvolution: Array<{
    date: string
    stock: number
  }>
  movementsByType: Array<{
    movementType: string
    movements: number
    fill: string
  }>
  topProducts: Array<{
    product: string
    movements: number
  }>
  lowStockAlerts: Array<{
    id: string
    product: string
    currentStock: number
    minStock: number
    location: string
    severity: "critical" | "warning"
  }>
  recentMovements: Array<{
    id: string
    date: string
    product: string
    type: "in" | "out" | "transfer"
    quantity: number
    from?: string
    to?: string
  }>
  recentOrders: Array<{
    id: string
    date: string
    customer: string
    status: "pending" | "processing" | "completed" | "cancelled"
    items: number
  }>
}

interface DashboardHomeProps {
  data: DashboardData
}

export function DashboardHome({ data }: DashboardHomeProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Compact Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Warehouse Overview</span> - Monitor stock levels, movements, and operational metrics in real-time.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Products"
          value={data.kpis.totalProducts}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Total Locations"
          value={data.kpis.totalLocations}
          icon={MapPin}
        />
        <KPICard
          title="Low Stock Items"
          value={data.kpis.lowStockItems}
          icon={AlertTriangle}
          description="Needs attention"
        />
        <KPICard
          title="Active Orders"
          value={data.kpis.activeOrders}
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Movements This Week"
          value={data.kpis.movementsThisWeek}
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <StockEvolutionChart data={data.stockEvolution} />
        <div className="grid gap-4">
          <MovementsByTypeChart data={data.movementsByType} />
          <TopProductsChart data={data.topProducts} />
        </div>
      </div>

      {/* Alerts and Tables Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <LowStockAlerts alerts={data.lowStockAlerts} />
        <RecentMovements movements={data.recentMovements} />
      </div>

      {/* Orders Table */}
      <RecentOrders orders={data.recentOrders} />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Warehouse Dashboard</DialogTitle>
            <DialogDescription>
              Comprehensive overview of your warehouse operations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* KPIs Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Key Performance Indicators</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Total Products</p>
                    <p className="text-muted-foreground">All SKUs in inventory</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Low Stock Items</p>
                    <p className="text-muted-foreground">Below minimum threshold</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Active Orders</p>
                    <p className="text-muted-foreground">Currently processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Movements</p>
                    <p className="text-muted-foreground">Inbound/outbound transfers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Analytics Charts</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Stock Evolution</p>
                    <p className="text-muted-foreground">Historical stock levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Movements by Type</p>
                    <p className="text-muted-foreground">Inbound/outbound/transfer</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Top Products</p>
                    <p className="text-muted-foreground">Most moved items</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts & Tables Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Alerts & Activity</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Low Stock Alerts</p>
                    <p className="text-muted-foreground">Products needing restock</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Recent Movements</p>
                    <p className="text-muted-foreground">Latest inventory transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Recent Orders</p>
                    <p className="text-muted-foreground">Order status tracking</p>
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

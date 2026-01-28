import { useState } from "react"
import { KPICard } from "./KPICard"
import { StockEvolutionChart } from "./StockEvolutionChart"
import { MovementsByTypeChart } from "./MovementsByTypeChart"
import { TopProductsChart } from "./TopProductsChart"
import { LowStockAlerts } from "./LowStockAlerts"
import { RecentMovements } from "./RecentMovements"
import { RecentOrders } from "./RecentOrders"
import { PeriodSelector } from "./PeriodSelector"
import type { Period } from "./PeriodSelector"
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
  const [period, setPeriod] = useState<Period>("week")

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <PeriodSelector value={period} onChange={setPeriod} />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
    </div>
  )
}

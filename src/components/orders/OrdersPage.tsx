import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrdersKPICards } from "./OrdersKPICards"
import { OrdersTable } from "./OrdersTable"
import { OrderStatusChart } from "./OrderStatusChart"
import { OrdersByPriorityChart } from "./OrdersByPriorityChart"
import type { OrdersData } from "@/types/entities"

interface OrdersPageProps {
  data: OrdersData
}

export function OrdersPage({ data }: OrdersPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    const statusCounts: Record<string, number> = {
      pending: data.kpis.pendingOrders,
      confirmed: 0,
      picking: data.kpis.inProgressOrders,
      shipped: data.kpis.shippedOrders,
      delivered: data.kpis.deliveredOrders,
    }

    const colors = [
      "hsl(38, 92%, 50%)", // pending - orange
      "hsl(221, 83%, 53%)", // confirmed - blue
      "hsl(168, 76%, 45%)", // picking - purple
      "hsl(142, 76%, 36%)", // shipped - green
      "hsl(16, 100%, 50%)", // delivered - emerald
    ]

    const labels: Record<string, string> = {
      pending: "Pending",
      confirmed: "Confirmed",
      picking: "Picking",
      shipped: "Shipped",
      delivered: "Delivered",
    }

    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count], index) => ({
        status: labels[status] || status,
        count,
        fill: colors[index % colors.length],
      }))
  }, [data.kpis])

  // Calculate priority distribution
  const priorityDistribution = useMemo(() => {
    const priorityMap = new Map<string, number>()

    data.orders.forEach((order) => {
      priorityMap.set(order.priority, (priorityMap.get(order.priority) || 0) + 1)
    })

    const colors: Record<string, string> = {
      urgent: "hsl(0, 84%, 60%)",
      high: "hsl(38, 92%, 50%)",
      medium: "hsl(142, 76%, 36%)",
      low: "hsl(221, 83%, 53%)",
    }

    const labels: Record<string, string> = {
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
    }

    return Array.from(priorityMap.entries())
      .map(([priority, count]) => ({
        priority: labels[priority] || priority,
        count,
        fill: colors[priority] || "hsl(0, 0%, 50%)",
      }))
      .sort((a, b) => b.count - a.count)
  }, [data.orders])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Manage customer orders</span> and track fulfillment from order to delivery.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPIs */}
      <OrdersKPICards kpis={data.kpis} />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <OrderStatusChart data={statusDistribution} />
        <OrdersByPriorityChart data={priorityDistribution} />
      </div>

      {/* Orders Table */}
      <OrdersTable orders={data.orders} />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Management</DialogTitle>
            <DialogDescription>
              Track and manage all customer orders from placement to delivery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">KPIs</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Total Orders</p>
                      <p className="text-muted-foreground">All customer orders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">In Progress</p>
                      <p className="text-muted-foreground">Active orders</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Status Tracking</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Shipped</p>
                      <p className="text-muted-foreground">Orders in transit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Total Value</p>
                      <p className="text-muted-foreground">Revenue tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Orders Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Review all customer orders with detailed status tracking and priority management.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Status, priority, warehouse</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by number or customer</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Actions</p>
                      <p className="text-muted-foreground">View details and process</p>
                    </div>
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

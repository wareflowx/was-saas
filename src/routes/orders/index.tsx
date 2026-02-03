import { createFileRoute } from "@tanstack/react-router"
import { OrdersPage } from "@/components/orders/OrdersPage"
import { useOrdersWithLines } from "@/hooks/use-locations"
import { useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/orders/")({
  component: OrdersRoute,
})

function OrdersRoute() {
  const { data: warehouses } = useWarehouses()
  const warehouseId = warehouses?.[0]?.id

  const { data: ordersData, isLoading, error } = useOrdersWithLines(warehouseId)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Error loading orders: {error.message}</div>
      </div>
    )
  }

  // No data state
  const data = ordersData || {
    kpis: {
      totalOrders: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalValue: 0,
      averageOrderValue: 0,
    },
    orders: [],
  }

  return <OrdersPage data={data} />
}

import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ReturnsPage } from "@/components/returns/ReturnsPage"
import type { ReturnsData } from "@/types/entities"

export const Route = createFileRoute("/returns")({
  component: ReturnsRoute,
})

const demoData: ReturnsData = {
  kpis: {
    totalReturns: 28,
    pendingReturns: 6,
    inProgressReturns: 8,
    completedReturns: 14,
    totalQuantity: 85,
    returnedQuantity: 52,
    pendingQuantity: 33,
    totalValue: 12500,
    refundedValue: 7800,
  },
  returns: [
    {
      id: "ret-1",
      returnNumber: "RET-2025-001",
      orderId: "ord-1",
      orderNumber: "ORD-2025-001",
      customerId: "cust-1",
      customerName: "ABC Company",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      returnDate: "2025-01-28T10:00:00Z",
      status: "in_progress",
      priority: "high",
      reason: "product_defective",
      reasonLabel: "Defective product",
      lines: [
        { id: "retline-1", productId: "prod-1", productSku: "ELE-001", productName: "Laptop Pro 15", quantity: 2, unitPrice: 1200, totalPrice: 2400, condition: "damaged", resolution: "refund" },
      ],
      totalQuantity: 2,
      totalAmount: 2400,
      refundedAmount: 0,
      processor: "John Doe",
      createdAt: "2025-01-28T10:00:00Z",
      lastUpdated: "2025-01-28T14:00:00Z",
    },
    {
      id: "ret-2",
      returnNumber: "RET-2025-002",
      orderId: "ord-2",
      orderNumber: "ORD-2025-002",
      customerId: "cust-2",
      customerName: "XYZ Corporation",
      warehouseId: "wh-2",
      warehouseName: "Lyon Warehouse",
      returnDate: "2025-01-27T14:00:00Z",
      status: "pending",
      priority: "medium",
      reason: "wrong_item",
      reasonLabel: "Wrong item",
      lines: [
        { id: "retline-2", productId: "prod-5", productSku: "AUT-001", productName: "Oil Filter", quantity: 10, unitPrice: 15, totalPrice: 150, condition: "new", resolution: "exchange" },
      ],
      totalQuantity: 10,
      totalAmount: 150,
      refundedAmount: 0,
      createdAt: "2025-01-27T14:00:00Z",
      lastUpdated: "2025-01-27T14:00:00Z",
    },
    {
      id: "ret-3",
      returnNumber: "RET-2025-003",
      orderId: "ord-3",
      orderNumber: "ORD-2025-003",
      customerId: "cust-3",
      customerName: "Individual Customer",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      returnDate: "2025-01-26T09:00:00Z",
      status: "completed",
      priority: "low",
      reason: "no_longer_needed",
      reasonLabel: "No longer needed",
      lines: [
        { id: "retline-3", productId: "prod-4", productSku: "FOOD-001", productName: "1kg Coffee Beans", quantity: 3, unitPrice: 20, totalPrice: 60, condition: "new", resolution: "refund" },
      ],
      totalQuantity: 3,
      totalAmount: 60,
      refundedAmount: 60,
      processor: "Jane Smith",
      completedDate: "2025-01-26T15:30:00Z",
      createdAt: "2025-01-26T09:00:00Z",
      lastUpdated: "2025-01-26T15:30:00Z",
    },
  ],
}

function ReturnsRoute() {
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
            <ReturnsPage data={demoData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { PickingPage } from "@/components/picking/PickingPage"
import type { PickingsData } from "@/types/entities"

export const Route = createFileRoute("/picking")({
  component: PickingRoute,
})

const demoData: PickingsData = {
  kpis: {
    totalPickings: 125,
    pendingPickings: 18,
    inProgressPickings: 32,
    completedPickings: 75,
    totalLines: 480,
    pickedLines: 325,
    completionRate: 68,
  },
  pickings: [
    {
      id: "pick-1",
      pickingNumber: "PIC-2025-001",
      orderId: "ord-1",
      orderNumber: "ORD-2025-001",
      customerId: "cust-1",
      customerName: "ABC Company",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      assignedDate: "2025-01-28T10:00:00Z",
      startedDate: "2025-01-28T10:15:00Z",
      status: "in_progress",
      priority: "high",
      lines: [
        { id: "pline-1", productId: "prod-1", productSku: "ELE-001", productName: "Laptop Pro 15", locationCode: "A-01-01-01", zoneName: "Storage Zone A", quantity: 10, pickedQuantity: 7, unit: "unit", status: "picked" },
        { id: "pline-2", productId: "prod-2", productSku: "ELE-002", productName: "Smartphone X", locationCode: "A-01-01-02", zoneName: "Storage Zone A", quantity: 20, pickedQuantity: 0, unit: "unit", status: "pending" },
      ],
      totalQuantity: 30,
      pickedQuantity: 7,
      remainingQuantity: 23,
      picker: "John Doe",
      createdAt: "2025-01-28T10:00:00Z",
      lastUpdated: "2025-01-28T10:30:00Z",
    },
    {
      id: "pick-2",
      pickingNumber: "PIC-2025-002",
      orderId: "ord-2",
      orderNumber: "ORD-2025-002",
      customerId: "cust-2",
      customerName: "XYZ Corporation",
      warehouseId: "wh-2",
      warehouseName: "Lyon Warehouse",
      assignedDate: "2025-01-28T09:00:00Z",
      status: "pending",
      priority: "medium",
      lines: [
        { id: "pline-3", productId: "prod-5", productSku: "AUT-001", productName: "Oil Filter", locationCode: "E-01-01-01", zoneName: "Storage Zone B", quantity: 100, pickedQuantity: 0, unit: "piece", status: "pending" },
      ],
      totalQuantity: 100,
      pickedQuantity: 0,
      remainingQuantity: 100,
      createdAt: "2025-01-28T09:00:00Z",
      lastUpdated: "2025-01-28T09:00:00Z",
    },
    {
      id: "pick-3",
      pickingNumber: "PIC-2025-003",
      orderId: "ord-3",
      orderNumber: "ORD-2025-003",
      customerId: "cust-3",
      customerName: "Individual Customer",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      assignedDate: "2025-01-26T14:00:00Z",
      startedDate: "2025-01-26T14:05:00Z",
      completedDate: "2025-01-26T14:25:00Z",
      status: "completed",
      priority: "low",
      lines: [
        { id: "pline-4", productId: "prod-4", productSku: "FOOD-001", productName: "1kg Coffee Beans", locationCode: "G-01-01-01", zoneName: "Storage Zone C", quantity: 5, pickedQuantity: 5, unit: "package", status: "picked" },
      ],
      totalQuantity: 5,
      pickedQuantity: 5,
      remainingQuantity: 0,
      picker: "Jane Smith",
      createdAt: "2025-01-26T14:00:00Z",
      lastUpdated: "2025-01-26T14:25:00Z",
    },
  ],
}

function PickingRoute() {
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
            <PickingPage data={demoData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

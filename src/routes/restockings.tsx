import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { RestockingsPage } from "@/components/restockings/RestockingsPage"
import type { RestockingsData } from "@/types/entities"

export const Route = createFileRoute("/restockings")({
  component: RestockingsRoute,
})

const demoData: RestockingsData = {
  kpis: {
    totalRestockings: 35,
    pendingRestockings: 8,
    inProgressRestockings: 12,
    completedRestockings: 15,
    totalProducts: 120,
    restockedProducts: 85,
    pendingProducts: 35,
  },
  restockings: [
    {
      id: "restock-1",
      restockingNumber: "REA-2025-001",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      status: "in_progress",
      priority: "high",
      lines: [
        { id: "rline-1", productId: "prod-2", productSku: "ELE-002", productName: "Smartphone X", currentQuantity: 12, targetQuantity: 50, quantityToRestock: 38, unit: "unit", status: "pending" },
        { id: "rline-2", productId: "prod-3", productSku: "MEC-001", productName: "5mm Screw Box", currentQuantity: 0, targetQuantity: 100, quantityToRestock: 100, unit: "piece", status: "in_progress" },
      ],
      totalProducts: 2,
      restockedProducts: 0,
      requester: "John Doe",
      assignedTo: "Jane Smith",
      requestedDate: "2025-01-28T09:00:00Z",
      startedDate: "2025-01-28T10:00:00Z",
      createdAt: "2025-01-28T09:00:00Z",
      lastUpdated: "2025-01-28T10:30:00Z",
    },
    {
      id: "restock-2",
      restockingNumber: "REA-2025-002",
      warehouseId: "wh-2",
      warehouseName: "Lyon Warehouse",
      status: "pending",
      priority: "medium",
      lines: [
        { id: "rline-3", productId: "prod-5", productSku: "AUT-001", productName: "Oil Filter", currentQuantity: 85, targetQuantity: 150, quantityToRestock: 65, unit: "unit", status: "pending" },
      ],
      totalProducts: 1,
      restockedProducts: 0,
      requester: "Bob Wilson",
      requestedDate: "2025-01-27T14:00:00Z",
      createdAt: "2025-01-27T14:00:00Z",
      lastUpdated: "2025-01-27T14:00:00Z",
    },
    {
      id: "restock-3",
      restockingNumber: "REA-2025-003",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      status: "completed",
      priority: "low",
      lines: [
        { id: "rline-4", productId: "prod-1", productSku: "ELE-001", productName: "Laptop Pro 15", currentQuantity: 120, targetQuantity: 150, quantityToRestock: 30, unit: "unit", status: "completed" },
      ],
      totalProducts: 1,
      restockedProducts: 1,
      requester: "Jane Smith",
      assignedTo: "John Doe",
      requestedDate: "2025-01-26T08:00:00Z",
      startedDate: "2025-01-26T09:00:00Z",
      completedDate: "2025-01-26T10:30:00Z",
      createdAt: "2025-01-26T08:00:00Z",
      lastUpdated: "2025-01-26T10:30:00Z",
    },
  ],
}

function RestockingsRoute() {
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
            <RestockingsPage data={demoData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

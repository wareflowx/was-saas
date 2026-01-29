import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ReceptionsPage } from "@/components/receptions/ReceptionsPage"
import type { ReceptionsData } from "@/types/entities"

export const Route = createFileRoute("/receptions")({
  component: ReceptionsRoute,
})

const demoData: ReceptionsData = {
  kpis: {
    totalReceptions: 45,
    pendingReceptions: 8,
    inProgressReceptions: 12,
    completedReceptions: 25,
    totalQuantity: 15000,
    receivedQuantity: 12500,
    pendingQuantity: 2500,
  },
  receptions: [
    {
      id: "rec-1",
      receptionNumber: "REC-2025-001",
      supplierId: "supp-1",
      supplierName: "TechSupplier Inc.",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      expectedDate: "2025-01-30T00:00:00Z",
      status: "in_progress",
      priority: "high",
      lines: [
        { id: "rline-1", productId: "prod-1", productSku: "ELE-001", productName: "Laptop Pro 15", orderedQuantity: 50, receivedQuantity: 30, rejectedQuantity: 0, unitPrice: 800, totalPrice: 40000 },
      ],
      totalQuantity: 50,
      receivedQuantity: 30,
      rejectedQuantity: 0,
      totalAmount: 40000,
      receiver: "John Doe",
      createdAt: "2025-01-28T10:00:00Z",
      lastUpdated: "2025-01-28T14:00:00Z",
    },
    {
      id: "rec-2",
      receptionNumber: "REC-2025-002",
      supplierId: "supp-2",
      supplierName: "AutoSupply Co.",
      warehouseId: "wh-2",
      warehouseName: "Lyon Warehouse",
      expectedDate: "2025-02-01T00:00:00Z",
      status: "pending",
      priority: "medium",
      lines: [
        { id: "rline-2", productId: "prod-5", productSku: "AUT-001", productName: "Oil Filter", orderedQuantity: 200, receivedQuantity: 0, rejectedQuantity: 0, unitPrice: 8, totalPrice: 1600 },
      ],
      totalQuantity: 200,
      receivedQuantity: 0,
      rejectedQuantity: 0,
      totalAmount: 1600,
      createdAt: "2025-01-27T09:00:00Z",
      lastUpdated: "2025-01-27T09:00:00Z",
    },
  ],
}

function ReceptionsRoute() {
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
            <ReceptionsPage data={demoData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

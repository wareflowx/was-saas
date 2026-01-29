import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { WarehousesPage } from "@/components/warehouses/WarehousesPage"
import type { WarehousesData } from "@/types/entities"

export const Route = createFileRoute("/warehouses")({
  component: WarehousesRoute,
})

// Demo data
const demoData: WarehousesData = {
  kpis: {
    totalWarehouses: 6,
    activeWarehouses: 5,
    totalSurface: 85000,
    totalCapacity: 250000,
    usedCapacity: 187500,
    averageOccupancy: 75,
    trackedPickers: 24,
  },
  warehouses: [
    {
      id: "wh-1",
      code: "WH-PAR-01",
      name: "Paris North Warehouse",
      city: "Paris",
      country: "France",
      surface: 15000,
      capacity: 45000,
      usedCapacity: 38250,
      zoneCount: 12,
      pickerCount: 5,
      manager: "John Doe",
      email: "j.dupont@wareflow.com",
      phone: "+33 1 23 45 67 89",
      status: "active",
      openingDate: "2018-03-15",
      lastUpdated: "2025-01-28T10:30:00Z",
    },
    {
      id: "wh-2",
      code: "WH-LYO-01",
      name: "Lyon Warehouse",
      city: "Lyon",
      country: "France",
      surface: 12000,
      capacity: 35000,
      usedCapacity: 28000,
      zoneCount: 10,
      pickerCount: 4,
      manager: "Jane Smith",
      email: "m.martin@wareflow.com",
      phone: "+33 4 56 78 90 12",
      status: "active",
      openingDate: "2019-06-20",
      lastUpdated: "2025-01-28T09:15:00Z",
    },
    {
      id: "wh-3",
      code: "WH-MAR-01",
      name: "Marseille Warehouse",
      city: "Marseille",
      country: "France",
      surface: 18000,
      capacity: 50000,
      usedCapacity: 45000,
      zoneCount: 15,
      pickerCount: 6,
      manager: "Bob Wilson",
      email: "p.bernard@wareflow.com",
      phone: "+33 4 91 23 45 67",
      status: "active",
      openingDate: "2017-09-10",
      lastUpdated: "2025-01-28T11:00:00Z",
    },
    {
      id: "wh-4",
      code: "WH-BOR-01",
      name: "Bordeaux Warehouse",
      city: "Bordeaux",
      country: "France",
      surface: 10000,
      capacity: 30000,
      usedCapacity: 21000,
      zoneCount: 8,
      pickerCount: 3,
      manager: "Sarah Johnson",
      email: "s.petit@wareflow.com",
      phone: "+33 5 56 78 90 12",
      status: "active",
      openingDate: "2020-02-01",
      lastUpdated: "2025-01-28T08:45:00Z",
    },
    {
      id: "wh-5",
      code: "WH-LIL-01",
      name: "Lille Warehouse",
      city: "Lille",
      country: "France",
      surface: 14000,
      capacity: 40000,
      usedCapacity: 28000,
      zoneCount: 11,
      pickerCount: 4,
      manager: "Michael Brown",
      email: "l.moreau@wareflow.com",
      phone: "+33 3 20 12 34 56",
      status: "active",
      openingDate: "2019-11-15",
      lastUpdated: "2025-01-28T10:00:00Z",
    },
    {
      id: "wh-6",
      code: "WH-STR-01",
      name: "Strasbourg Warehouse",
      city: "Strasbourg",
      country: "France",
      surface: 16000,
      capacity: 50000,
      usedCapacity: 27500,
      zoneCount: 14,
      pickerCount: 2,
      manager: "Emily Davis",
      email: "e.leroy@wareflow.com",
      phone: "+33 3 88 12 34 56",
      status: "maintenance",
      openingDate: "2021-04-20",
      lastUpdated: "2025-01-28T07:30:00Z",
    },
  ],
}

function WarehousesRoute() {
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
            <WarehousesPage data={demoData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

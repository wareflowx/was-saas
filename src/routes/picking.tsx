import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Home,
  BarChart3,
  Package,
  ArrowRight,
  ShoppingCart,
  Building2,
  FileSpreadsheet,
  Settings,
  Warehouse,
  Truck,
  ClipboardList,
  TrendingUp,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { PickingPage } from "@/components/picking"

export const Route = createFileRoute("/picking")({
  component: Picking,
})

function Picking() {
  // Demo data - replace with actual data from your backend
  const pickingData = {
    summary: {
      today: {
        date: new Date(),
        totalLines: 145,
        completedLines: 98,
        pendingLines: 47,
        totalQuantity: 3450,
        pickedQuantity: 2890,
        completionRate: 68,
        uniqueOperators: 8,
        avgLinesPerOperator: 18,
        totalDuration: 14580, // seconds
        avgDurationPerLine: 148, // seconds
      },
      thisWeek: {
        period: { start: new Date(), end: new Date() },
        totalLines: 892,
        completedLines: 756,
        totalQuantity: 21450,
        uniqueOrders: 234,
        uniqueProducts: 567,
        uniqueOperators: 12,
        avgLinesPerDay: 127,
        peakDay: "Wednesday",
      },
      thisMonth: {
        period: { start: new Date(), end: new Date() },
        totalLines: 3456,
        completedLines: 2987,
        totalQuantity: 82340,
        uniqueOrders: 892,
        uniqueProducts: 1234,
        uniqueOperators: 15,
        avgLinesPerDay: 115,
        peakDay: "Monday",
      },
    },
    pickingLines: [
      {
        id: "1",
        lineNumber: 1,
        commande: {
          orderId: "ORD-001",
          orderDate: new Date("2024-01-28"),
          orderType: "Sales Order",
          priority: "high",
          requester: "Acme Corp",
          destination: "Shipping Dock A",
        },
        article: {
          productId: 1001,
          productName: "Widget XL",
          productDescription: "Premium widget with extra features",
          sku: "WID-XL-001",
          quantity: 50,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 1",
          zone: "A",
          aisle: "01",
          bay: "03",
          level: 2,
          position: "05",
          fullPath: "Warehouse 1 / Zone A / Aisle 01 / Bay 03 / Level 2 / Position 05",
        },
        picking: {
          status: "in_progress",
          assignedTo: "John Doe",
          assignedAt: new Date("2024-01-28T10:30:00"),
          startedAt: new Date("2024-01-28T10:32:00"),
          duration: 320,
          quantityPicked: 40,
          quantityRequired: 50,
          progress: 80,
        },
        entrepot: "Warehouse 1",
        date: new Date("2024-01-28"),
        utilisateur: "John Doe",
        notes: ["Handle with care", "Check for damages"],
      },
      {
        id: "2",
        lineNumber: 2,
        commande: {
          orderId: "ORD-001",
          orderDate: new Date("2024-01-28"),
          orderType: "Sales Order",
          priority: "high",
          requester: "Acme Corp",
          destination: "Shipping Dock A",
        },
        article: {
          productId: 1002,
          productName: "Gadget Pro",
          sku: "GAD-PRO-002",
          quantity: 25,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 1",
          zone: "B",
          aisle: "02",
          bay: "05",
          level: 1,
          position: "02",
          fullPath: "Warehouse 1 / Zone B / Aisle 02 / Bay 05 / Level 1 / Position 02",
        },
        picking: {
          status: "pending",
          quantityPicked: 0,
          quantityRequired: 25,
          progress: 0,
        },
        entrepot: "Warehouse 1",
        date: new Date("2024-01-28"),
      },
      {
        id: "3",
        lineNumber: 1,
        commande: {
          orderId: "ORD-002",
          orderDate: new Date("2024-01-28"),
          orderType: "Transfer Order",
          priority: "medium",
          requester: "Tech Solutions",
          destination: "Staging Area B",
        },
        article: {
          productId: 1003,
          productName: "Component Z",
          productDescription: "Critical component for assembly",
          sku: "COM-Z-003",
          quantity: 100,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 2",
          zone: "C",
          aisle: "03",
          bay: "01",
          level: 1,
          position: "01",
          fullPath: "Warehouse 2 / Zone C / Aisle 03 / Bay 01 / Level 1 / Position 01",
        },
        picking: {
          status: "completed",
          assignedTo: "Jane Smith",
          assignedAt: new Date("2024-01-28T09:00:00"),
          startedAt: new Date("2024-01-28T09:05:00"),
          completedAt: new Date("2024-01-28T09:25:00"),
          duration: 1200,
          quantityPicked: 100,
          quantityRequired: 100,
          progress: 100,
        },
        entrepot: "Warehouse 2",
        date: new Date("2024-01-28"),
        utilisateur: "Jane Smith",
      },
      {
        id: "4",
        lineNumber: 3,
        commande: {
          orderId: "ORD-003",
          orderDate: new Date("2024-01-28"),
          orderType: "Sales Order",
          priority: "low",
          requester: "Global Industries",
          destination: "Shipping Dock C",
        },
        article: {
          productId: 1004,
          productName: "Product A",
          sku: "PRO-A-001",
          quantity: 75,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 3",
          zone: "D",
          aisle: "01",
          bay: "02",
          level: 3,
          position: "04",
          fullPath: "Warehouse 3 / Zone D / Aisle 01 / Bay 02 / Level 3 / Position 04",
        },
        picking: {
          status: "assigned",
          assignedTo: "Bob Wilson",
          assignedAt: new Date("2024-01-28T11:00:00"),
          quantityPicked: 0,
          quantityRequired: 75,
          progress: 0,
        },
        entrepot: "Warehouse 3",
        date: new Date("2024-01-28"),
        utilisateur: "Bob Wilson",
      },
      {
        id: "5",
        lineNumber: 2,
        commande: {
          orderId: "ORD-002",
          orderDate: new Date("2024-01-28"),
          orderType: "Transfer Order",
          priority: "medium",
          requester: "Tech Solutions",
          destination: "Staging Area B",
        },
        article: {
          productId: 1005,
          productName: "Item X",
          sku: "ITM-X-001",
          quantity: 30,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 1",
          zone: "A",
          aisle: "01",
          bay: "01",
          level: 1,
          position: "01",
          fullPath: "Warehouse 1 / Zone A / Aisle 01 / Bay 01 / Level 1 / Position 01",
        },
        picking: {
          status: "error",
          assignedTo: "Alice Brown",
          assignedAt: new Date("2024-01-28T10:00:00"),
          startedAt: new Date("2024-01-28T10:02:00"),
          quantityPicked: 15,
          quantityRequired: 30,
          progress: 50,
        },
        entrepot: "Warehouse 1",
        date: new Date("2024-01-28"),
        utilisateur: "Alice Brown",
        errors: [
          {
            type: "damaged",
            message: "Product damaged during picking",
            reportedAt: new Date("2024-01-28T10:15:00"),
            reportedBy: "Alice Brown",
          },
        ],
      },
      {
        id: "6",
        lineNumber: 4,
        commande: {
          orderId: "ORD-004",
          orderDate: new Date("2024-01-27"),
          orderType: "Sales Order",
          priority: "high",
          requester: "StartUp Inc",
          destination: "Shipping Dock A",
        },
        article: {
          productId: 1006,
          productName: "Single Item",
          sku: "SNG-001",
          quantity: 10,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 2",
          zone: "B",
          aisle: "02",
          bay: "02",
          level: 1,
          position: "02",
          fullPath: "Warehouse 2 / Zone B / Aisle 02 / Bay 02 / Level 1 / Position 02",
        },
        picking: {
          status: "partial",
          assignedTo: "John Doe",
          assignedAt: new Date("2024-01-27T14:00:00"),
          startedAt: new Date("2024-01-27T14:05:00"),
          quantityPicked: 5,
          quantityRequired: 10,
          progress: 50,
        },
        entrepot: "Warehouse 2",
        date: new Date("2024-01-27"),
        utilisateur: "John Doe",
        notes: ["Partial stock available, rest on backorder"],
      },
      {
        id: "7",
        lineNumber: 1,
        commande: {
          orderId: "ORD-005",
          orderDate: new Date("2024-01-28"),
          orderType: "Sales Order",
          priority: "medium",
          requester: "MegaCorp",
          destination: "Shipping Dock B",
        },
        article: {
          productId: 1007,
          productName: "Bulk Product 1",
          sku: "BLK-1-001",
          quantity: 200,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 3",
          zone: "C",
          aisle: "01",
          bay: "01",
          level: 1,
          position: "01",
          fullPath: "Warehouse 3 / Zone C / Aisle 01 / Bay 01 / Level 1 / Position 01",
        },
        picking: {
          status: "pending",
          quantityPicked: 0,
          quantityRequired: 200,
          progress: 0,
        },
        entrepot: "Warehouse 3",
        date: new Date("2024-01-28"),
      },
      {
        id: "8",
        lineNumber: 5,
        commande: {
          orderId: "ORD-003",
          orderDate: new Date("2024-01-28"),
          orderType: "Sales Order",
          priority: "low",
          requester: "Global Industries",
          destination: "Shipping Dock C",
        },
        article: {
          productId: 1008,
          productName: "Large Item A",
          sku: "LRG-A-001",
          quantity: 15,
          unit: "EA",
        },
        emplacement: {
          warehouse: "Warehouse 1",
          zone: "A",
          aisle: "02",
          bay: "06",
          level: 1,
          position: "01",
          fullPath: "Warehouse 1 / Zone A / Aisle 02 / Bay 06 / Level 1 / Position 01",
        },
        picking: {
          status: "cancelled",
          quantityPicked: 0,
          quantityRequired: 15,
          progress: 0,
        },
        entrepot: "Warehouse 1",
        date: new Date("2024-01-28"),
        notes: ["Order cancelled by customer"],
      },
    ],
    statusDistribution: [
      { status: "pending", count: 47 },
      { status: "in_progress", count: 23 },
      { status: "completed", count: 98 },
      { status: "cancelled", count: 5 },
      { status: "partial", count: 3 },
      { status: "error", count: 2 },
      { status: "assigned", count: 12 },
    ],
    operatorPerformance: [
      { operator: "John Doe", lines: 28, avgDuration: 145 },
      { operator: "Jane Smith", lines: 35, avgDuration: 120 },
      { operator: "Bob Wilson", lines: 22, avgDuration: 158 },
      { operator: "Alice Brown", lines: 18, avgDuration: 175 },
    ],
    trends: [
      { date: "Jan 22", totalLines: 120, completedLines: 95, avgDuration: 155 },
      { date: "Jan 23", totalLines: 135, completedLines: 108, avgDuration: 148 },
      { date: "Jan 24", totalLines: 128, completedLines: 102, avgDuration: 152 },
      { date: "Jan 25", totalLines: 142, completedLines: 115, avgDuration: 145 },
      { date: "Jan 26", totalLines: 138, completedLines: 110, avgDuration: 150 },
      { date: "Jan 27", totalLines: 145, completedLines: 118, avgDuration: 142 },
      { date: "Jan 28", totalLines: 145, completedLines: 98, avgDuration: 148 },
    ],
    priorityDistribution: [
      { priority: "high", count: 45, avgDuration: 165 },
      { priority: "medium", count: 68, avgDuration: 148 },
      { priority: "low", count: 32, avgDuration: 132 },
    ],
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="bg-background border-r">
          <SidebarHeader className="h-14 border-b bg-background">
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Wareflow</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarHeader>

          <SidebarContent className="bg-background">
            <SidebarGroup>
              <SidebarGroupLabel>Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <Home />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Warehouse</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/locations">
                        <Warehouse />
                        <span>Locations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <Package />
                        <span>Products</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive className="text-foreground">
                      <Link to="/picking">
                        <ClipboardList />
                        <span>Picking</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <ArrowRight />
                        <span>Movements</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <ShoppingCart />
                        <span>Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <ClipboardList />
                        <span>Inventory</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <TrendingUp />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
                      <Link to="/dashboard">
                        <FileSpreadsheet />
                        <span>Imports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-background">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-muted-foreground">
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <div className="p-8">
            <PickingPage data={pickingData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

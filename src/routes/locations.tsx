import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Home,
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
  AlertTriangle,
  ChevronRight,
  BarChart3,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { LocationsPage } from "@/components/locations"
import type { Location } from "@/components/locations"

export const Route = createFileRoute("/locations")({
  component: Locations,
})

function Locations() {
  // Demo data - replace with actual data from your backend
  const locationsData = {
    kpis: {
      totalLocations: 156,
      occupancyRate: 72,
      availableLocations: 43,
      fullLocations: 18,
      activeZones: 4,
    },
    occupancyByZone: [
      { zone: "Zone A", occupancy: 85, fill: "hsl(var(--chart-1))" },
      { zone: "Zone B", occupancy: 65, fill: "hsl(var(--chart-2))" },
      { zone: "Zone C", occupancy: 72, fill: "hsl(var(--chart-3))" },
      { zone: "Zone D", occupancy: 48, fill: "hsl(var(--chart-4))" },
    ],
    locationTypeDistribution: [
      { type: "Rack", count: 68, fill: "hsl(var(--chart-1))" },
      { type: "Shelf", count: 45, fill: "hsl(var(--chart-2))" },
      { type: "Floor", count: 28, fill: "hsl(var(--chart-3))" },
      { type: "Bin", count: 15, fill: "hsl(var(--chart-4))" },
    ],
    occupancyTrends: [
      { date: "Jan 22", occupancy: 68 },
      { date: "Jan 23", occupancy: 69 },
      { date: "Jan 24", occupancy: 70 },
      { date: "Jan 25", occupancy: 71 },
      { date: "Jan 26", occupancy: 71 },
      { date: "Jan 27", occupancy: 72 },
      { date: "Jan 28", occupancy: 72 },
    ],
    locations: [
      {
        id: "1",
        code: "A-01-01",
        zone: "A",
        warehouse: "Warehouse 1",
        type: "rack",
        capacity: 100,
        used: 90,
        productsCount: 3,
        status: "full",
        products: [
          { id: "p1", name: "Widget XL", sku: "WID-XL-001", quantity: 50 },
          { id: "p2", name: "Gadget Pro", sku: "GAD-PRO-002", quantity: 30 },
          { id: "p3", name: "Component Z", sku: "COM-Z-003", quantity: 10 },
        ],
      },
      {
        id: "2",
        code: "A-01-02",
        zone: "A",
        warehouse: "Warehouse 1",
        type: "rack",
        capacity: 100,
        used: 80,
        productsCount: 2,
        status: "medium",
        products: [
          { id: "p4", name: "Product A", sku: "PRO-A-001", quantity: 50 },
          { id: "p5", name: "Product B", sku: "PRO-B-002", quantity: 30 },
        ],
      },
      {
        id: "3",
        code: "B-01-01",
        zone: "B",
        warehouse: "Warehouse 1",
        type: "shelf",
        capacity: 50,
        used: 30,
        productsCount: 2,
        status: "medium",
        products: [
          { id: "p6", name: "Item X", sku: "ITM-X-001", quantity: 20 },
          { id: "p7", name: "Item Y", sku: "ITM-Y-002", quantity: 10 },
        ],
      },
      {
        id: "4",
        code: "B-01-02",
        zone: "B",
        warehouse: "Warehouse 2",
        type: "shelf",
        capacity: 50,
        used: 20,
        productsCount: 1,
        status: "available",
        products: [
          { id: "p8", name: "Single Item", sku: "SNG-001", quantity: 20 },
        ],
      },
      {
        id: "5",
        code: "C-01-01",
        zone: "C",
        warehouse: "Warehouse 2",
        type: "floor",
        capacity: 200,
        used: 150,
        productsCount: 4,
        status: "medium",
        products: [
          { id: "p9", name: "Bulk Product 1", sku: "BLK-1-001", quantity: 50 },
          { id: "p10", name: "Bulk Product 2", sku: "BLK-2-002", quantity: 40 },
          { id: "p11", name: "Bulk Product 3", sku: "BLK-3-003", quantity: 35 },
          { id: "p12", name: "Bulk Product 4", sku: "BLK-4-004", quantity: 25 },
        ],
      },
      {
        id: "6",
        code: "C-01-02",
        zone: "C",
        warehouse: "Warehouse 2",
        type: "floor",
        capacity: 200,
        used: 138,
        productsCount: 3,
        status: "medium",
        products: [
          { id: "p13", name: "Large Item A", sku: "LRG-A-001", quantity: 60 },
          { id: "p14", name: "Large Item B", sku: "LRG-B-002", quantity: 50 },
          { id: "p15", name: "Large Item C", sku: "LRG-C-003", quantity: 28 },
        ],
      },
      {
        id: "7",
        code: "D-01-01",
        zone: "D",
        warehouse: "Warehouse 3",
        type: "bin",
        capacity: 30,
        used: 12,
        productsCount: 2,
        status: "available",
        products: [
          { id: "p16", name: "Small Part A", sku: "SML-A-001", quantity: 8 },
          { id: "p17", name: "Small Part B", sku: "SML-B-002", quantity: 4 },
        ],
      },
      {
        id: "8",
        code: "D-01-02",
        zone: "D",
        warehouse: "Warehouse 3",
        type: "bin",
        capacity: 30,
        used: 15,
        productsCount: 2,
        status: "available",
        products: [
          { id: "p18", name: "Tiny Component X", sku: "TNY-X-001", quantity: 10 },
          { id: "p19", name: "Tiny Component Y", sku: "TNY-Y-002", quantity: 5 },
        ],
      },
      {
        id: "9",
        code: "A-02-01",
        zone: "A",
        warehouse: "Warehouse 1",
        type: "rack",
        capacity: 100,
        used: 95,
        productsCount: 3,
        status: "full",
        products: [
          { id: "p20", name: "High Volume Prod 1", sku: "HVP-1-001", quantity: 40 },
          { id: "p21", name: "High Volume Prod 2", sku: "HVP-2-002", quantity: 35 },
          { id: "p22", name: "High Volume Prod 3", sku: "HVP-3-003", quantity: 20 },
        ],
      },
      {
        id: "10",
        code: "B-02-01",
        zone: "B",
        warehouse: "Warehouse 1",
        type: "shelf",
        capacity: 50,
        used: 35,
        productsCount: 2,
        status: "medium",
        products: [
          { id: "p23", name: "Medium Stock Item A", sku: "MED-A-001", quantity: 25 },
          { id: "p24", name: "Medium Stock Item B", sku: "MED-B-002", quantity: 10 },
        ],
      },
    ] as Location[],
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
                    <SidebarMenuButton asChild isActive className="text-foreground">
                      <Link to="/locations">
                        <Warehouse />
                        <span>Locations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <Collapsible defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="text-muted-foreground">
                          <Package />
                          <span>Products</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link to="/products">
                                <Package className="text-muted-foreground" />
                                <span className="text-muted-foreground">All Products</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link to="/dead-stock">
                                <AlertTriangle className="text-muted-foreground" />
                                <span className="text-muted-foreground">Dead Stock</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link to="/misplaced-items">
                                <TrendingUp className="text-muted-foreground" />
                                <span className="text-muted-foreground">Misplaced Items</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link to="/abc-analysis">
                                <BarChart3 className="text-muted-foreground" />
                                <span className="text-muted-foreground">ABC Analysis</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-muted-foreground">
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
            <LocationsPage data={locationsData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

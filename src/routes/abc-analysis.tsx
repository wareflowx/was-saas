import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "@/components/ui/collapsible";
import {
  Home,
  Package,
  Warehouse,
  ClipboardList,
  FileSpreadsheet,
  Settings,
  Building2,
  ArrowRight,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { ABCAnalysisPage } from "@/components/abc-analysis";

export const Route = createFileRoute("/abc-analysis")({
  component: ABCAnalysis,
});

function ABCAnalysis() {
  // Demo data - replace with actual data from your backend
  const abcAnalysisData = {
    items: [
      {
        id: "1",
        sku: "ELEC-001",
        name: "Wireless Mouse",
        category: "Electronics",
        abcClass: "A" as const,
        stockValue: 45000,
        movementsPerMonth: 156,
        quantity: 500,
        currentZone: "A",
      },
      {
        id: "2",
        sku: "CLOTH-001",
        name: "Cotton T-Shirt",
        category: "Clothing",
        abcClass: "A" as const,
        stockValue: 38000,
        movementsPerMonth: 128,
        quantity: 400,
        currentZone: "A",
      },
      {
        id: "3",
        sku: "FOOD-001",
        name: "Organic Coffee",
        category: "Food",
        abcClass: "A" as const,
        stockValue: 32000,
        movementsPerMonth: 115,
        quantity: 350,
        currentZone: "A",
      },
      {
        id: "4",
        sku: "ELEC-002",
        name: "USB-C Cable",
        category: "Electronics",
        abcClass: "A" as const,
        stockValue: 28000,
        movementsPerMonth: 142,
        quantity: 300,
        currentZone: "A",
      },
      {
        id: "5",
        sku: "ELEC-003",
        name: "Bluetooth Keyboard",
        category: "Electronics",
        abcClass: "A" as const,
        stockValue: 25000,
        movementsPerMonth: 98,
        quantity: 250,
        currentZone: "B",
        suggestedZone: "A",
      },
      {
        id: "6",
        sku: "TOOL-001",
        name: "Hammer",
        category: "Tools",
        abcClass: "B" as const,
        stockValue: 12000,
        movementsPerMonth: 45,
        quantity: 180,
        currentZone: "B",
      },
      {
        id: "7",
        sku: "CLOTH-002",
        name: "Denim Jeans",
        category: "Clothing",
        abcClass: "B" as const,
        stockValue: 10500,
        movementsPerMonth: 38,
        quantity: 150,
        currentZone: "B",
      },
      {
        id: "8",
        sku: "FOOD-002",
        name: "Green Tea",
        category: "Food",
        abcClass: "B" as const,
        stockValue: 9800,
        movementsPerMonth: 52,
        quantity: 200,
        currentZone: "B",
      },
      {
        id: "9",
        sku: "TOOL-002",
        name: "Screwdriver Set",
        category: "Tools",
        abcClass: "B" as const,
        stockValue: 8500,
        movementsPerMonth: 42,
        quantity: 120,
        currentZone: "C",
      },
      {
        id: "10",
        sku: "ELEC-004",
        name: "Webcam HD",
        category: "Electronics",
        abcClass: "B" as const,
        stockValue: 7200,
        movementsPerMonth: 35,
        quantity: 100,
        currentZone: "C",
      },
      {
        id: "11",
        sku: "ELEC-007",
        name: "Old MP3 Player",
        category: "Electronics",
        abcClass: "C" as const,
        stockValue: 1500,
        movementsPerMonth: 5,
        quantity: 60,
        currentZone: "D",
      },
      {
        id: "12",
        sku: "CLOTH-008",
        name: "Vintage Jacket",
        category: "Clothing",
        abcClass: "C" as const,
        stockValue: 1200,
        movementsPerMonth: 3,
        quantity: 15,
        currentZone: "D",
      },
      {
        id: "13",
        sku: "TOOL-005",
        name: "Manual Saw",
        category: "Tools",
        abcClass: "C" as const,
        stockValue: 1800,
        movementsPerMonth: 8,
        quantity: 50,
        currentZone: "D",
      },
      {
        id: "14",
        sku: "FOOD-006",
        name: "Canned Soup",
        category: "Food",
        abcClass: "C" as const,
        stockValue: 900,
        movementsPerMonth: 4,
        quantity: 35,
        currentZone: "D",
      },
      {
        id: "15",
        sku: "ELEC-008",
        name: "Wired Headphones",
        category: "Electronics",
        abcClass: "C" as const,
        stockValue: 1100,
        movementsPerMonth: 6,
        quantity: 80,
        currentZone: "C",
      },
    ],
    kpis: {
      classACount: 5,
      classBCount: 5,
      classCCount: 5,
      aInWrongZoneCount: 1,
    },
    paretoData: [
      { product: "1", cumulativePercent: 22, value: 45000 },
      { product: "2", cumulativePercent: 40, value: 38000 },
      { product: "3", cumulativePercent: 55, value: 32000 },
      { product: "4", cumulativePercent: 68, value: 28000 },
      { product: "5", cumulativePercent: 78, value: 25000 },
      { product: "6", cumulativePercent: 85, value: 12000 },
      { product: "7", cumulativePercent: 90, value: 10500 },
      { product: "8", cumulativePercent: 94, value: 9800 },
      { product: "9", cumulativePercent: 97, value: 8500 },
      { product: "10", cumulativePercent: 99, value: 7200 },
    ],
    valueByABC: [
      { abc: "A", value: 168000, fill: "hsl(var(--chart-1))" },
      { abc: "B", value: 39000, fill: "hsl(var(--chart-2))" },
      { abc: "C", value: 6500, fill: "hsl(var(--chart-3))" },
    ],
  };

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
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
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
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
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
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
                      <Link to="/picking">
                        <ClipboardList />
                        <span>Picking</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
                      <Link to="/dashboard">
                        <ArrowRight />
                        <span>Movements</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
                      <Link to="/dashboard">
                        <ShoppingCart />
                        <span>Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
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
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
                      <Link to="/dashboard">
                        <TrendingUp />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="text-muted-foreground"
                    >
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
            <ABCAnalysisPage data={abcAnalysisData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

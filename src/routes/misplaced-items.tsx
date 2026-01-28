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
import { MisplacedItemsPage } from "@/components/misplaced-items";

export const Route = createFileRoute("/misplaced-items")({
  component: MisplacedItems,
});

function MisplacedItems() {
  // Demo data - replace with actual data from your backend
  const misplacedItemsData = {
    items: [
      {
        id: "1",
        sku: "ELEC-001",
        name: "Wireless Mouse",
        category: "Electronics",
        popularity: 5,
        currentLocation: "D-01-05",
        zone: "D",
        movementsPerMonth: 156,
        inefficiencyScore: 780,
        suggestedLocation: "A-01-01",
        suggestedZone: "A",
        reason: "High-demand item in far zone",
      },
      {
        id: "2",
        sku: "CLOTH-001",
        name: "Cotton T-Shirt",
        category: "Clothing",
        popularity: 5,
        currentLocation: "C-02-10",
        zone: "C",
        movementsPerMonth: 128,
        inefficiencyScore: 640,
        suggestedLocation: "B-01-01",
        suggestedZone: "B",
        reason: "Popular item in mid-far zone",
      },
      {
        id: "3",
        sku: "FOOD-001",
        name: "Organic Coffee",
        category: "Food",
        popularity: 5,
        currentLocation: "D-03-02",
        zone: "D",
        movementsPerMonth: 115,
        inefficiencyScore: 575,
        suggestedLocation: "C-01-01",
        suggestedZone: "C",
        reason: "Frequent item in farthest zone",
      },
      {
        id: "4",
        sku: "ELEC-002",
        name: "USB-C Cable",
        category: "Electronics",
        popularity: 4,
        currentLocation: "C-01-05",
        zone: "C",
        movementsPerMonth: 142,
        inefficiencyScore: 426,
        suggestedLocation: "A-01-02",
        suggestedZone: "A",
        reason: "High-movement item not in prime location",
      },
      {
        id: "5",
        sku: "TOOL-001",
        name: "Hammer",
        category: "Tools",
        popularity: 4,
        currentLocation: "D-02-08",
        zone: "D",
        movementsPerMonth: 98,
        inefficiencyScore: 392,
        suggestedLocation: "B-02-01",
        suggestedZone: "B",
        reason: "Popular tool in far zone",
      },
    ],
    kpis: {
      totalMisplacedItems: 5,
      highPriorityCount: 3,
      mediumPriorityCount: 2,
      avgInefficiencyScore: 563,
    },
    byZone: [
      { zone: "Zone A", count: 0, fill: "hsl(var(--chart-1))" },
      { zone: "Zone B", count: 0, fill: "hsl(var(--chart-2))" },
      { zone: "Zone C", count: 2, fill: "hsl(var(--chart-3))" },
      { zone: "Zone D", count: 3, fill: "hsl(var(--chart-4))" },
    ],
    inefficiencyByPopularity: [
      { popularity: "5 Stars", score: 1995, fill: "hsl(var(--chart-1))" },
      { popularity: "4 Stars", score: 818, fill: "hsl(var(--chart-2))" },
      { popularity: "3 Stars", score: 0, fill: "hsl(var(--chart-3))" },
      { popularity: "2 Stars", score: 0, fill: "hsl(var(--chart-4))" },
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
            <MisplacedItemsPage data={misplacedItemsData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

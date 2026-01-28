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
import { DeadStockPage } from "@/components/dead-stock";

export const Route = createFileRoute("/dead-stock")({
  component: DeadStock,
});

function DeadStock() {
  // Demo data - replace with actual data from your backend
  const deadStockData = {
    items: [
      {
        id: "1",
        sku: "ELEC-007",
        name: "Old MP3 Player",
        category: "Electronics",
        quantity: 45,
        location: "C-03-12",
        lastMoved: "2023-08-15",
        daysWithoutMovement: 166,
        valuePerUnit: 25.00,
        totalValue: 1125.00,
        severity: "high" as const,
      },
      {
        id: "2",
        sku: "CLOTH-008",
        name: "Vintage Jacket",
        category: "Clothing",
        quantity: 12,
        location: "B-04-08",
        lastMoved: "2023-10-20",
        daysWithoutMovement: 100,
        valuePerUnit: 85.00,
        totalValue: 1020.00,
        severity: "high" as const,
      },
      {
        id: "3",
        sku: "TOOL-005",
        name: "Manual Saw",
        category: "Tools",
        quantity: 30,
        location: "D-02-05",
        lastMoved: "2023-11-01",
        daysWithoutMovement: 88,
        valuePerUnit: 35.00,
        totalValue: 1050.00,
        severity: "medium" as const,
      },
      {
        id: "4",
        sku: "FOOD-006",
        name: "Canned Soup",
        category: "Food",
        quantity: 100,
        location: "C-05-10",
        lastMoved: "2023-11-15",
        daysWithoutMovement: 74,
        valuePerUnit: 3.50,
        totalValue: 350.00,
        severity: "medium" as const,
      },
      {
        id: "5",
        sku: "ELEC-008",
        name: "Wired Headphones",
        category: "Electronics",
        quantity: 60,
        location: "A-04-02",
        lastMoved: "2023-12-01",
        daysWithoutMovement: 58,
        valuePerUnit: 15.00,
        totalValue: 900.00,
        severity: "low" as const,
      },
    ],
    kpis: {
      totalDeadStock: 5,
      totalDeadStockValue: 4445.00,
      highSeverityCount: 2,
      mediumSeverityCount: 2,
    },
    valueByCategory: [
      { category: "Electronics", value: 2025, fill: "hsl(var(--chart-1))" },
      { category: "Clothing", value: 1020, fill: "hsl(var(--chart-2))" },
      { category: "Tools", value: 1050, fill: "hsl(var(--chart-3))" },
      { category: "Food", value: 350, fill: "hsl(var(--chart-4))" },
    ],
    bySeverity: [
      { severity: "High", count: 2, fill: "hsl(var(--chart-1))" },
      { severity: "Medium", count: 2, fill: "hsl(var(--chart-2))" },
      { severity: "Low", count: 1, fill: "hsl(var(--chart-3))" },
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
            <DeadStockPage data={deadStockData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

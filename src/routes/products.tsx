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
  Truck,
  AlertTriangle,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { ProductsPage } from "@/components/products";
import type { Product } from "@/components/products";

export const Route = createFileRoute("/products")({
  component: Products,
});

function Products() {
  // Demo data - replace with actual data from your backend
  const productsData = {
    kpis: {
      totalProducts: 248,
      lowStock: 18,
      outOfStock: 7,
      totalQuantity: 12450,
    },
    productsByCategory: [
      { category: "Electronics", count: 85, fill: "hsl(var(--chart-1))" },
      { category: "Clothing", count: 62, fill: "hsl(var(--chart-2))" },
      { category: "Food", count: 54, fill: "hsl(var(--chart-3))" },
      { category: "Tools", count: 47, fill: "hsl(var(--chart-4))" },
    ],
    stockLevels: [
      { level: "In Stock", count: 195, fill: "hsl(var(--chart-1))" },
      { level: "Low Stock", count: 46, fill: "hsl(var(--chart-2))" },
      { level: "Out of Stock", count: 7, fill: "hsl(var(--chart-3))" },
    ],
    products: [
      {
        id: "1",
        sku: "ELEC-001",
        name: "Wireless Mouse",
        category: "Electronics",
        quantity: 150,
        location: "A-01-01",
        status: "in_stock",
        popularity: 5,
        lastUpdated: "2024-01-28",
      },
      {
        id: "2",
        sku: "ELEC-002",
        name: "USB-C Cable",
        category: "Electronics",
        quantity: 25,
        location: "A-01-02",
        status: "low_stock",
        popularity: 4,
        lastUpdated: "2024-01-27",
      },
      {
        id: "3",
        sku: "CLOTH-001",
        name: "Cotton T-Shirt",
        category: "Clothing",
        quantity: 200,
        location: "B-01-01",
        status: "in_stock",
        popularity: 3,
        lastUpdated: "2024-01-26",
      },
      {
        id: "4",
        sku: "FOOD-001",
        name: "Organic Coffee",
        category: "Food",
        quantity: 0,
        location: "C-01-01",
        status: "out_of_stock",
        popularity: 5,
        lastUpdated: "2024-01-25",
      },
      {
        id: "5",
        sku: "TOOL-001",
        name: "Hammer",
        category: "Tools",
        quantity: 75,
        location: "D-01-01",
        status: "in_stock",
        popularity: 2,
        lastUpdated: "2024-01-24",
      },
      {
        id: "6",
        sku: "ELEC-003",
        name: "Bluetooth Keyboard",
        category: "Electronics",
        quantity: 8,
        location: "A-02-01",
        status: "low_stock",
        popularity: 4,
        lastUpdated: "2024-01-23",
      },
      {
        id: "7",
        sku: "CLOTH-002",
        name: "Denim Jeans",
        category: "Clothing",
        quantity: 120,
        location: "B-01-02",
        status: "in_stock",
        popularity: 3,
        lastUpdated: "2024-01-22",
      },
      {
        id: "8",
        sku: "FOOD-002",
        name: "Green Tea",
        category: "Food",
        quantity: 45,
        location: "C-01-02",
        status: "in_stock",
        popularity: 2,
        lastUpdated: "2024-01-21",
      },
      {
        id: "9",
        sku: "TOOL-002",
        name: "Screwdriver Set",
        category: "Tools",
        quantity: 0,
        location: "D-01-02",
        status: "out_of_stock",
        popularity: 1,
        lastUpdated: "2024-01-20",
      },
      {
        id: "10",
        sku: "ELEC-004",
        name: "Webcam HD",
        category: "Electronics",
        quantity: 60,
        location: "A-02-02",
        status: "in_stock",
        popularity: 5,
        lastUpdated: "2024-01-19",
      },
    ] as Product[],
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
            <ProductsPage data={productsData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

import { createFileRoute } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ProductsPage } from "@/components/products/ProductsPage"
import { useProducts, useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/products")({
  component: ProductsRoute,
})

function ProductsRoute() {
  // Fetch warehouses to get default warehouse ID
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses()

  // Fetch products data from backend
  const defaultWarehouseId = warehouses?.[0]?.id
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error,
  } = useProducts(defaultWarehouseId)

  // Loading state
  if (isLoadingWarehouses || isLoadingProducts) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading products...</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // Error state
  if (error) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-destructive">Error loading products: {error.message}</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state
  if (!productsData || !warehouses?.length) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No products found. Please complete the setup first.
              </div>
              <p className="text-sm text-muted-foreground">
                Import data or generate mock data to get started.
              </p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

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
            <ProductsPage data={productsData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

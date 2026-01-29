import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductsKPICards } from "./ProductsKPICards"
import { ProductsTable } from "./ProductsTable"
import type { ProductsData } from "@/types/entities"

interface ProductsPageProps {
  data: ProductsData
}

export function ProductsPage({ data }: ProductsPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = new Set(data.products.map((p) => p.category))
    return Array.from(categories)
  }, [data.products])

  // Filter products
  const filteredProducts = useMemo(() => {
    return data.products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === "all" || product.status === statusFilter
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [data.products, search, statusFilter, categoryFilter])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Compact Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Product Catalog</span> - Manage inventory, track stock levels, and monitor product values across all warehouses.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPIs */}
      <ProductsKPICards kpis={data.kpis} />

      {/* Products Table */}
      <ProductsTable
        products={filteredProducts}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={uniqueCategories}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Product Management</DialogTitle>
            <DialogDescription>
              Monitor and manage your product inventory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* KPIs Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Key Metrics</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Total Products</p>
                    <p className="text-muted-foreground">All SKUs in catalog</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">In Stock</p>
                    <p className="text-muted-foreground">Available items</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Low Stock</p>
                    <p className="text-muted-foreground">Below threshold</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Total Value</p>
                    <p className="text-muted-foreground">Inventory worth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Product Catalog</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Filters</p>
                    <p className="text-muted-foreground">By status, category, search</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Search</p>
                    <p className="text-muted-foreground">By name or SKU</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Details</p>
                    <p className="text-muted-foreground">Click eye icon to view</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

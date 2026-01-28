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
import { ProductsByCategoryChart } from "./ProductsByCategoryChart"
import { StockLevelsChart } from "./StockLevelsChart"
import { ProductsTable, type Product } from "./ProductsTable"
import { ProductDetailSheet } from "./ProductDetailSheet"
import type { StockStatus } from "./ProductsTable"

type Category = "all" | "Electronics" | "Clothing" | "Food" | "Tools"
type StatusFilter = "all" | "in_stock" | "low_stock" | "out_of_stock"

interface ProductsData {
  kpis: {
    totalProducts: number
    lowStock: number
    outOfStock: number
    totalQuantity: number
  }
  productsByCategory: Array<{
    category: string
    count: number
    fill: string
  }>
  stockLevels: Array<{
    level: string
    count: number
    fill: string
  }>
  products: Product[]
}

interface ProductsPageProps {
  data: ProductsData
}

export function ProductsPage({ data }: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Filter states for table
  const [tableSearch, setTableSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  // Filter products
  const filteredProducts = useMemo(() => {
    return data.products.filter((product) => {
      if (categoryFilter !== "all" && product.category !== categoryFilter) return false
      if (statusFilter !== "all" && product.status !== statusFilter) return false
      if (tableSearch && !product.name.toLowerCase().includes(tableSearch.toLowerCase()) && !product.sku.toLowerCase().includes(tableSearch.toLowerCase())) return false
      return true
    })
  }, [data.products, categoryFilter, statusFilter, tableSearch])

  // Demo movements
  const demoMovements = selectedProduct
    ? [
        {
          id: "MOV-001",
          date: "2024-01-28",
          type: "in" as const,
          quantity: 50,
          location: "A-01-01",
        },
        {
          id: "MOV-002",
          date: "2024-01-27",
          type: "out" as const,
          quantity: 20,
          location: "A-01-01",
        },
        {
          id: "MOV-003",
          date: "2024-01-26",
          type: "in" as const,
          quantity: 30,
          location: "B-01-01",
        },
      ]
    : []

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsSheetOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Monitor product inventory</span> and track stock levels across all categories in real-time.
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
      <ProductsKPICards
        totalProducts={data.kpis.totalProducts}
        lowStock={data.kpis.lowStock}
        outOfStock={data.kpis.outOfStock}
        totalQuantity={data.kpis.totalQuantity}
      />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <ProductsByCategoryChart data={data.productsByCategory} />
        <StockLevelsChart data={data.stockLevels} />
      </div>

      {/* Products Table */}
      <ProductsTable
        products={filteredProducts}
        search={tableSearch}
        onSearchChange={setTableSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onViewDetails={handleViewDetails}
      />

      {/* Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        movements={demoMovements}
        open={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false)
          setSelectedProduct(null)
        }}
      />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Products Overview</DialogTitle>
            <DialogDescription>
              Comprehensive view of all products and their inventory status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">KPIs</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Total Products</p>
                      <p className="text-muted-foreground">Complete product catalog count</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Low Stock</p>
                      <p className="text-muted-foreground">Products below minimum threshold</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Charts</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">By Category</p>
                      <p className="text-muted-foreground">Distribution across categories</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Stock Levels</p>
                      <p className="text-muted-foreground">Current stock status overview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Product Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Browse and search all products with powerful filtering options.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Click SKU</p>
                      <p className="text-muted-foreground">View details, stock info, and movements</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by name or SKU</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Category and stock status</p>
                    </div>
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

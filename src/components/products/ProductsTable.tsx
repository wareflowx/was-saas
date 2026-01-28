import { Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  quantity: number
  location: string
  status: StockStatus
  popularity: number
  lastUpdated: string
}

interface ProductsTableProps {
  products: Product[]
  search: string
  onSearchChange: (search: string) => void
  categoryFilter: string
  onCategoryChange: (category: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  currentPage: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onViewDetails?: (product: Product) => void
  className?: string
}

export function ProductsTable({
  products,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  currentPage,
  onPageChange,
  itemsPerPage,
  onViewDetails,
  className,
}: ProductsTableProps) {
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = products.slice(startIndex, endIndex)

  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case "in_stock":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
            In Stock
          </span>
        )
      case "low_stock":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            Low Stock
          </span>
        )
      case "out_of_stock":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-500">
            Out of Stock
          </span>
        )
    }
  }

  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Clothing">Clothing</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Tools">Tools</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">SKU</TableHead>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground">Quantity</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Popularity</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <button
                      onClick={() => onViewDetails && onViewDetails(product)}
                      className="font-medium text-left text-muted-foreground hover:text-primary transition-colors hover:underline"
                    >
                      {product.sku}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.category}</TableCell>
                  <TableCell className="text-muted-foreground">{product.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{product.location}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.popularity >= 4 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">
                        High
                      </span>
                    ) : product.popularity >= 3 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                        Medium
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500">
                        Low
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

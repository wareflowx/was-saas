import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import type { Product, StockStatus } from "./ProductsTable"

interface Movement {
  id: string
  date: string
  type: "in" | "out"
  quantity: number
  location: string
}

interface ProductDetailSheetProps {
  product: Product | null
  movements: Movement[]
  open: boolean
  onClose: () => void
}

function getStatusBadgeVariant(
  status: StockStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "in_stock":
      return "default"
    case "low_stock":
      return "secondary"
    case "out_of_stock":
      return "destructive"
  }
}

export function ProductDetailSheet({
  product,
  movements,
  open,
  onClose,
}: ProductDetailSheetProps) {
  if (!product) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden border-l-0 p-0">
        <div className="h-full m-2 rounded-xl border flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="relative px-6 pt-4 pb-4 border-b">
              <SheetHeader className="p-0">
                <SheetTitle className="text-xl pr-8">{product.name}</SheetTitle>
                <SheetDescription className="text-xs">Product details and inventory</SheetDescription>
              </SheetHeader>
            </div>

            <div className="p-6 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">SKU</p>
                  <p className="font-semibold text-[10px] truncate">{product.sku}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Category</p>
                  <p className="font-semibold text-[10px] truncate">{product.category}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Stock</p>
                  <p className="font-semibold text-sm">{product.quantity}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Location</p>
                  <p className="font-semibold text-[10px] truncate">{product.location}</p>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-xs font-medium">Stock Status</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(product.status)} className="capitalize text-xs h-5 px-2">
                    {product.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Last updated: {product.lastUpdated}
                </p>
              </div>

              {/* Recent Movements */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-xs font-medium">Recent Movements</p>
                  <span className="text-[10px] text-muted-foreground">({movements.length})</span>
                </div>
                {movements.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-xs text-muted-foreground">No movements yet</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {movements.slice(0, 4).map((movement) => (
                      <div
                        key={movement.id}
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={movement.type === "in" ? "default" : "secondary"}
                              className="capitalize text-[10px] h-5 px-2"
                            >
                              {movement.type}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground">{movement.date}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{movement.location}</p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-semibold">{movement.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {movements.length > 4 && (
                      <p className="text-[10px] text-muted-foreground text-center pt-1">
                        +{movements.length - 4} more movements
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

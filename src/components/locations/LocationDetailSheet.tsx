import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Location, LocationType, LocationStatus } from "./LocationsTable"

interface Product {
  id: string
  name: string
  sku: string
  quantity: number
  dateAdded: string
}

interface Movement {
  id: string
  date: string
  product: string
  type: "in" | "out"
  quantity: number
}

interface LocationDetailSheetProps {
  location: Location | null
  products: Product[]
  movements: Movement[]
  open: boolean
  onClose: () => void
}

function getStatusBadgeVariant(
  status: LocationStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "available":
      return "default"
    case "medium":
      return "secondary"
    case "full":
      return "destructive"
  }
}

export function LocationDetailSheet({
  location,
  products,
  movements,
  open,
  onClose,
}: LocationDetailSheetProps) {
  if (!location) return null

  const occupancy = Math.round((location.used / location.capacity) * 100)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden border-l-0 p-0">
        <div className="h-full m-2 rounded-xl border flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="relative px-6 pt-4 pb-4 border-b">
              <SheetHeader className="p-0">
                <SheetTitle className="text-xl pr-8">{location.code}</SheetTitle>
                <SheetDescription className="text-xs">Location details and inventory</SheetDescription>
              </SheetHeader>
            </div>

            <div className="p-6 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Zone</p>
                  <p className="font-semibold text-sm">{location.zone}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Type</p>
                  <p className="font-semibold text-sm capitalize">{location.type}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Used</p>
                  <p className="font-semibold text-sm">{location.used}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-2 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
                  <p className="font-semibold text-sm">{location.capacity}</p>
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <p className="text-xs font-medium">Stored Products</p>
                  <span className="text-[10px] text-muted-foreground">({products.length})</span>
                </div>
                {products.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center">
                    <p className="text-xs text-muted-foreground">No products stored</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {products.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground">{product.sku}</p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-sm font-semibold">{product.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {products.length > 4 && (
                      <p className="text-[10px] text-muted-foreground text-center pt-1">
                        +{products.length - 4} more products
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

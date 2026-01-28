import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

interface LocationDetailModalProps {
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

export function LocationDetailModal({
  location,
  products,
  movements,
  open,
  onClose,
}: LocationDetailModalProps) {
  if (!location) return null

  const occupancy = Math.round((location.used / location.capacity) * 100)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{location.code}</DialogTitle>
          <DialogDescription>Location details and inventory</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Zone</p>
              <p className="font-semibold">{location.zone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-semibold capitalize">{location.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="font-semibold">{location.capacity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusBadgeVariant(location.status)} className="capitalize">
                {location.status}
              </Badge>
            </div>
          </div>

          {/* Occupancy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Occupancy</p>
              <p className="text-sm text-muted-foreground">
                {location.used} / {location.capacity} ({occupancy}%)
              </p>
            </div>
            <Progress value={occupancy} className="h-3" />
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Stored Products ({products.length})</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No products stored
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.dateAdded}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Recent Movements */}
          <div>
            <h3 className="font-semibold mb-4">Recent Movements</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No movements yet
                    </TableCell>
                  </TableRow>
                ) : (
                  movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{movement.date}</TableCell>
                      <TableCell className="font-medium">{movement.product}</TableCell>
                      <TableCell>
                        <Badge
                          variant={movement.type === "in" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {movement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{movement.quantity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

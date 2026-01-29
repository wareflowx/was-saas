import { ArrowLeft, Package, Truck, User, Calendar, Barcode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from "@tanstack/react-router"
import type { Order } from "@/types/entities"

interface OrderDetailPageProps {
  order: Order
}

export function OrderDetailPage({ order }: OrderDetailPageProps) {
  const navigate = useNavigate()

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: {
        label: "Pending",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      },
      confirmed: {
        label: "Confirmed",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500",
      },
      picking: {
        label: "Picking",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-500/10 border border-purple-500/20 text-purple-500",
      },
      picked: {
        label: "Picked",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-500",
      },
      packing: {
        label: "Packing",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-500",
      },
      packed: {
        label: "Packed",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-teal-500/10 border border-teal-500/20 text-teal-500",
      },
      shipped: {
        label: "Shipped",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-500/10 border border-green-500/20 text-green-500",
      },
      delivered: {
        label: "Delivered",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-500",
      },
      cancelled: {
        label: "Cancelled",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-500",
      },
    }

    const config = statusConfig[status] || { label: status, className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500" }
    return <span className={config.className}>{config.label}</span>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; className: string }> = {
      urgent: {
        label: "Urgent",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-500",
      },
      high: {
        label: "High",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-orange-500/10 border border-orange-500/20 text-orange-500",
      },
      medium: {
        label: "Medium",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500",
      },
      low: {
        label: "Low",
        className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500",
      },
    }

    const config = priorityConfig[priority] || { label: priority, className: "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-500/10 border border-gray-500/20 text-gray-500" }
    return <span className={config.className}>{config.label}</span>
  }

  const getLineStatusBadge = (pickedQty: number, totalQty: number) => {
    if (pickedQty === 0) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">Pending</span>
    } else if (pickedQty < totalQty) {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-500">Partial</span>
    } else {
      return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500">Picked</span>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/orders" })}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      {/* Order Header Card */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              {getStatusBadge(order.status)}
              {getPriorityBadge(order.priority)}
            </div>
            <p className="text-sm text-muted-foreground">
              Order ID: {order.id}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>
        </div>
      </Card>

      {/* Order Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Customer Info */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Customer Name</p>
              <p className="text-sm font-medium">{order.customerName}</p>
            </div>
            {order.customerEmail && (
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{order.customerEmail}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Customer ID</p>
              <p className="text-sm font-medium">{order.customerId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium">{order.shippingAddress}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">City</p>
              <p className="text-sm font-medium">{order.shippingCity}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="text-sm font-medium">{order.shippingCountry}</p>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-xs text-muted-foreground">Tracking Number</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <Barcode className="h-3 w-3" />
                  {order.trackingNumber}
                </p>
              </div>
            )}
            {order.carrier && (
              <div>
                <p className="text-xs text-muted-foreground">Carrier</p>
                <p className="text-sm font-medium">{order.carrier}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates & Warehouse */}
        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dates & Warehouse
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Order Date</p>
              <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Required Date</p>
              <p className="text-sm font-medium">{new Date(order.requiredDate).toLocaleDateString()}</p>
            </div>
            {order.promisedDate && (
              <div>
                <p className="text-xs text-muted-foreground">Promised Date</p>
                <p className="text-sm font-medium">{new Date(order.promisedDate).toLocaleDateString()}</p>
              </div>
            )}
            {order.shippedDate && (
              <div>
                <p className="text-xs text-muted-foreground">Shipped Date</p>
                <p className="text-sm font-medium">{new Date(order.shippedDate).toLocaleDateString()}</p>
              </div>
            )}
            {order.deliveredDate && (
              <div>
                <p className="text-xs text-muted-foreground">Delivered Date</p>
                <p className="text-sm font-medium">{new Date(order.deliveredDate).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                Warehouse
              </p>
              <p className="text-sm font-medium">{order.warehouseName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignees */}
      {(order.picker || order.packer) && (
        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Assigned Team
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex gap-6">
              {order.picker && (
                <div>
                  <p className="text-xs text-muted-foreground">Picker</p>
                  <p className="text-sm font-medium">{order.picker}</p>
                </div>
              )}
              {order.packer && (
                <div>
                  <p className="text-xs text-muted-foreground">Packer</p>
                  <p className="text-sm font-medium">{order.packer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Lines */}
      <Card className="p-4">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="h-4 w-4" />
            Order Lines ({order.lines.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Picked</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.lines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">{line.productSku}</TableCell>
                    <TableCell>{line.productName}</TableCell>
                    <TableCell className="text-right">{line.quantity}</TableCell>
                    <TableCell className="text-right">{line.pickedQuantity}</TableCell>
                    <TableCell className="text-right">{line.quantity - line.pickedQuantity}</TableCell>
                    <TableCell className="text-right">${line.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${line.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{getLineStatusBadge(line.pickedQuantity, line.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Line Totals */}
          <div className="mt-4 flex justify-end">
            <div className="space-y-1 text-right">
              <div className="text-sm text-muted-foreground">
                Total Quantity: <span className="font-medium text-foreground">{order.totalQuantity}</span>
              </div>
              <div className="text-lg font-bold">
                Total Amount: <span className="text-xl">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card className="p-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

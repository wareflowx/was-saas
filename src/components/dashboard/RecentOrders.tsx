import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  date: string
  customer: string
  status: "pending" | "processing" | "completed" | "cancelled"
  items: number
}

interface RecentOrdersProps {
  orders: Order[]
  className?: string
}

function getStatusVariant(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "secondary"
    case "processing":
      return "default"
    case "completed":
      return "outline"
    case "cancelled":
      return "destructive"
  }
}

export function RecentOrders({ orders, className }: RecentOrdersProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-sm">{order.date}</TableCell>
                  <TableCell className="text-sm">{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="text-xs">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{order.items}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

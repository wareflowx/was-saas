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
import { ArrowRight, ArrowLeft, ArrowUpDown } from "lucide-react"

interface Movement {
  id: string
  date: string
  product: string
  type: "in" | "out" | "transfer"
  quantity: number
  from?: string
  to?: string
}

interface RecentMovementsProps {
  movements: Movement[]
  className?: string
}

function getMovementIcon(type: Movement["type"]) {
  switch (type) {
    case "in":
      return <ArrowLeft className="h-4 w-4 text-green-600" />
    case "out":
      return <ArrowRight className="h-4 w-4 text-red-600" />
    case "transfer":
      return <ArrowUpDown className="h-4 w-4 text-blue-600" />
  }
}

function getMovementBadgeVariant(type: Movement["type"]) {
  switch (type) {
    case "in":
      return "default"
    case "out":
      return "secondary"
    case "transfer":
      return "outline"
  }
}

export function RecentMovements({
  movements,
  className,
}: RecentMovementsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Movements</CardTitle>
        <CardDescription>Latest stock movements</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No movements yet
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="text-sm">{movement.date}</TableCell>
                  <TableCell className="text-sm font-medium">
                    {movement.product}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      <Badge variant={getMovementBadgeVariant(movement.type)} className="text-xs">
                        {movement.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{movement.quantity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {movement.from && movement.to
                      ? `${movement.from} → ${movement.to}`
                      : movement.from || movement.to || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

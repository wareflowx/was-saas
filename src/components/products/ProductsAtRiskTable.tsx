import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AtRiskProduct {
  sku: string
  name: string
  category: string
  stockoutCount: number
  daysOutOfStock: number
  risk: "high" | "medium" | "low"
}

interface ProductsAtRiskTableProps {
  products: AtRiskProduct[]
  className?: string
}

function getRiskBadge(risk: string) {
  switch (risk) {
    case "high":
      return <Badge className="bg-red-500/10 border-red-500/20 text-red-500 text-xs h-5 px-2">High Risk</Badge>
    case "medium":
      return <Badge className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500 text-xs h-5 px-2">Medium</Badge>
    case "low":
      return <Badge className="bg-green-500/10 border-green-500/20 text-green-500 text-xs h-5 px-2">Low</Badge>
  }
}

export function ProductsAtRiskTable({
  products,
  className,
}: ProductsAtRiskTableProps) {
  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Products at Risk</CardTitle>
        <CardDescription className="text-xs">Frequent stockouts and low inventory</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground text-xs">SKU</TableHead>
              <TableHead className="text-muted-foreground text-xs">Name</TableHead>
              <TableHead className="text-muted-foreground text-xs">Category</TableHead>
              <TableHead className="text-muted-foreground text-xs text-right">Stockouts</TableHead>
              <TableHead className="text-muted-foreground text-xs text-right">Days Out</TableHead>
              <TableHead className="text-muted-foreground text-xs">Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground text-xs py-4">
                  No products at risk
                </TableCell>
              </TableRow>
            ) : (
              products.slice(0, 5).map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="text-muted-foreground text-xs">{product.sku}</TableCell>
                  <TableCell className="text-xs font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{product.category}</TableCell>
                  <TableCell className="text-muted-foreground text-xs text-right">{product.stockoutCount}</TableCell>
                  <TableCell className="text-muted-foreground text-xs text-right">{product.daysOutOfStock}</TableCell>
                  <TableCell>{getRiskBadge(product.risk)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface LowStockAlert {
  id: string
  product: string
  currentStock: number
  minStock: number
  location: string
  severity: "critical" | "warning"
}

interface LowStockAlertsProps {
  alerts: LowStockAlert[]
  className?: string
}

export function LowStockAlerts({ alerts, className }: LowStockAlertsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products below minimum stock level</CardDescription>
          </div>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No low stock alerts
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{alert.product}</p>
                    <Badge
                      variant={alert.severity === "critical" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{alert.currentStock}</p>
                  <p className="text-xs text-muted-foreground">
                    min: {alert.minStock}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

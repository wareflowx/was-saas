import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface CategoryMetric {
  category: string
  totalProducts: number
  totalStock: number
  percentage: number
  trend: "up" | "down" | "stable"
}

interface CategoryMetricsProps {
  metrics: CategoryMetric[]
  className?: string
}

export function CategoryMetrics({
  metrics,
  className,
}: CategoryMetricsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <span className="text-green-500 text-xs">↑</span>
      case "down":
        return <span className="text-red-500 text-xs">↓</span>
      case "stable":
        return <span className="text-gray-500 text-xs">→</span>
    }
  }

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Category Analysis</CardTitle>
        <CardDescription className="text-xs">Stock distribution and trends</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        {metrics.map((metric) => (
          <div key={metric.category} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{metric.category}</span>
                <Badge variant="outline" className="text-[10px] h-5 px-2">
                  {metric.totalProducts} items
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{metric.totalStock.toLocaleString()} units</span>
                {getTrendIcon(metric.trend)}
              </div>
            </div>
            <Progress value={metric.percentage} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

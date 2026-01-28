import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

interface StockEvolutionChartProps {
  data: Array<{
    date: string
    stock: number
  }>
  className?: string
}

export function StockEvolutionChart({ data, className }: StockEvolutionChartProps) {
  const chartConfig = {
    stock: {
      label: "Stock Level",
      color: "hsl(var(--chart))",
    },
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Stock Evolution</CardTitle>
            <CardDescription>Inventory levels over time</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="stock"
              type="natural"
              fill="var(--color-stock)"
              fillOpacity={0.4}
              stroke="var(--color-stock)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

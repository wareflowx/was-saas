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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

interface TopProductsChartProps {
  data: Array<{
    product: string
    movements: number
  }>
  className?: string
}

export function TopProductsChart({ data, className }: TopProductsChartProps) {
  const chartConfig = {
    movements: {
      label: "Movements",
      color: "hsl(var(--chart))",
    },
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Moving Products</CardTitle>
        <CardDescription>Most active products this period</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <YAxis
              dataKey="product"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="movements" fill="var(--color-movements)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

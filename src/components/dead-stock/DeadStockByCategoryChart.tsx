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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts"

interface DeadStockByCategoryChartProps {
  data: Array<{
    category: string
    value: number
    fill: string
  }>
}

export function DeadStockByCategoryChart({
  data,
}: DeadStockByCategoryChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      const colors = [
        "hsl(221, 83%, 53%)",
        "hsl(280, 65%, 60%)",
        "hsl(160, 60%, 45%)",
        "hsl(30, 80%, 55%)",
      ]
      acc[item.category] = {
        label: item.category,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Value by Category</CardTitle>
        <CardDescription className="text-xs">Dead stock value distribution</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart
            data={data}
            height={180}
            margin={{
              top: 20,
              right: 10,
              left: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="value"
              radius={4}
              fill="var(--color-desktop)"
            >
              {data.map((item, index) => {
                const colors = [
                  "hsl(221, 83%, 53%)",
                  "hsl(280, 65%, 60%)",
                  "hsl(160, 60%, 45%)",
                  "hsl(30, 80%, 55%)",
                ]
                return (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                )
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

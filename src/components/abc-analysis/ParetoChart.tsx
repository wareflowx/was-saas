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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Bar, BarChart, Cell } from "recharts"

interface ParetoChartProps {
  data: Array<{
    product: string
    cumulativePercent: number
    value: number
  }>
}

export function ParetoChart({ data }: ParetoChartProps) {
  const chartConfig = {
    cumulative: {
      label: "Cumulative %",
      color: "hsl(221, 83%, 53%)",
    },
    value: {
      label: "Value",
      color: "hsl(var(--muted))",
    },
  }

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Pareto Analysis (80/20)</CardTitle>
        <CardDescription className="text-xs">Cumulative value by product</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <LineChart
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
              dataKey="product"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--muted))"
              radius={[0, 0, 0, 0]}
              opacity={0.3}
            />
            <Line
              type="monotone"
              dataKey="cumulativePercent"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

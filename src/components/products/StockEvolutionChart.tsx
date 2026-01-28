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
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

interface StockEvolutionChartProps {
  data: Array<{
    date: string
    stock: number
  }>
  className?: string
}

export function StockEvolutionChart({
  data,
  className,
}: StockEvolutionChartProps) {
  const chartConfig = {
    stock: {
      label: "Stock Level",
      color: "hsl(221, 83%, 53%)",
    },
  }

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Stock Evolution</CardTitle>
        <CardDescription className="text-xs">Stock level over last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={data}
            height={200}
            margin={{
              top: 20,
              right: 10,
              left: 0,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Line
              dataKey="stock"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={{
                fill: "hsl(221, 83%, 53%)",
                r: 3,
              }}
              activeDot={{
                r: 5,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

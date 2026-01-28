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

interface OccupancyTrendsChartProps {
  data: Array<{
    date: string
    occupancy: number
  }>
  className?: string
}

export function OccupancyTrendsChart({
  data,
  className,
}: OccupancyTrendsChartProps) {
  const chartConfig = {
    occupancy: {
      label: "Occupancy Rate",
      color: "hsl(221, 83%, 53%)",
    },
  }

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Occupancy Trends</CardTitle>
        <CardDescription className="text-xs">Warehouse occupancy over time</CardDescription>
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
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value) => `${value}%`}
            />
            <Line
              dataKey="occupancy"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={{
                fill: "hsl(221, 83%, 53%)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

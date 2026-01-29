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

interface ZoneCapacityChartProps {
  data: Array<{
    zone: string
    occupancy: number
    fill: string
  }>
  className?: string
}

export function ZoneCapacityChart({
  data,
  className,
}: ZoneCapacityChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      const colors = [
        "hsl(142, 76%, 36%)",
        "hsl(38, 92%, 50%)",
        "hsl(0, 84%, 60%)",
        "hsl(221, 83%, 53%)",
        "hsl(280, 65%, 60%)",
        "hsl(160, 60%, 45%)",
      ]
      acc[item.zone] = {
        label: item.zone,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Capacity Utilization by Zone</CardTitle>
        <CardDescription className="text-xs">Top and bottom zones by occupancy rate</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart
            data={data}
            height={180}
            margin={{
              top: 10,
              right: 10,
              left: 40,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={true} horizontal={false} />
            <XAxis
              dataKey="zone"
              tickLine={false}
              axisLine={false}
              tick={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Occupancy"]}
            />
            <Bar dataKey="occupancy" radius={4} fill="var(--color-desktop)">
              {data.map((item, index) => {
                const getColor = (value: number) => {
                  if (value >= 90) return "hsl(0, 84%, 60%)" // red
                  if (value >= 70) return "hsl(38, 92%, 50%)" // orange
                  if (value >= 40) return "hsl(142, 76%, 36%)" // green
                  return "hsl(221, 83%, 53%)" // blue
                }
                return <Cell key={`cell-${index}`} fill={getColor(item.occupancy)} />
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

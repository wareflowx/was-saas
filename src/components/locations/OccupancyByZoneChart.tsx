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

interface OccupancyByZoneChartProps {
  data: Array<{
    zone: string
    occupancy: number
    fill: string
  }>
  className?: string
}

export function OccupancyByZoneChart({
  data,
  className,
}: OccupancyByZoneChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      const colors = [
        "hsl(221, 83%, 53%)",
        "hsl(280, 65%, 60%)",
        "hsl(160, 60%, 45%)",
        "hsl(30, 80%, 55%)",
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
        <CardTitle className="text-sm">Occupancy by Zone</CardTitle>
        <CardDescription className="text-xs">Occupancy rate per warehouse zone</CardDescription>
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
              dataKey="zone"
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
            {data.map((item, index) => {
              const colors = [
                "hsl(221, 83%, 53%)",
                "hsl(280, 65%, 60%)",
                "hsl(160, 60%, 45%)",
                "hsl(30, 80%, 55%)",
              ]
              return (
                <Bar
                  key={item.zone}
                  dataKey="occupancy"
                  fill={colors[index % colors.length]}
                  radius={4}
                />
              )
            })}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

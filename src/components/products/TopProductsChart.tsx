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
    name: string
    movements: number
    fill: string
  }>
  className?: string
}

export function TopProductsChart({
  data,
  className,
}: TopProductsChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      const colors = [
        "hsl(221, 83%, 53%)",
        "hsl(280, 65%, 60%)",
        "hsl(160, 60%, 45%)",
        "hsl(30, 80%, 55%)",
        "hsl(340, 75%, 55%)",
      ]
      acc[item.name] = {
        label: item.name,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Top Products</CardTitle>
        <CardDescription className="text-xs">Most moved products this month</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={data}
            height={200}
            layout="vertical"
            margin={{
              top: 10,
              right: 20,
              left: 60,
              bottom: 10,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis
              type="number"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={55}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            {data.map((item, index) => {
              const colors = [
                "hsl(221, 83%, 53%)",
                "hsl(280, 65%, 60%)",
                "hsl(160, 60%, 45%)",
                "hsl(30, 80%, 55%)",
                "hsl(340, 75%, 55%)",
              ]
              return (
                <Bar
                  key={item.name}
                  dataKey="movements"
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

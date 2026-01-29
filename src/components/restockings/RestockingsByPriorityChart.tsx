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

interface RestockingsByPriorityChartProps {
  data: Array<{
    priority: string
    count: number
    fill: string
  }>
  className?: string
}

export function RestockingsByPriorityChart({
  data,
  className,
}: RestockingsByPriorityChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      const colors = [
        "hsl(0, 84%, 60%)",
        "hsl(38, 92%, 50%)",
        "hsl(142, 76%, 36%)",
        "hsl(221, 83%, 53%)",
      ]
      acc[item.priority] = {
        label: item.priority,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Restockings by Priority</CardTitle>
        <CardDescription className="text-xs">Count by priority level</CardDescription>
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
              dataKey="priority"
              tickLine={false}
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
              formatter={(value: number) => [value, "Restockings"]}
            />
            <Bar dataKey="count" radius={4}>
              {data.map((item, index) => {
                return <Cell key={`cell-${index}`} fill={item.fill} />
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

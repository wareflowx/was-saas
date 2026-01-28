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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Pie, PieChart, Cell } from "recharts"

interface DeadStockBySeverityChartProps {
  data: Array<{
    severity: string
    count: number
    fill: string
  }>
}

export function DeadStockBySeverityChart({
  data,
}: DeadStockBySeverityChartProps) {
  const colors = ["hsl(0, 84%, 60%)", "hsl(30, 80%, 55%)", "hsl(142, 76%, 36%)"]

  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.severity] = {
        label: item.severity,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">By Severity</CardTitle>
        <CardDescription className="text-xs">Priority level breakdown</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip content={<ChartTooltipContent nameKey="severity" />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="severity"
              outerRadius={60}
              label={(props) => {
                const color = colors[props.index % colors.length]
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    fill={color}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    className="text-[10px] font-medium"
                  >
                    {props.payload.severity}
                  </text>
                )
              }}
            >
              {data.map((entry, index) => (
                <Cell key={entry.severity} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="severity" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

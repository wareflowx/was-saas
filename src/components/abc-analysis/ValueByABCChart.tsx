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

interface ValueByABCChartProps {
  data: Array<{
    abc: string
    value: number
    fill: string
  }>
}

export function ValueByABCChart({ data }: ValueByABCChartProps) {
  const colors = [
    "hsl(221, 83%, 53%)",
    "hsl(280, 65%, 60%)",
    "hsl(160, 60%, 45%)",
  ]

  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.abc] = {
        label: `Class ${item.abc}`,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Value by ABC Class</CardTitle>
        <CardDescription className="text-xs">Stock value distribution</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px]"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip content={<ChartTooltipContent nameKey="abc" />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="abc"
              outerRadius={70}
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
                    {props.payload.abc}
                  </text>
                )
              }}
            >
              {data.map((entry, index) => (
                <Cell key={entry.abc} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="abc" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

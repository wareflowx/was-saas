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

interface MisplacedItemsByZoneChartProps {
  data: Array<{
    zone: string
    count: number
    fill: string
  }>
}

export function MisplacedItemsByZoneChart({
  data,
}: MisplacedItemsByZoneChartProps) {
  const colors = [
    "hsl(221, 83%, 53%)",
    "hsl(280, 65%, 60%)",
    "hsl(160, 60%, 45%)",
    "hsl(30, 80%, 55%)",
  ]

  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.zone] = {
        label: item.zone,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">By Current Zone</CardTitle>
        <CardDescription className="text-xs">Current zone distribution</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip content={<ChartTooltipContent nameKey="zone" />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="zone"
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
                    {props.payload.zone}
                  </text>
                )
              }}
            >
              {data.map((entry, index) => (
                <Cell key={entry.zone} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="zone" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

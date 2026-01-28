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
import { PieChart, Pie, Cell } from "recharts"

interface ZoneDistributionChartProps {
  data: Array<{
    zone: string
    count: number
    fill: string
  }>
  className?: string
}

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(280, 65%, 60%)",
  "hsl(160, 60%, 45%)",
  "hsl(30, 80%, 55%)",
]

export function ZoneDistributionChart({
  data,
  className,
}: ZoneDistributionChartProps) {
  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.zone] = {
        label: item.zone,
        color: COLORS[index % COLORS.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Products by Zone</CardTitle>
        <CardDescription className="text-xs">Distribution across warehouse zones</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="zone" />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="zone"
              label={(props) => {
                const color = COLORS[props.index % COLORS.length]
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

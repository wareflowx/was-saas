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
  ChartLegendContent,
  ChartLegend,
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"

interface LocationTypeDistributionChartProps {
  data: Array<{
    type: string
    count: number
    fill: string
  }>
  className?: string
}

export function LocationTypeDistributionChart({
  data,
  className,
}: LocationTypeDistributionChartProps) {
  const colors = [
    "hsl(221, 83%, 53%)",
    "hsl(280, 65%, 60%)",
    "hsl(160, 60%, 45%)",
    "hsl(30, 80%, 55%)",
  ]

  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.type] = {
        label: item.type,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Location Type Distribution</CardTitle>
        <CardDescription>Distribution by storage type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              label={(props) => {
                const colors = [
                  "hsl(221, 83%, 53%)",
                  "hsl(280, 65%, 60%)",
                  "hsl(160, 60%, 45%)",
                  "hsl(30, 80%, 55%)",
                ]
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
                    className="text-sm font-medium"
                  >
                    {props.payload.type}
                  </text>
                )
              }}
            />
            <ChartLegend content={<ChartLegendContent nameKey="type" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

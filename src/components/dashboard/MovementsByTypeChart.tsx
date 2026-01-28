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

interface MovementsByTypeChartProps {
  data: Array<{
    movementType: string
    movements: number
    fill: string
  }>
  className?: string
}

export function MovementsByTypeChart({
  data,
  className,
}: MovementsByTypeChartProps) {
  const chartConfig = data.reduce(
    (acc, item) => {
      acc[item.movementType] = {
        label: item.movementType,
        color: item.fill,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Movements by Type</CardTitle>
        <CardDescription>Distribution of movement types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="movementType" />}
            />
            <Pie
              data={data}
              dataKey="movements"
              label
              nameKey="movementType"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="movementType" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

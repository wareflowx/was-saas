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

interface ProductsByCategoryChartProps {
  data: Array<{
    category: string
    count: number
    fill: string
  }>
  className?: string
}

export function ProductsByCategoryChart({
  data,
  className,
}: ProductsByCategoryChartProps) {
  const colors = [
    "hsl(221, 83%, 53%)",
    "hsl(280, 65%, 60%)",
    "hsl(160, 60%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(340, 75%, 55%)",
  ]

  const chartConfig = data.reduce(
    (acc, item, index) => {
      acc[item.category] = {
        label: item.category,
        color: colors[index % colors.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>
  )

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Products by Category</CardTitle>
        <CardDescription className="text-xs">Distribution across product categories</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[180px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
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
                    {props.payload.category}
                  </text>
                )
              }}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="category" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

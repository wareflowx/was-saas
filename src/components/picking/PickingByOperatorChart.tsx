"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { PickingOperatorPerformance } from "./types"

export const description = "A bar chart showing picking performance by operator"

const chartConfig = {
  lines: {
    label: "Lines Picked",
    color: "hsl(var(--chart-1))",
  },
  avgDuration: {
    label: "Avg Duration",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface PickingByOperatorChartProps {
  data: PickingOperatorPerformance[]
}

export function PickingByOperatorChart({ data }: PickingByOperatorChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Picking by Operator</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer={false}
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="operator"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="lines" fill="var(--color-lines)" radius={4} />
            <Bar dataKey="avgDuration" fill="var(--color-avgDuration)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

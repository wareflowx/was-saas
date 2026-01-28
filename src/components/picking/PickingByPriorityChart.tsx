"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { PickingPriorityDistribution } from "./types"

export const description = "A bar chart showing picking by priority level"

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
  avgDuration: {
    label: "Avg Duration",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface PickingByPriorityChartProps {
  data: PickingPriorityDistribution[]
}

export function PickingByPriorityChart({ data }: PickingByPriorityChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Picking by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer={false}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="priority"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            <Bar dataKey="avgDuration" fill="var(--color-avgDuration)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

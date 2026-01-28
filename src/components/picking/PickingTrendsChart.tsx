"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { PickingTrendData } from "./types"

export const description = "A line chart showing picking trends over time"

const chartConfig = {
  totalLines: {
    label: "Total Lines",
    color: "hsl(var(--color-totalLines))",
  },
  completedLines: {
    label: "Completed Lines",
    color: "hsl(var(--color-completedLines))",
  },
  avgDuration: {
    label: "Avg Duration",
    color: "hsl(var(--color-avgDuration))",
  },
} satisfies ChartConfig

interface PickingTrendsChartProps {
  data: PickingTrendData[]
  period: "today" | "week" | "month"
}

export function PickingTrendsChart({ data, period }: PickingTrendsChartProps) {
  const title = {
    today: "Picking Trends - Today",
    week: "Picking Trends - This Week",
    month: "Picking Trends - This Month",
  }[period]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer={false}
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
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
            <Line
              type="monotone"
              dataKey="totalLines"
              stroke="var(--color-totalLines)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="completedLines"
              stroke="var(--color-completedLines)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="avgDuration"
              stroke="var(--color-avgDuration)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

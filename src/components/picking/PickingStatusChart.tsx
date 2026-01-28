"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { PickingStatusDistribution } from "./types"

export const description = "A pie chart showing picking status distribution"

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--muted))",
  },
  assigned: {
    label: "Assigned",
    color: "hsl(var(--primary))",
  },
  in_progress: {
    label: "In Progress",
    color: "hsl(45, 100%, 70%)",
  },
  completed: {
    label: "Completed",
    color: "hsl(142, 70%, 50%)",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(0, 80%, 70%)",
  },
  partial: {
    label: "Partial",
    color: "hsl(25, 90%, 70%)",
  },
  error: {
    label: "Error",
    color: "hsl(0, 80%, 60%)",
  },
} satisfies ChartConfig

interface PickingStatusChartProps {
  data: PickingStatusDistribution[]
}

export function PickingStatusChart({ data }: PickingStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Picking by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart className="mx-auto max-h-[250px]">
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              dataKey="count"
              name="status"
              label
              labelLine={false}
              radius={80}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

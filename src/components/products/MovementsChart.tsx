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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface MovementsChartProps {
  data: Array<{
    date: string
    in: number
    out: number
  }>
  className?: string
}

export function MovementsChart({
  data,
  className,
}: MovementsChartProps) {
  const chartConfig = {
    in: {
      label: "Stock In",
      color: "hsl(160, 60%, 45%)",
    },
    out: {
      label: "Stock Out",
      color: "hsl(30, 80%, 55%)",
    },
  }

  return (
    <Card className={className + " p-4"}>
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm">Stock Movements</CardTitle>
        <CardDescription className="text-xs">Inbound vs Outbound last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 0,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="in" fill="hsl(160, 60%, 45%)" radius={2} />
              <Bar dataKey="out" fill="hsl(30, 80%, 55%)" radius={2} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

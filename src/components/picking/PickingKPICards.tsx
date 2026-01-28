import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideProps } from "lucide-react"

interface PickingKPICardsProps {
  totalLines: number
  completedLines: number
  pendingLines: number
  completionRate: number
  className?: string
}

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ComponentType<LucideProps>
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

function KPICard({ title, value, icon: Icon, trend, description }: KPICardProps) {
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span
              className={
                trend.isPositive ? "text-green-600 font-medium" : "text-red-600 font-medium"
              }
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>{" "}
            vs last period
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function PickingKPICards({
  totalLines,
  completedLines,
  pendingLines,
  completionRate,
  className,
}: PickingKPICardsProps) {
  return (
    <div className={className}>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Lines"
          value={totalLines}
          icon={() => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          )}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Completed"
          value={completedLines}
          icon={() => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          description="Today"
        />
        <KPICard
          title="Pending"
          value={pendingLines}
          icon={() => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          )}
          description="Awaiting pick"
        />
        <KPICard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={() => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          )}
          description="Today"
        />
      </div>
    </div>
  )
}

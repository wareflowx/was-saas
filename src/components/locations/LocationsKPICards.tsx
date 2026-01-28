import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideProps } from "lucide-react"

interface LocationsKPICardsProps {
  totalLocations: number
  occupancyRate: number
  availableLocations: number
  fullLocations: number
  activeZones: number
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

export function LocationsKPICards({
  totalLocations,
  occupancyRate,
  availableLocations,
  fullLocations,
  className,
}: Omit<LocationsKPICardsProps, "activeZones">) {
  return (
    <div className={className}>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Locations"
          value={totalLocations}
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
              <path d="M3 3h18v18H3z" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          )}
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
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
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          )}
          description="Global occupancy"
        />
        <KPICard
          title="Available"
          value={availableLocations}
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
              <path d="M12 6v6l4 2" />
            </svg>
          )}
          description="Ready for inventory"
        />
        <KPICard
          title="Full Locations"
          value={fullLocations}
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          )}
          description="100% occupied"
        />
      </div>
    </div>
  )
}

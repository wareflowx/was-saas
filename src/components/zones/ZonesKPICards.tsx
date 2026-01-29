import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ZonesData } from "@/types/entities"

interface ZonesKPICardsProps {
  kpis: ZonesData["kpis"]
  className?: string
}

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

function KPICard({ title, value, icon: Icon, description }: KPICardProps) {
  return (
    <Card className="p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function ZonesKPICards({ kpis, className }: ZonesKPICardsProps) {
  const occupancyRate = kpis.totalCapacity > 0
    ? ((kpis.usedCapacity / kpis.totalCapacity) * 100).toFixed(1)
    : "0.0"

  return (
    <div className={className}>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Zones"
          value={kpis.totalZones}
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          )}
          description={`${kpis.activeZones} active`}
        />
        <KPICard
          title="Total Surface"
          value={`${kpis.totalSurface.toLocaleString()} m²`}
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          )}
          description={`${Math.round(kpis.totalSurface / kpis.totalZones)} m² per zone`}
        />
        <KPICard
          title="Total Capacity"
          value={`${kpis.totalCapacity.toLocaleString()} slots`}
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
              <path d="M3 21h18" />
              <path d="M5 21V7h4v14" />
              <path d="M9 21V10h6v11" />
              <path d="M15 21V3h4v18" />
            </svg>
          )}
          description={`${((kpis.usedCapacity / kpis.totalCapacity) * 100).toFixed(1)}% utilized`}
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
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          )}
          description={`${kpis.usedCapacity.toLocaleString()} used`}
        />
      </div>
    </div>
  )
}

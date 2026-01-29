import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LocationsData } from "@/types/entities"

interface LocationsKPICardsProps {
  kpis: LocationsData["kpis"]
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

export function LocationsKPICards({ kpis }: LocationsKPICardsProps) {
  const occupancyRate = kpis.totalCapacity > 0
    ? ((kpis.usedCapacity / kpis.totalCapacity) * 100).toFixed(1)
    : "0.0"

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Locations"
        value={kpis.totalLocations}
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
      />
      <KPICard
        title="Occupied"
        value={kpis.occupiedLocations}
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        )}
      />
      <KPICard
        title="Available"
        value={kpis.availableLocations}
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
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        )}
        description={`${kpis.usedCapacity.toLocaleString()} / ${kpis.totalCapacity.toLocaleString()}`}
      />
    </div>
  )
}

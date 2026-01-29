import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SectorsData } from "@/types/entities"

interface SectorsKPICardsProps {
  kpis: SectorsData["kpis"]
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

export function SectorsKPICards({ kpis, className }: SectorsKPICardsProps) {
  const occupancyRate = kpis.totalCapacity > 0
    ? ((kpis.usedCapacity / kpis.totalCapacity) * 100).toFixed(1)
    : "0.0"
  const inactiveCount = kpis.totalSectors - kpis.activeSectors

  return (
    <div className={className}>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Sectors"
          value={kpis.totalSectors}
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
              <line x1="3.27" x2="20.73" y1="6.96" y2="17.04" />
              <line x1="12" y1="22.08" x2="12" y2="2" />
            </svg>
          )}
          description={`${kpis.activeSectors} active, ${inactiveCount} inactive`}
        />
        <KPICard
          title="Total Capacity"
          value={kpis.totalCapacity.toLocaleString()}
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
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          )}
          description={`${Math.round(kpis.totalCapacity / kpis.totalSectors)} per sector`}
        />
        <KPICard
          title="Used Capacity"
          value={kpis.usedCapacity.toLocaleString()}
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
          description={`${occupancyRate}% utilized`}
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
              <line x1="12" x2="12" y1="20" y2="10" />
              <line x1="18" x2="18" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="16" />
            </svg>
          )}
          description={`${kpis.usedCapacity.toLocaleString()} occupied`}
        />
      </div>
    </div>
  )
}

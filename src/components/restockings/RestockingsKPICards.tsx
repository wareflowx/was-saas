import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RestockingsKPICardsProps {
  kpis: any
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

export function RestockingsKPICards({ kpis }: RestockingsKPICardsProps) {
  const completionRate = Math.round((kpis.completedRestockings / kpis.totalRestockings) * 100)

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total Restockings"
        value={kpis.totalRestockings}
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
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" x2="12" y1="22.08" y2="12" />
          </svg>
        )}
        description="All restock requests"
      />
      <KPICard
        title="Pending"
        value={kpis.pendingRestockings}
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
        description={`${kpis.pendingProducts} products`}
      />
      <KPICard
        title="In Progress"
        value={kpis.inProgressRestockings}
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
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        )}
        description="Being restocked"
      />
      <KPICard
        title="Completed"
        value={kpis.completedRestockings}
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
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        description={`${completionRate}% completion`}
      />
    </div>
  )
}

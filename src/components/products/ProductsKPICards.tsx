import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductsKPICardsProps {
  totalProducts: number
  lowStock: number
  outOfStock: number
  totalQuantity: number
  className?: string
}

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
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

export function ProductsKPICards({
  totalProducts,
  lowStock,
  outOfStock,
  totalQuantity,
  className,
}: ProductsKPICardsProps) {
  return (
    <div className={className}>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Products"
          value={totalProducts}
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
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Low Stock"
          value={lowStock}
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
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          )}
          description="Below minimum"
        />
        <KPICard
          title="Out of Stock"
          value={outOfStock}
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
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          )}
          description="Need reorder"
        />
        <KPICard
          title="Total Quantity"
          value={totalQuantity.toLocaleString()}
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
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          )}
          description="All units"
        />
      </div>
    </div>
  )
}

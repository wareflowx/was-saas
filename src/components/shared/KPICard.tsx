import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ReactElement } from "react"

interface KPICardProps {
  title: string
  value: string | number
  icon?: ReactElement
  trend?: {
    value: string | number
    label: string
  }
  description?: string
  className?: string
  iconClassName?: string
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  description,
  className,
  iconClassName,
}: KPICardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn("text-muted-foreground", iconClassName)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs mt-1 text-muted-foreground">
            {trend.value} {trend.label}
          </p>
        )}
        {description && !trend && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

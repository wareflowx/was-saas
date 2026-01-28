import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowUp } from "lucide-react"
import { type Priority } from "./types"
import { cn } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: Priority
  showLabel?: boolean
  className?: string
}

export function PriorityBadge({ priority, showLabel = true, className }: PriorityBadgeProps) {
  const config = {
    low: {
      variant: "outline" as const,
      icon: null,
      label: "Low",
      color: "text-blue-600 border-blue-600",
    },
    medium: {
      variant: "outline" as const,
      icon: AlertCircle,
      label: "Medium",
      color: "text-orange-600 border-orange-600",
    },
    high: {
      variant: "outline" as const,
      icon: ArrowUp,
      label: "High",
      color: "text-red-600 border-red-600",
    },
  }

  const { variant, icon: Icon, label, color } = config[priority]

  return (
    <Badge variant={variant} className={cn(color, className)}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {showLabel && <span className="capitalize">{label}</span>}
    </Badge>
  )
}

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Loader2, XCircle, AlertTriangle, Ban } from "lucide-react"
import { type PickingStatus } from "./types"
import { cn } from "@/lib/utils"

interface PickingStatusBadgeProps {
  status: PickingStatus
  showLabel?: boolean
  className?: string
}

export function PickingStatusBadge({ status, showLabel = true, className }: PickingStatusBadgeProps) {
  const config = {
    pending: {
      variant: "secondary" as const,
      icon: Clock,
      label: "Pending",
      color: "text-gray-600",
    },
    assigned: {
      variant: "default" as const,
      icon: CheckCircle,
      label: "Assigned",
      color: "text-blue-600",
    },
    in_progress: {
      variant: "default" as const,
      icon: Loader2,
      label: "In Progress",
      color: "text-yellow-600 animate-spin",
    },
    completed: {
      variant: "default" as const,
      icon: CheckCircle,
      label: "Completed",
      color: "text-green-600",
    },
    cancelled: {
      variant: "outline" as const,
      icon: Ban,
      label: "Cancelled",
      color: "text-red-600",
    },
    partial: {
      variant: "secondary" as const,
      icon: AlertTriangle,
      label: "Partial",
      color: "text-orange-600",
    },
    error: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Error",
      color: "text-red-600",
    },
  }

  const { variant, icon: Icon, label, color } = config[status]

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)}>
      <Icon className={cn("h-3.5 w-3.5", color)} />
      {showLabel && <span className="capitalize">{label}</span>}
    </Badge>
  )
}

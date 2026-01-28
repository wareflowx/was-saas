import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  picked: number
  required: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProgressBar({
  picked,
  required,
  showLabel = true,
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.round((picked / required) * 100)
  const isComplete = picked >= required

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Progress
        value={percentage}
        className={cn(sizeClasses[size], isComplete && "[&>div]:bg-green-600")}
      />
      {showLabel && (
        <p className="text-xs text-muted-foreground">
          {picked} / {required} ({percentage}%)
        </p>
      )}
    </div>
  )
}

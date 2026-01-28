import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Period = "today" | "week" | "month" | "custom"

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
  className?: string
}

const periods = [
  { value: "today" as Period, label: "Today" },
  { value: "week" as Period, label: "This Week" },
  { value: "month" as Period, label: "This Month" },
  { value: "custom" as Period, label: "Custom" },
]

export function PeriodSelector({
  value,
  onChange,
  className,
}: PeriodSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">Period:</span>
      <div className="flex gap-2">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={value === period.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(period.value)}
          >
            {period.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

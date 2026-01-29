import { useState, useMemo } from "react"
import { Sparkles, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RestockingsKPICards } from "./RestockingsKPICards"
import { RestockingsTable } from "./RestockingsTable"
import { RestockingStatusChart } from "./RestockingStatusChart"
import { RestockingsByPriorityChart } from "./RestockingsByPriorityChart"
import type { RestockingsData } from "@/types/entities"

interface RestockingsPageProps {
  data: RestockingsData
}

export function RestockingsPage({ data }: RestockingsPageProps) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    const statusCounts: Record<string, number> = {
      pending: data.kpis.pendingRestockings,
      in_progress: data.kpis.inProgressRestockings,
      completed: data.kpis.completedRestockings,
    }

    const colors = [
      "hsl(38, 92%, 50%)", // pending - orange
      "hsl(221, 83%, 53%)", // in_progress - blue
      "hsl(142, 76%, 36%)", // completed - green
    ]

    const labels: Record<string, string> = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
    }

    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count], index) => ({
        status: labels[status] || status,
        count,
        fill: colors[index % colors.length],
      }))
  }, [data.kpis])

  // Calculate priority distribution
  const priorityDistribution = useMemo(() => {
    const priorityMap = new Map<string, number>()

    data.restockings.forEach((restocking) => {
      priorityMap.set(restocking.priority, (priorityMap.get(restocking.priority) || 0) + 1)
    })

    const colors: Record<string, string> = {
      high: "hsl(0, 84%, 60%)",
      medium: "hsl(38, 92%, 50%)",
      low: "hsl(221, 83%, 53%)",
    }

    const labels: Record<string, string> = {
      high: "High",
      medium: "Medium",
      low: "Low",
    }

    return Array.from(priorityMap.entries())
      .map(([priority, count]) => ({
        priority: labels[priority] || priority,
        count,
        fill: colors[priority] || "hsl(0, 0%, 50%)",
      }))
      .sort((a, b) => b.count - a.count)
  }, [data.restockings])

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border bg-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Manage restocking operations</span> and maintain optimal inventory levels efficiently.
          </p>
        </div>
        <button
          onClick={() => setIsInfoDialogOpen(true)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* KPIs */}
      <RestockingsKPICards kpis={data.kpis} />

      {/* Charts Row */}
      <div className="grid gap-2 md:grid-cols-2">
        <RestockingStatusChart data={statusDistribution} />
        <RestockingsByPriorityChart data={priorityDistribution} />
      </div>

      {/* Restockings Table */}
      <RestockingsTable restockings={data.restockings} />

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Restocking Management</DialogTitle>
            <DialogDescription>
              Track and manage inventory replenishment from request to completion
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Top Row - 2 Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">KPIs</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Total Restockings</p>
                      <p className="text-muted-foreground">All restock requests</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Pending</p>
                      <p className="text-muted-foreground">Awaiting processing</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-semibold text-sm">Progress Tracking</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">In Progress</p>
                      <p className="text-muted-foreground">Currently restocking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Completed</p>
                      <p className="text-muted-foreground">Successfully restocked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row - 1 Card */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-sm">Restockings Table</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Monitor all restocking operations with real-time progress tracking and product details.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Filters</p>
                      <p className="text-muted-foreground">Status and priority</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Search</p>
                      <p className="text-muted-foreground">Find by number or warehouse</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Actions</p>
                      <p className="text-muted-foreground">View details and assign</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

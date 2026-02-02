import { createFileRoute, Navigate } from "@tanstack/react-router"
import { useWarehouses } from "@/hooks/use-locations"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const { data: warehouses, isLoading, isError } = useWarehouses()

  // Loading state while checking for warehouses
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Setting up Wareflow...</p>
        </div>
      </div>
    )
  }

  // Error handling - fallback to onboarding
  if (isError) {
    return <Navigate to="/onboarding/welcome" replace />
  }

  // Conditional redirection based on warehouse existence
  const hasWarehouses = warehouses && warehouses.length > 0

  if (hasWarehouses) {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/onboarding/welcome" replace />
}

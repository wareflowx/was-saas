import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { UsersPage } from "@/components/users/UsersPage"
import { useUsers, useWarehouses } from "@/hooks/use-locations"
import { useEffect } from "react"

export const Route = createFileRoute("/operators")({
  component: OperatorsRoute,
})

function OperatorsRoute() {
  const navigate = useNavigate()

  // Fetch warehouses to get default warehouse ID
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses()

  // Redirect to onboarding if no warehouses exist (after loading completes)
  useEffect(() => {
    if (!isLoadingWarehouses && warehouses && warehouses.warehouses.length === 0) {
      navigate({ to: "/onboarding/welcome" })
    }
  }, [isLoadingWarehouses, warehouses, navigate])

  // Fetch users data from backend (all users from all warehouses)
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error,
  } = useUsers(undefined) // Pass undefined to get all users from all warehouses

  // Loading state
  if (isLoadingWarehouses || isLoadingUsers) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading operators...</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // Error state
  if (error) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-destructive">Error loading operators: {error.message}</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No data state - only show this after loading is complete
  // Don't show during initial loading (isLoadingWarehouses handles that)
  if (!isLoadingWarehouses && (!usersData || !warehouses || warehouses.warehouses.length === 0)) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No operators found. Please complete the setup first.
              </div>
              <button
                onClick={() => navigate({ to: "/onboarding/welcome" })}
                className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                Go to Setup
              </button>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[back-filter]:bg-background/60 px-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>
          <div className="p-8">
            <UsersPage data={usersData} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

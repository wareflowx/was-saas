import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Application settings</p>
      </div>

      <div className="border rounded-lg p-8">
        <p className="text-muted-foreground">Settings coming soon...</p>
      </div>
    </div>
  )
}

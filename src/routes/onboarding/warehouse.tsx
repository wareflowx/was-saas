import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, Building2, MapPin } from "lucide-react"

export const Route = createFileRoute("/onboarding/warehouse")({
  component: WarehouseSetup,
})

function WarehouseSetup() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      {/* Lignes pointillées horizontales */}
      <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-border -translate-y-1/2" />
      <div className="absolute top-0 left-1/2 right-0 h-px border-t border-dashed border-border" />
      <div className="absolute bottom-0 left-1/2 right-0 h-px border-t border-dashed border-border" />

      {/* Lignes pointillées verticales */}
      <div className="absolute top-0 left-1/3 bottom-0 w-px border-l border-dashed border-border" />
      <div className="absolute top-0 left-2/3 bottom-0 w-px border-l border-dashed border-border" />

      {/* Box centrale */}
      <div className="relative z-10 w-full max-w-lg bg-background border p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/onboarding/welcome"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </Link>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Setup Your Warehouse</h1>
          <p className="text-muted-foreground">
            Configure your first workspace to get started
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-2 bg-primary" />
          <div className="flex-1 h-2 bg-primary" />
          <div className="flex-1 h-2 bg-muted" />
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Warehouse Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4 text-primary" />
              Warehouse Name
            </label>
            <input
              type="text"
              placeholder="My First Warehouse"
              className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              Location <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Paris, France"
              className="w-full px-4 py-3 bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Skip Option */}
          <div className="flex items-center gap-3 p-4 border hover:bg-accent/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              id="skip-setup"
              className="w-5 h-5 rounded border-2 border-primary focus:ring-2 focus:ring-primary/50"
            />
            <label htmlFor="skip-setup" className="flex-1 cursor-pointer">
              <div className="font-medium">I'll configure this later</div>
              <div className="text-sm text-muted-foreground">
                Skip warehouse setup and import data directly
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              to="/onboarding/import"
              className="flex-1 px-6 py-3 text-center rounded border hover:bg-accent transition-colors font-medium"
            >
              Skip
            </Link>
            <button
              onClick={() => navigate({ to: "/onboarding/import" })}
              className="flex-1 px-6 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 group"
            >
              Next
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            You can add multiple warehouses and change these settings later
          </p>
        </div>
      </div>
    </div>
  )
}

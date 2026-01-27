import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, Upload, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/onboarding/import")({
  component: DataImport,
})

type LoadingStep = {
  id: string
  label: string
  status: "pending" | "loading" | "complete"
}

function DataImport() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps: LoadingStep[] = [
    { id: "parse", label: "Parsing Solochain export file...", status: "pending" },
    { id: "products", label: "Processing products data...", status: "pending" },
    { id: "movements", label: "Processing movements data...", status: "pending" },
    { id: "orders", label: "Processing orders data...", status: "pending" },
    { id: "analyze", label: "Running initial analysis...", status: "pending" },
    { id: "complete", label: "Setup complete!", status: "pending" },
  ]

  const [loadingSteps, setLoadingSteps] = useState(steps)

  useEffect(() => {
    if (!isLoading) return

    const intervals = steps.map((step, index) => {
      return setTimeout(() => {
        setLoadingSteps((prev) => {
          const newSteps = [...prev]
          newSteps[index].status = "loading"
          return newSteps
        })
        setCurrentStep(index)

        // Complete after 800-1500ms
        setTimeout(() => {
          setLoadingSteps((prev) => {
            const newSteps = [...prev]
            newSteps[index].status = "complete"
            return newSteps
          })

          // Navigate to dashboard after last step
          if (index === steps.length - 1) {
            setTimeout(() => {
              navigate({ to: "/dashboard" })
            }, 500)
          }
        }, 800 + Math.random() * 700)
      }, index * 1500)
    })

    return () => intervals.forEach(clearTimeout)
  }, [isLoading])

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
      <div className="relative z-10 w-full max-w-2xl bg-background border p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/onboarding/warehouse"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back
          </Link>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Import Your Data</h1>
          <p className="text-muted-foreground">
            Upload your WMS export or start with demo data
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-2 bg-primary" />
          <div className="flex-1 h-2 bg-primary" />
          <div className="flex-1 h-2 bg-primary" />
        </div>

        {/* Upload Area */}
        <div>
          <div className="border-2 border-dashed p-12 text-center hover:border-primary/50 hover:bg-accent/5 transition-all cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">
                  Drop your Excel file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1 rounded">
                <FileSpreadsheet className="w-4 h-4" />
                .xlsx, .xls, .csv
              </div>
            </div>
          </div>
        </div>

        {/* Solochain WMS Option */}
        <div className="mt-6 p-6 border hover:bg-accent/50 transition-colors cursor-pointer">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              id="solochain"
              className="w-5 h-5 mt-1 rounded border-2 border-primary focus:ring-2 focus:ring-primary/50"
            />
            <label htmlFor="solochain" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2 font-medium mb-1">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Use Solochain as a template for your data
              </div>
              <div className="text-sm text-muted-foreground">
                Import your Solochain WMS export file
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Link
            to="/dashboard"
            className="flex-1 px-6 py-3 text-center rounded border hover:bg-accent transition-colors font-medium"
          >
            Skip Import
          </Link>
          <button
            onClick={() => setIsLoading(true)}
            className="flex-1 px-6 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 group"
          >
            Complete Setup
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            You can import data anytime from the dashboard
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300">
          <div className="w-full max-w-md bg-background border p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <h2 className="text-xl font-semibold">Setting up your workspace</h2>
            </div>

            <div className="space-y-4">
              {loadingSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  {step.status === "pending" && (
                    <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-muted" />
                  )}
                  {step.status === "loading" && (
                    <Loader2 className="w-5 h-5 mt-0.5 text-primary animate-spin" />
                  )}
                  {step.status === "complete" && (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500" />
                  )}
                  <div
                    className={`flex-1 ${
                      step.status === "complete" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                This will only take a moment...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

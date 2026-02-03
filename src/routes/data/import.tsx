import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, FlaskConical, Database, Clock, FileText, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useBackend } from "@/hooks/use-backend"
import { useWarehouses } from "@/hooks/use-locations"
import { useImportHistory } from "@/hooks/use-locations"

export const Route = createFileRoute("/data/import")({
  component: DataImportPage,
})

type LoadingStep = {
  id: string
  label: string
  status: "pending" | "loading" | "complete"
}

function DataImportPage() {
  const navigate = useNavigate()
  const backend = useBackend()
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses()
  const { data: importHistory, isLoading: isLoadingHistory } = useImportHistory()
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [useMockData, setUseMockData] = useState(false)

  // Set default warehouse when warehouses are loaded
  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !selectedWarehouseId) {
      setSelectedWarehouseId(warehouses[0].id as string)
    }
  }, [warehouses, selectedWarehouseId])

  const steps: LoadingStep[] = [
    { id: "validate", label: "Validating warehouse...", status: "pending" },
    { id: "generate", label: useMockData ? "Generating mock data..." : "Parsing Excel file...", status: "pending" },
    { id: "products", label: "Processing products data...", status: "pending" },
    { id: "movements", label: "Processing movements data...", status: "pending" },
    { id: "analyze", label: "Running analysis...", status: "pending" },
    { id: "complete", label: "Import complete!", status: "pending" },
  ]

  const [loadingSteps, setLoadingSteps] = useState(steps)

  useEffect(() => {
    if (!isLoading) return

    const runImport = async () => {
      if (!selectedWarehouseId) {
        setIsLoading(false)
        return
      }

      for (let index = 0; index < steps.length; index++) {
        setLoadingSteps((prev) => {
          const newSteps = [...prev]
          newSteps[index].status = "loading"
          return newSteps
        })

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

        // Actual data generation for mock data option
        if (index === 1 && useMockData) {
          try {
            await backend.generateMockData(selectedWarehouseId)
          } catch (error) {
            console.error('Error generating mock data:', error)
          }
        }

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
      }
    }

    runImport()
  }, [isLoading, useMockData, selectedWarehouseId])

  // Loading state for warehouses
  if (isLoadingWarehouses) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-muted-foreground">Loading warehouses...</div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  // No warehouses state
  if (!warehouses || warehouses.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground mb-4">
                No warehouses found. Please create a warehouse first.
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  return (
    <>
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>

          <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Import Data</h1>
              <p className="text-muted-foreground">
                Import warehouse data from external sources or generate test data
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Import Panel */}
              <div className="lg:col-span-2">
                <div className="bg-background border p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">New Import</h2>

                  {/* Warehouse Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Target Warehouse</label>
                    <select
                      value={selectedWarehouseId}
                      onChange={(e) => setSelectedWarehouseId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      disabled={isLoading}
                    >
                      {warehouses.map((wh: any) => (
                        <option key={wh.id} value={wh.id}>
                          {wh.name} ({wh.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed p-12 text-center transition-all cursor-pointer mb-6 ${useMockData ? 'opacity-50 pointer-events-none' : 'hover:border-primary/50 hover:bg-accent/5'}`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
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

                  {/* Mock Data Option */}
                  <div
                    className={`p-6 border transition-colors cursor-pointer ${useMockData ? 'bg-primary/10 border-primary' : 'hover:bg-accent/50'}`}
                    onClick={() => setUseMockData(!useMockData)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        id="mock-data"
                        checked={useMockData}
                        onChange={() => setUseMockData(!useMockData)}
                        className="w-5 h-5 mt-1 rounded border-2 border-primary focus:ring-2 focus:ring-primary/50"
                        disabled={isLoading}
                      />
                      <label htmlFor="mock-data" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium mb-1">
                          <FlaskConical className="w-5 h-5 text-primary" />
                          Generate test data for exploration
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Create realistic mock data to explore the application without needing a real WMS export
                        </div>
                        {useMockData && (
                          <div className="mt-3 p-3 bg-background rounded border">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                              <Database className="w-4 h-4" />
                              Test data includes:
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                              <div>• <strong>3 Warehouses</strong> (Paris, Madrid, Brussels)</div>
                              <div>• <strong>8 Users</strong> (Admin, Managers, Pickers)</div>
                              <div>• <strong>8 Suppliers</strong> (international)</div>
                              <div>• <strong>12 Customers</strong> (B2B/B2C)</div>
                              <div>• <strong>50 Products</strong> (10 categories)</div>
                              <div>• <strong>15-20 Purchase Orders</strong> + receptions</div>
                              <div>• <strong>200 Movements</strong> (90 days)</div>
                              <div>• <strong>30-40 Orders</strong> + pickings</div>
                              <div>• <strong>Shipments</strong> with carrier tracking</div>
                              <div>• <strong>5-10 Returns</strong> (customer)</div>
                              <div>• <strong>10-15 Restockings</strong> (internal)</div>
                              <div>• <strong>ABC Analysis</strong> ready</div>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setIsLoading(true)}
                    disabled={isLoading || !selectedWarehouseId}
                    className="w-full mt-6 px-6 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Start Import
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Import History Panel */}
              <div className="lg:col-span-1">
                <div className="bg-background border p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Import History
                  </h2>

                  {isLoadingHistory ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading history...
                    </div>
                  ) : !importHistory || importHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No imports yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(importHistory as any[]).map((importRecord: any) => (
                        <div
                          key={importRecord.id}
                          className="p-3 bg-muted/50 rounded border hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {importRecord.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-destructive" />
                              )}
                              <span className="text-sm font-medium">
                                {importRecord.pluginId}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(importRecord.importedAt)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <Database className="w-3 h-3" />
                              {importRecord.warehouseName || importRecord.warehouseCode}
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              {importRecord.rowsProcessed?.toLocaleString() || 0} rows
                            </div>
                            {importRecord.fileName && (
                              <div className="flex items-center gap-2">
                                <FileSpreadsheet className="w-3 h-3" />
                                {importRecord.fileName}
                              </div>
                            )}
                            {importRecord.durationMs && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {formatDuration(importRecord.durationMs)}
                              </div>
                            )}
                            {importRecord.errorMessage && (
                              <div className="text-destructive mt-2">
                                {importRecord.errorMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>

    {/* Loading Overlay */}
    {isLoading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300">
        <div className="w-full max-w-md bg-background border p-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <h2 className="text-xl font-semibold">Importing Data</h2>
          </div>

          <div className="space-y-4">
            {loadingSteps.map((step) => (
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
              Please wait while we process your data...
            </p>
          </div>
        </div>
      </div>
    )}
  </>
  )
}

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Package,
  MapPin,
  ShoppingCart,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react"
import { PickingStatusBadge } from "./PickingStatusBadge"
import { PriorityBadge } from "./PriorityBadge"
import { ProgressBar } from "./ProgressBar"
import type { PickingLine, PickingError } from "./types"

interface PickingLineSheetProps {
  pickingLine: PickingLine | null
  open: boolean
  onClose: () => void
  onStartPicking?: (line: PickingLine) => void
  onCompletePicking?: (line: PickingLine, qty: number) => void
  onReportError?: (line: PickingLine, error: Omit<PickingError, "reportedAt">) => void
  onReassign?: (line: PickingLine, operator: string) => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

export function PickingLineSheet({
  pickingLine,
  open,
  onClose,
  onStartPicking,
  onCompletePicking,
  onReportError,
  onReassign,
}: PickingLineSheetProps) {
  if (!pickingLine) return null

  const canStart = pickingLine.picking.status === "assigned" || pickingLine.picking.status === "pending"
  const canComplete = pickingLine.picking.status === "in_progress"

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Picking Line Details</SheetTitle>
          <SheetDescription>
            {pickingLine.commande.orderId} - Line #{pickingLine.lineNumber}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Status Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Picking Status</h3>
                </div>
                <PickingStatusBadge status={pickingLine.picking.status} />
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="font-semibold">{pickingLine.picking.progress}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-semibold">
                      {pickingLine.picking.duration
                        ? formatDuration(pickingLine.picking.duration)
                        : "Not started"}
                    </p>
                  </div>
                </div>

                {pickingLine.picking.assignedTo && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(pickingLine.picking.assignedTo)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{pickingLine.picking.assignedTo}</span>
                  </div>
                )}

                <ProgressBar
                  picked={pickingLine.picking.quantityPicked}
                  required={pickingLine.picking.quantityRequired}
                  showLabel
                />
              </div>
            </div>

            <Separator />

            {/* Order Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Order Information</h3>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-medium">{pickingLine.commande.orderId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Line Number</p>
                    <p className="font-medium">#{pickingLine.lineNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Order Type</p>
                    <p className="font-medium">{pickingLine.commande.orderType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Priority</p>
                    <PriorityBadge priority={pickingLine.commande.priority} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Requester</p>
                    <p className="font-medium">{pickingLine.commande.requester}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="font-medium">{pickingLine.commande.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Product Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Product Information</h3>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Product Name</p>
                  <p className="font-medium">{pickingLine.article.productName}</p>
                  {pickingLine.article.productDescription && (
                    <p className="text-sm text-muted-foreground">
                      {pickingLine.article.productDescription}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">SKU</p>
                    <p className="font-medium">{pickingLine.article.sku || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Unit</p>
                    <p className="font-medium">{pickingLine.article.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity Required</p>
                    <p className="font-medium">{pickingLine.article.quantity}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Location Information</h3>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Full Path</p>
                  <p className="font-medium">{pickingLine.emplacement.fullPath}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Warehouse</p>
                    <p className="font-medium">{pickingLine.emplacement.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Zone</p>
                    <p className="font-medium">{pickingLine.emplacement.zone}</p>
                  </div>
                  {pickingLine.emplacement.aisle && (
                    <div>
                      <p className="text-xs text-muted-foreground">Aisle</p>
                      <p className="font-medium">{pickingLine.emplacement.aisle}</p>
                    </div>
                  )}
                  {pickingLine.emplacement.bay && (
                    <div>
                      <p className="text-xs text-muted-foreground">Bay</p>
                      <p className="font-medium">{pickingLine.emplacement.bay}</p>
                    </div>
                  )}
                  {pickingLine.emplacement.level && (
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-medium">{pickingLine.emplacement.level}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="font-medium">{pickingLine.emplacement.position}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {pickingLine.notes && pickingLine.notes.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold">Notes</h3>
                  <div className="space-y-2">
                    {pickingLine.notes.map((note, index) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-muted/50 p-3 text-sm"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Errors */}
            {pickingLine.errors && pickingLine.errors.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <h3 className="font-semibold">Errors</h3>
                  </div>
                  <div className="space-y-2">
                    {pickingLine.errors.map((error, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge variant="destructive" className="mb-2 capitalize">
                              {error.type.replace(/_/g, " ")}
                            </Badge>
                            <p className="text-sm">{error.message}</p>
                          </div>
                          {error.reportedBy && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {error.reportedBy}
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(error.reportedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex flex-col gap-2 border-t pt-4">
          {canStart && onStartPicking && (
            <Button onClick={() => onStartPicking(pickingLine)} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Start Picking
            </Button>
          )}
          {canComplete && onCompletePicking && (
            <Button
              onClick={() => onCompletePicking(pickingLine, pickingLine.picking.quantityRequired)}
              className="w-full"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Picking
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onReportError && (
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => onReportError(pickingLine, {
                  type: "damaged",
                  message: "Product damaged during picking",
                })}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Report Error
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

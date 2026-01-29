import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTablePaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
}

export function DataTablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: DataTablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Affichage de</span>
        <span className="font-medium text-foreground">{startItem}</span>
        <span>à</span>
        <span className="font-medium text-foreground">{endItem}</span>
        <span>sur</span>
        <span className="font-medium text-foreground">{totalItems}</span>
        <span>éléments</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Lignes par page</span>
          <Select value={String(itemsPerPage)} onValueChange={(v) => onItemsPerPageChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers(currentPage, totalPages).map((page, index) => (
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="default"
                  onClick={() => onPageChange(page)}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = []
  const showEllipsis = totalPages > 7

  if (!showEllipsis) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  if (currentPage <= 3) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i)
    }
    pages.push("...")
    pages.push(totalPages)
  } else if (currentPage >= totalPages - 2) {
    pages.push(1)
    pages.push("...")
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    pages.push("...")
    pages.push(currentPage - 1)
    pages.push(currentPage)
    pages.push(currentPage + 1)
    pages.push("...")
    pages.push(totalPages)
  }

  return pages
}

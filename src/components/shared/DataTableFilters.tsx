import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Filter } from "lucide-react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableFiltersProps {
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    name: string
    label: string
    options: Array<{ value: string; label: string }>
    value?: string
    onChange: (value: string) => void
  }>
}

export function DataTableFilters({ searchPlaceholder, onSearchChange, filters = [] }: DataTableFiltersProps) {
  const [searchValue, setSearchValue] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearchChange(value)
  }

  const clearSearch = () => {
    setSearchValue("")
    onSearchChange("")
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {filters.length > 0 && (
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-accent" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2">
          {filters.map((filter) => (
            <Select
              key={filter.name}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  )
}

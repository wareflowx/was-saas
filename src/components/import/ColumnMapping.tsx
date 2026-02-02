import { useState } from 'react'
import { ArrowRight, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ColumnMapping } from '@/backend/import/mapping-service'

// ============================================================================
// TYPES
// ============================================================================

interface ColumnMappingProps {
  availableColumns: readonly string[]
  schemaFields: readonly {
    readonly field: string
    readonly required: boolean
    readonly displayName: string
    readonly type: string
  }[]
  initialMappings?: readonly ColumnMapping[]
  onMappingsChange: (mappings: ColumnMapping[]) => void
  onValidationChange: (isValid: boolean) => void
  sampleData?: readonly Record<string, unknown>[]
}

interface MappedField {
  sourceColumn: string
  targetField: string
  required: boolean
  displayName: string
  fieldType: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ColumnMapping({
  availableColumns,
  schemaFields,
  initialMappings,
  onMappingsChange,
  onValidationChange,
  sampleData = [],
}: ColumnMappingProps) {
  const [mappedFields, setMappedFields] = useState<MappedField[]>(() => {
    if (initialMappings && initialMappings.length > 0) {
      return initialMappings.map(mapping => {
        const field = schemaFields.find(f => f.field === mapping.targetField)
        return {
          sourceColumn: mapping.sourceColumn,
          targetField: mapping.targetField,
          required: mapping.required,
          displayName: field?.displayName || mapping.targetField,
          fieldType: field?.type || 'string',
        }
      })
    }

    // Auto-suggest initial mappings
    const suggested: MappedField[] = []
    const mappedCols = new Set<string>()

    for (const field of schemaFields) {
      // Try exact match
      if (availableColumns.includes(field.field) && !mappedCols.has(field.field)) {
        suggested.push({
          sourceColumn: field.field,
          targetField: field.field,
          required: field.required,
          displayName: field.displayName,
          fieldType: field.type,
        })
        mappedCols.add(field.field)
        continue
      }

      // Try case-insensitive match
      const caseMatch = availableColumns.find(
        col => col.toLowerCase() === field.field.toLowerCase()
      )
      if (caseMatch && !mappedCols.has(caseMatch)) {
        suggested.push({
          sourceColumn: caseMatch,
          targetField: field.field,
          required: field.required,
          displayName: field.displayName,
          fieldType: field.type,
        })
        mappedCols.add(caseMatch)
      }
    }

    return suggested
  })

  const unmappedColumns = availableColumns.filter(
    col => !mappedFields.some(m => m.sourceColumn === col)
  )

  const unmappedRequiredFields = schemaFields.filter(
    f => f.required && !mappedFields.some(m => m.targetField === f.field)
  )

  const isValid = unmappedRequiredFields.length === 0

  // Update validation state
  useState(() => {
    onValidationChange(isValid)
  })()

  const handleMappingChange = (targetField: string, sourceColumn: string) => {
    // Remove existing mapping for this target field
    const updated = mappedFields.filter(m => m.targetField !== targetField)

    // Remove the source column from other mappings
    const otherFields = updated.filter(m => m.sourceColumn !== sourceColumn)

    // Add new mapping
    const field = schemaFields.find(f => f.field === targetField)
    if (field) {
      otherFields.push({
        sourceColumn,
        targetField,
        required: field.required,
        displayName: field.displayName,
        fieldType: field.type,
      })
    }

    setMappedFields(otherFields)
    onMappingsChange(otherFields)
  }

  const handleUnmap = (targetField: string) => {
    const updated = mappedFields.filter(m => m.targetField !== targetField)
    setMappedFields(updated)
    onMappingsChange(updated)
  }

  const handleAutoMap = () => {
    // Simple auto-map using exact and case-insensitive matching
    const autoMapped: MappedField[] = []
    const mappedCols = new Set<string>()

    for (const field of schemaFields) {
      // Try exact match
      if (availableColumns.includes(field.field) && !mappedCols.has(field.field)) {
        autoMapped.push({
          sourceColumn: field.field,
          targetField: field.field,
          required: field.required,
          displayName: field.displayName,
          fieldType: field.type,
        })
        mappedCols.add(field.field)
        continue
      }

      // Try case-insensitive match
      const caseMatch = availableColumns.find(
        col => col.toLowerCase() === field.field.toLowerCase()
      )
      if (caseMatch && !mappedCols.has(caseMatch)) {
        autoMapped.push({
          sourceColumn: caseMatch,
          targetField: field.field,
          required: field.required,
          displayName: field.displayName,
          fieldType: field.type,
        })
        mappedCols.add(caseMatch)
      }
    }

    setMappedFields(autoMapped)
    onMappingsChange(autoMapped)
  }

  // Get unmapped columns sample data for preview
  const getSamplePreview = () => {
    if (sampleData.length === 0) return null

    const previewRow: Record<string, unknown> = {}
    const sourceToTarget = Object.fromEntries(
      mappedFields.map(m => [m.sourceColumn, m.targetField])
    )

    for (const [sourceCol, targetField] of Object.entries(sourceToTarget)) {
      if (sourceCol in sampleData[0]) {
        previewRow[targetField] = sampleData[0][sourceCol]
      }
    }

    return previewRow
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Column Mapping</h3>
          <p className="text-sm text-muted-foreground">
            Map Excel columns to system fields
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoMap}
        >
          Auto-Map Columns
        </Button>
      </div>

      {/* Validation Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {isValid ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">
                  All required fields mapped
                </span>
                {mappedFields.length > 0 && (
                  <Badge variant="secondary">
                    {mappedFields.length} fields mapped
                  </Badge>
                )}
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {unmappedRequiredFields.length} required fields not mapped
                  </span>
                  {unmappedRequiredFields.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Missing: {unmappedRequiredFields.map(f => f.displayName).join(', ')}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mappings</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Source Column (Excel)</TableHead>
                  <TableHead className="w-[40%]">Target Field</TableHead>
                  <TableHead className="w-[20%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemaFields.map((field) => {
                  const mapping = mappedFields.find(m => m.targetField === field.field)
                  const sourceColumn = mapping?.sourceColumn || ''

                  return (
                    <TableRow key={field.field}>
                      <TableCell>
                        <select
                          value={sourceColumn}
                          onChange={(e) => {
                            if (e.target.value) {
                              handleMappingChange(field.field, e.target.value)
                            } else {
                              handleUnmap(field.field)
                            }
                          }}
                          className="w-full"
                        >
                          <option value="">-- Select column --</option>
                          {availableColumns.map(col => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{field.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            {field.field}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={field.required ? 'default' : 'secondary'}>
                              {field.required ? 'Required' : 'Optional'}
                            </Badge>
                            <Badge variant="outline">
                              {field.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {mapping && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnmap(field.field)}
                          >
                            Unmap
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Unmapped Columns */}
      {unmappedColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Unmapped Columns ({unmappedColumns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {unmappedColumns.map(col => (
                <Badge key={col} variant="outline" className="text-xs">
                  {col}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {sampleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Data Preview (First Row)</CardTitle>
          </CardHeader>
          <CardContent>
            {getSamplePreview() ? (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Below is how your data will look after import (first row preview):
                </div>
                <ScrollArea className="h-32 border rounded-md p-2">
                  <div className="space-y-1 text-xs font-mono">
                    {Object.entries(getSamplePreview() || {}).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-muted-foreground w-32">{key}:</span>
                        <span>{String(value).substring(0, 50)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Map at least one field to see preview
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setMappedFields([])
            onMappingsChange([])
          }}
        >
          Clear All Mappings
        </Button>
      </div>
    </div>
  )
}

/**
 * Generic Database Operations
 *
 * Type-safe database operations with Zod validation.
 * Eliminates code duplication with generic functions.
 */

import type { z } from 'zod'
import type { Result, AppError } from '../../shared/types'
import { success, failure, databaseError, validationError } from '../../shared/types'
import { logger } from '../../shared/utils/logger'
import type { SQLiteTable } from 'drizzle-orm/sqlite-core'

// ============================================================================
// GENERIC BULK INSERT WITH VALIDATION
// ============================================================================

/**
 * Bulk insert with Zod validation
 * Validates all data before inserting, returns Result for error handling
 *
 * @param table - Drizzle table
 * @param schema - Zod schema for validation
 * @param db - Drizzle database instance
 * @param data - Data to insert
 * @param entityName - Entity name for logging
 * @returns Result with inserted count
 */
export const bulkInsertValidated = <T>(
  table: SQLiteTable,
  schema: z.ZodSchema<T>,
  db: any,
  data: readonly T[],
  entityName: string
): Result<number, AppError> => {
  if (data.length === 0) {
    return success(0)
  }

  // Validate all data first (fail fast)
  const validation = schema.array().safeParse(data)
  if (!validation.success) {
    logger.error('Validation failed', {
      entity: entityName,
      errors: validation.error.errors,
    })
    return failure(validationError(
      entityName,
      data,
      `Zod validation failed: ${validation.error.errors.map(e => e.message).join(', ')}`
    ))
  }

  // Use SQLite transaction for better performance
  const sqlite = db._.session
  let inserted = 0

  try {
    const insertMany = sqlite.transaction((items: readonly T[]) => {
      for (const item of items) {
        try {
          db.insert(table).values(item as any).run()
          inserted++
        } catch (error) {
          logger.error('Database insert failed', {
            entity: entityName,
            error,
            item,
          })
          // Continue with next item (don't fail entire transaction)
        }
      }
    })

    insertMany(validation.data)

    logger.info('Bulk insert completed', {
      entity: entityName,
      inserted,
      total: data.length,
    })

    return success(inserted)
  } catch (error) {
    logger.error('Transaction failed', {
      entity: entityName,
      error,
    })
    return failure(databaseError('INSERT', entityName, error))
  }
}

/**
 * Format date to ISO string for SQLite storage
 */
export const formatDate = (date: Date): string => {
  return date.toISOString()
}

/**
 * Create a transform function for entity insertion
 * Maps entity properties to database columns
 */
export const createTransform = <T, R extends Record<string, unknown>>(
  mapper: (entity: T) => R
): ((entity: T) => R) => mapper

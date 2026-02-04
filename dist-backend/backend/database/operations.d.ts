/**
 * Generic Database Operations
 *
 * Type-safe database operations with Zod validation.
 * Eliminates code duplication with generic functions.
 */
import type { z } from 'zod';
import type { Result, AppError } from '../../shared/types';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
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
export declare const bulkInsertValidated: <T>(table: SQLiteTable, schema: z.ZodSchema<T>, db: any, data: readonly T[], entityName: string) => Result<number, AppError>;
/**
 * Format date to ISO string for SQLite storage
 */
export declare const formatDate: (date: Date) => string;
/**
 * Create a transform function for entity insertion
 * Maps entity properties to database columns
 */
export declare const createTransform: <T, R extends Record<string, unknown>>(mapper: (entity: T) => R) => ((entity: T) => R);

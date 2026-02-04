"use strict";
/**
 * Generic Database Operations
 *
 * Type-safe database operations with Zod validation.
 * Eliminates code duplication with generic functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransform = exports.formatDate = exports.bulkInsertValidated = void 0;
const types_1 = require("../../shared/types");
const logger_1 = require("../../shared/utils/logger");
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
const bulkInsertValidated = (table, schema, db, data, entityName) => {
    if (data.length === 0) {
        return (0, types_1.success)(0);
    }
    // Validate all data first (fail fast)
    const validation = schema.array().safeParse(data);
    if (!validation.success) {
        logger_1.logger.error('Validation failed', {
            entity: entityName,
            errors: validation.error.errors,
        });
        return (0, types_1.failure)((0, types_1.validationError)(entityName, data, `Zod validation failed: ${validation.error.errors.map(e => e.message).join(', ')}`));
    }
    // Use SQLite transaction for better performance
    const sqlite = db._.session;
    let inserted = 0;
    try {
        const insertMany = sqlite.transaction((items) => {
            for (const item of items) {
                try {
                    db.insert(table).values(item).run();
                    inserted++;
                }
                catch (error) {
                    logger_1.logger.error('Database insert failed', {
                        entity: entityName,
                        error,
                        item,
                    });
                    // Continue with next item (don't fail entire transaction)
                }
            }
        });
        insertMany(validation.data);
        logger_1.logger.info('Bulk insert completed', {
            entity: entityName,
            inserted,
            total: data.length,
        });
        return (0, types_1.success)(inserted);
    }
    catch (error) {
        logger_1.logger.error('Transaction failed', {
            entity: entityName,
            error,
        });
        return (0, types_1.failure)((0, types_1.databaseError)('INSERT', entityName, error));
    }
};
exports.bulkInsertValidated = bulkInsertValidated;
/**
 * Format date to ISO string for SQLite storage
 */
const formatDate = (date) => {
    return date.toISOString();
};
exports.formatDate = formatDate;
/**
 * Create a transform function for entity insertion
 * Maps entity properties to database columns
 */
const createTransform = (mapper) => mapper;
exports.createTransform = createTransform;

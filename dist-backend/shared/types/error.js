"use strict";
/**
 * Application Error Types
 *
 * Structured error handling with domain classification and context.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionError = exports.notFoundError = exports.businessError = exports.networkError = exports.validationError = exports.ipcError = exports.databaseError = exports.createError = void 0;
/**
 * Create a generic error
 */
const createError = (domain, code, message, options) => ({
    domain,
    code,
    message,
    cause: options?.cause,
    context: options?.context,
    timestamp: new Date(),
    recoverable: options?.recoverable ?? false,
});
exports.createError = createError;
/**
 * Database error constructor
 */
const databaseError = (operation, table, cause) => (0, exports.createError)('DATABASE', `DB_${operation.toUpperCase()}_FAILED`, `Failed to ${operation} on ${table}`, { cause, context: { table, operation } });
exports.databaseError = databaseError;
/**
 * IPC error constructor
 */
const ipcError = (channel, cause) => (0, exports.createError)('IPC', 'IPC_CALL_FAILED', `IPC call to '${channel}' failed`, { cause, context: { channel }, recoverable: true });
exports.ipcError = ipcError;
/**
 * Validation error constructor
 */
const validationError = (field, value, message) => (0, exports.createError)('VALIDATION', 'VALIDATION_FAILED', message, { context: { field, value } });
exports.validationError = validationError;
/**
 * Network error constructor
 */
const networkError = (operation, url, cause) => (0, exports.createError)('NETWORK', 'NETWORK_REQUEST_FAILED', `Network request to ${url} failed`, { cause, context: { operation, url }, recoverable: true });
exports.networkError = networkError;
/**
 * Business logic error constructor
 */
const businessError = (rule, message, context) => (0, exports.createError)('BUSINESS', `BUSINESS_RULE_${rule.toUpperCase()}_VIOLATED`, message, { context, recoverable: false });
exports.businessError = businessError;
/**
 * Not found error
 */
const notFoundError = (resource, id) => (0, exports.createError)('DATABASE', 'NOT_FOUND', `${resource} with id '${id}' not found`, { context: { resource, id } });
exports.notFoundError = notFoundError;
/**
 * Permission denied error
 */
const permissionError = (action, resource) => (0, exports.createError)('BUSINESS', 'PERMISSION_DENIED', `Permission denied: cannot ${action} on ${resource}`, { context: { action, resource }, recoverable: false });
exports.permissionError = permissionError;

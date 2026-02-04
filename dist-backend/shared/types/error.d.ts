/**
 * Application Error Types
 *
 * Structured error handling with domain classification and context.
 */
/**
 * Error domains for categorization
 */
export type ErrorDomain = 'DATABASE' | 'IPC' | 'VALIDATION' | 'NETWORK' | 'BUSINESS';
/**
 * Application error type
 */
export type AppError = Readonly<{
    readonly domain: ErrorDomain;
    readonly code: string;
    readonly message: string;
    readonly cause?: unknown;
    readonly context?: Readonly<Record<string, unknown>>;
    readonly timestamp: Date;
    readonly recoverable: boolean;
}>;
/**
 * Create a generic error
 */
export declare const createError: (domain: ErrorDomain, code: string, message: string, options?: {
    cause?: unknown;
    context?: Record<string, unknown>;
    recoverable?: boolean;
}) => AppError;
/**
 * Database error constructor
 */
export declare const databaseError: (operation: string, table: string, cause: unknown) => AppError;
/**
 * IPC error constructor
 */
export declare const ipcError: (channel: string, cause: unknown) => AppError;
/**
 * Validation error constructor
 */
export declare const validationError: (field: string, value: unknown, message: string) => AppError;
/**
 * Network error constructor
 */
export declare const networkError: (operation: string, url: string, cause: unknown) => AppError;
/**
 * Business logic error constructor
 */
export declare const businessError: (rule: string, message: string, context?: Record<string, unknown>) => AppError;
/**
 * Not found error
 */
export declare const notFoundError: (resource: string, id: string) => AppError;
/**
 * Permission denied error
 */
export declare const permissionError: (action: string, resource: string) => AppError;

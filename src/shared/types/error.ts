/**
 * Application Error Types
 *
 * Structured error handling with domain classification and context.
 */

/**
 * Error domains for categorization
 */
export type ErrorDomain =
  | 'DATABASE'
  | 'IPC'
  | 'VALIDATION'
  | 'NETWORK'
  | 'BUSINESS'

/**
 * Application error type
 */
export type AppError = Readonly<{
  readonly domain: ErrorDomain
  readonly code: string
  readonly message: string
  readonly cause?: unknown
  readonly context?: Readonly<Record<string, unknown>>
  readonly timestamp: Date
  readonly recoverable: boolean
}>

/**
 * Create a generic error
 */
export const createError = (
  domain: ErrorDomain,
  code: string,
  message: string,
  options?: {
    cause?: unknown
    context?: Record<string, unknown>
    recoverable?: boolean
  }
): AppError => ({
  domain,
  code,
  message,
  cause: options?.cause,
  context: options?.context,
  timestamp: new Date(),
  recoverable: options?.recoverable ?? false,
})

/**
 * Database error constructor
 */
export const databaseError = (
  operation: string,
  table: string,
  cause: unknown
): AppError =>
  createError('DATABASE', `DB_${operation.toUpperCase()}_FAILED`,
    `Failed to ${operation} on ${table}`,
    { cause, context: { table, operation } }
  )

/**
 * IPC error constructor
 */
export const ipcError = (
  channel: string,
  cause: unknown
): AppError =>
  createError('IPC', 'IPC_CALL_FAILED',
    `IPC call to '${channel}' failed`,
    { cause, context: { channel }, recoverable: true }
  )

/**
 * Validation error constructor
 */
export const validationError = (
  field: string,
  value: unknown,
  message: string
): AppError =>
  createError('VALIDATION', 'VALIDATION_FAILED',
    message,
    { context: { field, value } }
  )

/**
 * Network error constructor
 */
export const networkError = (
  operation: string,
  url: string,
  cause: unknown
): AppError =>
  createError('NETWORK', 'NETWORK_REQUEST_FAILED',
    `Network request to ${url} failed`,
    { cause, context: { operation, url }, recoverable: true }
  )

/**
 * Business logic error constructor
 */
export const businessError = (
  rule: string,
  message: string,
  context?: Record<string, unknown>
): AppError =>
  createError('BUSINESS', `BUSINESS_RULE_${rule.toUpperCase()}_VIOLATED`,
    message,
    { context, recoverable: false }
)

/**
 * Not found error
 */
export const notFoundError = (
  resource: string,
  id: string
): AppError =>
  createError('DATABASE', 'NOT_FOUND',
    `${resource} with id '${id}' not found`,
    { context: { resource, id } }
)

/**
 * Permission denied error
 */
export const permissionError = (
  action: string,
  resource: string
): AppError =>
  createError('BUSINESS', 'PERMISSION_DENIED',
    `Permission denied: cannot ${action} on ${resource}`,
    { context: { action, resource }, recoverable: false }
)

/**
 * Result Type - Functional error handling
 *
 * Discriminated union for explicit error handling without exceptions.
 * All operations that can fail should return Result<T, E>.
 */

/**
 * Result type - success or failure
 */
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

/**
 * Create a success result
 */
export const success = <T>(data: T): Result<T> => ({
  success: true,
  data,
})

/**
 * Create a failure result
 */
export const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
})

/**
 * Map over the success value
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> =>
  result.success ? success(fn(result.data)) : result

/**
 * Chain results for sequential operations
 */
export const chain = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> =>
  result.success ? fn(result.data) : result

/**
 * FlatMap alias for chain
 */
export const flatMap = chain

/**
 * Check if result is success
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is { readonly success: true; readonly data: T } =>
  result.success

/**
 * Check if result is failure
 */
export const isFailure = <T, E>(result: Result<T, E>): result is { readonly success: false; readonly error: E } =>
  !result.success

/**
 * Get data or throw (for use in try/catch contexts)
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (result.success) {
    return result.data
  }
  throw result.error
}

/**
 * Get data or return default value
 */
export const getOrElse = <T, E>(result: Result<T, E>, defaultValue: T): T =>
  result.success ? result.data : defaultValue

/**
 * Get data or execute fallback function
 */
export const getOrThrow = <T, E>(result: Result<T, E>): T => {
  if (result.success) {
    return result.data
  }
  throw result.error
}

/**
 * Execute callback based on result
 */
export const fold = <T, E, U>(
  result: Result<T, E>,
  onSuccess: (data: T) => U,
  onFailure: (error: E) => U
): U =>
  result.success ? onSuccess(result.data) : onFailure(result.error)

/**
 * Result Type - Functional error handling
 *
 * Discriminated union for explicit error handling without exceptions.
 * All operations that can fail should return Result<T, E>.
 */
/**
 * Result type - success or failure
 */
export type Result<T, E = Error> = {
    readonly success: true;
    readonly data: T;
} | {
    readonly success: false;
    readonly error: E;
};
/**
 * Create a success result
 */
export declare const success: <T>(data: T) => Result<T>;
/**
 * Create a failure result
 */
export declare const failure: <E>(error: E) => Result<never, E>;
/**
 * Map over the success value
 */
export declare const map: <T, U, E>(result: Result<T, E>, fn: (data: T) => U) => Result<U, E>;
/**
 * Chain results for sequential operations
 */
export declare const chain: <T, U, E>(result: Result<T, E>, fn: (data: T) => Result<U, E>) => Result<U, E>;
/**
 * FlatMap alias for chain
 */
export declare const flatMap: <T, U, E>(result: Result<T, E>, fn: (data: T) => Result<U, E>) => Result<U, E>;
/**
 * Check if result is success
 */
export declare const isSuccess: <T, E>(result: Result<T, E>) => result is {
    readonly success: true;
    readonly data: T;
};
/**
 * Check if result is failure
 */
export declare const isFailure: <T, E>(result: Result<T, E>) => result is {
    readonly success: false;
    readonly error: E;
};
/**
 * Get data or throw (for use in try/catch contexts)
 */
export declare const unwrap: <T, E>(result: Result<T, E>) => T;
/**
 * Get data or return default value
 */
export declare const getOrElse: <T, E>(result: Result<T, E>, defaultValue: T) => T;
/**
 * Get data or execute fallback function
 */
export declare const getOrThrow: <T, E>(result: Result<T, E>) => T;
/**
 * Execute callback based on result
 */
export declare const fold: <T, E, U>(result: Result<T, E>, onSuccess: (data: T) => U, onFailure: (error: E) => U) => U;

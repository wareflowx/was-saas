"use strict";
/**
 * Result Type - Functional error handling
 *
 * Discriminated union for explicit error handling without exceptions.
 * All operations that can fail should return Result<T, E>.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fold = exports.getOrThrow = exports.getOrElse = exports.unwrap = exports.isFailure = exports.isSuccess = exports.flatMap = exports.chain = exports.map = exports.failure = exports.success = void 0;
/**
 * Create a success result
 */
const success = (data) => ({
    success: true,
    data,
});
exports.success = success;
/**
 * Create a failure result
 */
const failure = (error) => ({
    success: false,
    error,
});
exports.failure = failure;
/**
 * Map over the success value
 */
const map = (result, fn) => result.success ? (0, exports.success)(fn(result.data)) : result;
exports.map = map;
/**
 * Chain results for sequential operations
 */
const chain = (result, fn) => result.success ? fn(result.data) : result;
exports.chain = chain;
/**
 * FlatMap alias for chain
 */
exports.flatMap = exports.chain;
/**
 * Check if result is success
 */
const isSuccess = (result) => result.success;
exports.isSuccess = isSuccess;
/**
 * Check if result is failure
 */
const isFailure = (result) => !result.success;
exports.isFailure = isFailure;
/**
 * Get data or throw (for use in try/catch contexts)
 */
const unwrap = (result) => {
    if (result.success) {
        return result.data;
    }
    throw result.error;
};
exports.unwrap = unwrap;
/**
 * Get data or return default value
 */
const getOrElse = (result, defaultValue) => result.success ? result.data : defaultValue;
exports.getOrElse = getOrElse;
/**
 * Get data or execute fallback function
 */
const getOrThrow = (result) => {
    if (result.success) {
        return result.data;
    }
    throw result.error;
};
exports.getOrThrow = getOrThrow;
/**
 * Execute callback based on result
 */
const fold = (result, onSuccess, onFailure) => result.success ? onSuccess(result.data) : onFailure(result.error);
exports.fold = fold;

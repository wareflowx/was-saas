"use strict";
/**
 * Structured Logger
 *
 * Provides structured logging with different log levels.
 * Replaces console.log/console.error throughout the codebase.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLogger = exports.logger = exports.createLogger = void 0;
/**
 * Default logger configuration
 */
const defaultConfig = {
    level: 'info',
    enabled: true,
};
/**
 * Log levels in order of severity
 */
const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
/**
 * Create a logger instance
 */
const createLogger = (config = defaultConfig) => {
    const shouldLog = (level) => config.enabled && logLevels[level] >= logLevels[config.level];
    const log = (level, message, context) => {
        if (!shouldLog(level)) {
            return;
        }
        const entry = {
            level,
            timestamp: new Date().toISOString(),
            message,
            context,
        };
        // In development, use console methods with colors
        // In production, this would go to a logging service
        const logMethod = level === 'error' ? console.error :
            level === 'warn' ? console.warn :
                console.log;
        logMethod(JSON.stringify(entry));
    };
    return {
        debug: (message, context) => log('debug', message, context),
        info: (message, context) => log('info', message, context),
        warn: (message, context) => log('warn', message, context),
        error: (message, context) => log('error', message, context),
    };
};
exports.createLogger = createLogger;
/**
 * Default logger instance
 */
exports.logger = (0, exports.createLogger)();
/**
 * Logger with debug level enabled
 */
exports.debugLogger = (0, exports.createLogger)({ level: 'debug', enabled: true });

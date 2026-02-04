/**
 * Structured Logger
 *
 * Provides structured logging with different log levels.
 * Replaces console.log/console.error throughout the codebase.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogEntry = Readonly<{
    readonly level: LogLevel;
    readonly timestamp: string;
    readonly message: string;
    readonly context?: Readonly<Record<string, unknown>>;
}>;
/**
 * Logger configuration
 */
type LoggerConfig = Readonly<{
    readonly level: LogLevel;
    readonly enabled: boolean;
}>;
/**
 * Create a logger instance
 */
export declare const createLogger: (config?: LoggerConfig) => {
    debug: (message: string, context?: Record<string, unknown>) => void;
    info: (message: string, context?: Record<string, unknown>) => void;
    warn: (message: string, context?: Record<string, unknown>) => void;
    error: (message: string, context?: Record<string, unknown>) => void;
};
/**
 * Default logger instance
 */
export declare const logger: {
    debug: (message: string, context?: Record<string, unknown>) => void;
    info: (message: string, context?: Record<string, unknown>) => void;
    warn: (message: string, context?: Record<string, unknown>) => void;
    error: (message: string, context?: Record<string, unknown>) => void;
};
/**
 * Logger with debug level enabled
 */
export declare const debugLogger: {
    debug: (message: string, context?: Record<string, unknown>) => void;
    info: (message: string, context?: Record<string, unknown>) => void;
    warn: (message: string, context?: Record<string, unknown>) => void;
    error: (message: string, context?: Record<string, unknown>) => void;
};
export {};

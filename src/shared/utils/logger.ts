/**
 * Structured Logger
 *
 * Provides structured logging with different log levels.
 * Replaces console.log/console.error throughout the codebase.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogEntry = Readonly<{
  readonly level: LogLevel
  readonly timestamp: string
  readonly message: string
  readonly context?: Readonly<Record<string, unknown>>
}>

/**
 * Logger configuration
 */
type LoggerConfig = Readonly<{
  readonly level: LogLevel
  readonly enabled: boolean
}>

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: 'info',
  enabled: true,
} as const

/**
 * Log levels in order of severity
 */
const logLevels: Readonly<Record<LogLevel, number>> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const

/**
 * Create a logger instance
 */
export const createLogger = (config: LoggerConfig = defaultConfig) => {
  const shouldLog = (level: LogLevel): boolean =>
    config.enabled && logLevels[level] >= logLevels[config.level]

  const log = (level: LogLevel, message: string, context?: Record<string, unknown>): void => {
    if (!shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      context,
    }

    // In development, use console methods with colors
    // In production, this would go to a logging service
    const logMethod = level === 'error' ? console.error :
                       level === 'warn' ? console.warn :
                       console.log

    logMethod(JSON.stringify(entry))
  }

  return {
    debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
    info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
    warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
    error: (message: string, context?: Record<string, unknown>) => log('error', message, context),
  }
}

/**
 * Default logger instance
 */
export const logger = createLogger()

/**
 * Logger with debug level enabled
 */
export const debugLogger = createLogger({ level: 'debug', enabled: true })

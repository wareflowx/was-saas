/**
 * IPC Proxy - Type-safe Electron IPC communication
 *
 * Creates a proxy that validates input/output with Zod schemas
 * and returns Result<T, AppError> for all calls.
 */

import type { Result, AppError } from '../types'
import { success, failure, ipcError } from '../types'
import type { IpcContract, IpcProxy } from './contract'
import { ipcContract } from './contract'

/**
 * Create a type-safe IPC proxy
 * Validates input/output and wraps errors in Result type
 */
export const createIpcProxy = <T extends IpcContract>(
  channels: unknown
): IpcProxy<T> => {
  return new Proxy({} as unknown as IpcProxy<T>, {
    get(_target, entity: keyof T) {
      return new Proxy({} as unknown as IpcProxy<T>[keyof T], {
        get(_target, method: keyof T[typeof entity]) {
          return async (input?: unknown): Promise<Result<unknown, AppError>> => {
            try {
              // Validate input with Zod schema
              const schema = ipcContract[entity][method]
              const validationResult = schema.input.safeParse(input)

              if (!validationResult.success) {
                return failure({
                  domain: 'VALIDATION',
                  code: 'IPC_INPUT_VALIDATION_FAILED',
                  message: `Invalid input for ${String(entity)}.${String(method)}`,
                  cause: validationResult.error,
                  timestamp: new Date(),
                  recoverable: false,
                })
              }

              // Call IPC channel
              const channelName = `${String(entity)}:${String(method)}`
              const result = await (channels as Record<string, (input: unknown) => unknown>)[channelName](
                validationResult.data
              )

              // Validate output with Zod schema
              const outputValidation = schema.output.safeParse(result)

              if (!outputValidation.success) {
                return failure({
                  domain: 'VALIDATION',
                  code: 'IPC_OUTPUT_VALIDATION_FAILED',
                  message: `Invalid output from ${String(entity)}.${String(method)}`,
                  cause: outputValidation.error,
                  timestamp: new Date(),
                  recoverable: false,
                })
              }

              return success(outputValidation.data)
            } catch (error) {
              return failure(ipcError(
                `${String(entity)}.${String(method)}`,
                error
              ))
            }
          }
        }
      }) as IpcProxy<T>[keyof T]
    }
  })
}

/**
 * Create IPC proxy from window.electronAPI
 */
export const createIpcProxyFromWindow = <T extends IpcContract>(
  windowElectronAPI: unknown
): IpcProxy<T> => {
  // Create channel map from window.electronAPI
  const channels: Record<string, (input: unknown) => unknown> = {}

  // This will be populated based on the actual electronAPI structure
  // For now, return a proxy that expects the standard electronAPI format
  return createIpcProxy<T>(windowElectronAPI)
}

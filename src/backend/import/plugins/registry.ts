/**
 * Plugin Registry - Pure functional approach
 *
 * All available import plugins with pure functions (no global mutable state)
 */

import type { ImportPlugin } from '../types'
import { genericExcelPlugin } from './generic-excel/index'
import { mockDataGeneratorPlugin } from './mock-data-generator/index'

// ============================================================================
// DEFAULT PLUGINS (READONLY)
// ============================================================================

/**
 * Default plugins - readonly collection
 */
export const defaultPlugins: Readonly<Record<string, ImportPlugin>> = {
  [genericExcelPlugin.id]: genericExcelPlugin,
  [mockDataGeneratorPlugin.id]: mockDataGeneratorPlugin,
} as const

// ============================================================================
// PURE FUNCTIONS (NO MUTATION)
// ============================================================================

/**
 * Get a plugin by ID
 * @param pluginId - Plugin ID
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns Plugin or undefined if not found
 */
export const getPlugin = (
  pluginId: string,
  plugins: Readonly<Record<string, ImportPlugin>> = defaultPlugins
): ImportPlugin | undefined => plugins[pluginId]

/**
 * List all available plugins
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns Array of all plugins
 */
export const listPlugins = (
  plugins: Readonly<Record<string, ImportPlugin>> = defaultPlugins
): readonly ImportPlugin[] => Object.values(plugins)

/**
 * Check if plugin exists
 * @param pluginId - Plugin ID to check
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns True if plugin exists
 */
export const pluginExists = (
  pluginId: string,
  plugins: Readonly<Record<string, ImportPlugin>> = defaultPlugins
): boolean => pluginId in plugins

/**
 * Add a custom plugin to the registry (pure function)
 * @param plugins - Base plugin registry
 * @param plugin - Plugin to add
 * @returns New registry with plugin added
 */
export const withPlugin = (
  plugins: Readonly<Record<string, ImportPlugin>>,
  plugin: ImportPlugin
): Readonly<Record<string, ImportPlugin>> => ({
  ...plugins,
  [plugin.id]: plugin,
})

/**
 * Remove a plugin from the registry (pure function)
 * @param plugins - Base plugin registry
 * @param pluginId - Plugin ID to remove
 * @returns New registry without the plugin
 */
export const withoutPlugin = (
  plugins: Readonly<Record<string, ImportPlugin>>,
  pluginId: string
): Readonly<Record<string, ImportPlugin>> => {
  const { [pluginId]: removed, ...rest } = plugins
  return rest
}

/**
 * Get plugin info for display
 * @param plugin - Plugin
 * @returns Plugin info
 */
export const getPluginInfo = (plugin: ImportPlugin) => ({
  id: plugin.id,
  name: plugin.name,
  version: plugin.version,
  description: plugin.description,
  author: plugin.author,
  wmsSystem: plugin.wmsSystem,
  supportedFormats: plugin.supportedFormats,
})

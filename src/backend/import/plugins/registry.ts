import type { ImportPlugin, PluginRegistry } from '../types'

// ============================================================================
// PLUGIN REGISTRY
// Record type containing all available plugins
// ============================================================================

/**
 * Plugin Registry - All available import plugins
 * Plugins are registered here and accessed by ID
 */
export const registry: PluginRegistry = {}

// ============================================================================
// REGISTRY FUNCTIONS (Pure functions)
// ============================================================================

/**
 * Get a plugin by ID
 * @param registry - Plugin registry
 * @param pluginId - Plugin ID
 * @returns Plugin or undefined if not found
 */
export const getPlugin = (
  registry: PluginRegistry,
  pluginId: string
): ImportPlugin | undefined => {
  return registry[pluginId]
}

/**
 * List all available plugins
 * @param registry - Plugin registry
 * @returns Array of all plugins
 */
export const listPlugins = (registry: PluginRegistry): readonly ImportPlugin[] => {
  return Object.values(registry)
}

/**
 * Register a new plugin
 * @param registry - Current registry
 * @param plugin - Plugin to register
 * @returns New registry with plugin added
 */
export const registerPlugin = (
  registry: PluginRegistry,
  plugin: ImportPlugin
): PluginRegistry => {
  return {
    ...registry,
    [plugin.id]: plugin,
  }
}

/**
 * Unregister a plugin
 * @param registry - Current registry
 * @param pluginId - Plugin ID to remove
 * @returns New registry without the plugin
 */
export const unregisterPlugin = (
  registry: PluginRegistry,
  pluginId: string
): PluginRegistry => {
  const { [pluginId]: removed, ...rest } = registry
  return rest
}

/**
 * Check if plugin exists
 * @param registry - Plugin registry
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
export const pluginExists = (
  registry: PluginRegistry,
  pluginId: string
): boolean => {
  return pluginId in registry
}

// ============================================================================
// DEFAULT PLUGINS (Will be added as we implement them)
// ============================================================================

/**
 * Initialize default plugins
 * Registers all built-in plugins
 * Currently empty - plugins will be added in next commits
 */
export const initializeDefaultPlugins = (): void => {
  // Generic Excel plugin will be registered here
  // Solochain plugin will be registered here
  // Other plugins will be registered here
}

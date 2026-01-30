import { genericExcelPlugin } from './generic-excel';
import { mockDataGeneratorPlugin } from './mock-data-generator';
// ============================================================================
// PLUGIN REGISTRY
// Record type containing all available plugins
// ============================================================================
/**
 * Plugin Registry - All available import plugins
 * Plugins are registered here and accessed by ID
 */
export const registry = {};
// ============================================================================
// REGISTRY FUNCTIONS
// ============================================================================
/**
 * Get a plugin by ID from global registry
 * @param pluginId - Plugin ID
 * @returns Plugin or undefined if not found
 */
export const getPlugin = (pluginId) => {
    return registry[pluginId];
};
/**
 * List all available plugins from global registry
 * @returns Array of all plugins
 */
export const listPlugins = () => {
    return Object.values(registry);
};
/**
 * Register a plugin in the global registry
 * @param plugin - Plugin to register
 */
export const registerPlugin = (plugin) => {
    registry[plugin.id] = plugin;
};
/**
 * Unregister a plugin from the global registry
 * @param pluginId - Plugin ID to remove
 */
export const unregisterPlugin = (pluginId) => {
    delete registry[pluginId];
};
/**
 * Check if plugin exists in global registry
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
export const pluginExists = (pluginId) => {
    return pluginId in registry;
};
// ============================================================================
// DEFAULT PLUGINS INITIALIZATION
// ============================================================================
/**
 * Initialize default plugins
 * Registers all built-in plugins
 */
export const initializeDefaultPlugins = () => {
    // Register Generic Excel plugin
    registerPlugin(genericExcelPlugin);
    // Register Mock Data Generator plugin (for testing)
    registerPlugin(mockDataGeneratorPlugin);
    // More plugins will be registered here as we implement them
    // - Solochain plugin
    // - other WMS plugins
};

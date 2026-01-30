import type { ImportPlugin, PluginRegistry } from '../types';
/**
 * Plugin Registry - All available import plugins
 * Plugins are registered here and accessed by ID
 */
export declare const registry: PluginRegistry;
/**
 * Get a plugin by ID from global registry
 * @param pluginId - Plugin ID
 * @returns Plugin or undefined if not found
 */
export declare const getPlugin: (pluginId: string) => ImportPlugin | undefined;
/**
 * List all available plugins from global registry
 * @returns Array of all plugins
 */
export declare const listPlugins: () => readonly ImportPlugin[];
/**
 * Register a plugin in the global registry
 * @param plugin - Plugin to register
 */
export declare const registerPlugin: (plugin: ImportPlugin) => void;
/**
 * Unregister a plugin from the global registry
 * @param pluginId - Plugin ID to remove
 */
export declare const unregisterPlugin: (pluginId: string) => void;
/**
 * Check if plugin exists in global registry
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
export declare const pluginExists: (pluginId: string) => boolean;
/**
 * Initialize default plugins
 * Registers all built-in plugins
 */
export declare const initializeDefaultPlugins: () => void;
//# sourceMappingURL=registry.d.ts.map
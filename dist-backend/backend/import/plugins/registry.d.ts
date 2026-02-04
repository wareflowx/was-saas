/**
 * Plugin Registry - Pure functional approach
 *
 * All available import plugins with pure functions (no global mutable state)
 */
import type { ImportPlugin } from '../types';
/**
 * Default plugins - readonly collection
 */
export declare const defaultPlugins: Readonly<Record<string, ImportPlugin>>;
/**
 * Get a plugin by ID
 * @param pluginId - Plugin ID
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns Plugin or undefined if not found
 */
export declare const getPlugin: (pluginId: string, plugins?: Readonly<Record<string, ImportPlugin>>) => ImportPlugin | undefined;
/**
 * List all available plugins
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns Array of all plugins
 */
export declare const listPlugins: (plugins?: Readonly<Record<string, ImportPlugin>>) => readonly ImportPlugin[];
/**
 * Check if plugin exists
 * @param pluginId - Plugin ID to check
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns True if plugin exists
 */
export declare const pluginExists: (pluginId: string, plugins?: Readonly<Record<string, ImportPlugin>>) => boolean;
/**
 * Add a custom plugin to the registry (pure function)
 * @param plugins - Base plugin registry
 * @param plugin - Plugin to add
 * @returns New registry with plugin added
 */
export declare const withPlugin: (plugins: Readonly<Record<string, ImportPlugin>>, plugin: ImportPlugin) => Readonly<Record<string, ImportPlugin>>;
/**
 * Remove a plugin from the registry (pure function)
 * @param plugins - Base plugin registry
 * @param pluginId - Plugin ID to remove
 * @returns New registry without the plugin
 */
export declare const withoutPlugin: (plugins: Readonly<Record<string, ImportPlugin>>, pluginId: string) => Readonly<Record<string, ImportPlugin>>;
/**
 * Get plugin info for display
 * @param plugin - Plugin
 * @returns Plugin info
 */
export declare const getPluginInfo: (plugin: ImportPlugin) => {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    wmsSystem: string;
    supportedFormats: readonly import("../types").FileFormat[];
};

"use strict";
/**
 * Plugin Registry - Pure functional approach
 *
 * All available import plugins with pure functions (no global mutable state)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginInfo = exports.withoutPlugin = exports.withPlugin = exports.pluginExists = exports.listPlugins = exports.getPlugin = exports.defaultPlugins = void 0;
const index_1 = require("./generic-excel/index");
const index_2 = require("./mock-data-generator/index");
// ============================================================================
// DEFAULT PLUGINS (READONLY)
// ============================================================================
/**
 * Default plugins - readonly collection
 */
exports.defaultPlugins = {
    [index_1.genericExcelPlugin.id]: index_1.genericExcelPlugin,
    [index_2.mockDataGeneratorPlugin.id]: index_2.mockDataGeneratorPlugin,
};
// ============================================================================
// PURE FUNCTIONS (NO MUTATION)
// ============================================================================
/**
 * Get a plugin by ID
 * @param pluginId - Plugin ID
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns Plugin or undefined if not found
 */
const getPlugin = (pluginId, plugins = exports.defaultPlugins) => plugins[pluginId];
exports.getPlugin = getPlugin;
/**
 * List all available plugins
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns Array of all plugins
 */
const listPlugins = (plugins = exports.defaultPlugins) => Object.values(plugins);
exports.listPlugins = listPlugins;
/**
 * Check if plugin exists
 * @param pluginId - Plugin ID to check
 * @param plugins - Plugin registry (defaults to defaultPlugins)
 * @returns True if plugin exists
 */
const pluginExists = (pluginId, plugins = exports.defaultPlugins) => pluginId in plugins;
exports.pluginExists = pluginExists;
/**
 * Add a custom plugin to the registry (pure function)
 * @param plugins - Base plugin registry
 * @param plugin - Plugin to add
 * @returns New registry with plugin added
 */
const withPlugin = (plugins, plugin) => ({
    ...plugins,
    [plugin.id]: plugin,
});
exports.withPlugin = withPlugin;
/**
 * Remove a plugin from the registry (pure function)
 * @param plugins - Base plugin registry
 * @param pluginId - Plugin ID to remove
 * @returns New registry without the plugin
 */
const withoutPlugin = (plugins, pluginId) => {
    const { [pluginId]: removed, ...rest } = plugins;
    return rest;
};
exports.withoutPlugin = withoutPlugin;
/**
 * Get plugin info for display
 * @param plugin - Plugin
 * @returns Plugin info
 */
const getPluginInfo = (plugin) => ({
    id: plugin.id,
    name: plugin.name,
    version: plugin.version,
    description: plugin.description,
    author: plugin.author,
    wmsSystem: plugin.wmsSystem,
    supportedFormats: plugin.supportedFormats,
});
exports.getPluginInfo = getPluginInfo;

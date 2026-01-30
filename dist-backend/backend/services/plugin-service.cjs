"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedFormats = exports.hasPlugin = exports.getPlugin = exports.listPlugins = void 0;
const registry_1 = require("../import/plugins/registry");
/**
 * List all available plugins
 * @returns Array of plugin info
 */
const listPlugins = () => {
    return Object.values(registry_1.registry).map((plugin) => ({
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        author: plugin.author,
        wmsSystem: plugin.wmsSystem,
        supportedFormats: plugin.supportedFormats,
    }));
};
exports.listPlugins = listPlugins;
/**
 * Get plugin by ID
 * @param pluginId - Plugin ID
 * @returns Plugin or null
 */
const getPlugin = (pluginId) => {
    return registry_1.registry[pluginId] || null;
};
exports.getPlugin = getPlugin;
/**
 * Check if plugin is registered
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
const hasPlugin = (pluginId) => {
    return pluginId in registry_1.registry;
};
exports.hasPlugin = hasPlugin;
/**
 * Get supported file formats for a plugin
 * @param pluginId - Plugin ID
 * @returns Array of supported formats
 */
const getSupportedFormats = (pluginId) => {
    const plugin = registry_1.registry[pluginId];
    return plugin?.supportedFormats || [];
};
exports.getSupportedFormats = getSupportedFormats;

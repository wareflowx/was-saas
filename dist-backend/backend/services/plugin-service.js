import { registry } from '../import/plugins/registry';
/**
 * List all available plugins
 * @returns Array of plugin info
 */
export const listPlugins = () => {
    return Object.values(registry).map((plugin) => ({
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        author: plugin.author,
        wmsSystem: plugin.wmsSystem,
        supportedFormats: plugin.supportedFormats,
    }));
};
/**
 * Get plugin by ID
 * @param pluginId - Plugin ID
 * @returns Plugin or null
 */
export const getPlugin = (pluginId) => {
    return registry[pluginId] || null;
};
/**
 * Check if plugin is registered
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
export const hasPlugin = (pluginId) => {
    return pluginId in registry;
};
/**
 * Get supported file formats for a plugin
 * @param pluginId - Plugin ID
 * @returns Array of supported formats
 */
export const getSupportedFormats = (pluginId) => {
    const plugin = registry[pluginId];
    return plugin?.supportedFormats || [];
};

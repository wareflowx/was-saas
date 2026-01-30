"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDefaultPlugins = exports.pluginExists = exports.unregisterPlugin = exports.registerPlugin = exports.listPlugins = exports.getPlugin = exports.registry = void 0;
const generic_excel_1 = require('./generic-excel.cjs');
const mock_data_generator_1 = require('./mock-data-generator.cjs');
// ============================================================================
// PLUGIN REGISTRY
// Record type containing all available plugins
// ============================================================================
/**
 * Plugin Registry - All available import plugins
 * Plugins are registered here and accessed by ID
 */
exports.registry = {};
// ============================================================================
// REGISTRY FUNCTIONS
// ============================================================================
/**
 * Get a plugin by ID from global registry
 * @param pluginId - Plugin ID
 * @returns Plugin or undefined if not found
 */
const getPlugin = (pluginId) => {
    return exports.registry[pluginId];
};
exports.getPlugin = getPlugin;
/**
 * List all available plugins from global registry
 * @returns Array of all plugins
 */
const listPlugins = () => {
    return Object.values(exports.registry);
};
exports.listPlugins = listPlugins;
/**
 * Register a plugin in the global registry
 * @param plugin - Plugin to register
 */
const registerPlugin = (plugin) => {
    exports.registry[plugin.id] = plugin;
};
exports.registerPlugin = registerPlugin;
/**
 * Unregister a plugin from the global registry
 * @param pluginId - Plugin ID to remove
 */
const unregisterPlugin = (pluginId) => {
    delete exports.registry[pluginId];
};
exports.unregisterPlugin = unregisterPlugin;
/**
 * Check if plugin exists in global registry
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
const pluginExists = (pluginId) => {
    return pluginId in exports.registry;
};
exports.pluginExists = pluginExists;
// ============================================================================
// DEFAULT PLUGINS INITIALIZATION
// ============================================================================
/**
 * Initialize default plugins
 * Registers all built-in plugins
 */
const initializeDefaultPlugins = () => {
    // Register Generic Excel plugin
    (0, exports.registerPlugin)(generic_excel_1.genericExcelPlugin);
    // Register Mock Data Generator plugin (for testing)
    (0, exports.registerPlugin)(mock_data_generator_1.mockDataGeneratorPlugin);
    // More plugins will be registered here as we implement them
    // - Solochain plugin
    // - other WMS plugins
};
exports.initializeDefaultPlugins = initializeDefaultPlugins;

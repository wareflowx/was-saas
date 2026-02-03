import type { ImportPlugin } from '../import/types';
/**
 * List all available plugins
 * @returns Array of plugin info
 */
export declare const listPlugins: () => readonly {
    id: string;
    name: string;
    version: string;
    description: string;
    author: string;
    wmsSystem: string;
    supportedFormats: readonly string[];
}[];
/**
 * Get plugin by ID
 * @param pluginId - Plugin ID
 * @returns Plugin or null
 */
export declare const getPlugin: (pluginId: string) => ImportPlugin | null;
/**
 * Check if plugin is registered
 * @param pluginId - Plugin ID to check
 * @returns True if plugin exists
 */
export declare const hasPlugin: (pluginId: string) => boolean;
/**
 * Get supported file formats for a plugin
 * @param pluginId - Plugin ID
 * @returns Array of supported formats
 */
export declare const getSupportedFormats: (pluginId: string) => readonly string[];

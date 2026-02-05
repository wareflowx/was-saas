# Electron Development Guidelines

## ES Modules in Electron Main Process

When using ES modules (`"type": "module"` in package.json) in the Electron main process, `__dirname` is not available by default. You must manually define it using `fileURLToPath(import.meta.url)` and `path.dirname()`.

## Development vs Production Detection

Never rely solely on `process.env.NODE_ENV` to detect development mode. Always use `app.isPackaged` as a fallback since NODE_ENV may not be set during development. The correct pattern is: check if NODE_ENV equals 'development' OR if the app is not packaged.

## Hot Reload Configuration

Use `vite-plugin-electron` to enable hot reload for the main process and preload scripts. This provides automatic compilation and reloading when you modify Electron code.

## Script Management

Keep the development script simple. Let `vite-plugin-electron` handle Electron compilation and launching automatically. Do not manually launch Electron via `electron .` in your dev script when using the plugin - this causes duplicate instances.

## Port Configuration

Ensure port consistency between Vite dev server and Electron's loadURL. Both the Vite server port and the URL that Electron loads must match. Use `--host` flag if you need to bind to a specific interface (e.g., 127.0.0.1).

## DevTools Considerations

TanStack DevTools can reserve ports that may conflict with your application. If you encounter port conflicts during development, consider removing devtools dependencies from the project.

## File Loading

In development, load the application via `mainWindow.loadURL()` pointing to your Vite dev server. In production, use `mainWindow.loadFile()` pointing to the built HTML file. Always implement proper fallback logic based on the environment.

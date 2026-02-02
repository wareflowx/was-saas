import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const backendDir = join(__dirname, '..', 'dist-backend', 'backend')

function fixRequirePaths(dir) {
  const files = readdirSync(dir)

  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      fixRequirePaths(fullPath)
      continue
    }

    if (!file.endsWith('.cjs')) continue

    let content = readFileSync(fullPath, 'utf-8')
    const originalContent = content

    // Fix all relative require statements that don't have .cjs extension
    content = content.replace(
      /require\(['"]([^'"]+)['"]\)/g,
      (match, importPath) => {
        // Skip if already has extension or is node module
        if (importPath.endsWith('.cjs') ||
            importPath.endsWith('.js') ||
            importPath.endsWith('.json') ||
            !importPath.startsWith('.')) {
          return match
        }

        // Try to find the file with .cjs extension
        const relativeDir = dirname(fullPath)
        const possiblePaths = [
          join(relativeDir, importPath + '.cjs'),
          join(relativeDir, importPath, 'index.cjs'),
        ]

        for (const possiblePath of possiblePaths) {
          try {
            if (statSync(possiblePath).isFile()) {
              const relativePath = importPath.endsWith('.cjs') ? importPath : importPath + '.cjs'
              return `require('${relativePath}')`
            }
          } catch (err) {
            // File doesn't exist, continue
          }
        }

        // If it's a directory import, try to add index.cjs
        try {
          const dirPath = join(relativeDir, importPath)
          if (statSync(dirPath).isDirectory()) {
            const indexPath = join(dirPath, 'index.cjs')
            if (statSync(indexPath).isFile()) {
              return `require('${importPath}/index.cjs')`
            }
          }
        } catch (err) {
          // Not a directory, keep original
        }

        return match
      }
    )

    if (content !== originalContent) {
      writeFileSync(fullPath, content)
      console.log(`Fixed: ${fullPath.replace(process.cwd(), '')}`)
    }
  }
}

console.log('Fixing all require paths in dist-backend/backend...')
fixRequirePaths(backendDir)
console.log('Done!')

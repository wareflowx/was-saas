import { renameSync, readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const directories = [
  'dist-backend',
  'dist-electron'
]

function renameToCjs(dir) {
  const files = readdirSync(dir)

  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      renameToCjs(fullPath)
    } else if (file.endsWith('.js') && !file.endsWith('.cjs')) {
      const newPath = join(dir, file.slice(0, -3) + '.cjs')
      renameSync(fullPath, newPath)
      console.log(`Renamed: ${fullPath} -> ${newPath}`)
    } else if (file.endsWith('.d.ts') && !file.endsWith('.d.cts')) {
      const newPath = join(dir, file.slice(0, -5) + '.d.cts')
      renameSync(fullPath, newPath)
      console.log(`Renamed: ${fullPath} -> ${newPath}`)
    }
  }
}

function fixRequires(dir) {
  const files = readdirSync(dir)

  for (const file of files) {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      fixRequires(fullPath)
    } else if (file.endsWith('.cjs')) {
      let content = readFileSync(fullPath, 'utf-8')

      // Fix relative requires - but check if they're directories first
      const originalContent = content

      // First, revert incorrectly fixed requires (directories that got .cjs appended)
      // Check if the path without .cjs is a directory
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        // Fix directory imports to point to index.cjs
        lines[i] = lines[i].replace(
          /require\(['"]((?!\.\.\/|\.\.\\)[^'"]+)['"]\)/g,
          (match, importPath) => {
            // Skip if already has extension
            if (importPath.endsWith('.cjs') || importPath.endsWith('.js')) {
              return match
            }

            const relativeDir = join(dir, importPath)
            try {
              if (statSync(relativeDir).isDirectory()) {
                // It's a directory, check if index.cjs exists inside
                const indexCjsPath = join(relativeDir, 'index.cjs')
                try {
                  if (statSync(indexCjsPath).isFile()) {
                    // Directory has index.cjs, use it
                    return `require('${importPath}/index.cjs')`
                  }
                } catch (err) {
                  // No index.cjs, keep original
                }
              }
            } catch (err) {
              // Not a directory or doesn't exist, keep original
            }
            return match
          }
        )
      }
      content = lines.join('\n')

      if (content !== originalContent) {
        writeFileSync(fullPath, content)
        console.log(`Fixed requires in: ${fullPath}`)
      }
    }
  }
}

console.log('Renaming .js to .cjs and .d.ts to .d.cts...')
for (const dir of directories) {
  try {
    renameToCjs(dir)
  } catch (error) {
    // Directory doesn't exist, skip
  }
}

console.log('Fixing require paths...')
for (const dir of directories) {
  try {
    fixRequires(dir)
  } catch (error) {
    // Directory doesn't exist, skip
  }
}

console.log('Done!')

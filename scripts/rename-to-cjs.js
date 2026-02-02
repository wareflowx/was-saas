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

      // Fix relative requires
      const originalContent = content

      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        // Fix relative imports without extensions
        lines[i] = lines[i].replace(
          /require\(['"](\.\.\/|\.\/[^'"]+)['"]\)/g,
          (match, importPath) => {
            // Skip if already has extension
            if (importPath.endsWith('.cjs') || importPath.endsWith('.js')) {
              return match
            }

            const relativePath = join(dir, importPath)

            // Try as file first
            try {
              const cjsFilePath = relativePath + '.cjs'
              if (statSync(cjsFilePath).isFile()) {
                return `require('${importPath}.cjs')`
              }
            } catch (err) {
              // Not a .cjs file, try as directory
            }

            // Try as directory
            try {
              if (statSync(relativePath).isDirectory()) {
                // Check if index.cjs exists inside
                const indexCjsPath = join(relativePath, 'index.cjs')
                if (statSync(indexCjsPath).isFile()) {
                  return `require('${importPath}/index.cjs')`
                }
              }
            } catch (err) {
              // Not a directory, keep original
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

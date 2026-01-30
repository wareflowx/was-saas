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

      // Fix relative requires from ./xxx to ./xxx.cjs
      const originalContent = content
      content = content.replace(
        /require\(['"]((?!\.\.\/)[^'"]+)['"]\)/g,
        (match, path) => {
          // Only fix relative requires that don't already have .cjs extension
          if (path.startsWith('.') && !path.includes('.cjs') && !path.includes('.json')) {
            return `require('${path}.cjs')`
          }
          return match
        }
      )

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

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const directories = [
  'dist-backend',
  'dist-electron'
]

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
      // But not for node_modules or external packages
      const originalContent = content
      content = content.replace(
        /require\(['"]((?!\.\.\/)[^'"]+)['"]\)/g,
        (match, path) => {
          // Don't modify if it's a node module or absolute path
          if (path.startsWith('.') && !path.includes('.cjs')) {
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

console.log('Fixing require paths...')
for (const dir of directories) {
  try {
    fixRequires(dir)
  } catch (error) {
    // Directory doesn't exist, skip
  }
}
console.log('Done!')

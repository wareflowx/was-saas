import { renameSync, readdirSync, statSync } from 'fs'
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

console.log('Renaming .js to .cjs and .d.ts to .d.cts...')
for (const dir of directories) {
  try {
    renameToCjs(dir)
  } catch (error) {
    // Directory doesn't exist, skip
  }
}
console.log('Done!')

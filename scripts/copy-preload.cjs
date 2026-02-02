const fs = require('fs')
const path = require('path')

const source = path.join(__dirname, '..', 'electron', 'preload.cjs')
const target = path.join(__dirname, '..', 'dist-electron', 'preload.cjs')

// Ensure target directory exists
const targetDir = path.dirname(target)
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

// Copy the file
fs.copyFileSync(source, target)
console.log('✓ Copied preload.cjs to dist-electron/')

import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
copyFileSync(
  resolve(root, 'public/data/groups.json'),
  resolve(root, 'src/data/groupsBundled.json'),
)
console.log('[offline] 已复制 public/data/groups.json → src/data/groupsBundled.json')

import { createAssetServer } from 'remix/assets'
import * as path from 'node:path'

export const assets = createAssetServer({
  basePath: '/assets',
  rootDir: path.resolve(import.meta.dirname, '..'),
  mounts: { src: 'src', playground: 'playground', npm: 'node_modules' },
  allowFiles: ['src/**', 'playground/**'],
  allowPackages: ['remix', '@remix-run/ui', '@remix-run/component'],
  sourceMaps: 'external',
})

export const scriptEntry = await assets.getScriptEntry('playground/entry.ts')

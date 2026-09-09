import {
  detectMultipleImportMapSupport,
  importModule,
  preloadShim,
} from 'remix/multiple-import-maps-polyfill'
import { run } from 'remix/ui'

import { installDarkMode } from '../src/dark-mode.ts'

installDarkMode()

run({
  async loadModule(moduleUrl, exportName) {
    let mod = (await importModule(moduleUrl)) as Record<string, unknown>
    let component = mod[exportName]
    if (typeof component !== 'function') {
      throw new Error(`Unknown component: ${moduleUrl}#${exportName}`)
    }
    return component
  },
  async processClientEntryPreloads(preloads) {
    if (await detectMultipleImportMapSupport()) return preloads

    preloadShim(preloads)
    return []
  },
})

import { run } from 'remix/ui'

import { installDarkMode } from '../src/dark-mode.ts'

installDarkMode()

run({
  async loadModule(moduleUrl, exportName) {
    let mod = await import(moduleUrl)
    return mod[exportName]
  },
})

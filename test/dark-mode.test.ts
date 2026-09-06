import test from 'node:test'
import assert from 'node:assert/strict'
import {
  readThemeCookie,
  themeHtmlProps,
  setTheme,
  resolveIsDark,
} from '../src/dark-mode.ts'

test('readThemeCookie parses theme correctly', () => {
  assert.equal(readThemeCookie(null), null)
  assert.equal(readThemeCookie(''), null)
  assert.equal(readThemeCookie('other=123; foo=bar'), null)
  assert.equal(readThemeCookie('volt-theme=dark'), 'dark')
  assert.equal(readThemeCookie('volt-theme=light'), 'light')
  assert.equal(readThemeCookie('foo=1; volt-theme=dark; bar=2'), 'dark')
  assert.equal(readThemeCookie('volt-theme=invalid'), null)
  assert.equal(readThemeCookie('volt-theme=system'), null)

  // Custom cookie name
  assert.equal(readThemeCookie('custom-theme=dark', 'custom-theme'), 'dark')
  assert.equal(readThemeCookie('volt-theme=dark', 'custom-theme'), null)
})

test('themeHtmlProps generates correct root attributes for SSR', () => {
  assert.deepEqual(themeHtmlProps('dark'), { className: 'dark', 'data-theme': 'dark' })
  assert.deepEqual(themeHtmlProps('light'), { className: '', 'data-theme': 'light' })
  assert.deepEqual(themeHtmlProps(null), { className: '' })
})

test('resolveIsDark resolves explicit preferences', () => {
  assert.equal(resolveIsDark('dark'), true)
  assert.equal(resolveIsDark('light'), false)
})

test('setTheme syncs cookie and localStorage in browser environment', () => {
  // Mock localStorage and document.cookie
  let storage = new Map<string, string>()
  let cookieString = ''

  globalThis.localStorage = {
    getItem: (k: string) => storage.get(k) ?? null,
    setItem: (k: string, v: string) => storage.set(k, v),
    removeItem: (k: string) => storage.delete(k),
    clear: () => storage.clear(),
    length: 0,
    key: () => null,
  } as any

  let doc = {
    get cookie() {
      return cookieString
    },
    set cookie(val: string) {
      cookieString = val
    },
    documentElement: {
      classList: {
        toggle: () => {},
      },
      style: {},
    },
  }
  globalThis.document = doc as any

  // 1. Set dark theme
  setTheme('dark')
  assert.equal(storage.get('volt-theme'), 'dark')
  assert.match(cookieString, /^volt-theme=dark/)
  assert.match(cookieString, /max-age=31536000/)

  // 2. Set light theme
  setTheme('light')
  assert.equal(storage.get('volt-theme'), 'light')
  assert.match(cookieString, /^volt-theme=light/)

  // 3. Set system theme (clears storage and cookie)
  setTheme('system')
  assert.equal(storage.has('volt-theme'), false)
  assert.match(cookieString, /^volt-theme=;/)
  assert.match(cookieString, /max-age=0/)

  // 4. Custom storage key and options
  setTheme('dark', { storageKey: 'my-theme', cookie: { name: 'my-cookie', maxAge: 86400 } })
  assert.equal(storage.get('my-theme'), 'dark')
  assert.match(cookieString, /^my-cookie=dark/)
  assert.match(cookieString, /max-age=86400/)
})

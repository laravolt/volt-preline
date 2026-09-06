# Changelog

## 0.2.0 — 2026-09-06
- `dark-mode`: `setTheme()` and `installDarkMode()` now also sync the preference to a `volt-theme`
  cookie (configurable/disable-able via `cookie` option) so the server can render
  `<html class="dark">` up front; new SSR helpers `readThemeCookie()` and `themeHtmlProps()`.
  The runtime observer now watches `style` as well as `class`, because Remix UI frame patches
  rewrite `<html>` attributes (theme flash on navigation). Document the CSS rule
  `html.dark { color-scheme: dark }` as the preferred way to derive `color-scheme`.
- `Alert`: optional `align="center"` (default `start`, non-breaking) centers title, description and
  actions — dialogs rendered inside right-aligned table cells otherwise inherit `text-align`.
- Docs: searchable single-select `Combobox` recipe (clear button, option descriptions); note that
  `Button` takes exactly one of `color` | `outline` | `plain` (there is no `variant` prop).
- Tests: `test/dark-mode.test.ts`, `test/alert.test.ts` (`bun test test/`).

## 0.1.0 — 2026-09-02
- First full set: 28 components mirroring the `volt-catalyst` API (same files, exports, props,
  context contracts) styled with Preline UI 5 semantic tokens; interactions via `remix/ui` primitives,
  no `preline.js`.
- Native-first forms (`@tailwindcss/forms`), native `<dialog>` overlays, menu/select/combobox
  primitives, FLIP current indicator, mobile drawers.
- Playground (`npm run playground`) + 50 Playwright tests (`npm run test:e2e`).

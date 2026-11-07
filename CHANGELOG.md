# Changelog

## 0.3.1 — 2026-11-08
- `dark-mode`: `readThemeCookie()` returns `null` when the cookie value cannot be percent-decoded,
  as documented (`'light'`, `'dark'` or `null`). Before, it threw, so a malformed `theme` cookie
  failed the server render of any page that reads it (#14).

## 0.3.0 — 2026-11-02
- **Remix 3.1.** Peer dependency is now `remix ^3.1.0`, and `@remix-run/ui` is 0.13.0 (it requires
  `@remix-run/component` 1.1, which ships with `remix` 3.1.0). Apps on `remix` 3.0.x must upgrade
  to 3.1 with this release; one copy of the component runtime is installed either way.
- `remix/ui` was split upstream in Remix 3.0. Components import the runtime from `remix/component`
  (JSX via `remix/component/jsx-runtime`) and the primitives from `@remix-run/ui`, now a direct
  dependency (`menu`, `select`, `combobox` lost their `/primitives` suffix). Apps that serve
  volt-preline through `createAssetServer` must add `@remix-run/ui` and `@remix-run/component` to
  `allowPackages` (the playground does).
- `dark-mode`: `darkModeHeadScript()` escapes `<`, `>`, `&` and U+2028/U+2029 in the storage key, so
  a custom key can no longer end the inline `<script>` early. The default key's output is unchanged.
- `dist/` is built with TypeScript 7 (quote style and import order differ; the code is the same),
  and CI now fails when `dist/` does not match `npm run build`.
- LICENSE is plain MIT; the Preline attribution moved to `NOTICE`, which ships in the package.

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

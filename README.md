# volt-preline

[Preline UI](https://preline.co) (free tier, MIT) as **Remix 3 UI** components — the open
counterpart of the private `volt-catalyst` package, with the **same component API**:

```tsx
import { Button } from 'volt-preline/button'      // or 'volt-catalyst/button'
import { Field, Label } from 'volt-preline/fieldset'
```

Interactions (dropdown, listbox, combobox, dialog, drawers) are built on `remix/ui` primitives;
`preline.js` is not needed. Styling uses Preline's semantic tokens so one `theme.css` re-skins the app.

## Setup
```css
/* app/styles/app.css */
@import "tailwindcss";
@import "volt-preline/styles.css";   /* variants + @tailwindcss/forms + theme tokens + .dark variant */
@source "../../node_modules/volt-preline/dist";
```
Add `"volt-preline"` to `assets.allowPackages` in `remix.json`.

## Dark Mode

`volt-preline/dark-mode` manages theme preferences across server rendering and Remix frame DOM patching.

### Setup

1. **Browser entry**: call `installDarkMode()` once in your browser client entry. It follows the OS setting or a saved choice via `setTheme()`, syncs an HTTP cookie (`volt-theme`) by default, and maintains the `dark` class across Remix frame navigations:
```ts
import { installDarkMode } from 'volt-preline/dark-mode'

installDarkMode()
```

2. **Server-Side Rendering**: read the theme cookie so the initial HTML is rendered with `class="dark"` immediately, preventing theme flash:
```tsx
import { readThemeCookie, themeHtmlProps, darkModeHeadScript } from 'volt-preline/dark-mode'

export function Document({ request, children }: { request: Request; children: React.ReactNode }) {
  let theme = readThemeCookie(request.headers.get('cookie')) // 'light' | 'dark' | null

  return (
    <html lang="en" {...themeHtmlProps(theme)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeHeadScript() }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

3. **CSS Color-Scheme Rule**: In your `app/styles/app.css`, declare `html.dark { color-scheme: dark; }`:
```css
/* app/styles/app.css */
html.dark {
  color-scheme: dark;
}
```
*Why?* Remix UI frame navigations diff and patch DOM attributes on `<html>`, which can strip inline `style="color-scheme: ..."` attributes temporarily. The CSS rule ensures form controls and scrollbars never flash light during DOM updates.

4. **Switching Themes**:
```ts
import { setTheme } from 'volt-preline/dark-mode'

setTheme('dark')   // saves to localStorage AND writes cookie
setTheme('light')  // saves to localStorage AND writes cookie
setTheme('system') // clears localStorage AND expires cookie
```

## Alert Dialog Alignment

The `Alert` component supports an optional `align?: 'start' | 'center'` prop (default `'start'`):

```tsx
import { Alert, AlertTitle, AlertDescription, AlertActions } from 'volt-preline/alert'
import { Button } from 'volt-preline/button'

<Alert open={isOpen} onClose={() => setIsOpen(false)} align="center">
  <AlertTitle>Hapus Data?</AlertTitle>
  <AlertDescription>Tindakan ini permanen dan tidak dapat dibatalkan.</AlertDescription>
  <AlertActions>
    <Button plain type="button" onClick={() => setIsOpen(false)}>Batal</Button>
    <Button color="red" type="submit">Hapus</Button>
  </AlertActions>
</Alert>
```

> **Inherited text alignment in table cells**: When a dialog or confirmation modal (such as `ConfirmDialog`) is rendered inside a right-aligned table cell (`<td class="text-right">`), descendant elements inherit `text-align: right` unless overridden. Specifying `align="center"` (or `'start'`) ensures consistent text alignment and centers action buttons via `sm:justify-center`.

## Develop
```sh
bun install
npm run typecheck
npm run playground   # kitchen-sink at http://localhost:4410
npm run test:e2e     # Playwright
npm run build        # dist/
```
See `CONVENTIONS.md`.

## Attribution

Built on [Preline UI](https://preline.co) by Preline Labs Ltd. (MIT + Preline UI Fair Use License).
`volt-preline` is a Remix UI integration of Preline's design language, not a replacement for Preline UI;
Preline Pro content is not included.

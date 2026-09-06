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

2. **Server-Side Rendering**: read the theme cookie so the initial HTML is rendered with `className="dark"` immediately, preventing theme flash:
```tsx
import type { Handle, RemixNode } from 'remix/ui'
import {
  readThemeCookie,
  themeHtmlProps,
  darkModeHeadScript,
  type ServerTheme,
} from 'volt-preline/dark-mode'

export interface DocumentProps {
  title?: string
  theme?: ServerTheme
  children?: RemixNode
}

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { title = 'Volt App', theme = null, children } = handle.props
    return (
      <html lang="id" {...themeHtmlProps(theme)}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <script dangerouslySetInnerHTML={{ __html: darkModeHeadScript() }} />
        </head>
        <body className="bg-background text-foreground antialiased">{children}</body>
      </html>
    )
  }
}
```

In your controller or route handler, pass the theme from the request header:
```ts
let theme = readThemeCookie(context.request.headers.get('cookie'))
return context.render(<MyPage theme={theme} />)
// Or expose it application-wide via middleware using AsyncLocalStorage
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

## Button Props (Important Convention)

`Button` (`volt-preline/button`) uses discriminated style props matching `volt-catalyst/button`. It accepts **exactly one** of:
- `color="blue"` (or any valid `ButtonColor`: `red`, `zinc`, `dark`, etc.) for a solid button
- `outline` (boolean prop) for an outline button
- `plain` (boolean prop) for a ghost/plain button

> ⚠️ **Common Mistake**: Do **not** use `variant="outline"` or `variant="ghost"`. The `variant` prop does not exist on `Button` and will fail TypeScript typechecking.
> - Instead of `<Button variant="outline">`, write `<Button outline>`.
> - Instead of `<Button variant="ghost">`, write `<Button plain>`.

## Combobox Recipe: Searchable Single-Select

When selecting from a dataset with >5 options, use `Combobox` inside an island (`clientEntry`). For typed options, instantiate once:

```tsx
import { clientEntry, on, type Handle } from 'remix/ui'
import {
  Combobox,
  ComboboxOption,
  ComboboxLabel,
  ComboboxDescription,
} from 'volt-preline/combobox'
import { Button } from 'volt-preline/button'

export type Shareholder = {
  id: string
  name: string
  group: string
  totalShares: number
}

const ShareholderCombobox = Combobox as typeof Combobox<Shareholder>
const ShareholderComboboxOption = ComboboxOption as typeof ComboboxOption<Shareholder>

export const ShareholderSelector = clientEntry<{
  shareholders: Shareholder[]
  selectedId: string
  onChange: (id: string) => void
}>(import.meta.url, function ShareholderSelector(handle) {
  return () => {
    let { shareholders, selectedId, onChange } = handle.props
    let current = shareholders.find((s) => s.id === selectedId) ?? null

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-[240px]">
          <ShareholderCombobox
            name="shareholder_id"
            options={shareholders}
            displayValue={(sh) => sh?.name ?? ''}
            valueKey={(sh) => sh.id}
            value={current}
            onChange={(sh) => {
              onChange(sh?.id ?? '')
              handle.update()
            }}
            filter={(sh, query) => {
              let q = query.toLowerCase().trim()
              return (
                sh.name.toLowerCase().includes(q) ||
                sh.group.toLowerCase().includes(q)
              )
            }}
            placeholder="Cari pemegang saham..."
          >
            {(sh) => (
              <ShareholderComboboxOption value={sh}>
                <ComboboxLabel>{sh.name}</ComboboxLabel>
                <ComboboxDescription>
                  {sh.group} · {sh.totalShares} lembar
                </ComboboxDescription>
              </ShareholderComboboxOption>
            )}
          </ShareholderCombobox>
        </div>

        {current && (
          <Button
            type="button"
            plain
            aria-label="Kosongkan pilihan"
            mix={on<HTMLButtonElement, 'click'>('click', () => {
              onChange('')
              handle.update()
            })}
          >
            Kosongkan
          </Button>
        )}
      </div>
    )
  }
})
```

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

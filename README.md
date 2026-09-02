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
Add `"volt-preline"` to `assets.allowPackages` in `remix.json`. Dark mode: call `installDarkMode()` from `volt-preline/dark-mode` in your browser entry (it follows
the OS setting or a saved choice via `setTheme()`, and survives Remix frame navigations), and inline
`darkModeHeadScript()` in `<head>` to avoid a flash.

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

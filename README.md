# velix-preline

[Preline UI](https://preline.co) (free tier, MIT) as **Remix 3 UI** components — the open
counterpart of the private `velix-catalyst` package, with the **same component API**:

```tsx
import { Button } from 'velix-preline/button'      // or 'velix-catalyst/button'
import { Field, Label } from 'velix-preline/fieldset'
```

Interactions (dropdown, listbox, combobox, dialog, drawers) are built on `remix/ui` primitives;
`preline.js` is not needed. Styling uses Preline's semantic tokens so one `theme.css` re-skins the app.

## Setup
```css
/* app/styles/app.css */
@import "tailwindcss";
@import "velix-preline/styles.css";   /* variants + @tailwindcss/forms + theme tokens + .dark variant */
@source "../../node_modules/velix-preline/dist";
```
Add `"velix-preline"` to `assets.allowPackages` in `remix.json`. Toggle dark mode by adding the
`dark` class to `<html>`.

## Develop
```sh
bun install
npm run typecheck
npm run playground   # kitchen-sink at http://localhost:4410
npm run test:e2e     # Playwright
npm run build        # dist/
```
See `CONVENTIONS.md`.

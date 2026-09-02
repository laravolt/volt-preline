# volt-preline conventions (Remix 3.0.0-rc.1)

Goal: an MIT component library for Remix UI with the **same component API as `volt-catalyst`**
(same file names, export names and props) but styled with **Preline UI 5** (free tier) markup and
semantic tokens. Interactions come from `remix/ui/*` primitives — **`preline.js` is never used**.
Apps switch tiers by changing the import package only.

## Sources of truth
- API contract + behavior reference: `~/Developer/volt-catalyst/src/<name>.tsx` (private, Tailwind
  Plus). Mirror its exports, props, context wiring, primitive usage, and a11y. **Never copy its
  Tailwind class strings, layout tricks or design details** — that code is licensed; only the
  behavior/structure may be reused. If in doubt, rewrite.
- Visual reference: Preline docs (`https://preline.co/docs/<component>.html`, fetch with WebFetch
  and read the Tailwind-utility variant) and Preline's semantic tokens in `node_modules/preline/theme.css`
  (`bg-background`, `text-foreground`, `bg-card border-card-line`, `bg-layer border-layer-line
  text-layer-foreground`, `bg-primary text-primary-foreground hover:bg-primary-hover`,
  `bg-secondary`, `bg-destructive`, `bg-muted text-muted-foreground`, `bg-dropdown
  border-dropdown-line text-dropdown-item-foreground hover:bg-dropdown-item-hover`, `bg-overlay
  border-overlay-line`, `bg-sidebar border-sidebar-line bg-sidebar-nav-active`, `bg-navbar`,
  `divide-table-line`, `bg-select`, `bg-popover`, `bg-tooltip`, …). Prefer tokens over raw palette
  classes so `theme.css` re-skins everything. Dark mode = `.dark` class (`dark:` variant is defined
  in `src/styles.css`); tokens already switch, so `dark:` classes are rarely needed.
- `@tailwindcss/forms` is loaded: native inputs/checkbox/radio use its base styles like Preline does.

## Component shape (identical to volt-catalyst)
- `function X(handle: Handle<Props>) { return () => … }`, `children?: RemixNode`, props accept
  `className` and `class` via `splitProps`/`cx` from `src/utils.ts`, typed props extending
  `ElementProps`, context via `handle.context` with the same context value shapes
  (e.g. `Field` → `{ controlId, descriptionId, errorId, disabled }`).
- Native-first: real `<input>`/`<select>`/`<textarea>`/`<button>`/`<a>`; Checkbox/Radio/Switch are
  native inputs styled with `@tailwindcss/forms` + Preline classes (Preline switch = checkbox with
  `relative w-11 h-6 … checked:bg-primary before:translate-x-full` pattern).
- Overlays: native `<dialog>` for Dialog/Alert (CSS transitions with `open:`/`starting:open:` /
  `transition-discrete`), `remix/ui/menu/primitives` for Dropdown, `remix/ui/select/primitives` for
  Listbox, `remix/ui/combobox/primitives` for Combobox, `remix/ui/animation` for the current
  indicator. Same props as volt-catalyst (`open`, `onClose`, `anchor`, `onSelect`, `value`,
  `onChange`, `displayValue`, `filter`, `valueKey`, …).
- rc.1 gotcha: never pass `checked/value/open/selected={undefined}` explicitly on host elements;
  use conditional spreads.

## Quality gate per component
1. `npx tsc --noEmit` clean for your files.
2. Section in `playground/sections/<group>.tsx` rendering every variant (a `clientEntry` island).
3. Playwright spec `playground/tests/<group>.spec.ts` (behavior parity with volt-catalyst's spec
   for the same group — you may read that spec for the assertions, then write your own).
4. JSDoc at the top of each file: API parity notes vs volt-catalyst and hydration requirements.

/**
 * `Dropdown` — Preline "Dropdown" styling on top of `remix/ui/menu/primitives` (no `preline.js`).
 *
 * API parity with `volt-catalyst/dropdown`: `Dropdown` (`label`, `onSelect(event)`), `DropdownButton`
 * (`as`, defaults to `Button`), `DropdownMenu` (`anchor="bottom end"` strings), `DropdownItem` (`href`,
 * `name`, `value`, `label`, `searchValue`, `disabled`), `DropdownHeader`, `DropdownSection`,
 * `DropdownHeading`, `DropdownDivider`, `DropdownLabel`, `DropdownDescription`, `DropdownShortcut`.
 *
 * Wiring:
 * - `Dropdown` renders `menu.Context` (no wrapper element) and exposes `onSelect` through context; the
 *   `MenuSelectEvent` also bubbles from the item so ancestors can listen with `onMenuSelect(...)`.
 * - `DropdownButton` applies `menu.trigger()`; the host component must forward `mix` to its root element.
 * - `DropdownMenu` is a native `popover="manual"` surface positioned by `remix/ui/anchor`. The `anchor`
 *   prop is mapped to an anchor placement (`'bottom end'` → `bottom-end`, gap 8px — Preline's `mt-2`)
 *   and swapped into the popover context right before the surface opens. The resolved placement (after
 *   viewport flipping) is written to `data-anchor-placement`.
 * - `DropdownItem` with `href` renders `<a role="menuitem">` (enhanced by `run()`); otherwise a
 *   `<button type="button">`. Highlight state comes from the primitives as `data-highlighted`, disabled
 *   as `aria-disabled`.
 * - `DropdownSection` gets `aria-labelledby` when a `DropdownHeading` is rendered; `DropdownItem` gets
 *   `aria-describedby` for a rendered `DropdownDescription` / `DropdownShortcut`.
 *
 * Hydration: interactive only inside an app `clientEntry`; the components are not client entries.
 */
import { type Dispatched, type ElementProps, type ElementType, type Handle, type RemixNode } from 'remix/ui';
import * as menu from 'remix/ui/menu/primitives';
export type DropdownAnchor = 'top' | 'bottom' | 'left' | 'right' | 'top start' | 'top end' | 'bottom start' | 'bottom end' | 'left start' | 'left end' | 'right start' | 'right end';
export type DropdownSelectEvent = Dispatched<menu.MenuSelectEvent, HTMLElement>;
export interface DropdownProps {
    /** Accessible name for the menu surface (defaults to the trigger's content). */
    label?: string;
    /** Called once per selection with the `MenuSelectEvent` (`event.item.name` / `event.item.value`). */
    onSelect?: (event: DropdownSelectEvent) => void;
    children?: RemixNode;
}
interface DropdownContextValue {
    readonly onSelect: DropdownProps['onSelect'];
}
export declare function Dropdown(handle: Handle<DropdownProps, DropdownContextValue>): () => import("remix/ui").RemixElement;
export interface DropdownButtonProps extends ElementProps {
    /** Component or tag to render; defaults to `Button`. Must forward `mix` to its root element. */
    as?: ElementType;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DropdownButton(handle: Handle<DropdownButtonProps>): () => import("remix/ui").RemixElement;
export interface DropdownMenuProps extends ElementProps {
    anchor?: DropdownAnchor;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DropdownMenu(handle: Handle<DropdownMenuProps>): () => import("remix/ui").RemixElement;
export interface DropdownItemProps extends ElementProps {
    /** Renders an `<a href>` that navigates on select. */
    href?: string;
    /** Item name reported in the select event (defaults to `value`). */
    name?: string;
    value?: string;
    /** Accessible/typeahead label (defaults to the item text). */
    label?: string;
    searchValue?: menu.MenuItemOptions['searchValue'];
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
}
interface DropdownItemContextValue {
    descriptionId: string;
    shortcutId: string;
}
export declare function DropdownItem(handle: Handle<DropdownItemProps, DropdownItemContextValue>): () => import("remix/ui").RemixElement;
export interface DropdownHeaderProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DropdownHeader(handle: Handle<DropdownHeaderProps>): () => import("remix/ui").RemixElement;
export interface DropdownSectionProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
interface DropdownSectionContextValue {
    headingId: string;
}
export declare function DropdownSection(handle: Handle<DropdownSectionProps, DropdownSectionContextValue>): () => import("remix/ui").RemixElement;
export interface DropdownHeadingProps extends ElementProps {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DropdownHeading(handle: Handle<DropdownHeadingProps>): () => import("remix/ui").RemixElement;
export interface DropdownDividerProps extends ElementProps {
    className?: string;
    class?: string;
}
export declare function DropdownDivider(handle: Handle<DropdownDividerProps>): () => import("remix/ui").RemixElement;
export interface DropdownLabelProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DropdownLabel(handle: Handle<DropdownLabelProps>): () => import("remix/ui").RemixElement;
export interface DropdownDescriptionProps extends ElementProps {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DropdownDescription(handle: Handle<DropdownDescriptionProps>): () => import("remix/ui").RemixElement;
export interface DropdownShortcutProps extends ElementProps {
    keys: string | string[];
    id?: string;
    className?: string;
    class?: string;
}
export declare function DropdownShortcut(handle: Handle<DropdownShortcutProps>): () => import("remix/ui").RemixElement;
export {};

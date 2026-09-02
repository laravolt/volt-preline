import { jsx as _jsx } from "remix/ui/jsx-runtime";
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
import { on, ref, } from 'remix/ui';
import * as menu from 'remix/ui/menu/primitives';
import * as popover from 'remix/ui/popover';
import { Button } from "./button.js";
import { cx, splitProps } from "./utils.js";
/** `anchor="bottom end"` → remix anchor options. Gap = Preline's `mt-2`. */
function toAnchorOptions(anchor) {
    return { placement: anchor.replace(' ', '-'), offset: 8 };
}
export function Dropdown(handle) {
    handle.context.set({
        get onSelect() {
            return handle.props.onSelect;
        },
    });
    return () => _jsx(menu.Context, { label: handle.props.label, children: handle.props.children });
}
export function DropdownButton(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { as: Comp = Button, mix, children, ...props } = rest;
        let extra = Comp === 'button' && !props.type ? { type: 'button' } : {};
        return (_jsx(Comp, { ...props, ...extra, className: className, mix: [menu.trigger(), mix], children: children }));
    };
}
export function DropdownMenu(handle) {
    let dropdown = handle.context.get(Dropdown);
    let popoverCtx = handle.context.get(popover.Context);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { anchor: _anchor, mix, children, ...props } = rest;
        return (_jsx("div", { ...props, mix: [
                // The trigger registered the anchor target with a default placement; replace the placement
                // with the one requested on the menu before `menu.popover()` positions the surface (mixin
                // listeners run in order, so this runs first).
                on('beforetoggle', (event) => {
                    if (event.newState === 'open' && popoverCtx.anchor) {
                        popoverCtx.anchor = {
                            target: popoverCtx.anchor.target,
                            options: toAnchorOptions(handle.props.anchor ?? 'bottom'),
                        };
                    }
                }),
                menu.popover(),
                menu.onMenuSelect((event) => dropdown.onSelect?.(event)),
                mix,
            ], className: cx(className, 
            // Preline dropdown menu surface
            'min-w-60 rounded-lg border border-dropdown-line bg-dropdown p-1 shadow-md', 
            // Native popover reset (UA gives it margin, canvas colors, a fixed width)
            'm-0 w-max text-inherit', 
            // Scroll when the menu does not fit in the viewport
            'overflow-y-auto', 
            // Invisible outline, visible only in forced-colors mode
            'outline outline-transparent focus:outline-hidden', 
            // Leave-only fade; `transition-discrete` keeps the surface displayed while it fades out
            'transition-opacity transition-discrete duration-150 ease-in not-open:opacity-0 data-[close-animation=none]:transition-none'), children: _jsx("div", { mix: menu.list(), className: "space-y-0.5 focus:outline-hidden", children: children }) }));
    };
}
export function DropdownItem(handle) {
    let ids = {
        descriptionId: `${handle.id}-description`,
        shortcutId: `${handle.id}-shortcut`,
    };
    handle.context.set(ids);
    let node;
    let itemRef = ref((node_) => {
        node = node_;
    });
    function syncDescribedBy() {
        handle.queueTask(() => {
            if (!node)
                return;
            let host = node;
            let describedBy = [ids.descriptionId, ids.shortcutId].filter((id) => host.querySelector(`#${CSS.escape(id)}`));
            if (describedBy.length)
                host.setAttribute('aria-describedby', describedBy.join(' '));
            else
                host.removeAttribute('aria-describedby');
        });
    }
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { href, name, value, label, searchValue, disabled, mix, children, ...props } = rest;
        let classes = cx(className, 
        // Preline dropdown item, laid out as a 3-column grid: [icon] [label/description] [shortcut]
        'group grid w-full cursor-default grid-cols-[auto_1fr_auto] items-center rounded-lg px-3 py-2 text-left text-sm', 'text-dropdown-item-foreground focus:outline-hidden', 
        // Highlight (keyboard + pointer, set by the menu primitives)
        'data-highlighted:bg-dropdown-item-focus', 
        // Disabled
        'aria-disabled:pointer-events-none aria-disabled:opacity-50', 
        // Icons / avatars in the first column
        '*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-3 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground-1', '*:data-[slot=avatar]:col-start-1 *:data-[slot=avatar]:row-start-1 *:data-[slot=avatar]:mr-3 *:data-[slot=avatar]:size-5');
        let itemMix = [
            menu.item({ name: name ?? value ?? '', value, label, searchValue, disabled }),
            itemRef,
            mix,
        ];
        syncDescribedBy();
        if (typeof href === 'string') {
            return (_jsx("a", { ...props, href: href, mix: [...itemMix, disabled && on('click', (event) => event.preventDefault())], className: classes, children: children }));
        }
        return (_jsx("button", { ...props, type: "button", mix: itemMix, className: classes, children: children }));
    };
}
export function DropdownHeader(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("div", { ...props, className: cx(className, 'px-3 pt-2 pb-1'), children: children }));
    };
}
export function DropdownSection(handle) {
    let headingId = `${handle.id}-heading`;
    handle.context.set({ headingId });
    let node;
    let sectionRef = ref((node_) => {
        node = node_;
    });
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, mix, ...props } = rest;
        // Label the group by its heading when one is rendered.
        handle.queueTask(() => {
            if (!node)
                return;
            if (node.querySelector(`#${CSS.escape(headingId)}`))
                node.setAttribute('aria-labelledby', headingId);
            else
                node.removeAttribute('aria-labelledby');
        });
        return (_jsx("div", { ...props, role: "group", mix: [sectionRef, mix], className: cx(className, 'space-y-0.5'), children: children }));
    };
}
export function DropdownHeading(handle) {
    let section = handle.context.get(DropdownSection);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id = section.headingId, children, ...props } = rest;
        return (_jsx("header", { ...props, id: id, role: "presentation", className: cx(className, 'block px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground-1 uppercase'), children: children }));
    };
}
export function DropdownDivider(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        return _jsx("hr", { ...rest, role: "separator", className: cx(className, 'my-1 h-px border-0 bg-dropdown-divider') });
    };
}
export function DropdownLabel(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("div", { ...props, "data-slot": "label", className: cx(className, 'col-start-2 row-start-1'), children: children }));
    };
}
export function DropdownDescription(handle) {
    let item = handle.context.get(DropdownItem);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id = item.descriptionId, children, ...props } = rest;
        return (_jsx("div", { ...props, id: id, "data-slot": "description", className: cx(className, 'col-span-2 col-start-2 row-start-2 text-xs text-muted-foreground-1'), children: children }));
    };
}
export function DropdownShortcut(handle) {
    let item = handle.context.get(DropdownItem);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { keys, id = item.shortcutId, ...props } = rest;
        let parts = Array.isArray(keys) ? keys : keys.split('');
        return (_jsx("kbd", { ...props, id: id, className: cx(className, 'col-start-3 row-start-1 ml-6 flex justify-self-end text-xs text-muted-foreground'), children: parts.map((char, index) => (_jsx("kbd", { className: cx('min-w-[2ch] text-center font-sans capitalize', index > 0 && char.length > 1 && 'pl-1'), children: char }, index))) }));
    };
}

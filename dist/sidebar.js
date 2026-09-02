import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
/**
 * `Sidebar` family for volt-preline (API parity with volt-catalyst `sidebar.tsx`: same exports,
 * props, context wiring, `data-current` and drawer-closing behavior; Preline sidebar look).
 *
 * - `Sidebar` is a full-height `<nav>` column painted with `bg-sidebar` tokens; the host (layout)
 *   adds the `border-e border-sidebar-line` edge.
 * - `SidebarSection` owns a `LayoutGroup` (see `./current-indicator.tsx`) so the current-item marker
 *   slides between its `SidebarItem`s.
 * - `SidebarItem` with `href` renders `<Link>` and, on click, closes the nearest open `<dialog>`
 *   ancestor (the mobile drawer of `SidebarLayout`/`StackedLayout`). Without `href` it renders
 *   `<button type="button">`. `current` sets `data-current="true"`, paints Preline's
 *   `bg-sidebar-nav-active` and renders a keyed `bg-primary` leading bar via `CurrentIndicator`.
 * - Attach behavior with `mix={on('click', …)}`; a user `mix` is composed after the drawer-close one.
 *
 * Hydration: markup is server-renderable; the animated marker and drawer-close need the composition
 * to live inside an app `clientEntry`.
 */
import { on } from 'remix/ui';
import { TouchTarget } from "./button.js";
import { CurrentIndicator, LayoutGroup } from "./current-indicator.js";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
export function Sidebar(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("nav", { ...attrs, className: cx(className, 'flex h-full min-h-0 flex-col bg-sidebar text-sidebar-nav-foreground'), children: children }));
    };
}
export function SidebarHeader(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { ...attrs, className: cx(className, 'flex flex-col border-b border-sidebar-divider p-2 *:data-[slot=section]:not-first:mt-2'), children: children }));
    };
}
export function SidebarBody(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { ...attrs, className: cx(className, 'flex flex-1 flex-col overflow-y-auto p-2 *:data-[slot=section]:not-first:mt-6'), children: children }));
    };
}
export function SidebarFooter(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { ...attrs, className: cx(className, 'mt-auto flex flex-col border-t border-sidebar-divider p-2 *:data-[slot=section]:not-first:mt-2'), children: children }));
    };
}
/** Scopes the sliding current-item marker (Catalyst `LayoutGroup` equivalent). */
export function SidebarSection(handle) {
    let group = new LayoutGroup();
    handle.context.set(group);
    return () => {
        group.snapshot();
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { ...attrs, "data-slot": "section", className: cx(className, 'flex flex-col gap-y-1'), children: children }));
    };
}
export function SidebarDivider(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        return _jsx("hr", { ...rest, className: cx(className, 'my-3 border-t border-sidebar-divider') });
    };
}
export function SidebarSpacer(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        return _jsx("div", { "aria-hidden": "true", ...rest, className: cx(className, 'mt-6 flex-1') });
    };
}
export function SidebarHeading(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("h3", { ...attrs, className: cx(className, 'px-2.5 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground-1'), children: children }));
    };
}
const itemClasses = cx(
// Preline sidebar link
'flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-sidebar-nav-foreground', 'hover:bg-sidebar-nav-hover focus:outline-hidden focus-visible:bg-sidebar-nav-focus', 'disabled:pointer-events-none disabled:opacity-50', 
// Current: Preline's active background + medium weight
'data-current:bg-sidebar-nav-active data-current:font-medium', 
// Icon children
'*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground-1', 'hover:*:data-[slot=icon]:text-sidebar-nav-foreground data-current:*:data-[slot=icon]:text-primary', 
// A trailing icon after other content goes to the end, smaller
'*:not-first:last:data-[slot=icon]:ms-auto *:not-first:last:data-[slot=icon]:size-4', 
// Avatar children
'*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:shrink-0');
export function SidebarItem(handle) {
    let group = handle.context.get(SidebarSection);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { current, children, href, mix, ...attrs } = rest;
        let currentAttr = current ? { 'data-current': 'true' } : {};
        return (_jsxs("span", { className: cx(className, 'relative'), children: [current && (_jsx(CurrentIndicator, { group: group, className: "absolute inset-y-2 -start-2 w-0.5 rounded-full bg-primary" }, "current-indicator")), typeof href === 'string' ? (_jsx(Link, { ...attrs, href: href, className: itemClasses, ...currentAttr, mix: [
                        // Navigating from inside the mobile drawer dismisses it.
                        on('click', (event) => {
                            let dialog = event.currentTarget.closest('dialog');
                            if (dialog?.open)
                                dialog.close();
                        }),
                        mix,
                    ], children: _jsx(TouchTarget, { children: children }) })) : (_jsx("button", { type: "button", ...attrs, className: itemClasses, ...currentAttr, ...(mix !== undefined ? { mix } : {}), children: _jsx(TouchTarget, { children: children }) }))] }));
    };
}
export function SidebarLabel(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("span", { ...attrs, className: cx(className, 'truncate'), children: children }));
    };
}

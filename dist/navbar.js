import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { TouchTarget } from "./button.js";
import { CurrentIndicator, LayoutGroup } from "./current-indicator.js";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
export function Navbar(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("nav", { ...attrs, className: cx(className, 'flex flex-1 items-center gap-x-4 py-3 text-navbar-nav-foreground'), children: children }));
    };
}
export function NavbarDivider(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        return _jsx("div", { "aria-hidden": "true", ...rest, className: cx(className, 'h-6 w-px shrink-0 bg-navbar-divider') });
    };
}
/** Scopes the sliding current-item marker (Catalyst `LayoutGroup` equivalent). */
export function NavbarSection(handle) {
    let group = new LayoutGroup();
    handle.context.set(group);
    return () => {
        group.snapshot();
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { ...attrs, className: cx(className, 'flex items-center gap-x-1'), children: children }));
    };
}
export function NavbarSpacer(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        return _jsx("div", { "aria-hidden": "true", ...rest, className: cx(className, 'flex-1') });
    };
}
const itemClasses = cx(
// Preline nav link: compact rounded pill, semantic navbar tokens
'relative flex min-w-0 items-center gap-x-2 rounded-lg px-2.5 py-2 text-start text-sm font-medium text-navbar-nav-foreground', 'hover:bg-navbar-nav-hover focus:outline-hidden focus-visible:bg-navbar-nav-focus active:bg-navbar-nav-active', 'disabled:pointer-events-none disabled:opacity-50', 
// Current: Preline tints the active link with the primary color
'data-current:text-primary', 
// Icon children
'*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground-1', 'hover:*:data-[slot=icon]:text-navbar-nav-foreground data-current:*:data-[slot=icon]:text-primary', 
// A trailing icon (e.g. chevron) after other content is pushed to the end and drawn smaller
'*:not-first:last:data-[slot=icon]:ms-auto *:not-first:last:data-[slot=icon]:size-4', 
// Avatar children
'*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:shrink-0');
export function NavbarItem(handle) {
    let group = handle.context.get(NavbarSection);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { current, children, href, ...attrs } = rest;
        let currentAttr = current ? { 'data-current': 'true' } : {};
        return (_jsxs("span", { className: cx(className, 'relative'), children: [current && (_jsx(CurrentIndicator, { group: group, className: "absolute inset-x-2.5 -bottom-3 h-0.5 rounded-full bg-primary" }, "current-indicator")), typeof href === 'string' ? (_jsx(Link, { ...attrs, href: href, className: itemClasses, ...currentAttr, children: _jsx(TouchTarget, { children: children }) })) : (_jsx("button", { type: "button", ...attrs, className: itemClasses, ...currentAttr, children: _jsx(TouchTarget, { children: children }) }))] }));
    };
}
export function NavbarLabel(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("span", { ...attrs, className: cx(className, 'truncate'), children: children }));
    };
}

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "remix/ui/jsx-runtime";
/**
 * `StackedLayout` for volt-preline (API parity with volt-catalyst `stacked-layout.tsx`: same
 * `navbar`/`sidebar`/`children` props and drawer behavior; Preline navbar-on-top layout).
 *
 * A `bg-navbar border-b border-navbar-line` header spans the top with the `navbar` node; below `lg`
 * it also shows an "Open navigation" button that opens the `sidebar` node in the same native
 * `<dialog>` drawer as `SidebarLayout` (shared `mobileSidebarDialogClasses`): slide transition,
 * dimmed backdrop, closes on Escape, backdrop click, "Close navigation" and `SidebarItem` links.
 *
 * Hydration: `StackedLayoutChrome` (drawer + header) belongs inside an app `clientEntry` so the
 * open/close buttons are wired. Keep `StackedLayoutContent` OUTSIDE that client entry: page content
 * passed as island `children` is serialized and loses every `mix`.
 */
import { on, ref } from 'remix/ui';
import { NavbarItem } from "./navbar.js";
import { CloseMenuIcon, OpenMenuIcon, mobileSidebarDialogClasses, mobileSidebarPanelClasses } from "./sidebar-layout.js";
import { cx, splitProps } from "./utils.js";
/** Outer flex column (`min-h-svh`). Server-renderable; wrap `StackedLayoutChrome` + `StackedLayoutContent`. */
export function StackedLayoutRoot(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { ...attrs, className: cx(className, 'relative isolate flex min-h-svh w-full flex-col bg-background text-foreground'), children: children }));
    };
}
/** The `<main>` content well. Server-renderable, so page content (forms, nested client entries) keeps its mixins. */
export function StackedLayoutContent(handle) {
    return () => (_jsx(_Fragment, { children: _jsx("main", { className: "flex flex-1 flex-col", children: _jsx("div", { className: "grow p-4 sm:p-6 lg:p-8", children: _jsx("div", { className: "mx-auto w-full max-w-6xl", children: handle.props.children }) }) }) }));
}
export function StackedLayoutChrome(handle) {
    let dialog;
    let panel;
    let open = () => {
        if (dialog && !dialog.open)
            dialog.showModal();
    };
    let close = () => {
        if (dialog?.open)
            dialog.close();
    };
    return () => {
        let { navbar, sidebar } = handle.props;
        return (_jsxs(_Fragment, { children: [_jsx("dialog", { "aria-label": "Navigation", className: mobileSidebarDialogClasses, mix: [
                        ref((node) => {
                            dialog = node;
                        }),
                        on('click', (event) => {
                            if (!panel || !panel.contains(event.target))
                                close();
                        }),
                    ], children: _jsxs("div", { className: mobileSidebarPanelClasses, mix: ref((node) => {
                            panel = node;
                        }), children: [_jsx("div", { className: "flex justify-end px-2 pt-2", children: _jsx(NavbarItem, { "aria-label": "Close navigation", mix: on('click', close), children: _jsx(CloseMenuIcon, {}) }) }), sidebar] }) }), _jsxs("header", { className: "flex items-center gap-x-2 border-b border-navbar-line bg-navbar px-4 sm:px-6", children: [_jsx("div", { className: "lg:hidden", children: _jsx(NavbarItem, { "aria-label": "Open navigation", mix: on('click', open), children: _jsx(OpenMenuIcon, {}) }) }), _jsx("div", { className: "min-w-0 flex-1", children: navbar })] })] }));
    };
}
/**
 * Backwards-compatible composition. Prefer `StackedLayoutRoot` + `StackedLayoutChrome` (inside a
 * `clientEntry`) + `StackedLayoutContent` (outside it): passing page content through a client entry's
 * `children` serializes it, which strips `mix` handlers and nested client entries
 * ("Framework invariant: Invalid mix prop" on hydration).
 */
export function StackedLayout(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { navbar, sidebar, children, ...attrs } = rest;
        return (_jsxs(StackedLayoutRoot, { ...attrs, className: className, children: [_jsx(StackedLayoutChrome, { navbar: navbar, sidebar: sidebar }), _jsx(StackedLayoutContent, { children: children })] }));
    };
}

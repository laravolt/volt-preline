import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
/**
 * `StackedLayout` for volt-preline (API parity with volt-catalyst `stacked-layout.tsx`: same
 * `navbar`/`sidebar`/`children` props and drawer behavior; Preline navbar-on-top layout).
 *
 * A `bg-navbar border-b border-navbar-line` header spans the top with the `navbar` node; below `lg`
 * it also shows an "Open navigation" button that opens the `sidebar` node in the same native
 * `<dialog>` drawer as `SidebarLayout` (shared `mobileSidebarDialogClasses`): slide transition,
 * dimmed backdrop, closes on Escape, backdrop click, "Close navigation" and `SidebarItem` links.
 *
 * Hydration: render inside an app `clientEntry` so the open/close buttons are wired; the layout
 * itself is not a client entry.
 */
import { on, ref } from 'remix/ui';
import { NavbarItem } from "./navbar.js";
import { CloseMenuIcon, OpenMenuIcon, mobileSidebarDialogClasses, mobileSidebarPanelClasses } from "./sidebar-layout.js";
import { cx, splitProps } from "./utils.js";
export function StackedLayout(handle) {
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
        let { className, rest } = splitProps(handle.props);
        let { navbar, sidebar, children, ...attrs } = rest;
        return (_jsxs("div", { ...attrs, className: cx(className, 'relative isolate flex min-h-svh w-full flex-col bg-background text-foreground'), children: [_jsx("dialog", { "aria-label": "Navigation", className: mobileSidebarDialogClasses, mix: [
                        ref((node) => {
                            dialog = node;
                        }),
                        on('click', (event) => {
                            if (!panel || !panel.contains(event.target))
                                close();
                        }),
                    ], children: _jsxs("div", { className: mobileSidebarPanelClasses, mix: ref((node) => {
                            panel = node;
                        }), children: [_jsx("div", { className: "flex justify-end px-2 pt-2", children: _jsx(NavbarItem, { "aria-label": "Close navigation", mix: on('click', close), children: _jsx(CloseMenuIcon, {}) }) }), sidebar] }) }), _jsxs("header", { className: "flex items-center gap-x-2 border-b border-navbar-line bg-navbar px-4 sm:px-6", children: [_jsx("div", { className: "lg:hidden", children: _jsx(NavbarItem, { "aria-label": "Open navigation", mix: on('click', open), children: _jsx(OpenMenuIcon, {}) }) }), _jsx("div", { className: "min-w-0 flex-1", children: navbar })] }), _jsx("main", { className: "flex flex-1 flex-col", children: _jsx("div", { className: "grow p-4 sm:p-6 lg:p-8", children: _jsx("div", { className: "mx-auto w-full max-w-6xl", children: children }) }) })] }));
    };
}

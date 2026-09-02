import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
/**
 * `SidebarLayout` for volt-preline (API parity with volt-catalyst `sidebar-layout.tsx`: same
 * `navbar`/`sidebar`/`children` props and drawer behavior; Preline application-layout look).
 *
 * - Desktop (`lg+`): a fixed 16rem `bg-sidebar border-e border-sidebar-line` column and the content
 *   offset by the same width on `bg-background`.
 * - Mobile: a `bg-navbar border-b border-navbar-line` header with an "Open navigation" button and the
 *   `navbar` node; the `sidebar` node is repeated inside a native `<dialog aria-label="Navigation">`
 *   drawer opened with `showModal()`. It slides in from the start edge (`open:` / `starting:open:` +
 *   `transition-discrete` so the leave also animates), dims the page with `::backdrop`, closes on
 *   Escape (native), on backdrop click, on the "Close navigation" button, and when a `SidebarItem`
 *   with `href` is clicked inside it.
 * - `mobileSidebarDialogClasses` is exported so `StackedLayout` shares the exact same drawer.
 *
 * Hydration: the open/close buttons only work once hydrated, so render this layout inside an app
 * `clientEntry` (the layout itself is not one). Server output is the closed drawer plus the desktop
 * sidebar.
 */
import { on, ref } from 'remix/ui';
import { NavbarItem } from "./navbar.js";
import { cx, splitProps } from "./utils.js";
export function OpenMenuIcon() {
    return () => (_jsx("svg", { "data-slot": "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M4 6h16M4 12h16M4 18h16" }) }));
}
export function CloseMenuIcon() {
    return () => (_jsx("svg", { "data-slot": "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M18 6 6 18M6 6l12 12" }) }));
}
/** Classes for the mobile drawer `<dialog>`: UA reset + Preline off-canvas slide + dimmed backdrop. */
export const mobileSidebarDialogClasses = cx(
// Turn the UA dialog box into an off-canvas panel pinned to the start edge
'fixed inset-y-0 start-0 m-0 h-full max-h-none w-64 max-w-[85vw] border-0 bg-transparent p-0 text-inherit lg:hidden', 
// Slide in/out (Preline: transition-all duration-300 transform)
'-translate-x-full transition-all transition-discrete duration-300 ease-in-out open:translate-x-0 starting:open:-translate-x-full', 
// Backdrop fade
'backdrop:bg-black/50 backdrop:opacity-0 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300', 'open:backdrop:opacity-100 starting:open:backdrop:opacity-0');
/** Classes for the panel inside the drawer (the visible sidebar surface). */
export const mobileSidebarPanelClasses = 'flex h-full flex-col border-e border-sidebar-line bg-sidebar shadow-lg';
export function SidebarLayout(handle) {
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
        return (_jsxs("div", { ...attrs, className: cx(className, 'relative isolate flex min-h-svh w-full bg-background text-foreground max-lg:flex-col'), children: [_jsx("div", { className: "fixed inset-y-0 start-0 z-10 w-64 border-e border-sidebar-line bg-sidebar max-lg:hidden", children: sidebar }), _jsx("dialog", { "aria-label": "Navigation", className: mobileSidebarDialogClasses, mix: [
                        ref((node) => {
                            dialog = node;
                        }),
                        on('click', (event) => {
                            // A click that does not land inside the panel hit the backdrop.
                            if (!panel || !panel.contains(event.target))
                                close();
                        }),
                    ], children: _jsxs("div", { className: mobileSidebarPanelClasses, mix: ref((node) => {
                            panel = node;
                        }), children: [_jsx("div", { className: "flex justify-end px-2 pt-2", children: _jsx(NavbarItem, { "aria-label": "Close navigation", mix: on('click', close), children: _jsx(CloseMenuIcon, {}) }) }), sidebar] }) }), _jsxs("header", { className: "flex items-center gap-x-2 border-b border-navbar-line bg-navbar px-4 lg:hidden", children: [_jsx(NavbarItem, { "aria-label": "Open navigation", mix: on('click', open), children: _jsx(OpenMenuIcon, {}) }), _jsx("div", { className: "min-w-0 flex-1", children: navbar })] }), _jsx("main", { className: "flex flex-1 flex-col lg:min-w-0 lg:ps-64", children: _jsx("div", { className: "grow p-4 sm:p-6 lg:p-8", children: _jsx("div", { className: "mx-auto w-full max-w-6xl", children: children }) }) })] }));
    };
}

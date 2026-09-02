/**
 * `SidebarLayout` for velix-preline (API parity with velix-catalyst `sidebar-layout.tsx`: same
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
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
export declare function OpenMenuIcon(): () => import("remix/ui").RemixElement;
export declare function CloseMenuIcon(): () => import("remix/ui").RemixElement;
/** Classes for the mobile drawer `<dialog>`: UA reset + Preline off-canvas slide + dimmed backdrop. */
export declare const mobileSidebarDialogClasses: string;
/** Classes for the panel inside the drawer (the visible sidebar surface). */
export declare const mobileSidebarPanelClasses = "flex h-full flex-col border-e border-sidebar-line bg-sidebar shadow-lg";
export type SidebarLayoutProps = {
    navbar: RemixNode;
    sidebar: RemixNode;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function SidebarLayout(handle: Handle<SidebarLayoutProps>): () => import("remix/ui").RemixElement;

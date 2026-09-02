/**
 * `StackedLayout` for velix-preline (API parity with velix-catalyst `stacked-layout.tsx`: same
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
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
export type StackedLayoutProps = {
    navbar: RemixNode;
    sidebar: RemixNode;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function StackedLayout(handle: Handle<StackedLayoutProps>): () => import("remix/ui").RemixElement;

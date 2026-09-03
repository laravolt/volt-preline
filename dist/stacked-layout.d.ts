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
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
export type StackedLayoutChromeProps = {
    navbar: RemixNode;
    sidebar: RemixNode;
};
export type StackedLayoutRootProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
/** Outer flex column (`min-h-svh`). Server-renderable; wrap `StackedLayoutChrome` + `StackedLayoutContent`. */
export declare function StackedLayoutRoot(handle: Handle<StackedLayoutRootProps>): () => import("remix/ui").RemixElement;
/** The `<main>` content well. Server-renderable, so page content (forms, nested client entries) keeps its mixins. */
export declare function StackedLayoutContent(handle: Handle<{
    children?: RemixNode;
}>): () => import("remix/ui").RemixElement;
export type StackedLayoutProps = {
    navbar: RemixNode;
    sidebar: RemixNode;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function StackedLayoutChrome(handle: Handle<StackedLayoutChromeProps>): () => import("remix/ui").RemixElement;
/**
 * Backwards-compatible composition. Prefer `StackedLayoutRoot` + `StackedLayoutChrome` (inside a
 * `clientEntry`) + `StackedLayoutContent` (outside it): passing page content through a client entry's
 * `children` serializes it, which strips `mix` handlers and nested client entries
 * ("Framework invariant: Invalid mix prop" on hydration).
 */
export declare function StackedLayout(handle: Handle<StackedLayoutProps>): () => import("remix/ui").RemixElement;

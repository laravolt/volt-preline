/**
 * `Link` for volt-preline (API parity with volt-catalyst `link.tsx`).
 *
 * A plain `<a href>`: same-origin anchors are progressively enhanced by Remix `run()`, so no `link()`
 * mixin is needed. Accepts both `className` and `class`; every other prop (including `mix`,
 * `target`, `rel`, `data-*`) is spread onto the anchor. No default styling — callers (Button,
 * NavbarItem, SidebarItem, PaginationPage) supply their own Preline classes.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type LinkProps = {
    href: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Link(handle: Handle<LinkProps>): () => import("remix/ui").RemixElement;

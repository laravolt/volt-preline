/**
 * `Sidebar` family for velix-preline (API parity with velix-catalyst `sidebar.tsx`: same exports,
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
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
import { LayoutGroup } from './current-indicator.tsx';
type DivProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type SidebarProps = DivProps;
export declare function Sidebar(handle: Handle<SidebarProps>): () => import("remix/ui").RemixElement;
export type SidebarHeaderProps = DivProps;
export declare function SidebarHeader(handle: Handle<SidebarHeaderProps>): () => import("remix/ui").RemixElement;
export type SidebarBodyProps = DivProps;
export declare function SidebarBody(handle: Handle<SidebarBodyProps>): () => import("remix/ui").RemixElement;
export type SidebarFooterProps = DivProps;
export declare function SidebarFooter(handle: Handle<SidebarFooterProps>): () => import("remix/ui").RemixElement;
export type SidebarSectionProps = DivProps;
/** Scopes the sliding current-item marker (Catalyst `LayoutGroup` equivalent). */
export declare function SidebarSection(handle: Handle<SidebarSectionProps, LayoutGroup>): () => import("remix/ui").RemixElement;
export type SidebarDividerProps = {
    className?: string;
    class?: string;
} & ElementProps;
export declare function SidebarDivider(handle: Handle<SidebarDividerProps>): () => import("remix/ui").RemixElement;
export type SidebarSpacerProps = DivProps;
export declare function SidebarSpacer(handle: Handle<SidebarSpacerProps>): () => import("remix/ui").RemixElement;
export type SidebarHeadingProps = DivProps;
export declare function SidebarHeading(handle: Handle<SidebarHeadingProps>): () => import("remix/ui").RemixElement;
export type SidebarItemProps = {
    current?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
    /** With `href` the item renders as a `<Link>` (and closes an enclosing open `<dialog>`); without it, as `<button type="button">`. */
    href?: string;
} & ElementProps;
export declare function SidebarItem(handle: Handle<SidebarItemProps>): () => import("remix/ui").RemixElement;
export type SidebarLabelProps = DivProps;
export declare function SidebarLabel(handle: Handle<SidebarLabelProps>): () => import("remix/ui").RemixElement;
export {};

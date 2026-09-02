/**
 * `Navbar` family for volt-preline (API parity with volt-catalyst `navbar.tsx`: same exports,
 * props, context wiring and `data-current` behavior; Preline navbar look).
 *
 * - `Navbar` is a `<nav>` row; hosts (layouts) paint `bg-navbar border-b border-navbar-line`.
 * - `NavbarSection` owns a `LayoutGroup` (see `./current-indicator.tsx`) so the current-item marker
 *   slides between its `NavbarItem`s.
 * - `NavbarItem` with `href` renders `<Link>` (plain `<a>`), otherwise `<button type="button">`.
 *   `current` sets `data-current="true"`, tints the item `text-primary` (Preline's active nav link)
 *   and renders a keyed `bg-primary` underline via `CurrentIndicator`.
 * - Icons: children with `data-slot="icon"` are sized; a trailing icon (chevron) is pushed to the end.
 * - Attach behavior with `mix={on('click', …)}`.
 *
 * Hydration: markup is server-renderable; the animated marker needs the composition to live inside
 * an app `clientEntry` that re-renders when `current` changes.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
import { LayoutGroup } from './current-indicator.tsx';
type DivProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type NavbarProps = DivProps;
export declare function Navbar(handle: Handle<NavbarProps>): () => import("remix/ui").RemixElement;
export type NavbarDividerProps = DivProps;
export declare function NavbarDivider(handle: Handle<NavbarDividerProps>): () => import("remix/ui").RemixElement;
export type NavbarSectionProps = DivProps;
/** Scopes the sliding current-item marker (Catalyst `LayoutGroup` equivalent). */
export declare function NavbarSection(handle: Handle<NavbarSectionProps, LayoutGroup>): () => import("remix/ui").RemixElement;
export type NavbarSpacerProps = DivProps;
export declare function NavbarSpacer(handle: Handle<NavbarSpacerProps>): () => import("remix/ui").RemixElement;
export type NavbarItemProps = {
    current?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
    /** With `href` the item renders as a `<Link>`; without it, as `<button type="button">`. */
    href?: string;
} & ElementProps;
export declare function NavbarItem(handle: Handle<NavbarItemProps>): () => import("remix/ui").RemixElement;
export type NavbarLabelProps = DivProps;
export declare function NavbarLabel(handle: Handle<NavbarLabelProps>): () => import("remix/ui").RemixElement;
export {};

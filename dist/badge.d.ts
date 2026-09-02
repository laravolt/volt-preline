/**
 * Preline `Badge` / `BadgeButton` for Remix UI — API-compatible with `volt-catalyst/badge`.
 *
 * API parity: same exports (`Badge`, `BadgeButton`, `badgeColors`, `BadgeColor`, `BadgeProps`,
 * `BadgeButtonProps`) and the same 18-color union. `BadgeButton` with `href` renders through
 * `Link` (`./link.tsx`), otherwise a native `<button type="button">`; the wrapper is a `group` so
 * the inner badge can react to hover.
 *
 * Styling: Preline UI 5 "soft" pill badge (`inline-flex items-center gap-x-1.5 py-1 px-2
 * rounded-full text-xs font-medium bg-{c}-100 text-{c}-800 dark:bg-{c}-500/20 dark:text-{c}-400`).
 * `zinc` maps onto Preline's `bg-surface text-surface-foreground`, `blue` onto the `primary-*`
 * scale so it follows the theme's primary color.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
declare const colors: {
    red: string;
    orange: string;
    amber: string;
    yellow: string;
    lime: string;
    green: string;
    emerald: string;
    teal: string;
    cyan: string;
    sky: string;
    blue: string;
    indigo: string;
    violet: string;
    purple: string;
    fuchsia: string;
    pink: string;
    rose: string;
    zinc: string;
};
export type BadgeColor = keyof typeof colors;
export declare const badgeColors: BadgeColor[];
export type BadgeProps = {
    color?: BadgeColor;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Badge(handle: Handle<BadgeProps>): () => import("remix/ui").RemixElement;
export type BadgeButtonProps = {
    color?: BadgeColor;
    className?: string;
    class?: string;
    children?: RemixNode;
} & (({
    href?: never;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
} & ElementProps) | ({
    href: string;
    target?: string;
} & ElementProps));
export declare function BadgeButton(handle: Handle<BadgeButtonProps>): () => import("remix/ui").RemixElement;
export {};

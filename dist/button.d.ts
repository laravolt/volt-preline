/**
 * Preline `Button` / `TouchTarget` for Remix UI — API-compatible with `velix-catalyst/button`.
 *
 * API parity: same exports (`Button`, `TouchTarget`, `buttonColors`, `ButtonColor`, `ButtonProps`,
 * `ButtonStyleProps`, `ButtonElementProps`) and the same discriminated props: exactly one of
 * `color` (solid), `outline` or `plain`; `href` renders a `Link` (`./link.tsx`), otherwise a native
 * `<button type="button">` (`type` overridable, `disabled` passes through).
 *
 * Styling: Preline UI 5 button patterns on semantic tokens.
 * - solid `color` maps onto tokens where Preline has one (`blue` → `bg-primary`, `red` →
 *   `bg-destructive`, `dark*`/`zinc` → `bg-secondary`/`bg-surface-4`, `light`/`white` → `bg-layer`
 *   "white" button) and onto Tailwind palette shades for the remaining Catalyst colors.
 * - `outline` = Preline outline button (`border-layer-line text-muted-foreground-1 hover:border-primary-hover …`).
 * - `plain` = Preline ghost button (`border-transparent text-primary hover:bg-primary-100 …`).
 * - Focus uses Preline's `focus:outline-hidden focus:bg-*-focus`; disabled uses
 *   `disabled:opacity-50 disabled:pointer-events-none`.
 * - Icons: children with `data-slot="icon"` are sized 16px and shrink-0 (Preline "button with icon").
 *
 * Hydration: none required; navigation is a plain anchor enhanced by Remix `run()`.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
declare const styles: {
    base: string[];
    outline: string[];
    plain: string[];
    colors: {
        'dark/zinc': string;
        dark: string;
        'dark/white': string;
        light: string;
        white: string;
        zinc: string;
        blue: string;
        red: string;
        indigo: string;
        cyan: string;
        orange: string;
        amber: string;
        yellow: string;
        lime: string;
        green: string;
        emerald: string;
        teal: string;
        sky: string;
        violet: string;
        purple: string;
        fuchsia: string;
        pink: string;
        rose: string;
    };
};
export type ButtonColor = keyof typeof styles.colors;
export declare const buttonColors: ButtonColor[];
/** Style discriminant: exactly one of `color` (solid), `outline`, or `plain`. */
export type ButtonStyleProps = {
    color?: ButtonColor;
    outline?: never;
    plain?: never;
} | {
    color?: never;
    outline: true;
    plain?: never;
} | {
    color?: never;
    outline?: never;
    plain: true;
};
/** Element discriminant: `href` renders a `Link`, otherwise a native `<button>`. */
export type ButtonElementProps = ({
    href?: never;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
} & ElementProps) | ({
    href: string;
    target?: string;
} & ElementProps);
export type ButtonProps = ButtonStyleProps & {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ButtonElementProps;
export declare function Button(handle: Handle<ButtonProps>): () => import("remix/ui").RemixElement;
/**
 * Expands the hit area to at least 44×44px on coarse pointers (touch). Renders an `aria-hidden`
 * helper span before the children; the parent must be `relative`.
 */
export declare function TouchTarget(handle: Handle<{
    children?: RemixNode;
}>): () => import("remix/ui").RemixElement;
export {};

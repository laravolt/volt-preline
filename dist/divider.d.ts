/**
 * Preline `Divider` for Remix UI — API-compatible with `volt-catalyst/divider`.
 *
 * API parity: `<hr role="presentation">` with an optional `soft` flag.
 * Styling: Preline horizontal rule on the theme border tokens (`border-border`; `soft` uses the
 * lighter `border-line-1`).
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle } from 'remix/ui';
export type DividerProps = {
    soft?: boolean;
    className?: string;
    class?: string;
} & ElementProps;
export declare function Divider(handle: Handle<DividerProps>): () => import("remix/ui").RemixElement;

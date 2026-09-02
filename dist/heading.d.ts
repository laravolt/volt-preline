/**
 * Preline `Heading` / `Subheading` for Remix UI — API-compatible with `volt-catalyst/heading`.
 *
 * API parity: `level` (1–6, default 1 for `Heading`, 2 for `Subheading`) picks the `h*` tag via
 * `createElement`; other props spread onto the element.
 *
 * Styling: Preline typography — page title `text-2xl font-semibold text-foreground`, section
 * title `text-base font-semibold text-foreground`.
 *
 * Hydration: none required.
 */
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingProps = {
    level?: HeadingLevel;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Heading(handle: Handle<HeadingProps>): () => import("remix/ui").RemixElement;
export declare function Subheading(handle: Handle<HeadingProps>): () => import("remix/ui").RemixElement;

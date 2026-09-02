/**
 * Preline `Text` / `TextLink` / `Strong` / `Code` for Remix UI — API-compatible with
 * `velix-catalyst/text`.
 *
 * API parity: `Text` renders `<p data-slot="text">`, `TextLink` renders through `Link`
 * (`./link.tsx`), `Strong` → `<strong>`, `Code` → `<code>`; all accept `className`/`class` and
 * spread the rest.
 *
 * Styling: Preline typography tokens — body copy `text-sm text-muted-foreground-1`, links
 * `text-primary underline decoration-primary/40 hover:decoration-primary`, strong
 * `font-semibold text-foreground`, inline code as a small `bg-muted border-line-2` chip.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type TextProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Text(handle: Handle<TextProps>): () => import("remix/ui").RemixElement;
export type TextLinkProps = {
    href: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function TextLink(handle: Handle<TextLinkProps>): () => import("remix/ui").RemixElement;
export declare function Strong(handle: Handle<TextProps>): () => import("remix/ui").RemixElement;
export declare function Code(handle: Handle<TextProps>): () => import("remix/ui").RemixElement;

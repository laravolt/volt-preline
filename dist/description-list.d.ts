/**
 * Preline `DescriptionList` / `DescriptionTerm` / `DescriptionDetails` for Remix UI —
 * API-compatible with `velix-catalyst/description-list`.
 *
 * API parity: `<dl>` / `<dt>` / `<dd>` with `className`/`class` merging and prop passthrough.
 *
 * Styling: Preline has no dedicated description-list page; this follows its "list group / data
 * rows" look — a two-column grid on `sm+` (term column capped at 12rem), terms in
 * `text-muted-foreground-1`, details in `text-foreground`, rows separated by `border-line-1`.
 * On narrow screens each term stacks above its details with a single separator per pair.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type DescriptionListProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function DescriptionList(handle: Handle<DescriptionListProps>): () => import("remix/ui").RemixElement;
export declare function DescriptionTerm(handle: Handle<DescriptionListProps>): () => import("remix/ui").RemixElement;
export declare function DescriptionDetails(handle: Handle<DescriptionListProps>): () => import("remix/ui").RemixElement;

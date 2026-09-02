/**
 * `Pagination` family for velix-preline (API parity with velix-catalyst `pagination.tsx`: same
 * exports and props; Preline pagination look).
 *
 * - `Pagination` is `<nav aria-label="Page navigation">` (label overridable).
 * - `PaginationPrevious` / `PaginationNext` render `Button plain` as a link when `href` is a string,
 *   or as a disabled `<button>` when `href` is `null` (the default).
 * - `PaginationPage` is a `Button plain` link; `current` sets `aria-current="page"` and Preline's
 *   `bg-surface-1` active fill.
 * - `PaginationList` hides the page numbers below `sm` (only prev/next remain, like Preline's
 *   compact variant); `PaginationGap` is the `…` ellipsis.
 *
 * Hydration: none required — plain anchors and buttons.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type PaginationProps = {
    'aria-label'?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Pagination(handle: Handle<PaginationProps>): () => import("remix/ui").RemixElement;
export type PaginationPreviousProps = {
    /** `null` (default) renders a disabled button. */
    href?: string | null;
    className?: string;
    class?: string;
    children?: RemixNode;
};
export declare function PaginationPrevious(handle: Handle<PaginationPreviousProps>): () => import("remix/ui").RemixElement;
export type PaginationNextProps = PaginationPreviousProps;
export declare function PaginationNext(handle: Handle<PaginationNextProps>): () => import("remix/ui").RemixElement;
export type PaginationListProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function PaginationList(handle: Handle<PaginationListProps>): () => import("remix/ui").RemixElement;
export type PaginationPageProps = {
    href: string;
    className?: string;
    class?: string;
    current?: boolean;
    children?: RemixNode;
};
export declare function PaginationPage(handle: Handle<PaginationPageProps>): () => import("remix/ui").RemixElement;
export type PaginationGapProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function PaginationGap(handle: Handle<PaginationGapProps>): () => import("remix/ui").RemixElement;

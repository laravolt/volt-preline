/**
 * Preline `Table` family for Remix UI — API-compatible with `volt-catalyst/table`.
 *
 * API parity:
 * - `Table` provides `{ bleed, dense, grid, striped }` through `handle.context` (same shape as
 *   volt-catalyst's `TableContextValue`); `TableHead`/`TableBody`/`TableRow`/`TableHeader`/
 *   `TableCell` read it.
 * - `TableRow` provides `{ href, target, title, nextCellIndex }`; when a row has `href`, every
 *   `TableCell` renders an absolutely positioned `<a data-row-link>` overlay (`./link.tsx`) with
 *   `aria-label={title}`; only the first cell's overlay is tabbable (`tabIndex 0`, others `-1`).
 * - Root element gets the `className` and the other props (same as volt-catalyst).
 *
 * Styling: Preline UI 5 table — `min-w-full divide-y divide-table-line`, header cells
 * `text-xs font-semibold uppercase text-muted-foreground-1`, body cells `text-sm text-foreground`,
 * `striped` = Preline zebra rows (`even:bg-surface`), `grid` = Preline vertical dividers
 * (`divide-x divide-table-line` on rows), `dense` = tighter cell padding, and non-`bleed`
 * tables are framed in Preline's `rounded-lg border border-table-line shadow-xs` card; `bleed`
 * drops the frame so the table runs edge to edge. Linked rows highlight with
 * `hover:bg-muted-hover` and show a focus outline when their overlay link is focused.
 *
 * Hydration: none required; row links are ordinary anchors enhanced by Remix `run()`.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type TableContextValue = {
    bleed: boolean;
    dense: boolean;
    grid: boolean;
    striped: boolean;
};
export type TableProps = {
    bleed?: boolean;
    dense?: boolean;
    grid?: boolean;
    striped?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Table(handle: Handle<TableProps, TableContextValue>): () => import("remix/ui").RemixElement;
export type TableSectionProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function TableHead(handle: Handle<TableSectionProps>): () => import("remix/ui").RemixElement;
export declare function TableBody(handle: Handle<TableSectionProps>): () => import("remix/ui").RemixElement;
export type TableRowContextValue = {
    href?: string;
    target?: string;
    title?: string;
    /** Returns the 0-based index of the next `TableCell` rendered in this row. */
    nextCellIndex(): number;
};
export type TableRowProps = {
    href?: string;
    target?: string;
    title?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function TableRow(handle: Handle<TableRowProps, TableRowContextValue>): () => import("remix/ui").RemixElement;
export declare function TableHeader(handle: Handle<TableSectionProps>): () => import("remix/ui").RemixElement;
export declare function TableCell(handle: Handle<TableSectionProps>): () => import("remix/ui").RemixElement;

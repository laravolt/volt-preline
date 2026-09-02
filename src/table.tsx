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
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { Link } from './link.tsx'
import { cx, splitProps } from './utils.ts'

export type TableContextValue = { bleed: boolean; dense: boolean; grid: boolean; striped: boolean }

const defaultTableContext: TableContextValue = { bleed: false, dense: false, grid: false, striped: false }

export type TableProps = {
  bleed?: boolean
  dense?: boolean
  grid?: boolean
  striped?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Table(handle: Handle<TableProps, TableContextValue>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { bleed = false, dense = false, grid = false, striped = false, children, ...props } = rest
    handle.context.set({ bleed, dense, grid, striped })
    return (
      <div className="flow-root">
        <div {...props} className={cx(className, 'overflow-x-auto')}>
          <div className={cx('inline-block min-w-full align-middle', !bleed && 'overflow-hidden rounded-lg border border-table-line shadow-xs')}>
            <table className="min-w-full divide-y divide-table-line text-left text-sm text-foreground">{children}</table>
          </div>
        </div>
      </div>
    )
  }
}

export type TableSectionProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export function TableHead(handle: Handle<TableSectionProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <thead {...props} className={cx(className, 'bg-muted text-muted-foreground-1')}>
        {children}
      </thead>
    )
  }
}

export function TableBody(handle: Handle<TableSectionProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <tbody {...props} className={cx(className, 'divide-y divide-table-line')}>
        {children}
      </tbody>
    )
  }
}

export type TableRowContextValue = {
  href?: string
  target?: string
  title?: string
  /** Returns the 0-based index of the next `TableCell` rendered in this row. */
  nextCellIndex(): number
}

export type TableRowProps = { href?: string; target?: string; title?: string; className?: string; class?: string; children?: RemixNode } & ElementProps

export function TableRow(handle: Handle<TableRowProps, TableRowContextValue>) {
  return () => {
    let { striped, grid } = handle.context.get(Table) ?? defaultTableContext
    let { className, rest } = splitProps(handle.props)
    let { href, target, title, children, ...props } = rest

    let cellIndex = 0
    handle.context.set({ href, target, title, nextCellIndex: () => cellIndex++ })

    return (
      <tr
        {...props}
        className={cx(
          className,
          striped && 'even:bg-surface',
          grid && 'divide-x divide-table-line',
          href &&
            'hover:bg-muted-hover has-[[data-row-link]:focus-visible]:outline-2 has-[[data-row-link]:focus-visible]:-outline-offset-2 has-[[data-row-link]:focus-visible]:outline-primary',
        )}
      >
        {children}
      </tr>
    )
  }
}

export function TableHeader(handle: Handle<TableSectionProps>) {
  return () => {
    let { dense } = handle.context.get(Table) ?? defaultTableContext
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <th
        {...props}
        className={cx(className, 'px-4 text-start text-xs font-semibold uppercase whitespace-nowrap', dense ? 'py-2' : 'py-3')}
      >
        {children}
      </th>
    )
  }
}

export function TableCell(handle: Handle<TableSectionProps>) {
  return () => {
    let { dense } = handle.context.get(Table) ?? defaultTableContext
    let row = handle.context.get(TableRow)
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest

    let href = row?.href
    let isFirstCell = href ? row.nextCellIndex() === 0 : false

    return (
      <td {...props} className={cx(className, 'relative px-4 whitespace-nowrap', dense ? 'py-2' : 'py-4')}>
        {href && (
          <Link
            data-row-link=""
            href={href}
            {...(row.target ? { target: row.target } : {})}
            {...(row.title ? { 'aria-label': row.title } : {})}
            tabIndex={isFirstCell ? 0 : -1}
            className="absolute inset-0 focus:outline-hidden"
          />
        )}
        {children}
      </td>
    )
  }
}

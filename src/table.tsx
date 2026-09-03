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

export type TableResponsive = 'stack'

export type TableContextValue = { bleed: boolean; dense: boolean; grid: boolean; striped: boolean; responsive?: TableResponsive }

const defaultTableContext: TableContextValue = { bleed: false, dense: false, grid: false, striped: false }

export type TableProps = {
  bleed?: boolean
  dense?: boolean
  grid?: boolean
  striped?: boolean
  responsive?: TableResponsive
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Table(handle: Handle<TableProps, TableContextValue>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { bleed = false, dense = false, grid = false, striped = false, responsive, children, ...props } = rest
    handle.context.set({ bleed, dense, grid, striped, responsive })
    let stack = responsive === 'stack'
    return (
      <div className="flow-root">
        <div {...props} className={cx(className, stack ? 'overflow-x-auto max-sm:overflow-visible' : 'overflow-x-auto')}>
          <div
            className={cx(
              'inline-block min-w-full align-middle',
              !bleed && !stack && 'overflow-hidden rounded-lg border border-table-line shadow-xs',
              !bleed && stack && 'overflow-hidden rounded-lg border border-table-line shadow-xs max-sm:overflow-visible max-sm:rounded-none max-sm:border-0 max-sm:shadow-none',
            )}
          >
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
    let { responsive } = handle.context.get(Table) ?? defaultTableContext
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <thead
        {...props}
        className={cx(className, 'bg-muted text-muted-foreground-1', responsive === 'stack' && 'max-sm:sr-only')}
      >
        {children}
      </thead>
    )
  }
}

export function TableBody(handle: Handle<TableSectionProps>) {
  return () => {
    let { responsive } = handle.context.get(Table) ?? defaultTableContext
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <tbody
        {...props}
        className={cx(className, 'divide-y divide-table-line', responsive === 'stack' && 'max-sm:divide-y-0 max-sm:flex max-sm:flex-col max-sm:gap-3')}
      >
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
    let { striped, grid, responsive } = handle.context.get(Table) ?? defaultTableContext
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
          grid && responsive === 'stack' && 'max-sm:divide-x-0',
          responsive === 'stack' && 'max-sm:flex max-sm:flex-col max-sm:border max-sm:border-table-line max-sm:rounded-lg max-sm:overflow-hidden max-sm:bg-card max-sm:shadow-xs max-sm:divide-y-0',
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

export type TableCellProps = TableSectionProps & { stackedLabel?: string }

export function TableCell(handle: Handle<TableCellProps>) {
  return () => {
    let { dense, responsive } = handle.context.get(Table) ?? defaultTableContext
    let row = handle.context.get(TableRow)
    let { className, rest } = splitProps(handle.props)
    let { stackedLabel, children, ...props } = rest

    let href = row?.href
    let isFirstCell = href ? row.nextCellIndex() === 0 : false
    let stack = responsive === 'stack'

    return (
      <td
        {...props}
        className={cx(
          className,
          'relative px-4 whitespace-nowrap',
          dense ? 'py-2' : 'py-4',
          stack && 'max-sm:whitespace-normal max-sm:flex max-sm:items-start max-sm:justify-between max-sm:gap-4 max-sm:px-4 max-sm:py-3 max-sm:text-left',
        )}
      >
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
        {stackedLabel && stack && (
          <span aria-hidden="true" className="hidden max-sm:inline text-xs font-semibold uppercase text-muted-foreground-1 max-sm:shrink-0 max-sm:max-w-[45%]">
            {stackedLabel}
          </span>
        )}
        <span className={cx(stack && 'max-sm:flex-1 max-sm:text-right max-sm:text-sm', !stack && 'contents')}>{children}</span>
      </td>
    )
  }
}

/**
 * `Pagination` family for volt-preline (API parity with volt-catalyst `pagination.tsx`: same
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
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { Button } from './button.tsx'
import { cx, splitProps } from './utils.ts'

export type PaginationProps = {
  'aria-label'?: string
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Pagination(handle: Handle<PaginationProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { 'aria-label': ariaLabel = 'Page navigation', children, ...attrs } = rest
    return (
      <nav aria-label={ariaLabel} {...attrs} className={cx(className, 'flex items-center gap-x-1')}>
        {children}
      </nav>
    )
  }
}

export type PaginationPreviousProps = {
  /** `null` (default) renders a disabled button. */
  href?: string | null
  className?: string
  class?: string
  children?: RemixNode
}

const edgeButtonClasses = 'min-h-9.5 min-w-9.5 px-2.5 py-2 gap-x-1.5'

export function PaginationPrevious(handle: Handle<PaginationPreviousProps>) {
  return () => {
    let { className } = splitProps(handle.props)
    let { href = null, children = 'Previous' } = handle.props
    return (
      <span className={cx(className, 'grow basis-0')}>
        <Button
          {...(href === null ? { disabled: true } : { href })}
          plain
          aria-label="Previous page"
          className={edgeButtonClasses}
        >
          <svg data-slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {children}
        </Button>
      </span>
    )
  }
}

export type PaginationNextProps = PaginationPreviousProps

export function PaginationNext(handle: Handle<PaginationNextProps>) {
  return () => {
    let { className } = splitProps(handle.props)
    let { href = null, children = 'Next' } = handle.props
    return (
      <span className={cx(className, 'flex grow basis-0 justify-end')}>
        <Button
          {...(href === null ? { disabled: true } : { href })}
          plain
          aria-label="Next page"
          className={edgeButtonClasses}
        >
          {children}
          <svg data-slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </span>
    )
  }
}

export type PaginationListProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export function PaginationList(handle: Handle<PaginationListProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <span {...attrs} className={cx(className, 'hidden items-center gap-x-1 sm:flex')}>
        {children}
      </span>
    )
  }
}

export type PaginationPageProps = {
  href: string
  className?: string
  class?: string
  current?: boolean
  children?: RemixNode
}

export function PaginationPage(handle: Handle<PaginationPageProps>) {
  return () => {
    let { className } = splitProps(handle.props)
    let { href, current = false, children } = handle.props
    return (
      <Button
        href={href}
        plain
        aria-label={`Page ${children}`}
        {...(current ? { 'aria-current': 'page' } : {})}
        className={cx(className, 'min-h-9.5 min-w-9.5 justify-center px-3 py-2', current && 'bg-surface-1 hover:bg-surface-hover')}
      >
        {children}
      </Button>
    )
  }
}

export type PaginationGapProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export function PaginationGap(handle: Handle<PaginationGapProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children = '…', ...attrs } = rest
    return (
      <span
        aria-hidden="true"
        {...attrs}
        className={cx(className, 'flex min-h-9.5 min-w-9.5 items-center justify-center p-2 text-sm text-muted-foreground select-none')}
      >
        {children}
      </span>
    )
  }
}

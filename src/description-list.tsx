/**
 * Preline `DescriptionList` / `DescriptionTerm` / `DescriptionDetails` for Remix UI —
 * API-compatible with `volt-catalyst/description-list`.
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
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { cx, splitProps } from './utils.ts'

export type DescriptionListProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export function DescriptionList(handle: Handle<DescriptionListProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <dl {...props} className={cx(className, 'grid grid-cols-1 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]')}>
        {children}
      </dl>
    )
  }
}

export function DescriptionTerm(handle: Handle<DescriptionListProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <dt
        {...props}
        className={cx(className, 'col-start-1 border-t border-line-1 pt-3 font-medium text-muted-foreground-1 first:border-t-0 sm:py-3')}
      >
        {children}
      </dt>
    )
  }
}

export function DescriptionDetails(handle: Handle<DescriptionListProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <dd {...props} className={cx(className, 'pt-1 pb-3 text-foreground sm:border-t sm:border-line-1 sm:py-3 sm:nth-2:border-t-0')}>
        {children}
      </dd>
    )
  }
}

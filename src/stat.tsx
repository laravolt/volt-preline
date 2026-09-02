/**
 * `Stat` tile for Remix UI — API-compatible with `volt-catalyst/stat` (`title`, `value`,
 * `change`; a leading `+` in `change` renders a green badge, otherwise red).
 *
 * Styling: Preline UI 5 stat card — `bg-card border border-card-line shadow-2xs rounded-xl`, an
 * uppercase `text-xs text-muted-foreground-1` label, a `text-2xl font-medium text-foreground`
 * value and a soft `Badge` next to a muted "from last week" caption.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle } from 'remix/ui'

import { Badge } from './badge.tsx'
import { cx, splitProps } from './utils.ts'

export type StatProps = { title: string; value: string; change: string; className?: string; class?: string } & ElementProps

export function Stat(handle: Handle<StatProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { title, value, change, ...props } = rest
    let up = String(change).startsWith('+')
    return (
      <div {...props} className={cx(className, 'flex flex-col rounded-xl border border-card-line bg-card p-4 shadow-2xs md:p-5')}>
        <div className="text-xs font-semibold tracking-wide text-muted-foreground-1 uppercase">{title}</div>
        <div className="mt-2 text-xl font-medium text-foreground sm:text-2xl">{value}</div>
        <div className="mt-3 flex items-center gap-x-2 text-xs">
          <Badge color={up ? 'green' : 'red'}>{change}</Badge>
          <span className="text-muted-foreground-1">from last week</span>
        </div>
      </div>
    )
  }
}

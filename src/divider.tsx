/**
 * Preline `Divider` for Remix UI — API-compatible with `velix-catalyst/divider`.
 *
 * API parity: `<hr role="presentation">` with an optional `soft` flag.
 * Styling: Preline horizontal rule on the theme border tokens (`border-border`; `soft` uses the
 * lighter `border-line-1`).
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle } from 'remix/ui'

import { cx, splitProps } from './utils.ts'

export type DividerProps = { soft?: boolean; className?: string; class?: string } & ElementProps

export function Divider(handle: Handle<DividerProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { soft = false, ...props } = rest
    return <hr role="presentation" {...props} className={cx(className, 'w-full border-t', soft ? 'border-line-1' : 'border-border')} />
  }
}

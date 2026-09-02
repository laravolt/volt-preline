/**
 * Preline `Heading` / `Subheading` for Remix UI — API-compatible with `volt-catalyst/heading`.
 *
 * API parity: `level` (1–6, default 1 for `Heading`, 2 for `Subheading`) picks the `h*` tag via
 * `createElement`; other props spread onto the element.
 *
 * Styling: Preline typography — page title `text-2xl font-semibold text-foreground`, section
 * title `text-base font-semibold text-foreground`.
 *
 * Hydration: none required.
 */
import { createElement, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { cx, splitProps } from './utils.ts'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = { level?: HeadingLevel; className?: string; class?: string; children?: RemixNode } & ElementProps

export function Heading(handle: Handle<HeadingProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { level = 1, children, ...props } = rest
    return createElement(
      `h${level as HeadingLevel}`,
      { ...props, className: cx(className, 'text-2xl font-semibold text-foreground') },
      children,
    )
  }
}

export function Subheading(handle: Handle<HeadingProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { level = 2, children, ...props } = rest
    return createElement(
      `h${level as HeadingLevel}`,
      { ...props, className: cx(className, 'text-base font-semibold text-foreground') },
      children,
    )
  }
}

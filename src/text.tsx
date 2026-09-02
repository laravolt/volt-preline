/**
 * Preline `Text` / `TextLink` / `Strong` / `Code` for Remix UI — API-compatible with
 * `velix-catalyst/text`.
 *
 * API parity: `Text` renders `<p data-slot="text">`, `TextLink` renders through `Link`
 * (`./link.tsx`), `Strong` → `<strong>`, `Code` → `<code>`; all accept `className`/`class` and
 * spread the rest.
 *
 * Styling: Preline typography tokens — body copy `text-sm text-muted-foreground-1`, links
 * `text-primary underline decoration-primary/40 hover:decoration-primary`, strong
 * `font-semibold text-foreground`, inline code as a small `bg-muted border-line-2` chip.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { Link } from './link.tsx'
import { cx, splitProps } from './utils.ts'

export type TextProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export function Text(handle: Handle<TextProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <p data-slot="text" {...props} className={cx(className, 'text-sm text-muted-foreground-1')}>
        {children}
      </p>
    )
  }
}

export type TextLinkProps = { href: string; className?: string; class?: string; children?: RemixNode } & ElementProps

export function TextLink(handle: Handle<TextLinkProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { href, children, ...props } = rest
    return (
      <Link
        {...props}
        href={href}
        className={cx(
          className,
          'text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-hover hover:decoration-primary focus:outline-hidden focus:decoration-primary',
        )}
      >
        {children}
      </Link>
    )
  }
}

export function Strong(handle: Handle<TextProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <strong {...props} className={cx(className, 'font-semibold text-foreground')}>
        {children}
      </strong>
    )
  }
}

export function Code(handle: Handle<TextProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <code
        {...props}
        className={cx(className, 'rounded-sm border border-line-2 bg-muted px-1 py-0.5 font-mono text-[0.8125rem] font-medium text-foreground')}
      >
        {children}
      </code>
    )
  }
}

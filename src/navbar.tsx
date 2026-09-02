/**
 * `Navbar` family for volt-preline (API parity with volt-catalyst `navbar.tsx`: same exports,
 * props, context wiring and `data-current` behavior; Preline navbar look).
 *
 * - `Navbar` is a `<nav>` row; hosts (layouts) paint `bg-navbar border-b border-navbar-line`.
 * - `NavbarSection` owns a `LayoutGroup` (see `./current-indicator.tsx`) so the current-item marker
 *   slides between its `NavbarItem`s.
 * - `NavbarItem` with `href` renders `<Link>` (plain `<a>`), otherwise `<button type="button">`.
 *   `current` sets `data-current="true"`, tints the item `text-primary` (Preline's active nav link)
 *   and renders a keyed `bg-primary` underline via `CurrentIndicator`.
 * - Icons: children with `data-slot="icon"` are sized; a trailing icon (chevron) is pushed to the end.
 * - Attach behavior with `mix={on('click', …)}`.
 *
 * Hydration: markup is server-renderable; the animated marker needs the composition to live inside
 * an app `clientEntry` that re-renders when `current` changes.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { TouchTarget } from './button.tsx'
import { CurrentIndicator, LayoutGroup } from './current-indicator.tsx'
import { Link } from './link.tsx'
import { cx, splitProps } from './utils.ts'

type DivProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export type NavbarProps = DivProps

export function Navbar(handle: Handle<NavbarProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <nav {...attrs} className={cx(className, 'flex flex-1 items-center gap-x-4 py-3 text-navbar-nav-foreground')}>
        {children}
      </nav>
    )
  }
}

export type NavbarDividerProps = DivProps

export function NavbarDivider(handle: Handle<NavbarDividerProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    return <div aria-hidden="true" {...rest} className={cx(className, 'h-6 w-px shrink-0 bg-navbar-divider')} />
  }
}

export type NavbarSectionProps = DivProps

/** Scopes the sliding current-item marker (Catalyst `LayoutGroup` equivalent). */
export function NavbarSection(handle: Handle<NavbarSectionProps, LayoutGroup>) {
  let group = new LayoutGroup()
  handle.context.set(group)

  return () => {
    group.snapshot()
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div {...attrs} className={cx(className, 'flex items-center gap-x-1')}>
        {children}
      </div>
    )
  }
}

export type NavbarSpacerProps = DivProps

export function NavbarSpacer(handle: Handle<NavbarSpacerProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    return <div aria-hidden="true" {...rest} className={cx(className, 'flex-1')} />
  }
}

export type NavbarItemProps = {
  current?: boolean
  className?: string
  class?: string
  children?: RemixNode
  /** With `href` the item renders as a `<Link>`; without it, as `<button type="button">`. */
  href?: string
} & ElementProps

const itemClasses = cx(
  // Preline nav link: compact rounded pill, semantic navbar tokens
  'relative flex min-w-0 items-center gap-x-2 rounded-lg px-2.5 py-2 text-start text-sm font-medium text-navbar-nav-foreground',
  'hover:bg-navbar-nav-hover focus:outline-hidden focus-visible:bg-navbar-nav-focus active:bg-navbar-nav-active',
  'disabled:pointer-events-none disabled:opacity-50',
  // Current: Preline tints the active link with the primary color
  'data-current:text-primary',
  // Icon children
  '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground-1',
  'hover:*:data-[slot=icon]:text-navbar-nav-foreground data-current:*:data-[slot=icon]:text-primary',
  // A trailing icon (e.g. chevron) after other content is pushed to the end and drawn smaller
  '*:not-first:last:data-[slot=icon]:ms-auto *:not-first:last:data-[slot=icon]:size-4',
  // Avatar children
  '*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:shrink-0',
)

export function NavbarItem(handle: Handle<NavbarItemProps>) {
  let group = handle.context.get(NavbarSection)

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { current, children, href, ...attrs } = rest
    let currentAttr = current ? { 'data-current': 'true' } : {}

    return (
      <span className={cx(className, 'relative')}>
        {current && (
          <CurrentIndicator
            key="current-indicator"
            group={group}
            className="absolute inset-x-2.5 -bottom-3 h-0.5 rounded-full bg-primary"
          />
        )}
        {typeof href === 'string' ? (
          <Link {...attrs} href={href} className={itemClasses} {...currentAttr}>
            <TouchTarget>{children}</TouchTarget>
          </Link>
        ) : (
          <button type="button" {...attrs} className={itemClasses} {...currentAttr}>
            <TouchTarget>{children}</TouchTarget>
          </button>
        )}
      </span>
    )
  }
}

export type NavbarLabelProps = DivProps

export function NavbarLabel(handle: Handle<NavbarLabelProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <span {...attrs} className={cx(className, 'truncate')}>
        {children}
      </span>
    )
  }
}

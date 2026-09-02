/**
 * `Sidebar` family for velix-preline (API parity with velix-catalyst `sidebar.tsx`: same exports,
 * props, context wiring, `data-current` and drawer-closing behavior; Preline sidebar look).
 *
 * - `Sidebar` is a full-height `<nav>` column painted with `bg-sidebar` tokens; the host (layout)
 *   adds the `border-e border-sidebar-line` edge.
 * - `SidebarSection` owns a `LayoutGroup` (see `./current-indicator.tsx`) so the current-item marker
 *   slides between its `SidebarItem`s.
 * - `SidebarItem` with `href` renders `<Link>` and, on click, closes the nearest open `<dialog>`
 *   ancestor (the mobile drawer of `SidebarLayout`/`StackedLayout`). Without `href` it renders
 *   `<button type="button">`. `current` sets `data-current="true"`, paints Preline's
 *   `bg-sidebar-nav-active` and renders a keyed `bg-primary` leading bar via `CurrentIndicator`.
 * - Attach behavior with `mix={on('click', …)}`; a user `mix` is composed after the drawer-close one.
 *
 * Hydration: markup is server-renderable; the animated marker and drawer-close need the composition
 * to live inside an app `clientEntry`.
 */
import { on, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { TouchTarget } from './button.tsx'
import { CurrentIndicator, LayoutGroup } from './current-indicator.tsx'
import { Link } from './link.tsx'
import { cx, splitProps } from './utils.ts'

type DivProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export type SidebarProps = DivProps

export function Sidebar(handle: Handle<SidebarProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <nav {...attrs} className={cx(className, 'flex h-full min-h-0 flex-col bg-sidebar text-sidebar-nav-foreground')}>
        {children}
      </nav>
    )
  }
}

export type SidebarHeaderProps = DivProps

export function SidebarHeader(handle: Handle<SidebarHeaderProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div
        {...attrs}
        className={cx(className, 'flex flex-col border-b border-sidebar-divider p-2 *:data-[slot=section]:not-first:mt-2')}
      >
        {children}
      </div>
    )
  }
}

export type SidebarBodyProps = DivProps

export function SidebarBody(handle: Handle<SidebarBodyProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div
        {...attrs}
        className={cx(className, 'flex flex-1 flex-col overflow-y-auto p-2 *:data-[slot=section]:not-first:mt-6')}
      >
        {children}
      </div>
    )
  }
}

export type SidebarFooterProps = DivProps

export function SidebarFooter(handle: Handle<SidebarFooterProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div
        {...attrs}
        className={cx(className, 'mt-auto flex flex-col border-t border-sidebar-divider p-2 *:data-[slot=section]:not-first:mt-2')}
      >
        {children}
      </div>
    )
  }
}

export type SidebarSectionProps = DivProps

/** Scopes the sliding current-item marker (Catalyst `LayoutGroup` equivalent). */
export function SidebarSection(handle: Handle<SidebarSectionProps, LayoutGroup>) {
  let group = new LayoutGroup()
  handle.context.set(group)

  return () => {
    group.snapshot()
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div {...attrs} data-slot="section" className={cx(className, 'flex flex-col gap-y-1')}>
        {children}
      </div>
    )
  }
}

export type SidebarDividerProps = { className?: string; class?: string } & ElementProps

export function SidebarDivider(handle: Handle<SidebarDividerProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    return <hr {...rest} className={cx(className, 'my-3 border-t border-sidebar-divider')} />
  }
}

export type SidebarSpacerProps = DivProps

export function SidebarSpacer(handle: Handle<SidebarSpacerProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    return <div aria-hidden="true" {...rest} className={cx(className, 'mt-6 flex-1')} />
  }
}

export type SidebarHeadingProps = DivProps

export function SidebarHeading(handle: Handle<SidebarHeadingProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <h3 {...attrs} className={cx(className, 'px-2.5 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground-1')}>
        {children}
      </h3>
    )
  }
}

export type SidebarItemProps = {
  current?: boolean
  className?: string
  class?: string
  children?: RemixNode
  /** With `href` the item renders as a `<Link>` (and closes an enclosing open `<dialog>`); without it, as `<button type="button">`. */
  href?: string
} & ElementProps

const itemClasses = cx(
  // Preline sidebar link
  'flex w-full items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-start text-sm text-sidebar-nav-foreground',
  'hover:bg-sidebar-nav-hover focus:outline-hidden focus-visible:bg-sidebar-nav-focus',
  'disabled:pointer-events-none disabled:opacity-50',
  // Current: Preline's active background + medium weight
  'data-current:bg-sidebar-nav-active data-current:font-medium',
  // Icon children
  '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground-1',
  'hover:*:data-[slot=icon]:text-sidebar-nav-foreground data-current:*:data-[slot=icon]:text-primary',
  // A trailing icon after other content goes to the end, smaller
  '*:not-first:last:data-[slot=icon]:ms-auto *:not-first:last:data-[slot=icon]:size-4',
  // Avatar children
  '*:data-[slot=avatar]:size-6 *:data-[slot=avatar]:shrink-0',
)

export function SidebarItem(handle: Handle<SidebarItemProps>) {
  let group = handle.context.get(SidebarSection)

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { current, children, href, mix, ...attrs } = rest
    let currentAttr = current ? { 'data-current': 'true' } : {}

    return (
      <span className={cx(className, 'relative')}>
        {current && (
          <CurrentIndicator
            key="current-indicator"
            group={group}
            className="absolute inset-y-2 -start-2 w-0.5 rounded-full bg-primary"
          />
        )}
        {typeof href === 'string' ? (
          <Link
            {...attrs}
            href={href}
            className={itemClasses}
            {...currentAttr}
            mix={[
              // Navigating from inside the mobile drawer dismisses it.
              on<HTMLAnchorElement>('click', (event) => {
                let dialog = event.currentTarget.closest('dialog')
                if (dialog?.open) dialog.close()
              }),
              mix,
            ]}
          >
            <TouchTarget>{children}</TouchTarget>
          </Link>
        ) : (
          <button
            type="button"
            {...attrs}
            className={itemClasses}
            {...currentAttr}
            {...(mix !== undefined ? { mix } : {})}
          >
            <TouchTarget>{children}</TouchTarget>
          </button>
        )}
      </span>
    )
  }
}

export type SidebarLabelProps = DivProps

export function SidebarLabel(handle: Handle<SidebarLabelProps>) {
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

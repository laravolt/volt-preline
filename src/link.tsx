/**
 * `Link` for velix-preline (API parity with velix-catalyst `link.tsx`).
 *
 * A plain `<a href>`: same-origin anchors are progressively enhanced by Remix `run()`, so no `link()`
 * mixin is needed. Accepts both `className` and `class`; every other prop (including `mix`,
 * `target`, `rel`, `data-*`) is spread onto the anchor. No default styling — callers (Button,
 * NavbarItem, SidebarItem, PaginationPage) supply their own Preline classes.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { splitProps } from './utils.ts'

export type LinkProps = { href: string; className?: string; class?: string; children?: RemixNode } & ElementProps

export function Link(handle: Handle<LinkProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { href, children, ...attrs } = rest
    return (
      <a {...attrs} href={href} {...(className !== undefined ? { className } : {})}>
        {children}
      </a>
    )
  }
}

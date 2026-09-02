/**
 * `StackedLayout` for volt-preline (API parity with volt-catalyst `stacked-layout.tsx`: same
 * `navbar`/`sidebar`/`children` props and drawer behavior; Preline navbar-on-top layout).
 *
 * A `bg-navbar border-b border-navbar-line` header spans the top with the `navbar` node; below `lg`
 * it also shows an "Open navigation" button that opens the `sidebar` node in the same native
 * `<dialog>` drawer as `SidebarLayout` (shared `mobileSidebarDialogClasses`): slide transition,
 * dimmed backdrop, closes on Escape, backdrop click, "Close navigation" and `SidebarItem` links.
 *
 * Hydration: render inside an app `clientEntry` so the open/close buttons are wired; the layout
 * itself is not a client entry.
 */
import { on, ref, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { NavbarItem } from './navbar.tsx'
import { CloseMenuIcon, OpenMenuIcon, mobileSidebarDialogClasses, mobileSidebarPanelClasses } from './sidebar-layout.tsx'
import { cx, splitProps } from './utils.ts'

export type StackedLayoutProps = {
  navbar: RemixNode
  sidebar: RemixNode
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function StackedLayout(handle: Handle<StackedLayoutProps>) {
  let dialog: HTMLDialogElement | undefined
  let panel: HTMLElement | undefined

  let open = () => {
    if (dialog && !dialog.open) dialog.showModal()
  }
  let close = () => {
    if (dialog?.open) dialog.close()
  }

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { navbar, sidebar, children, ...attrs } = rest

    return (
      <div {...attrs} className={cx(className, 'relative isolate flex min-h-svh w-full flex-col bg-background text-foreground')}>
        {/* Sidebar on mobile */}
        <dialog
          aria-label="Navigation"
          className={mobileSidebarDialogClasses}
          mix={[
            ref((node) => {
              dialog = node as HTMLDialogElement
            }),
            on('click', (event) => {
              if (!panel || !panel.contains(event.target as Node)) close()
            }),
          ]}
        >
          <div
            className={mobileSidebarPanelClasses}
            mix={ref((node) => {
              panel = node as HTMLElement
            })}
          >
            <div className="flex justify-end px-2 pt-2">
              <NavbarItem aria-label="Close navigation" mix={on<HTMLButtonElement>('click', close)}>
                <CloseMenuIcon />
              </NavbarItem>
            </div>
            {sidebar}
          </div>
        </dialog>

        {/* Navbar */}
        <header className="flex items-center gap-x-2 border-b border-navbar-line bg-navbar px-4 sm:px-6">
          <div className="lg:hidden">
            <NavbarItem aria-label="Open navigation" mix={on<HTMLButtonElement>('click', open)}>
              <OpenMenuIcon />
            </NavbarItem>
          </div>
          <div className="min-w-0 flex-1">{navbar}</div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col">
          <div className="grow p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </main>
      </div>
    )
  }
}

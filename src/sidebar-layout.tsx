/**
 * `SidebarLayout` for volt-preline (API parity with volt-catalyst `sidebar-layout.tsx`: same
 * `navbar`/`sidebar`/`children` props and drawer behavior; Preline application-layout look).
 *
 * - Desktop (`lg+`): a fixed 16rem `bg-sidebar border-e border-sidebar-line` column and the content
 *   offset by the same width on `bg-background`.
 * - Mobile: a `bg-navbar border-b border-navbar-line` header with an "Open navigation" button and the
 *   `navbar` node; the `sidebar` node is repeated inside a native `<dialog aria-label="Navigation">`
 *   drawer opened with `showModal()`. It slides in from the start edge (`open:` / `starting:open:` +
 *   `transition-discrete` so the leave also animates), dims the page with `::backdrop`, closes on
 *   Escape (native), on backdrop click, on the "Close navigation" button, and when a `SidebarItem`
 *   with `href` is clicked inside it.
 * - `mobileSidebarDialogClasses` is exported so `StackedLayout` shares the exact same drawer.
 *
 * Hydration: the open/close buttons only work once hydrated, so render this layout inside an app
 * `clientEntry` (the layout itself is not one). Server output is the closed drawer plus the desktop
 * sidebar.
 */
import { on, ref, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { NavbarItem } from './navbar.tsx'
import { cx, splitProps } from './utils.ts'

export function OpenMenuIcon() {
  return () => (
    <svg data-slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseMenuIcon() {
  return () => (
    <svg data-slot="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

/** Classes for the mobile drawer `<dialog>`: UA reset + Preline off-canvas slide + dimmed backdrop. */
export const mobileSidebarDialogClasses = cx(
  // Turn the UA dialog box into an off-canvas panel pinned to the start edge
  'fixed inset-y-0 start-0 m-0 h-full max-h-none w-64 max-w-[85vw] border-0 bg-transparent p-0 text-inherit lg:hidden',
  // Slide in/out (Preline: transition-all duration-300 transform)
  '-translate-x-full transition-all transition-discrete duration-300 ease-in-out open:translate-x-0 starting:open:-translate-x-full',
  // Backdrop fade
  'backdrop:bg-black/50 backdrop:opacity-0 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300',
  'open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
)

/** Classes for the panel inside the drawer (the visible sidebar surface). */
export const mobileSidebarPanelClasses = 'flex h-full flex-col border-e border-sidebar-line bg-sidebar shadow-lg'

export type SidebarLayoutProps = {
  navbar: RemixNode
  sidebar: RemixNode
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function SidebarLayout(handle: Handle<SidebarLayoutProps>) {
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
      <div
        {...attrs}
        className={cx(className, 'relative isolate flex min-h-svh w-full bg-background text-foreground max-lg:flex-col')}
      >
        {/* Sidebar on desktop */}
        <div className="fixed inset-y-0 start-0 z-10 w-64 border-e border-sidebar-line bg-sidebar max-lg:hidden">{sidebar}</div>

        {/* Sidebar on mobile */}
        <dialog
          aria-label="Navigation"
          className={mobileSidebarDialogClasses}
          mix={[
            ref((node) => {
              dialog = node as HTMLDialogElement
            }),
            on('click', (event) => {
              // A click that does not land inside the panel hit the backdrop.
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

        {/* Navbar on mobile */}
        <header className="flex items-center gap-x-2 border-b border-navbar-line bg-navbar px-4 lg:hidden">
          <NavbarItem aria-label="Open navigation" mix={on<HTMLButtonElement>('click', open)}>
            <OpenMenuIcon />
          </NavbarItem>
          <div className="min-w-0 flex-1">{navbar}</div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col lg:min-w-0 lg:ps-64">
          <div className="grow p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </main>
      </div>
    )
  }
}

/**
 * Internal: the sliding "current item" marker shared by `NavbarItem` and `SidebarItem`
 * (API parity with velix-catalyst `current-indicator.tsx`; same `LayoutGroup` + `CurrentIndicator`
 * exports and behavior).
 *
 * Mechanics:
 * - `NavbarSection` / `SidebarSection` create a `LayoutGroup` and expose it through `handle.context`.
 * - The current item renders one keyed `<span data-slot="current-indicator">` with `animateLayout()`
 *   from `remix/ui/animation`, which FLIP-animates the span whenever its own item moves or resizes.
 * - When `current` jumps to a *different* item the span is a new element in a new parent, so
 *   `animateLayout` alone cannot connect the two. The group therefore records the live marker's box
 *   at the start of every section render (before the DOM is patched) and the freshly inserted span
 *   plays a Web Animations FLIP from that recorded box to its own position.
 *
 * Look: Preline's current state is a primary accent — the marker is a thin `bg-primary` bar
 * (underline in the navbar, leading bar in the sidebar); the item itself also gets `data-current`.
 *
 * Server rendering: the span is plain markup; boxes are only measured in the browser.
 */
import { ref, type Handle } from 'remix/ui'
import { animateLayout, spring } from 'remix/ui/animation'

const INDICATOR_KEY = 'current-indicator'

/** Context value provided by a section (the equivalent of Catalyst's `LayoutGroup`). */
export class LayoutGroup {
  /** The marker element currently mounted in this group, if any. */
  node: HTMLElement | null = null
  /** Box of the marker measured during the last render, before the DOM commit. */
  lastBox: DOMRect | null = null

  /** Call at the top of the section's render function. */
  snapshot(): void {
    if (this.node?.isConnected) this.lastBox = this.node.getBoundingClientRect()
  }
}

function playHandoff(node: HTMLElement, from: DOMRect) {
  let to = node.getBoundingClientRect()
  if (!to.width || !to.height) return
  let dx = from.left - to.left
  let dy = from.top - to.top
  let sx = from.width / to.width
  let sy = from.height / to.height
  let unchanged = Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.001 && Math.abs(sy - 1) < 0.001
  if (unchanged) return
  node.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: '0 0' },
      { transform: 'none', transformOrigin: '0 0' },
    ],
    { ...spring('snappy') },
  )
}

export type CurrentIndicatorProps = {
  /** The enclosing section's group (undefined when an item is rendered outside a section). */
  group: LayoutGroup | undefined
  className: string
}

export function CurrentIndicator(handle: Handle<CurrentIndicatorProps>) {
  return () => {
    let { group, className } = handle.props
    // Sections snapshot during their own render; this covers items updated outside a section render.
    group?.snapshot()

    return (
      <span
        key={INDICATOR_KEY}
        aria-hidden="true"
        data-slot="current-indicator"
        className={className}
        mix={[
          animateLayout({ ...spring('snappy') }),
          ref((el, signal) => {
            if (!group) return
            let node = el as HTMLElement
            if (group.node !== node && group.lastBox) playHandoff(node, group.lastBox)
            group.node = node
            group.lastBox = null
            signal.addEventListener('abort', () => {
              if (group.node === node) group.node = null
            })
          }),
        ]}
      />
    )
  }
}

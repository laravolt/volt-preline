/**
 * Internal: the sliding "current item" marker shared by `NavbarItem` and `SidebarItem`
 * (API parity with volt-catalyst `current-indicator.tsx`; same `LayoutGroup` + `CurrentIndicator`
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
import { type Handle } from 'remix/ui';
/** Context value provided by a section (the equivalent of Catalyst's `LayoutGroup`). */
export declare class LayoutGroup {
    /** The marker element currently mounted in this group, if any. */
    node: HTMLElement | null;
    /** Box of the marker measured during the last render, before the DOM commit. */
    lastBox: DOMRect | null;
    /** Call at the top of the section's render function. */
    snapshot(): void;
}
export type CurrentIndicatorProps = {
    /** The enclosing section's group (undefined when an item is rendered outside a section). */
    group: LayoutGroup | undefined;
    className: string;
};
export declare function CurrentIndicator(handle: Handle<CurrentIndicatorProps>): () => import("remix/ui").RemixElement;

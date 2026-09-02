/**
 * `Dropdown` — Preline "Dropdown" styling on top of `remix/ui/menu/primitives` (no `preline.js`).
 *
 * API parity with `velix-catalyst/dropdown`: `Dropdown` (`label`, `onSelect(event)`), `DropdownButton`
 * (`as`, defaults to `Button`), `DropdownMenu` (`anchor="bottom end"` strings), `DropdownItem` (`href`,
 * `name`, `value`, `label`, `searchValue`, `disabled`), `DropdownHeader`, `DropdownSection`,
 * `DropdownHeading`, `DropdownDivider`, `DropdownLabel`, `DropdownDescription`, `DropdownShortcut`.
 *
 * Wiring:
 * - `Dropdown` renders `menu.Context` (no wrapper element) and exposes `onSelect` through context; the
 *   `MenuSelectEvent` also bubbles from the item so ancestors can listen with `onMenuSelect(...)`.
 * - `DropdownButton` applies `menu.trigger()`; the host component must forward `mix` to its root element.
 * - `DropdownMenu` is a native `popover="manual"` surface positioned by `remix/ui/anchor`. The `anchor`
 *   prop is mapped to an anchor placement (`'bottom end'` → `bottom-end`, gap 8px — Preline's `mt-2`)
 *   and swapped into the popover context right before the surface opens. The resolved placement (after
 *   viewport flipping) is written to `data-anchor-placement`.
 * - `DropdownItem` with `href` renders `<a role="menuitem">` (enhanced by `run()`); otherwise a
 *   `<button type="button">`. Highlight state comes from the primitives as `data-highlighted`, disabled
 *   as `aria-disabled`.
 * - `DropdownSection` gets `aria-labelledby` when a `DropdownHeading` is rendered; `DropdownItem` gets
 *   `aria-describedby` for a rendered `DropdownDescription` / `DropdownShortcut`.
 *
 * Hydration: interactive only inside an app `clientEntry`; the components are not client entries.
 */
import {
  on,
  ref,
  type Dispatched,
  type ElementProps,
  type ElementType,
  type Handle,
  type MixValue,
  type RemixNode,
} from 'remix/ui'
import type { AnchorOptions } from 'remix/ui/anchor'
import * as menu from 'remix/ui/menu/primitives'
import * as popover from 'remix/ui/popover'

import { Button } from './button.tsx'
import { cx, splitProps } from './utils.ts'

export type DropdownAnchor =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top start'
  | 'top end'
  | 'bottom start'
  | 'bottom end'
  | 'left start'
  | 'left end'
  | 'right start'
  | 'right end'

/** `anchor="bottom end"` → remix anchor options. Gap = Preline's `mt-2`. */
function toAnchorOptions(anchor: DropdownAnchor): AnchorOptions {
  return { placement: anchor.replace(' ', '-') as NonNullable<AnchorOptions['placement']>, offset: 8 }
}

// ---------------------------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------------------------

export type DropdownSelectEvent = Dispatched<menu.MenuSelectEvent, HTMLElement>

export interface DropdownProps {
  /** Accessible name for the menu surface (defaults to the trigger's content). */
  label?: string
  /** Called once per selection with the `MenuSelectEvent` (`event.item.name` / `event.item.value`). */
  onSelect?: (event: DropdownSelectEvent) => void
  children?: RemixNode
}

interface DropdownContextValue {
  readonly onSelect: DropdownProps['onSelect']
}

export function Dropdown(handle: Handle<DropdownProps, DropdownContextValue>) {
  handle.context.set({
    get onSelect() {
      return handle.props.onSelect
    },
  })
  return () => <menu.Context label={handle.props.label}>{handle.props.children}</menu.Context>
}

// ---------------------------------------------------------------------------------------------
// DropdownButton
// ---------------------------------------------------------------------------------------------

export interface DropdownButtonProps extends ElementProps {
  /** Component or tag to render; defaults to `Button`. Must forward `mix` to its root element. */
  as?: ElementType
  className?: string
  class?: string
  children?: RemixNode
}

export function DropdownButton(handle: Handle<DropdownButtonProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { as: Comp = Button, mix, children, ...props } = rest
    let extra = Comp === 'button' && !(props as { type?: string }).type ? { type: 'button' } : {}
    return (
      <Comp {...props} {...extra} className={className} mix={[menu.trigger(), mix]}>
        {children}
      </Comp>
    )
  }
}

// ---------------------------------------------------------------------------------------------
// DropdownMenu
// ---------------------------------------------------------------------------------------------

export interface DropdownMenuProps extends ElementProps {
  anchor?: DropdownAnchor
  className?: string
  class?: string
  children?: RemixNode
}

export function DropdownMenu(handle: Handle<DropdownMenuProps>) {
  let dropdown = handle.context.get(Dropdown)
  let popoverCtx = handle.context.get(popover.Context)

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { anchor: _anchor, mix, children, ...props } = rest

    return (
      <div
        {...props}
        mix={[
          // The trigger registered the anchor target with a default placement; replace the placement
          // with the one requested on the menu before `menu.popover()` positions the surface (mixin
          // listeners run in order, so this runs first).
          on('beforetoggle', (event) => {
            if (event.newState === 'open' && popoverCtx.anchor) {
              popoverCtx.anchor = {
                target: popoverCtx.anchor.target,
                options: toAnchorOptions(handle.props.anchor ?? 'bottom'),
              }
            }
          }),
          menu.popover(),
          menu.onMenuSelect((event) => dropdown.onSelect?.(event)),
          mix,
        ]}
        className={cx(
          className,
          // Preline dropdown menu surface
          'min-w-60 rounded-lg border border-dropdown-line bg-dropdown p-1 shadow-md',
          // Native popover reset (UA gives it margin, canvas colors, a fixed width)
          'm-0 w-max text-inherit',
          // Scroll when the menu does not fit in the viewport
          'overflow-y-auto',
          // Invisible outline, visible only in forced-colors mode
          'outline outline-transparent focus:outline-hidden',
          // Leave-only fade; `transition-discrete` keeps the surface displayed while it fades out
          'transition-opacity transition-discrete duration-150 ease-in not-open:opacity-0 data-[close-animation=none]:transition-none',
        )}
      >
        <div mix={menu.list()} className="space-y-0.5 focus:outline-hidden">
          {children}
        </div>
      </div>
    )
  }
}

// ---------------------------------------------------------------------------------------------
// DropdownItem
// ---------------------------------------------------------------------------------------------

export interface DropdownItemProps extends ElementProps {
  /** Renders an `<a href>` that navigates on select. */
  href?: string
  /** Item name reported in the select event (defaults to `value`). */
  name?: string
  value?: string
  /** Accessible/typeahead label (defaults to the item text). */
  label?: string
  searchValue?: menu.MenuItemOptions['searchValue']
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
}

interface DropdownItemContextValue {
  descriptionId: string
  shortcutId: string
}

export function DropdownItem(handle: Handle<DropdownItemProps, DropdownItemContextValue>) {
  let ids: DropdownItemContextValue = {
    descriptionId: `${handle.id}-description`,
    shortcutId: `${handle.id}-shortcut`,
  }
  handle.context.set(ids)

  let node: HTMLElement | undefined
  let itemRef = ref((node_: HTMLElement) => {
    node = node_
  })

  function syncDescribedBy() {
    handle.queueTask(() => {
      if (!node) return
      let host = node
      let describedBy = [ids.descriptionId, ids.shortcutId].filter((id) => host.querySelector(`#${CSS.escape(id)}`))
      if (describedBy.length) host.setAttribute('aria-describedby', describedBy.join(' '))
      else host.removeAttribute('aria-describedby')
    })
  }

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { href, name, value, label, searchValue, disabled, mix, children, ...props } = rest

    let classes = cx(
      className,
      // Preline dropdown item, laid out as a 3-column grid: [icon] [label/description] [shortcut]
      'group grid w-full cursor-default grid-cols-[auto_1fr_auto] items-center rounded-lg px-3 py-2 text-left text-sm',
      'text-dropdown-item-foreground focus:outline-hidden',
      // Highlight (keyboard + pointer, set by the menu primitives)
      'data-highlighted:bg-dropdown-item-focus',
      // Disabled
      'aria-disabled:pointer-events-none aria-disabled:opacity-50',
      // Icons / avatars in the first column
      '*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-3 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground-1',
      '*:data-[slot=avatar]:col-start-1 *:data-[slot=avatar]:row-start-1 *:data-[slot=avatar]:mr-3 *:data-[slot=avatar]:size-5',
    )

    let itemMix: MixValue[] = [
      menu.item({ name: name ?? value ?? '', value, label, searchValue, disabled }),
      itemRef,
      mix,
    ]

    syncDescribedBy()

    if (typeof href === 'string') {
      return (
        <a {...props} href={href} mix={[...itemMix, disabled && on('click', (event) => event.preventDefault())]} className={classes}>
          {children}
        </a>
      )
    }

    return (
      <button {...props} type="button" mix={itemMix} className={classes}>
        {children}
      </button>
    )
  }
}

// ---------------------------------------------------------------------------------------------
// Header / Section / Heading / Divider / Label / Description / Shortcut
// ---------------------------------------------------------------------------------------------

export interface DropdownHeaderProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

export function DropdownHeader(handle: Handle<DropdownHeaderProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <div {...props} className={cx(className, 'px-3 pt-2 pb-1')}>
        {children}
      </div>
    )
  }
}

export interface DropdownSectionProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

interface DropdownSectionContextValue {
  headingId: string
}

export function DropdownSection(handle: Handle<DropdownSectionProps, DropdownSectionContextValue>) {
  let headingId = `${handle.id}-heading`
  handle.context.set({ headingId })
  let node: HTMLElement | undefined
  let sectionRef = ref((node_: HTMLElement) => {
    node = node_
  })

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, mix, ...props } = rest

    // Label the group by its heading when one is rendered.
    handle.queueTask(() => {
      if (!node) return
      if (node.querySelector(`#${CSS.escape(headingId)}`)) node.setAttribute('aria-labelledby', headingId)
      else node.removeAttribute('aria-labelledby')
    })

    return (
      <div {...props} role="group" mix={[sectionRef, mix]} className={cx(className, 'space-y-0.5')}>
        {children}
      </div>
    )
  }
}

export interface DropdownHeadingProps extends ElementProps {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
}

export function DropdownHeading(handle: Handle<DropdownHeadingProps>) {
  let section = handle.context.get(DropdownSection)
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id = section.headingId, children, ...props } = rest
    return (
      <header
        {...props}
        id={id}
        role="presentation"
        className={cx(className, 'block px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground-1 uppercase')}
      >
        {children}
      </header>
    )
  }
}

export interface DropdownDividerProps extends ElementProps {
  className?: string
  class?: string
}

export function DropdownDivider(handle: Handle<DropdownDividerProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    return <hr {...rest} role="separator" className={cx(className, 'my-1 h-px border-0 bg-dropdown-divider')} />
  }
}

export interface DropdownLabelProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

export function DropdownLabel(handle: Handle<DropdownLabelProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <div {...props} data-slot="label" className={cx(className, 'col-start-2 row-start-1')}>
        {children}
      </div>
    )
  }
}

export interface DropdownDescriptionProps extends ElementProps {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
}

export function DropdownDescription(handle: Handle<DropdownDescriptionProps>) {
  let item = handle.context.get(DropdownItem)
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id = item.descriptionId, children, ...props } = rest
    return (
      <div
        {...props}
        id={id}
        data-slot="description"
        className={cx(className, 'col-span-2 col-start-2 row-start-2 text-xs text-muted-foreground-1')}
      >
        {children}
      </div>
    )
  }
}

export interface DropdownShortcutProps extends ElementProps {
  keys: string | string[]
  id?: string
  className?: string
  class?: string
}

export function DropdownShortcut(handle: Handle<DropdownShortcutProps>) {
  let item = handle.context.get(DropdownItem)
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { keys, id = item.shortcutId, ...props } = rest
    let parts: string[] = Array.isArray(keys) ? keys : keys.split('')
    return (
      <kbd {...props} id={id} className={cx(className, 'col-start-3 row-start-1 ml-6 flex justify-self-end text-xs text-muted-foreground')}>
        {parts.map((char, index) => (
          <kbd key={index} className={cx('min-w-[2ch] text-center font-sans capitalize', index > 0 && char.length > 1 && 'pl-1')}>
            {char}
          </kbd>
        ))}
      </kbd>
    )
  }
}

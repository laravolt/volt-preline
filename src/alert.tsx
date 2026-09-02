/**
 * `Alert` — the compact confirmation variant of `Dialog` (`role="alertdialog"`), Preline "Modal" styling.
 *
 * API parity with `velix-catalyst/alert`: `Alert` (`open`, `onClose(false)`, `size` — default `md`,
 * `className`), `AlertTitle`, `AlertDescription`, `AlertBody`, `AlertActions`; same context value shape
 * as `Dialog` (`{ titleId, descriptionId }`) and the same `aria-labelledby` / `aria-describedby` wiring.
 *
 * Mechanics are shared with `Dialog` through `./modal.ts` (native `<dialog>` + `showModal()`, Escape /
 * backdrop / native close → `onClose(false)`, scroll lock, focus restore). The panel is centered and uses
 * Preline's scale transition (`scale-95 opacity-0` → `scale-100 opacity-100`) via `open:` / `starting:`
 * + `transition-discrete`.
 *
 * Hydration: toggle `open` from state inside an app `clientEntry`; the components are not client entries.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { dialogHostClasses } from './dialog.tsx'
import { createModal, type ModalContextValue } from './modal.ts'
import { cx, splitProps } from './utils.ts'

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
}

export type AlertSize = keyof typeof sizes
export type AlertContextValue = ModalContextValue

export interface AlertProps extends ElementProps {
  size?: AlertSize
  /** Whether the alert is shown. Toggle from app state. */
  open?: boolean
  /** Called with `false` when the user asks to close (Escape, backdrop click, native close). */
  onClose?: (open: false) => void
  className?: string
  class?: string
  children?: RemixNode
}

export function Alert(handle: Handle<AlertProps, AlertContextValue>) {
  let ids: AlertContextValue = { titleId: `${handle.id}-title`, descriptionId: `${handle.id}-description` }
  handle.context.set(ids)

  let modal = createModal(handle, ids, () => ({
    open: !!handle.props.open,
    onClose: handle.props.onClose,
    ariaLabelledBy: handle.props['aria-labelledby'],
    ariaDescribedBy: handle.props['aria-describedby'],
  }))

  return () => {
    let { className, rest } = splitProps(handle.props)
    let {
      size = 'md',
      open: _open,
      onClose: _onClose,
      'aria-labelledby': _labelledBy,
      'aria-describedby': _describedBy,
      children,
      ...dialogProps
    } = rest

    modal.afterRender()

    return (
      <dialog
        {...dialogProps}
        data-slot="alert"
        role="alertdialog"
        aria-modal="true"
        mix={modal.dialog()}
        className={dialogHostClasses}
      >
        {/* Centered wrapper with Preline's scale transition */}
        <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
          <div
            data-slot="alert-panel"
            mix={modal.panel}
            className={cx(
              className,
              'w-full',
              sizes[size as AlertSize],
              'flex flex-col rounded-xl border border-overlay-line bg-overlay p-4 shadow-2xs sm:p-5',
              'scale-95 opacity-0 transition-all transition-discrete duration-300 ease-out',
              'group-open:scale-100 group-open:opacity-100 starting:group-open:scale-95 starting:group-open:opacity-0',
            )}
          >
            {children}
          </div>
        </div>
      </dialog>
    )
  }
}

export interface AlertTitleProps extends ElementProps {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
}

export function AlertTitle(handle: Handle<AlertTitleProps>) {
  let ctx = handle.context.get(Alert)
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id = ctx.titleId, children, ...props } = rest
    return (
      <h2 {...props} id={id} className={cx(className, 'text-base font-bold text-balance text-foreground')}>
        {children}
      </h2>
    )
  }
}

export interface AlertDescriptionProps extends ElementProps {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
}

export function AlertDescription(handle: Handle<AlertDescriptionProps>) {
  let ctx = handle.context.get(Alert)
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id = ctx.descriptionId, children, ...props } = rest
    return (
      <p {...props} id={id} data-slot="text" className={cx(className, 'mt-1 text-sm text-pretty text-muted-foreground-2')}>
        {children}
      </p>
    )
  }
}

export interface AlertBodyProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

export function AlertBody(handle: Handle<AlertBodyProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <div {...props} className={cx(className, 'mt-3')}>
        {children}
      </div>
    )
  }
}

export interface AlertActionsProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

export function AlertActions(handle: Handle<AlertActionsProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <div
        {...props}
        className={cx(
          className,
          'mt-5 flex flex-col-reverse items-center gap-2 *:w-full sm:flex-row sm:justify-end sm:*:w-auto',
        )}
      >
        {children}
      </div>
    )
  }
}

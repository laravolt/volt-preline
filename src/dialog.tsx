/**
 * `Dialog` — Preline "Modal" styling on a native `<dialog>`.
 *
 * API parity with `velix-catalyst/dialog`: `Dialog` (`open`, `onClose(false)`, `size`, `className`),
 * `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogActions`. Same context value shape
 * (`{ titleId, descriptionId }`); `aria-labelledby` / `aria-describedby` are set automatically when a
 * title / description is rendered (or when passed explicitly on `Dialog`).
 *
 * Behavior: `showModal()` drives the top layer and traps focus natively; Escape, backdrop click and
 * native close call `onClose(false)` (controlled — flip `open` from app state). Document scroll is locked
 * while open and focus returns to the opener on close. Enter/leave transitions are CSS only: Preline's
 * slide-down (`mt-0 opacity-0` → `mt-7 opacity-100`) expressed with `open:` / `starting:` / `backdrop:`
 * and `transition-discrete` so the exit animates while the dialog leaves the top layer.
 *
 * Hydration: toggle `open` from state inside an app `clientEntry`; the components are not client entries.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

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

export type DialogSize = keyof typeof sizes
export type DialogContextValue = ModalContextValue

export interface DialogProps extends ElementProps {
  size?: DialogSize
  /** Whether the dialog is shown. Toggle from app state. */
  open?: boolean
  /** Called with `false` when the user asks to close (Escape, backdrop click, native close). */
  onClose?: (open: false) => void
  className?: string
  class?: string
  children?: RemixNode
}

/** Shared `<dialog>` host reset: fill the viewport, transparent, the panel is laid out by us. */
export const dialogHostClasses = cx(
  'group fixed inset-0 z-80 m-0 size-full max-h-none max-w-none overflow-x-hidden overflow-y-auto border-0 bg-transparent p-0 text-inherit focus:outline-hidden',
  // Stay in the top layer while the panel and backdrop animate out
  'transition transition-discrete duration-300',
  // Backdrop fade
  'backdrop:bg-inverse/50 backdrop:opacity-0 backdrop:transition-opacity backdrop:transition-discrete backdrop:duration-300 backdrop:ease-out',
  'open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
)

export function Dialog(handle: Handle<DialogProps, DialogContextValue>) {
  let ids: DialogContextValue = { titleId: `${handle.id}-title`, descriptionId: `${handle.id}-description` }
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
      size = 'lg',
      open: _open,
      onClose: _onClose,
      'aria-labelledby': _labelledBy,
      'aria-describedby': _describedBy,
      children,
      ...dialogProps
    } = rest

    modal.afterRender()

    return (
      <dialog {...dialogProps} data-slot="dialog" aria-modal="true" mix={modal.dialog()} className={dialogHostClasses}>
        {/* Preline modal wrapper: slides down 1.75rem while fading in */}
        <div
          className={cx(
            'm-3 w-auto sm:mx-auto sm:w-full',
            sizes[size as DialogSize],
            'mt-0 opacity-0 transition-all transition-discrete duration-300 ease-out',
            'group-open:mt-7 group-open:opacity-100 starting:group-open:mt-0 starting:group-open:opacity-0',
          )}
        >
          <div
            data-slot="dialog-panel"
            mix={modal.panel}
            className={cx(className, 'flex flex-col rounded-xl border border-overlay-line bg-overlay p-4 shadow-2xs')}
          >
            {children}
          </div>
        </div>
      </dialog>
    )
  }
}

export interface DialogTitleProps extends ElementProps {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
}

export function DialogTitle(handle: Handle<DialogTitleProps>) {
  let ctx = handle.context.get(Dialog)
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

export interface DialogDescriptionProps extends ElementProps {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
}

export function DialogDescription(handle: Handle<DialogDescriptionProps>) {
  let ctx = handle.context.get(Dialog)
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

export interface DialogBodyProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

export function DialogBody(handle: Handle<DialogBodyProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <div {...props} className={cx(className, 'mt-4 overflow-y-auto')}>
        {children}
      </div>
    )
  }
}

export interface DialogActionsProps extends ElementProps {
  className?: string
  class?: string
  children?: RemixNode
}

export function DialogActions(handle: Handle<DialogActionsProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <div
        {...props}
        className={cx(
          className,
          'mt-6 flex flex-col-reverse items-center gap-2 border-t border-overlay-divider pt-3 *:w-full sm:flex-row sm:justify-end sm:*:w-auto',
        )}
      >
        {children}
      </div>
    )
  }
}

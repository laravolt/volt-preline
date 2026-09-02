/**
 * Internal helper shared by `Dialog` and `Alert` (not part of the public API).
 *
 * Drives a native `<dialog>` from a controlled `open` prop:
 * - `showModal()` when `open` flips to true, `close()` when it flips to false (checked after every
 *   render through `handle.queueTask`).
 * - Escape (the native `cancel` event) and clicks on the backdrop area (outside the panel) are turned
 *   into `onClose(false)` requests; the app is expected to flip `open` to `false`.
 * - Document scrolling is locked while a modal is open (reference counted across nested modals).
 * - Focus returns to the element that was focused when the modal opened.
 * - `aria-labelledby` / `aria-describedby` are wired to the title / description ids that the compound
 *   parts register through context, only when those parts are actually rendered.
 *
 * Hydration: only meaningful inside a client entry; the `<dialog>` stays closed during SSR.
 */
import { on, ref, type Handle, type MixValue } from 'remix/ui'

export interface ModalContextValue {
  titleId: string
  descriptionId: string
}

export interface ModalState {
  open: boolean
  onClose?: ((open: false) => void) | undefined
  ariaLabelledBy?: string | undefined
  ariaDescribedBy?: string | undefined
}

// --- document scroll lock ---------------------------------------------------------------------

let openModals = 0
let previousOverflow = ''
let previousPaddingRight = ''

function acquireScrollLock(): () => void {
  if (typeof document === 'undefined') return () => {}
  let body = document.body
  if (openModals === 0) {
    previousOverflow = body.style.overflow
    previousPaddingRight = body.style.paddingRight
    let gutter = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gutter > 0) body.style.paddingRight = `${gutter}px`
  }
  openModals++
  let released = false
  return () => {
    if (released) return
    released = true
    openModals--
    if (openModals === 0) {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }
}

// --- modal controller -------------------------------------------------------------------------

export function createModal(handle: Handle<any, any>, ids: ModalContextValue, read: () => ModalState) {
  let dialog: HTMLDialogElement | null = null
  let panel: HTMLElement | null = null
  let restoreTarget: HTMLElement | null = null
  let releaseScrollLock = () => {}
  let pressStartedOutside = false

  let isOutside = (target: EventTarget | null) => !(panel && target instanceof Node && panel.contains(target))

  function requestClose() {
    read().onClose?.(false)
  }

  function show(el: HTMLDialogElement) {
    restoreTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null
    el.showModal()
    releaseScrollLock = acquireScrollLock()
  }

  function syncOpen(el: HTMLDialogElement) {
    let { open } = read()
    if (open && !el.open) show(el)
    else if (!open && el.open) el.close()
  }

  function syncAria(el: HTMLDialogElement) {
    let { ariaLabelledBy, ariaDescribedBy } = read()
    let has = (id: string) => !!el.querySelector(`#${CSS.escape(id)}`)
    let labelledBy = ariaLabelledBy ?? (has(ids.titleId) ? ids.titleId : null)
    let describedBy = ariaDescribedBy ?? (has(ids.descriptionId) ? ids.descriptionId : null)
    if (labelledBy) el.setAttribute('aria-labelledby', labelledBy)
    else el.removeAttribute('aria-labelledby')
    if (describedBy) el.setAttribute('aria-describedby', describedBy)
    else el.removeAttribute('aria-describedby')
  }

  function restoreFocus() {
    let active = document.activeElement
    let focusIsLost = !active || active === document.body || (dialog ? dialog.contains(active) : false)
    if (focusIsLost && restoreTarget?.isConnected) restoreTarget.focus()
    restoreTarget = null
  }

  return {
    /** Mixin for the panel element (tells backdrop clicks apart from clicks inside the panel). */
    panel: ref((node: HTMLElement) => {
      panel = node
    }) as MixValue,

    /** Mixins for the `<dialog>` host element. */
    dialog(): MixValue<HTMLDialogElement> {
      return [
        ref((el: HTMLDialogElement, signal) => {
          dialog = el
          syncOpen(el)
          signal.addEventListener('abort', () => {
            if (el.open) el.close()
            releaseScrollLock()
            dialog = null
          })
        }),
        // Escape → controlled close request (the browser would otherwise close the dialog itself).
        on<HTMLDialogElement, 'cancel'>('cancel', (event) => {
          if (read().onClose) {
            event.preventDefault()
            requestClose()
          }
        }),
        // Native close: `<form method="dialog">`, `el.close()`, or a browser ignoring `cancel`.
        on<HTMLDialogElement, 'close'>('close', () => {
          releaseScrollLock()
          if (read().open) requestClose()
          restoreFocus()
        }),
        // Backdrop: only close when both the press and the release land outside the panel, so a drag
        // that starts inside (text selection) and ends on the backdrop does not dismiss.
        on<HTMLDialogElement, 'pointerdown'>('pointerdown', (event) => {
          pressStartedOutside = isOutside(event.target)
        }),
        on<HTMLDialogElement, 'click'>('click', (event) => {
          if (pressStartedOutside && isOutside(event.target)) requestClose()
        }),
      ]
    },

    /** Call from the render function: re-syncs open state and aria wiring once the DOM is updated. */
    afterRender() {
      handle.queueTask(() => {
        if (!dialog) return
        syncOpen(dialog)
        syncAria(dialog)
      })
    },
  }
}

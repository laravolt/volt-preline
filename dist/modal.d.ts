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
import { type Handle, type MixValue } from 'remix/ui';
export interface ModalContextValue {
    titleId: string;
    descriptionId: string;
}
export interface ModalState {
    open: boolean;
    onClose?: ((open: false) => void) | undefined;
    ariaLabelledBy?: string | undefined;
    ariaDescribedBy?: string | undefined;
}
export declare function createModal(handle: Handle<any, any>, ids: ModalContextValue, read: () => ModalState): {
    /** Mixin for the panel element (tells backdrop clicks apart from clicks inside the panel). */
    panel: MixValue;
    /** Mixins for the `<dialog>` host element. */
    dialog(): MixValue<HTMLDialogElement>;
    /** Call from the render function: re-syncs open state and aria wiring once the DOM is updated. */
    afterRender(): void;
};

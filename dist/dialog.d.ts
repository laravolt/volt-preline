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
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
import { type ModalContextValue } from './modal.ts';
declare const sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
};
export type DialogSize = keyof typeof sizes;
export type DialogContextValue = ModalContextValue;
export interface DialogProps extends ElementProps {
    size?: DialogSize;
    /** Whether the dialog is shown. Toggle from app state. */
    open?: boolean;
    /** Called with `false` when the user asks to close (Escape, backdrop click, native close). */
    onClose?: (open: false) => void;
    className?: string;
    class?: string;
    children?: RemixNode;
}
/** Shared `<dialog>` host reset: fill the viewport, transparent, the panel is laid out by us. */
export declare const dialogHostClasses: string;
export declare function Dialog(handle: Handle<DialogProps, DialogContextValue>): () => import("remix/ui").RemixElement;
export interface DialogTitleProps extends ElementProps {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DialogTitle(handle: Handle<DialogTitleProps>): () => import("remix/ui").RemixElement;
export interface DialogDescriptionProps extends ElementProps {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DialogDescription(handle: Handle<DialogDescriptionProps>): () => import("remix/ui").RemixElement;
export interface DialogBodyProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DialogBody(handle: Handle<DialogBodyProps>): () => import("remix/ui").RemixElement;
export interface DialogActionsProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function DialogActions(handle: Handle<DialogActionsProps>): () => import("remix/ui").RemixElement;
export {};

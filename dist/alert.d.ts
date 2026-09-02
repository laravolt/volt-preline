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
export type AlertSize = keyof typeof sizes;
export type AlertContextValue = ModalContextValue;
export interface AlertProps extends ElementProps {
    size?: AlertSize;
    /** Whether the alert is shown. Toggle from app state. */
    open?: boolean;
    /** Called with `false` when the user asks to close (Escape, backdrop click, native close). */
    onClose?: (open: false) => void;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function Alert(handle: Handle<AlertProps, AlertContextValue>): () => import("remix/ui").RemixElement;
export interface AlertTitleProps extends ElementProps {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function AlertTitle(handle: Handle<AlertTitleProps>): () => import("remix/ui").RemixElement;
export interface AlertDescriptionProps extends ElementProps {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function AlertDescription(handle: Handle<AlertDescriptionProps>): () => import("remix/ui").RemixElement;
export interface AlertBodyProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function AlertBody(handle: Handle<AlertBodyProps>): () => import("remix/ui").RemixElement;
export interface AlertActionsProps extends ElementProps {
    className?: string;
    class?: string;
    children?: RemixNode;
}
export declare function AlertActions(handle: Handle<AlertActionsProps>): () => import("remix/ui").RemixElement;
export {};

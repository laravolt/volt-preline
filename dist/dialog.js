import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { createModal } from "./modal.js";
import { cx, splitProps } from "./utils.js";
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
};
/** Shared `<dialog>` host reset: fill the viewport, transparent, the panel is laid out by us. */
export const dialogHostClasses = cx('group fixed inset-0 z-80 m-0 size-full max-h-none max-w-none overflow-x-hidden overflow-y-auto border-0 bg-transparent p-0 text-inherit focus:outline-hidden', 
// Stay in the top layer while the panel and backdrop animate out
'transition transition-discrete duration-300', 
// Backdrop fade
'backdrop:bg-inverse/50 backdrop:opacity-0 backdrop:transition-opacity backdrop:transition-discrete backdrop:duration-300 backdrop:ease-out', 'open:backdrop:opacity-100 starting:open:backdrop:opacity-0');
export function Dialog(handle) {
    let ids = { titleId: `${handle.id}-title`, descriptionId: `${handle.id}-description` };
    handle.context.set(ids);
    let modal = createModal(handle, ids, () => ({
        open: !!handle.props.open,
        onClose: handle.props.onClose,
        ariaLabelledBy: handle.props['aria-labelledby'],
        ariaDescribedBy: handle.props['aria-describedby'],
    }));
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { size = 'lg', open: _open, onClose: _onClose, 'aria-labelledby': _labelledBy, 'aria-describedby': _describedBy, children, ...dialogProps } = rest;
        modal.afterRender();
        return (_jsx("dialog", { ...dialogProps, "data-slot": "dialog", "aria-modal": "true", mix: modal.dialog(), className: dialogHostClasses, children: _jsx("div", { className: cx('m-3 w-auto sm:mx-auto sm:w-full', sizes[size], 'mt-0 opacity-0 transition-all transition-discrete duration-300 ease-out', 'group-open:mt-7 group-open:opacity-100 starting:group-open:mt-0 starting:group-open:opacity-0'), children: _jsx("div", { "data-slot": "dialog-panel", mix: modal.panel, className: cx(className, 'flex flex-col rounded-xl border border-overlay-line bg-overlay p-4 shadow-2xs'), children: children }) }) }));
    };
}
export function DialogTitle(handle) {
    let ctx = handle.context.get(Dialog);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id = ctx.titleId, children, ...props } = rest;
        return (_jsx("h2", { ...props, id: id, className: cx(className, 'text-base font-bold text-balance text-foreground'), children: children }));
    };
}
export function DialogDescription(handle) {
    let ctx = handle.context.get(Dialog);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id = ctx.descriptionId, children, ...props } = rest;
        return (_jsx("p", { ...props, id: id, "data-slot": "text", className: cx(className, 'mt-1 text-sm text-pretty text-muted-foreground-2'), children: children }));
    };
}
export function DialogBody(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("div", { ...props, className: cx(className, 'mt-4 overflow-y-auto'), children: children }));
    };
}
export function DialogActions(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("div", { ...props, className: cx(className, 'mt-6 flex flex-col-reverse items-center gap-2 border-t border-overlay-divider pt-3 *:w-full sm:flex-row sm:justify-end sm:*:w-auto'), children: children }));
    };
}

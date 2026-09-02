import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { dialogHostClasses } from "./dialog.js";
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
export function Alert(handle) {
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
        let { size = 'md', open: _open, onClose: _onClose, 'aria-labelledby': _labelledBy, 'aria-describedby': _describedBy, children, ...dialogProps } = rest;
        modal.afterRender();
        return (_jsx("dialog", { ...dialogProps, "data-slot": "alert", role: "alertdialog", "aria-modal": "true", mix: modal.dialog(), className: dialogHostClasses, children: _jsx("div", { className: "flex min-h-full items-center justify-center p-3 sm:p-4", children: _jsx("div", { "data-slot": "alert-panel", mix: modal.panel, className: cx(className, 'w-full', sizes[size], 'flex flex-col rounded-xl border border-overlay-line bg-overlay p-4 shadow-2xs sm:p-5', 'scale-95 opacity-0 transition-all transition-discrete duration-300 ease-out', 'group-open:scale-100 group-open:opacity-100 starting:group-open:scale-95 starting:group-open:opacity-0'), children: children }) }) }));
    };
}
export function AlertTitle(handle) {
    let ctx = handle.context.get(Alert);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id = ctx.titleId, children, ...props } = rest;
        return (_jsx("h2", { ...props, id: id, className: cx(className, 'text-base font-bold text-balance text-foreground'), children: children }));
    };
}
export function AlertDescription(handle) {
    let ctx = handle.context.get(Alert);
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id = ctx.descriptionId, children, ...props } = rest;
        return (_jsx("p", { ...props, id: id, "data-slot": "text", className: cx(className, 'mt-1 text-sm text-pretty text-muted-foreground-2'), children: children }));
    };
}
export function AlertBody(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("div", { ...props, className: cx(className, 'mt-3'), children: children }));
    };
}
export function AlertActions(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("div", { ...props, className: cx(className, 'mt-5 flex flex-col-reverse items-center gap-2 *:w-full sm:flex-row sm:justify-end sm:*:w-auto'), children: children }));
    };
}

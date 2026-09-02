import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { Button } from "./button.js";
import { cx, splitProps } from "./utils.js";
export function Pagination(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { 'aria-label': ariaLabel = 'Page navigation', children, ...attrs } = rest;
        return (_jsx("nav", { "aria-label": ariaLabel, ...attrs, className: cx(className, 'flex items-center gap-x-1'), children: children }));
    };
}
const edgeButtonClasses = 'min-h-9.5 min-w-9.5 px-2.5 py-2 gap-x-1.5';
export function PaginationPrevious(handle) {
    return () => {
        let { className } = splitProps(handle.props);
        let { href = null, children = 'Previous' } = handle.props;
        return (_jsx("span", { className: cx(className, 'grow basis-0'), children: _jsxs(Button, { ...(href === null ? { disabled: true } : { href }), plain: true, "aria-label": "Previous page", className: edgeButtonClasses, children: [_jsx("svg", { "data-slot": "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m15 18-6-6 6-6" }) }), children] }) }));
    };
}
export function PaginationNext(handle) {
    return () => {
        let { className } = splitProps(handle.props);
        let { href = null, children = 'Next' } = handle.props;
        return (_jsx("span", { className: cx(className, 'flex grow basis-0 justify-end'), children: _jsxs(Button, { ...(href === null ? { disabled: true } : { href }), plain: true, "aria-label": "Next page", className: edgeButtonClasses, children: [children, _jsx("svg", { "data-slot": "icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m9 18 6-6-6-6" }) })] }) }));
    };
}
export function PaginationList(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("span", { ...attrs, className: cx(className, 'hidden items-center gap-x-1 sm:flex'), children: children }));
    };
}
export function PaginationPage(handle) {
    return () => {
        let { className } = splitProps(handle.props);
        let { href, current = false, children } = handle.props;
        return (_jsx(Button, { href: href, plain: true, "aria-label": `Page ${children}`, ...(current ? { 'aria-current': 'page' } : {}), className: cx(className, 'min-h-9.5 min-w-9.5 justify-center px-3 py-2', current && 'bg-surface-1 hover:bg-surface-hover'), children: children }));
    };
}
export function PaginationGap(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children = '…', ...attrs } = rest;
        return (_jsx("span", { "aria-hidden": "true", ...attrs, className: cx(className, 'flex min-h-9.5 min-w-9.5 items-center justify-center p-2 text-sm text-muted-foreground select-none'), children: children }));
    };
}

import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { cx, splitProps } from "./utils.js";
export function DescriptionList(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("dl", { ...props, className: cx(className, 'grid grid-cols-1 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]'), children: children }));
    };
}
export function DescriptionTerm(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("dt", { ...props, className: cx(className, 'col-start-1 border-t border-line-1 pt-3 font-medium text-muted-foreground-1 first:border-t-0 sm:py-3'), children: children }));
    };
}
export function DescriptionDetails(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("dd", { ...props, className: cx(className, 'pt-1 pb-3 text-foreground sm:border-t sm:border-line-1 sm:py-3 sm:nth-2:border-t-0'), children: children }));
    };
}

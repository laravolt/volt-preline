import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
export function Text(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("p", { "data-slot": "text", ...props, className: cx(className, 'text-sm text-muted-foreground-1'), children: children }));
    };
}
export function TextLink(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { href, children, ...props } = rest;
        return (_jsx(Link, { ...props, href: href, className: cx(className, 'text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary-hover hover:decoration-primary focus:outline-hidden focus:decoration-primary'), children: children }));
    };
}
export function Strong(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("strong", { ...props, className: cx(className, 'font-semibold text-foreground'), children: children }));
    };
}
export function Code(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("code", { ...props, className: cx(className, 'rounded-sm border border-line-2 bg-muted px-1 py-0.5 font-mono text-[0.8125rem] font-medium text-foreground'), children: children }));
    };
}

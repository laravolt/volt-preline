import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { cx, splitProps } from "./utils.js";
export function AuthLayout(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("main", { ...attrs, className: cx(className, 'flex min-h-dvh flex-col bg-background text-foreground'), children: _jsx("div", { className: "flex grow items-center justify-center p-4 sm:p-6", children: _jsx("div", { className: "w-full max-w-md rounded-xl border border-card-line bg-card p-4 shadow-2xs sm:p-7", children: children }) }) }));
    };
}

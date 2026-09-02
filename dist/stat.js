import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { Badge } from "./badge.js";
import { cx, splitProps } from "./utils.js";
export function Stat(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { title, value, change, ...props } = rest;
        let up = String(change).startsWith('+');
        return (_jsxs("div", { ...props, className: cx(className, 'flex flex-col rounded-xl border border-card-line bg-card p-4 shadow-2xs md:p-5'), children: [_jsx("div", { className: "text-xs font-semibold tracking-wide text-muted-foreground-1 uppercase", children: title }), _jsx("div", { className: "mt-2 text-xl font-medium text-foreground sm:text-2xl", children: value }), _jsxs("div", { className: "mt-3 flex items-center gap-x-2 text-xs", children: [_jsx(Badge, { color: up ? 'green' : 'red', children: change }), _jsx("span", { className: "text-muted-foreground-1", children: "from last week" })] })] }));
    };
}

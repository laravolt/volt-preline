import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { cx, splitProps } from "./utils.js";
export function Divider(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { soft = false, ...props } = rest;
        return _jsx("hr", { role: "presentation", ...props, className: cx(className, 'w-full border-t', soft ? 'border-line-1' : 'border-border') });
    };
}

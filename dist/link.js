import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { splitProps } from "./utils.js";
export function Link(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { href, children, ...attrs } = rest;
        return (_jsx("a", { ...attrs, href: href, ...(className !== undefined ? { className } : {}), children: children }));
    };
}

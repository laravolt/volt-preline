import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { TouchTarget } from "./button.js";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
export function Avatar(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { src = null, square = false, initials, alt = '', ...props } = rest;
        return (_jsx("span", { "data-slot": "avatar", ...props, className: cx(className, 'inline-flex shrink-0 items-center justify-center overflow-hidden align-middle ring-1 ring-line-2 ring-inset', square ? 'rounded-lg' : 'rounded-full', !src && initials && 'bg-surface-4 text-foreground-inverse font-semibold'), children: src ? (_jsx("img", { className: "size-full object-cover", src: src, alt: alt })) : initials ? (_jsxs("svg", { className: "size-full fill-current uppercase select-none", viewBox: "0 0 40 40", "aria-hidden": alt ? undefined : 'true', children: [alt && _jsx("title", { children: alt }), _jsx("text", { x: "50%", y: "50%", textAnchor: "middle", dominantBaseline: "central", fontSize: "16", fontWeight: "600", children: initials })] })) : null }));
    };
}
export function AvatarButton(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { src, square = false, initials, alt, href, ...props } = rest;
        let classes = cx(className, square ? 'rounded-lg' : 'rounded-full', 'relative inline-flex focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background', 'disabled:opacity-50 disabled:pointer-events-none');
        return typeof href === 'string' ? (_jsx(Link, { ...props, href: href, className: classes, children: _jsx(TouchTarget, { children: _jsx(Avatar, { className: "size-full", src: src, square: square, initials: initials, alt: alt }) }) })) : (_jsx("button", { type: "button", ...props, className: cx(classes, 'cursor-pointer'), children: _jsx(TouchTarget, { children: _jsx(Avatar, { className: "size-full", src: src, square: square, initials: initials, alt: alt }) }) }));
    };
}

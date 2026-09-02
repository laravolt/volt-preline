/**
 * Preline `Heading` / `Subheading` for Remix UI — API-compatible with `volt-catalyst/heading`.
 *
 * API parity: `level` (1–6, default 1 for `Heading`, 2 for `Subheading`) picks the `h*` tag via
 * `createElement`; other props spread onto the element.
 *
 * Styling: Preline typography — page title `text-2xl font-semibold text-foreground`, section
 * title `text-base font-semibold text-foreground`.
 *
 * Hydration: none required.
 */
import { createElement } from 'remix/ui';
import { cx, splitProps } from "./utils.js";
export function Heading(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { level = 1, children, ...props } = rest;
        return createElement(`h${level}`, { ...props, className: cx(className, 'text-2xl font-semibold text-foreground') }, children);
    };
}
export function Subheading(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { level = 2, children, ...props } = rest;
        return createElement(`h${level}`, { ...props, className: cx(className, 'text-base font-semibold text-foreground') }, children);
    };
}

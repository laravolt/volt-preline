import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
const styles = {
    base: [
        // Preline: inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border
        'relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-sm font-medium',
        // Preline small size
        'py-2 px-3',
        // Focus / disabled (Preline)
        'focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none',
        // Icon slot
        '*:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0',
    ],
    outline: [
        'border-layer-line text-muted-foreground-1',
        'hover:border-primary-hover hover:text-primary-hover focus:border-primary-focus focus:text-primary-focus',
    ],
    plain: [
        'border-transparent text-primary',
        'hover:bg-primary-100 hover:text-primary-800 focus:bg-primary-100 focus:text-primary-800',
        'dark:hover:bg-primary-500/20 dark:hover:text-primary-400 dark:focus:bg-primary-500/20 dark:focus:text-primary-400',
    ],
    colors: {
        // Secondary (Preline "secondary" = dark button, inverted in dark mode)
        'dark/zinc': 'bg-secondary border-secondary-line text-secondary-foreground hover:bg-secondary-hover focus:bg-secondary-focus',
        dark: 'bg-secondary border-secondary-line text-secondary-foreground hover:bg-secondary-hover focus:bg-secondary-focus',
        'dark/white': 'bg-secondary border-secondary-line text-secondary-foreground hover:bg-secondary-hover focus:bg-secondary-focus',
        // Preline "white" (layered) button
        light: 'bg-layer border-layer-line text-layer-foreground shadow-2xs hover:bg-layer-hover focus:bg-layer-focus',
        white: 'bg-layer border-layer-line text-layer-foreground shadow-2xs hover:bg-layer-hover focus:bg-layer-focus',
        // Preline "surface" (gray) button
        zinc: 'bg-surface-4 border-surface-line text-foreground-inverse hover:bg-surface-5 focus:bg-surface-5',
        // Primary / destructive tokens
        blue: 'bg-primary border-primary-line text-primary-foreground hover:bg-primary-hover focus:bg-primary-focus',
        red: 'bg-destructive border-transparent text-destructive-foreground hover:bg-destructive-hover focus:bg-destructive-focus',
        // Tailwind palette (Preline "custom color" solid shape: bg-{c}-500 text-white hover:bg-{c}-600; literal so Tailwind's scanner sees them)
        indigo: 'bg-indigo-500 border-transparent text-white hover:bg-indigo-600 focus:bg-indigo-600',
        cyan: 'bg-cyan-500 border-transparent text-white hover:bg-cyan-600 focus:bg-cyan-600',
        orange: 'bg-orange-500 border-transparent text-white hover:bg-orange-600 focus:bg-orange-600',
        amber: 'bg-amber-500 border-transparent text-white hover:bg-amber-600 focus:bg-amber-600',
        yellow: 'bg-yellow-500 border-transparent text-white hover:bg-yellow-600 focus:bg-yellow-600',
        lime: 'bg-lime-500 border-transparent text-white hover:bg-lime-600 focus:bg-lime-600',
        green: 'bg-green-500 border-transparent text-white hover:bg-green-600 focus:bg-green-600',
        emerald: 'bg-emerald-500 border-transparent text-white hover:bg-emerald-600 focus:bg-emerald-600',
        teal: 'bg-teal-500 border-transparent text-white hover:bg-teal-600 focus:bg-teal-600',
        sky: 'bg-sky-500 border-transparent text-white hover:bg-sky-600 focus:bg-sky-600',
        violet: 'bg-violet-500 border-transparent text-white hover:bg-violet-600 focus:bg-violet-600',
        purple: 'bg-purple-500 border-transparent text-white hover:bg-purple-600 focus:bg-purple-600',
        fuchsia: 'bg-fuchsia-500 border-transparent text-white hover:bg-fuchsia-600 focus:bg-fuchsia-600',
        pink: 'bg-pink-500 border-transparent text-white hover:bg-pink-600 focus:bg-pink-600',
        rose: 'bg-rose-500 border-transparent text-white hover:bg-rose-600 focus:bg-rose-600',
    },
};
export const buttonColors = Object.keys(styles.colors);
export function Button(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { color, outline, plain, href, children, ...props } = rest;
        let classes = cx(className, styles.base, outline ? styles.outline : plain ? styles.plain : styles.colors[color ?? 'dark/zinc']);
        return typeof href === 'string' ? (_jsx(Link, { ...props, href: href, className: classes, children: _jsx(TouchTarget, { children: children }) })) : (_jsx("button", { type: "button", ...props, className: cx(classes, 'cursor-pointer'), children: _jsx(TouchTarget, { children: children }) }));
    };
}
/**
 * Expands the hit area to at least 44×44px on coarse pointers (touch). Renders an `aria-hidden`
 * helper span before the children; the parent must be `relative`.
 */
export function TouchTarget(handle) {
    return () => (_jsxs(_Fragment, { children: [_jsx("span", { className: "absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden", "aria-hidden": "true" }), handle.props.children] }));
}

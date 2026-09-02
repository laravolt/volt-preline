import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { TouchTarget } from "./button.js";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
// Preline soft badge per color plus a `group-hover` step for BadgeButton. Literal strings so Tailwind's scanner sees them.
const colors = {
    red: 'bg-red-100 text-red-800 group-hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:group-hover:bg-red-500/30',
    orange: 'bg-orange-100 text-orange-800 group-hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:group-hover:bg-orange-500/30',
    amber: 'bg-amber-100 text-amber-800 group-hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:group-hover:bg-amber-500/30',
    yellow: 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:group-hover:bg-yellow-500/30',
    lime: 'bg-lime-100 text-lime-800 group-hover:bg-lime-200 dark:bg-lime-500/20 dark:text-lime-400 dark:group-hover:bg-lime-500/30',
    green: 'bg-green-100 text-green-800 group-hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:group-hover:bg-green-500/30',
    emerald: 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:group-hover:bg-emerald-500/30',
    teal: 'bg-teal-100 text-teal-800 group-hover:bg-teal-200 dark:bg-teal-500/20 dark:text-teal-400 dark:group-hover:bg-teal-500/30',
    cyan: 'bg-cyan-100 text-cyan-800 group-hover:bg-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:group-hover:bg-cyan-500/30',
    sky: 'bg-sky-100 text-sky-800 group-hover:bg-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:group-hover:bg-sky-500/30',
    blue: 'bg-primary-100 text-primary-800 group-hover:bg-primary-200 dark:bg-primary-500/20 dark:text-primary-400 dark:group-hover:bg-primary-500/30',
    indigo: 'bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:group-hover:bg-indigo-500/30',
    violet: 'bg-violet-100 text-violet-800 group-hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-400 dark:group-hover:bg-violet-500/30',
    purple: 'bg-purple-100 text-purple-800 group-hover:bg-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:group-hover:bg-purple-500/30',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-800 group-hover:bg-fuchsia-200 dark:bg-fuchsia-500/20 dark:text-fuchsia-400 dark:group-hover:bg-fuchsia-500/30',
    pink: 'bg-pink-100 text-pink-800 group-hover:bg-pink-200 dark:bg-pink-500/20 dark:text-pink-400 dark:group-hover:bg-pink-500/30',
    rose: 'bg-rose-100 text-rose-800 group-hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:group-hover:bg-rose-500/30',
    zinc: 'bg-surface text-surface-foreground group-hover:bg-surface-hover',
};
export const badgeColors = Object.keys(colors);
export function Badge(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { color = 'zinc', children, ...props } = rest;
        return (_jsx("span", { ...props, className: cx(className, 'inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap', colors[color]), children: children }));
    };
}
export function BadgeButton(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { color = 'zinc', href, children, ...props } = rest;
        let classes = cx(className, 'group relative inline-flex rounded-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background', 'disabled:opacity-50 disabled:pointer-events-none');
        return typeof href === 'string' ? (_jsx(Link, { ...props, href: href, className: classes, children: _jsx(TouchTarget, { children: _jsx(Badge, { color: color, children: children }) }) })) : (_jsx("button", { type: "button", ...props, className: cx(classes, 'cursor-pointer'), children: _jsx(TouchTarget, { children: _jsx(Badge, { color: color, children: children }) }) }));
    };
}

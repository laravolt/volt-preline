import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
const defaultTableContext = { bleed: false, dense: false, grid: false, striped: false };
export function Table(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { bleed = false, dense = false, grid = false, striped = false, responsive, children, ...props } = rest;
        handle.context.set({ bleed, dense, grid, striped, responsive });
        let stack = responsive === 'stack';
        return (_jsx("div", { className: "flow-root", children: _jsx("div", { ...props, className: cx(className, stack ? 'overflow-x-auto max-sm:overflow-visible' : 'overflow-x-auto'), children: _jsx("div", { className: cx('inline-block min-w-full align-middle', !bleed && !stack && 'overflow-hidden rounded-lg border border-table-line shadow-xs', !bleed && stack && 'overflow-hidden rounded-lg border border-table-line shadow-xs max-sm:overflow-visible max-sm:rounded-none max-sm:border-0 max-sm:shadow-none'), children: _jsx("table", { className: "min-w-full divide-y divide-table-line text-left text-sm text-foreground", children: children }) }) }) }));
    };
}
export function TableHead(handle) {
    return () => {
        let { responsive } = handle.context.get(Table) ?? defaultTableContext;
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("thead", { ...props, className: cx(className, 'bg-muted text-muted-foreground-1', responsive === 'stack' && 'max-sm:sr-only'), children: children }));
    };
}
export function TableBody(handle) {
    return () => {
        let { responsive } = handle.context.get(Table) ?? defaultTableContext;
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("tbody", { ...props, className: cx(className, 'divide-y divide-table-line', responsive === 'stack' && 'max-sm:divide-y-0 max-sm:flex max-sm:flex-col max-sm:gap-3'), children: children }));
    };
}
export function TableRow(handle) {
    return () => {
        let { striped, grid, responsive } = handle.context.get(Table) ?? defaultTableContext;
        let { className, rest } = splitProps(handle.props);
        let { href, target, title, children, ...props } = rest;
        let cellIndex = 0;
        handle.context.set({ href, target, title, nextCellIndex: () => cellIndex++ });
        return (_jsx("tr", { ...props, className: cx(className, striped && 'even:bg-surface', grid && 'divide-x divide-table-line', grid && responsive === 'stack' && 'max-sm:divide-x-0', responsive === 'stack' && 'max-sm:flex max-sm:flex-col max-sm:border max-sm:border-table-line max-sm:rounded-lg max-sm:overflow-hidden max-sm:bg-card max-sm:shadow-xs max-sm:divide-y-0', href &&
                'hover:bg-muted-hover has-[[data-row-link]:focus-visible]:outline-2 has-[[data-row-link]:focus-visible]:-outline-offset-2 has-[[data-row-link]:focus-visible]:outline-primary'), children: children }));
    };
}
export function TableHeader(handle) {
    return () => {
        let { dense } = handle.context.get(Table) ?? defaultTableContext;
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("th", { ...props, className: cx(className, 'px-4 text-start text-xs font-semibold uppercase whitespace-nowrap', dense ? 'py-2' : 'py-3'), children: children }));
    };
}
export function TableCell(handle) {
    return () => {
        let { dense, responsive } = handle.context.get(Table) ?? defaultTableContext;
        let row = handle.context.get(TableRow);
        let { className, rest } = splitProps(handle.props);
        let { stackedLabel, children, ...props } = rest;
        let href = row?.href;
        let isFirstCell = href ? row.nextCellIndex() === 0 : false;
        let stack = responsive === 'stack';
        return (_jsxs("td", { ...props, className: cx(className, 'relative px-4 whitespace-nowrap', dense ? 'py-2' : 'py-4', stack && 'max-sm:whitespace-normal max-sm:flex max-sm:items-start max-sm:justify-between max-sm:gap-4 max-sm:px-4 max-sm:py-3 max-sm:text-left'), children: [href && (_jsx(Link, { "data-row-link": "", href: href, ...(row.target ? { target: row.target } : {}), ...(row.title ? { 'aria-label': row.title } : {}), tabIndex: isFirstCell ? 0 : -1, className: "absolute inset-0 focus:outline-hidden" })), stackedLabel && stack && (_jsx("span", { "aria-hidden": "true", className: "hidden max-sm:inline text-xs font-semibold uppercase text-muted-foreground-1 max-sm:shrink-0 max-sm:max-w-[45%]", children: stackedLabel })), _jsx("span", { className: cx(stack && 'max-sm:flex-1 max-sm:text-right max-sm:text-sm', !stack && 'contents'), children: children })] }));
    };
}

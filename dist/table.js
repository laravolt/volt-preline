import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
import { Link } from "./link.js";
import { cx, splitProps } from "./utils.js";
const defaultTableContext = { bleed: false, dense: false, grid: false, striped: false };
export function Table(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { bleed = false, dense = false, grid = false, striped = false, children, ...props } = rest;
        handle.context.set({ bleed, dense, grid, striped });
        return (_jsx("div", { className: "flow-root", children: _jsx("div", { ...props, className: cx(className, 'overflow-x-auto'), children: _jsx("div", { className: cx('inline-block min-w-full align-middle', !bleed && 'overflow-hidden rounded-lg border border-table-line shadow-xs'), children: _jsx("table", { className: "min-w-full divide-y divide-table-line text-left text-sm text-foreground", children: children }) }) }) }));
    };
}
export function TableHead(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("thead", { ...props, className: cx(className, 'bg-muted text-muted-foreground-1'), children: children }));
    };
}
export function TableBody(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("tbody", { ...props, className: cx(className, 'divide-y divide-table-line'), children: children }));
    };
}
export function TableRow(handle) {
    return () => {
        let { striped, grid } = handle.context.get(Table) ?? defaultTableContext;
        let { className, rest } = splitProps(handle.props);
        let { href, target, title, children, ...props } = rest;
        let cellIndex = 0;
        handle.context.set({ href, target, title, nextCellIndex: () => cellIndex++ });
        return (_jsx("tr", { ...props, className: cx(className, striped && 'even:bg-surface', grid && 'divide-x divide-table-line', href &&
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
        let { dense } = handle.context.get(Table) ?? defaultTableContext;
        let row = handle.context.get(TableRow);
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        let href = row?.href;
        let isFirstCell = href ? row.nextCellIndex() === 0 : false;
        return (_jsxs("td", { ...props, className: cx(className, 'relative px-4 whitespace-nowrap', dense ? 'py-2' : 'py-4'), children: [href && (_jsx(Link, { "data-row-link": "", href: href, ...(row.target ? { target: row.target } : {}), ...(row.title ? { 'aria-label': row.title } : {}), tabIndex: isFirstCell ? 0 : -1, className: "absolute inset-0 focus:outline-hidden" })), children] }));
    };
}

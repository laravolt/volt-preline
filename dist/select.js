import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
/**
 * `select.tsx` — Preline-styled native select with the velix-catalyst API.
 *
 * API parity with velix-catalyst:
 * - Same export (`Select`) and props (`name`, `value`, `defaultValue`, `multiple`, `size`,
 *   `disabled`, `invalid`, `required`, `aria-describedby`, `onChange`, `children`).
 * - Native `<select>`; a chevron icon overlays single selects (none when `multiple`). The
 *   `@tailwindcss/forms` background chevron is disabled (`bg-none`) in favor of the themed SVG.
 * - `invalid` → `aria-invalid="true"`; `id`/`disabled`/`aria-describedby` default from `Field`.
 * - `onChange` is bound with the `on()` mixin (only active inside a client entry).
 * - `value`/`defaultValue` mark the matching `<option>` children as `selected` during render so the
 *   initial selection is correct in server HTML (a native `<select>` has no `value` attribute).
 *
 * Styling: Preline "select" (`bg-layer border-layer-line rounded-lg pe-9 focus:border-primary
 * focus:ring-primary`), error state `border-destructive`.
 *
 * Hydration: static markup; no client entry required unless `onChange` is used.
 */
import { on } from 'remix/ui';
import { controlAttrsFromField } from "./fieldset.js";
import { cx, splitProps } from "./utils.js";
function isElement(node) {
    return typeof node === 'object' && node !== null && node.$rmx === true;
}
/** Clone `<option>` descendants (through `<optgroup>`/fragments) so those matching `values` get `selected`. */
function markSelected(node, values) {
    if (Array.isArray(node))
        return node.map((child) => markSelected(child, values));
    if (!isElement(node))
        return node;
    let props = node.props;
    if (node.type === 'option') {
        let optionValue = props.value !== undefined ? String(props.value) : undefined;
        if (optionValue !== undefined && values.includes(optionValue) && !props.selected) {
            return { ...node, props: { ...props, selected: true } };
        }
        return node;
    }
    if (props.children === undefined)
        return node;
    return { ...node, props: { ...props, children: markSelected(props.children, values) } };
}
export function Select(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { invalid, multiple, onChange, children, value, defaultValue, id: _id, disabled: _disabled, 'aria-describedby': _describedBy, ...attrs } = rest;
        let { id, disabled, describedBy } = controlAttrsFromField(handle, rest);
        let selected = value ?? defaultValue;
        if (selected !== undefined)
            children = markSelected(children, Array.isArray(selected) ? selected : [String(selected)]);
        return (_jsxs("span", { "data-slot": "control", className: cx(className, 'group relative block w-full'), children: [_jsx("select", { ...attrs, multiple: multiple || undefined, ...(value !== undefined ? { value } : {}), id: id, disabled: disabled || undefined, "aria-invalid": invalid ? 'true' : undefined, "aria-describedby": describedBy, mix: onChange ? on('change', (event) => onChange(event)) : undefined, className: cx(
                    // Layout (space for the chevron on single selects)
                    'block w-full rounded-lg py-2.5 ps-4 sm:py-3', multiple ? 'pe-4' : 'pe-9', 
                    // Typography
                    'text-base text-layer-foreground sm:text-sm', 
                    // Surface (drop the forms-plugin chevron; we render our own)
                    'bg-layer border-layer-line bg-none shadow-2xs', '[&_optgroup]:font-semibold [&_option]:bg-layer [&_option]:text-layer-foreground [&_option:checked]:bg-surface-1', 
                    // Focus
                    'focus:border-primary focus:ring-primary', 
                    // Invalid
                    'aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive', 
                    // Disabled
                    'disabled:pointer-events-none disabled:opacity-50'), children: children }), !multiple && (_jsx("span", { className: "pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 group-has-disabled:opacity-50", children: _jsxs("svg", { className: "size-4 shrink-0 text-muted-foreground", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("path", { d: "m7 15 5 5 5-5" }), _jsx("path", { d: "m7 9 5-5 5 5" })] }) }))] }));
    };
}

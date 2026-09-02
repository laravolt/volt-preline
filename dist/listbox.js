import { jsx as _jsx, jsxs as _jsxs } from "remix/ui/jsx-runtime";
/**
 * `Listbox` — Preline "Advanced Select" styling on top of `remix/ui/select/primitives` (which
 * composes `listbox` + `popover` for the button-triggered "custom select" pattern).
 *
 * API parity with `velix-catalyst/listbox`: same exports (`Listbox`, `ListboxOption`,
 * `ListboxLabel`, `ListboxDescription`, `nodeText`) and props (`name`, `value`, `defaultValue`,
 * `onChange(value)`, `placeholder`, `autoFocus`, `disabled`, `invalid`, aria-*, `className`/`class`,
 * `children`). Reads `Field` context through `controlAttrsFromField` (`id`, `disabled`,
 * `aria-describedby`).
 *
 * Behavior notes (shared with velix-catalyst, inherited from the primitive):
 * - Values are strings (the hidden `<input type="hidden" name>` needs a string); `value` /
 *   `defaultValue` / `onChange(value)` use `string | null`.
 * - The selected option's content is rendered inside the trigger by walking `children` for the
 *   `ListboxOption` whose `value` matches.
 * - The trigger content and `onChange` update when the primitive settles a selection, i.e. after
 *   the popover's close transition (~100ms), not synchronously.
 * - `value` is controlled by remounting the select context when the prop moves away from the
 *   current selection (the primitive only supports `defaultValue`).
 * - State selectors: highlighted option = `data-[highlighted=true]`, selected = `aria-selected`,
 *   disabled = `aria-disabled` / `disabled`, invalid trigger = `aria-invalid` / `data-invalid`.
 * - Unlike velix-catalyst (macOS-style "selected option over the trigger"), the surface drops
 *   below the trigger like Preline's dropdown (`bottom-start`, 8px gap, flips to top when needed).
 * - `ListboxOption` accepts an optional `label` (typeahead / accessible text); by default it is
 *   the text content of `children`.
 *
 * Hydration: `Listbox` is not a client entry. Place it inside an app `clientEntry` (or any
 * hydrated tree) for the popover/keyboard behavior; it server-renders as a plain button + hidden
 * input.
 */
import { on } from 'remix/ui';
import * as popover from 'remix/ui/popover';
import * as select from 'remix/ui/select/primitives';
import { controlAttrsFromField } from "./fieldset.js";
import { cx, splitProps } from "./utils.js";
/** Text content of a Remix node tree (used for typeahead labels and the select's default label). */
export function nodeText(node) {
    return collectText(node).replace(/\s+/g, ' ').trim();
}
function collectText(node) {
    if (node == null || typeof node === 'boolean')
        return '';
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint')
        return String(node);
    if (Array.isArray(node))
        return node.map(collectText).join(' ');
    if (typeof node === 'object' && '$rmx' in node)
        return collectText(node.props.children);
    return '';
}
function findOption(node, value) {
    if (node == null || typeof node !== 'object')
        return undefined;
    if (Array.isArray(node)) {
        for (let child of node) {
            let found = findOption(child, value);
            if (found)
                return found;
        }
        return undefined;
    }
    if (!('$rmx' in node))
        return undefined;
    let element = node;
    if (element.type === ListboxOption && element.props.value === value)
        return element;
    return findOption(element.props.children, value);
}
/** Row content: label + description side by side, icons/avatars sized like Preline's select items. */
const optionContentClasses = cx('flex min-w-0 flex-1 items-center gap-x-2', '*:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground', '*:data-[slot=avatar]:size-5 *:data-[slot=avatar]:shrink-0');
/** Chevron used by Preline's advanced select toggle. */
function ChevronIcon(_handle) {
    return () => (_jsxs("svg", { className: "size-3.5 shrink-0 text-muted-foreground", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("path", { d: "m7 15 5 5 5-5" }), _jsx("path", { d: "m7 9 5-5 5 5" })] }));
}
/** Check shown on the selected option (Preline `hs-selected:` pattern, driven by `aria-selected`). */
function SelectedCheckIcon(handle) {
    return () => (_jsx("svg", { className: cx('size-3.5 shrink-0 text-primary', handle.props.className), xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }));
}
export function Listbox(handle) {
    let currentValue = handle.props.value ?? handle.props.defaultValue ?? null;
    let lastPropValue = handle.props.value;
    let contextKey = 0;
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id, disabled, describedBy: ariaDescribedBy } = controlAttrsFromField(handle, rest);
        let { id: _id, name, value, defaultValue: _defaultValue, onChange: _onChange, placeholder, autoFocus, disabled: _disabled, invalid, 'aria-describedby': _ariaDescribedBy, children, mix, ...buttonProps } = rest;
        // Controlled `value`: remount the select context when the prop moves away from the current selection.
        if (value !== lastPropValue) {
            lastPropValue = value;
            if (value !== undefined && value !== currentValue) {
                currentValue = value;
                contextKey++;
            }
        }
        let selected = currentValue !== null ? findOption(children, currentValue) : undefined;
        let selectedProps = selected ? splitProps(selected.props) : undefined;
        return (_jsx(select.Context, { name: name, defaultValue: currentValue, defaultLabel: nodeText(placeholder), disabled: disabled, children: _jsxs("span", { "data-slot": "control", className: "relative block w-full", children: [_jsxs("button", { ...buttonProps, type: "button", id: id, "data-slot": "control", autoFocus: autoFocus, disabled: disabled, "aria-invalid": invalid ? 'true' : undefined, "data-invalid": invalid ? '' : undefined, "aria-describedby": ariaDescribedBy, mix: [
                            select.trigger(),
                            select.onSelectChange((event) => {
                                if (event.value === null || event.value === currentValue)
                                    return;
                                currentValue = event.value;
                                handle.props.onChange?.(event.value);
                                void handle.update();
                            }),
                            mix,
                        ], className: cx(className, 
                        // Preline advanced-select toggle
                        'group relative flex w-full cursor-pointer items-center gap-x-2 text-nowrap', 'rounded-lg border border-layer-line bg-layer text-layer-foreground', 'py-3 ps-4 pe-9 text-start text-sm', 'hover:bg-layer-hover focus:bg-layer-focus focus:outline-hidden', 'focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-1 focus-visible:ring-offset-background', 
                        // Invalid
                        'data-invalid:border-destructive data-invalid:focus-visible:ring-destructive-focus', 
                        // Disabled
                        'disabled:pointer-events-none disabled:opacity-50'), children: [_jsx("span", { className: "flex min-w-0 flex-1 items-center", children: selected ? (_jsx("span", { className: cx(selectedProps?.className, optionContentClasses), children: selected.props.children })) : placeholder ? (_jsx("span", { className: "block truncate text-muted-foreground", children: placeholder })) : null }), _jsx("span", { className: "pointer-events-none absolute inset-y-0 end-3 flex items-center", children: _jsx(ChevronIcon, {}) })] }), _jsx(popover.Context, { children: _jsx(ListboxOptions, { children: children }) }), name && _jsx("input", { mix: select.hiddenInput() })] }) }, contextKey));
    };
}
/** Popover surface + listbox root (one element). Preline dropdown look, anchored below the trigger. */
function ListboxOptions(handle) {
    let popoverCtx = handle.context.get(popover.Context);
    return () => (_jsx("div", { mix: [
            // The primitive anchors the selected option over the trigger (macOS style). Preline's
            // select is a dropdown: place it under the trigger with a small gap. This runs before the
            // primitive's own `beforetoggle` (nested mixin descriptors are applied after top-level ones).
            on('beforetoggle', (event) => {
                if (event.newState !== 'open')
                    return;
                let anchor = popoverCtx.anchor;
                if (!anchor)
                    return;
                popoverCtx.anchor = {
                    target: anchor.target,
                    options: { placement: 'bottom-start', offset: 8 },
                };
            }),
            select.popover(),
            select.list(),
        ], className: cx(
        // Native popover resets (UA styles: margin auto, border, padding, inset 0)
        'm-0 inset-auto', 
        // Preline select dropdown
        'z-50 max-h-72 space-y-0.5 overflow-hidden overflow-y-auto rounded-lg border border-select-line bg-select p-1 shadow-xl', '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb', 'select-none focus:outline-hidden', 
        // Transitions (native popover: fade in via @starting-style, fade out via discrete display/overlay transition)
        'opacity-0 transition-[opacity,display,overlay] transition-discrete duration-100 ease-in open:opacity-100 starting:open:opacity-0 not-open:pointer-events-none'), children: handle.props.children }));
}
export function ListboxOption(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { value, label, disabled, children, mix, ...divProps } = rest;
        return (_jsxs("div", { ...divProps, mix: [select.option({ value, label: label ?? nodeText(children) ?? value, disabled }), mix], className: cx(
            // Preline select item
            'group/option flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-4 py-2 text-sm text-select-item-foreground', 'focus:outline-hidden', 
            // Highlight (keyboard/mouse) + selected
            'data-[highlighted=true]:bg-select-item-hover aria-selected:bg-select-item-active', 
            // Disabled
            'aria-disabled:pointer-events-none aria-disabled:opacity-50'), children: [_jsx("span", { className: cx(className, optionContentClasses), children: children }), _jsx(SelectedCheckIcon, { className: "hidden group-aria-selected/option:block" })] }));
    };
}
export function ListboxLabel(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("span", { ...props, className: cx(className, 'truncate'), children: children }));
    };
}
export function ListboxDescription(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...props } = rest;
        return (_jsx("span", { ...props, className: cx(className, 'flex min-w-0 flex-1 overflow-hidden text-muted-foreground'), children: _jsx("span", { className: "flex-1 truncate", children: children }) }));
    };
}

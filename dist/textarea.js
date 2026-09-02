import { jsx as _jsx } from "remix/ui/jsx-runtime";
/**
 * `textarea.tsx` — Preline-styled textarea with the volt-catalyst API.
 *
 * API parity with volt-catalyst:
 * - Same export (`Textarea`) and props (`name`, `value`, `defaultValue`, `placeholder`, `rows`,
 *   `disabled`, `invalid`, `required`, `resizable`, `aria-describedby`, `onChange`, `onInput`).
 * - Native `<textarea>` in a `data-slot="control"` span; `invalid` → `aria-invalid="true"`.
 * - `id`, `disabled` and `aria-describedby` default from the surrounding `Field` context.
 * - `onChange`/`onInput` are bound with the `on()` mixin (only active inside a client entry).
 *
 * Styling: Preline "textarea" (same surface/focus/error tokens as `Input`, plus the themed scrollbar).
 *
 * Hydration: static markup; no client entry required unless `onChange`/`onInput` are used.
 */
import { on } from 'remix/ui';
import { controlAttrsFromField } from "./fieldset.js";
import { inputClasses } from "./input.js";
import { cx, splitProps } from "./utils.js";
export function Textarea(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { invalid, resizable = true, onChange, onInput, id: _id, disabled: _disabled, 'aria-describedby': _describedBy, ...attrs } = rest;
        let { id, disabled, describedBy } = controlAttrsFromField(handle, rest);
        let mixins = [
            onChange && on('change', (event) => onChange(event)),
            onInput && on('input', (event) => onInput(event)),
        ].filter((m) => Boolean(m));
        return (_jsx("span", { "data-slot": "control", className: cx(className, 'relative block w-full'), children: _jsx("textarea", { rows: 3, ...attrs, id: id, disabled: disabled || undefined, "aria-invalid": invalid ? 'true' : undefined, "aria-describedby": describedBy, mix: mixins.length ? mixins : undefined, className: cx(inputClasses, 
                // Themed scrollbar (Preline)
                '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb', resizable ? 'resize-y' : 'resize-none') }) }));
    };
}

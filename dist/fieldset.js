import { jsx as _jsx } from "remix/ui/jsx-runtime";
import { cx, splitProps } from "./utils.js";
const fieldProviders = new Set();
/** Register a component that provides `FieldContextValue` (used by CheckboxField, RadioField, SwitchField). */
export function registerFieldProvider(component) {
    fieldProviders.add(component);
}
/** Read the nearest field context (from `Field` or any registered field provider). */
export function getFieldContext(handle) {
    for (let provider of fieldProviders) {
        let value = handle.context.get(provider);
        if (value)
            return value;
    }
    return undefined;
}
/** Build `{ id, disabled, aria-describedby }` defaults for a form control from field context. */
export function controlAttrsFromField(handle, props) {
    let field = getFieldContext(handle);
    return {
        id: props.id ?? field?.controlId,
        disabled: props.disabled ?? field?.disabled,
        describedBy: props['aria-describedby'] ?? (field ? `${field.descriptionId} ${field.errorId}` : undefined),
    };
}
export function Fieldset(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { disabled, children, ...attrs } = rest;
        handle.context.set({ disabled: Boolean(disabled) });
        return (_jsx("fieldset", { ...attrs, disabled: disabled || undefined, className: cx(className, 'min-w-0 [&>[data-slot=legend]+*]:mt-4'), children: children }));
    };
}
export function Legend(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        let disabled = handle.context.get(Fieldset)?.disabled;
        return (_jsx("legend", { "data-slot": "legend", "data-disabled": disabled ? '' : undefined, ...attrs, className: cx(className, 'text-base font-semibold text-foreground data-disabled:opacity-50'), children: children }));
    };
}
export function FieldGroup(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { children, ...attrs } = rest;
        return (_jsx("div", { "data-slot": "control", ...attrs, className: cx(className, 'grid gap-y-6'), children: children }));
    };
}
export function Field(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id, disabled, children, ...attrs } = rest;
        let controlId = id || handle.id;
        let isDisabled = Boolean(disabled ?? handle.context.get(Fieldset)?.disabled);
        handle.context.set({
            controlId,
            descriptionId: `${controlId}-description`,
            errorId: `${controlId}-error`,
            disabled: isDisabled || undefined,
        });
        return (_jsx("div", { "data-slot": "field", "data-disabled": isDisabled ? '' : undefined, ...attrs, className: cx(className, 
            // Preline: label sits 2 units above the control, helper/error text 2 units below.
            '[&>[data-slot=label]+[data-slot=control]]:mt-2', '[&>[data-slot=label]+[data-slot=description]]:mt-1', '[&>[data-slot=description]+[data-slot=control]]:mt-2', '[&>[data-slot=control]+[data-slot=description]]:mt-2', '[&>[data-slot=control]+[data-slot=error]]:mt-2', '[&>[data-slot=label]]:font-medium'), children: children }));
    };
}
registerFieldProvider(Field);
export function Label(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { htmlFor, children, ...attrs } = rest;
        let field = getFieldContext(handle);
        let disabled = field?.disabled ?? handle.context.get(Fieldset)?.disabled;
        return (_jsx("label", { "data-slot": "label", "data-disabled": disabled ? '' : undefined, ...attrs, htmlFor: htmlFor ?? field?.controlId, className: cx(className, 'block text-sm text-foreground select-none data-disabled:opacity-50'), children: children }));
    };
}
export function Description(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id, children, ...attrs } = rest;
        let field = getFieldContext(handle);
        let disabled = field?.disabled ?? handle.context.get(Fieldset)?.disabled;
        return (_jsx("p", { "data-slot": "description", "data-disabled": disabled ? '' : undefined, ...attrs, id: id ?? field?.descriptionId, className: cx(className, 'text-sm text-muted-foreground-1 data-disabled:opacity-50'), children: children }));
    };
}
export function ErrorMessage(handle) {
    return () => {
        let { className, rest } = splitProps(handle.props);
        let { id, children, ...attrs } = rest;
        let field = getFieldContext(handle);
        let disabled = field?.disabled ?? handle.context.get(Fieldset)?.disabled;
        return (_jsx("p", { "data-slot": "error", "data-disabled": disabled ? '' : undefined, ...attrs, id: id ?? field?.errorId, className: cx(className, 'text-sm text-destructive data-disabled:opacity-50'), children: children }));
    };
}

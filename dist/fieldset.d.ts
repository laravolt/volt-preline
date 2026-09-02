/**
 * `fieldset.tsx` — Preline-styled form scaffolding with the velix-catalyst API.
 *
 * API parity with velix-catalyst:
 * - Same exports: `Fieldset`, `Legend`, `FieldGroup`, `Field`, `Label`, `Description`, `ErrorMessage`
 *   plus the helpers `registerFieldProvider`, `getFieldContext`, `controlAttrsFromField` and the
 *   `FieldContextValue` / `FieldsetContextValue` types.
 * - `Fieldset` is a native `<fieldset>`; `disabled` disables descendants natively and is shared through
 *   context so `Legend`/`Label`/`Description` render `data-disabled`.
 * - `Field` publishes `{ controlId, descriptionId, errorId, disabled }` through `handle.context`.
 *   `Label` gets `htmlFor`, `Description`/`ErrorMessage` get their ids, and controls read
 *   `id`/`disabled`/`aria-describedby` through `controlAttrsFromField`. Because controls render before
 *   their description, `aria-describedby` always references both ids.
 * - `CheckboxField`/`RadioField`/`SwitchField` register themselves via `registerFieldProvider` so the
 *   same `Label`/`Description`/`ErrorMessage` work inside them without circular imports.
 *
 * Styling: Preline "label / helper text / error text" typography using semantic tokens
 * (`text-foreground`, `text-muted-foreground-1`, `text-destructive`). Sibling spacing uses
 * `data-slot` markers so the order label → control → description/error just works.
 *
 * Hydration: static markup; no client entry required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type FieldContextValue = {
    controlId: string;
    descriptionId: string;
    errorId: string;
    disabled?: boolean;
};
type FieldProvider = (handle: Handle<any, FieldContextValue>) => unknown;
/** Register a component that provides `FieldContextValue` (used by CheckboxField, RadioField, SwitchField). */
export declare function registerFieldProvider(component: FieldProvider): void;
/** Read the nearest field context (from `Field` or any registered field provider). */
export declare function getFieldContext(handle: Handle<any, any>): FieldContextValue | undefined;
/** Build `{ id, disabled, aria-describedby }` defaults for a form control from field context. */
export declare function controlAttrsFromField(handle: Handle<any, any>, props: {
    id?: string;
    disabled?: boolean;
    'aria-describedby'?: string;
}): {
    id: string | undefined;
    disabled: boolean | undefined;
    describedBy: string | undefined;
};
export type FieldsetContextValue = {
    disabled: boolean;
};
export type FieldsetProps = {
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Fieldset(handle: Handle<FieldsetProps, FieldsetContextValue>): () => import("remix/ui").RemixElement;
export type LegendProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Legend(handle: Handle<LegendProps>): () => import("remix/ui").RemixElement;
export type FieldGroupProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function FieldGroup(handle: Handle<FieldGroupProps>): () => import("remix/ui").RemixElement;
export type FieldProps = {
    /** Id used for the control; description/error ids derive from it. Defaults to `handle.id`. */
    id?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Field(handle: Handle<FieldProps, FieldContextValue>): () => import("remix/ui").RemixElement;
export type LabelProps = {
    htmlFor?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Label(handle: Handle<LabelProps>): () => import("remix/ui").RemixElement;
export type DescriptionProps = {
    id?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Description(handle: Handle<DescriptionProps>): () => import("remix/ui").RemixElement;
export type ErrorMessageProps = DescriptionProps;
export declare function ErrorMessage(handle: Handle<ErrorMessageProps>): () => import("remix/ui").RemixElement;
export {};

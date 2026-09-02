/**
 * `checkbox.tsx` — Preline-styled native checkbox with the volt-catalyst API.
 *
 * API parity with volt-catalyst:
 * - Same exports (`CheckboxGroup`, `CheckboxField`, `Checkbox`) and props (`color`, `name`, `value`,
 *   `checked`, `defaultChecked`, `indeterminate`, `disabled`, `required`, `aria-label`,
 *   `aria-describedby`, `onChange(checked, event)`).
 * - `Checkbox` is a *visible* native `<input type="checkbox">` styled by `@tailwindcss/forms` +
 *   Preline classes (no hidden input + custom indicator). Forms post without JS and a `Label` click
 *   toggles it natively. `checked`/`defaultChecked` use conditional spreads (rc.1: never pass
 *   `checked={undefined}`).
 * - `indeterminate` is applied to the DOM property via `ref` (+ `queueTask` on re-render); the forms
 *   plugin draws the dash through `:indeterminate`. Needs hydration to show.
 * - `onChange` is bound via `on('change')` (needs a client entry).
 * - `CheckboxField` provides the same field context as `Field` (id/description/error/disabled) and
 *   lays out control / label / description in Preline's "checkbox with description" arrangement.
 * - `color` keeps volt-catalyst's key set; with `@tailwindcss/forms` the checked fill is
 *   `currentColor`, so colors map to `text-*` utilities (default → `text-primary-checked`).
 *
 * Hydration: no client entry is needed for form posting; `onChange`/`indeterminate` need one.
 */
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
import { type FieldContextValue } from './fieldset.tsx';
export type CheckboxGroupProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function CheckboxGroup(handle: Handle<CheckboxGroupProps>): () => import("remix/ui").RemixElement;
export type CheckboxFieldProps = {
    id?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
/** Shared control/label/description layout for Checkbox and Radio fields. */
export declare const choiceFieldClasses: string[];
export declare function CheckboxField(handle: Handle<CheckboxFieldProps, FieldContextValue>): () => import("remix/ui").RemixElement;
/** `@tailwindcss/forms` fills a checked box with `currentColor`, so each color is a text utility. */
export declare const choiceColors: {
    'dark/zinc': string;
    'dark/white': string;
    white: string;
    dark: string;
    zinc: string;
    red: string;
    orange: string;
    amber: string;
    yellow: string;
    lime: string;
    green: string;
    emerald: string;
    teal: string;
    cyan: string;
    sky: string;
    blue: string;
    indigo: string;
    violet: string;
    purple: string;
    fuchsia: string;
    pink: string;
    rose: string;
};
export type CheckboxColor = keyof typeof choiceColors;
/** Preline native checkbox/radio base (shape is added by the caller). */
export declare const choiceBaseClasses: string[];
export type CheckboxProps = {
    id?: string;
    color?: CheckboxColor;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    required?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
    onChange?: (checked: boolean, event: Event & {
        currentTarget: HTMLInputElement;
    }) => void;
    className?: string;
    class?: string;
} & ElementProps;
export declare function Checkbox(handle: Handle<CheckboxProps>): () => import("remix/ui").RemixElement;

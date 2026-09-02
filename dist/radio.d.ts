/**
 * `radio.tsx` — Preline-styled native radio with the velix-catalyst API.
 *
 * API parity with velix-catalyst:
 * - Same exports (`RadioGroup`, `RadioField`, `Radio`) and props. `RadioGroup` is a
 *   `<div role="radiogroup">` sharing `name`, `value`/`defaultValue`, `disabled` and
 *   `onChange(value, event)` with its `Radio`s through context; radios are grouped natively through
 *   the shared `name`, so forms post without JS and arrow keys move selection natively.
 * - `Radio` is a *visible* native `<input type="radio">` styled by `@tailwindcss/forms` + Preline
 *   (`rounded-full`). `checked`/`defaultChecked` use conditional spreads (rc.1 gotcha).
 * - `RadioField` provides the same field context as `Field` (id/description/error/disabled).
 * - `color` keys match velix-catalyst; mapped to `text-*` utilities (checked fill is `currentColor`).
 *
 * Hydration: no client entry is needed for form posting; `RadioGroup.onChange` needs one.
 */
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
import { choiceColors } from './checkbox.tsx';
import { type FieldContextValue } from './fieldset.tsx';
export type RadioGroupContextValue = {
    name?: string;
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    onChange?: (value: string, event: Event & {
        currentTarget: HTMLInputElement;
    }) => void;
};
export type RadioGroupProps = {
    name?: string;
    /** Controlled value. */
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    onChange?: RadioGroupContextValue['onChange'];
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function RadioGroup(handle: Handle<RadioGroupProps, RadioGroupContextValue>): () => import("remix/ui").RemixElement;
export type RadioFieldProps = {
    id?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function RadioField(handle: Handle<RadioFieldProps, FieldContextValue>): () => import("remix/ui").RemixElement;
export type RadioColor = keyof typeof choiceColors;
export type RadioProps = {
    id?: string;
    color?: RadioColor;
    /** Form value; also compared against the group's `value`/`defaultValue`. */
    value: string;
    name?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    required?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
    className?: string;
    class?: string;
} & ElementProps;
export declare function Radio(handle: Handle<RadioProps>): () => import("remix/ui").RemixElement;

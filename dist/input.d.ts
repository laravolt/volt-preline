/**
 * `input.tsx` — Preline-styled text input with the volt-catalyst API.
 *
 * API parity with volt-catalyst:
 * - Same exports (`Input`, `InputGroup`) and props (`type`, `name`, `value`, `defaultValue`,
 *   `placeholder`, `disabled`, `invalid`, `required`, `autoFocus`, `aria-describedby`, `onChange`,
 *   `onInput`, `className`/`class`).
 * - Real native `<input>` wrapped in a `data-slot="control"` span, so forms post without JS.
 *   `invalid` sets `aria-invalid="true"` and styles through `aria-invalid:`.
 * - `id`, `disabled` and `aria-describedby` default from the surrounding `Field` context.
 * - `onChange`/`onInput` are bound with the `on()` mixin (only active inside a client entry).
 * - `InputGroup` positions `data-slot="icon"` children (first child → leading, last child → trailing)
 *   the Preline way (absolute icon, `ps-11`/`pe-11` padding on the input).
 *
 * Styling: Preline "input" (`bg-layer border-layer-line rounded-lg focus:border-primary
 * focus:ring-primary`), error state `border-destructive focus:ring-destructive`.
 *
 * Hydration: static markup; no client entry required unless `onChange`/`onInput` are used.
 */
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
export type InputGroupProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function InputGroup(handle: Handle<InputGroupProps>): () => import("remix/ui").RemixElement;
declare const dateTypes: readonly ["date", "datetime-local", "month", "time", "week"];
type DateType = (typeof dateTypes)[number];
export type InputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType;
export type InputEventHandler = (event: Event & {
    currentTarget: HTMLInputElement;
}) => void;
export type InputProps = {
    id?: string;
    type?: InputType;
    name?: string;
    value?: string | number;
    defaultValue?: string | number;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    'aria-describedby'?: string;
    onChange?: InputEventHandler;
    onInput?: InputEventHandler;
    className?: string;
    class?: string;
} & ElementProps;
/** Preline text-input classes shared by `Input` (and reused by `Textarea`/`Select` for consistency). */
export declare const inputClasses: string[];
export declare function Input(handle: Handle<InputProps>): () => import("remix/ui").RemixElement;
export {};

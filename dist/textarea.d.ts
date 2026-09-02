/**
 * `textarea.tsx` — Preline-styled textarea with the velix-catalyst API.
 *
 * API parity with velix-catalyst:
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
import { type ElementProps, type Handle } from 'remix/ui';
export type TextareaEventHandler = (event: Event & {
    currentTarget: HTMLTextAreaElement;
}) => void;
export type TextareaProps = {
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    resizable?: boolean;
    'aria-describedby'?: string;
    onChange?: TextareaEventHandler;
    onInput?: TextareaEventHandler;
    className?: string;
    class?: string;
} & ElementProps;
export declare function Textarea(handle: Handle<TextareaProps>): () => import("remix/ui").RemixElement;

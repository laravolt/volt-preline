/**
 * `select.tsx` — Preline-styled native select with the volt-catalyst API.
 *
 * API parity with volt-catalyst:
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
import { type ElementProps, type Handle, type RemixElement, type RemixNode } from 'remix/ui';
export type SelectEventHandler = (event: Event & {
    currentTarget: HTMLSelectElement;
}) => void;
export type SelectProps = {
    id?: string;
    name?: string;
    /** Controlled value (array when `multiple`). */
    value?: string | string[];
    defaultValue?: string | string[];
    multiple?: boolean;
    size?: number;
    disabled?: boolean;
    invalid?: boolean;
    required?: boolean;
    'aria-describedby'?: string;
    onChange?: SelectEventHandler;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function Select(handle: Handle<SelectProps>): () => RemixElement;

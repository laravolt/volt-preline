/**
 * `Combobox` — Preline "ComboBox" styling on top of `remix/ui/combobox/primitives`.
 *
 * API parity with `velix-catalyst/combobox`: same exports (`Combobox`, `ComboboxOption`,
 * `ComboboxLabel`, `ComboboxDescription`) and props: `options`, `displayValue(option)`, optional
 * `filter(option, query)` (default: `displayValue` includes the query, case-insensitive),
 * `valueKey(option)`, `value` / `defaultValue` / `onChange(option | null)`, `name`, `placeholder`,
 * `anchor`, `disabled`, `invalid`, `autoFocus`, aria-*, `className`/`class`, and a
 * `children(option)` render function returning a `<ComboboxOption value={option}>`. Reads `Field`
 * context through `controlAttrsFromField` (`id`, `disabled`, `aria-describedby`).
 *
 * Behavior notes (shared with velix-catalyst, inherited from the primitive):
 * - Options are arbitrary `T`, but the form value must be a string: `valueKey(option)` (default:
 *   `String(option)` for primitives, `displayValue(option)` for objects) is what the hidden
 *   `<input type="hidden" name>` carries and what `onChange` is resolved from.
 * - Filtering: every option is always rendered; `filter(option, query)` decides which ones the
 *   primitive treats as matches (it hides the rest with `hidden` and closes the popup when nothing
 *   matches). The primitive's own prefix matching is bypassed by feeding it per-option search values
 *   that are kept in sync with the query, so `filter` has full control.
 * - The primitive commits an exact `displayValue` match on blur and clears non-matching text (and
 *   the selection) on blur/Escape. Typing clears the committed value immediately (`onChange(null)`).
 * - `value` is controlled by remounting the combobox context when it changes to a different option
 *   than the current selection (the primitive only supports `defaultValue`).
 * - State selectors: highlighted option = `data-[highlighted=true]`, selected = `aria-selected`,
 *   disabled = `aria-disabled` / `disabled`, invalid input = `aria-invalid` / `data-invalid`.
 *   The popup is anchored `bottom-start` (or `top-start` with `anchor="top"`) with an 8px gap.
 *
 * TypeScript: Remix components receive a `handle`, so JSX cannot infer `T` from attributes (it
 * resolves to `unknown`). For typed callbacks, instantiate once:
 * `const PersonCombobox = Combobox as typeof Combobox<Person>` (same for `ComboboxOption`).
 *
 * Hydration: `Combobox` is not a client entry. Place it inside an app `clientEntry` for typing /
 * keyboard / popover behavior; it server-renders as a plain text input + hidden input.
 */
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
export type ComboboxProps<T> = {
    options: T[];
    displayValue: (option: T | null) => string | undefined;
    filter?: (option: T, query: string) => boolean;
    /** String form value for an option (hidden input + `onChange` lookup). */
    valueKey?: (option: T) => string;
    value?: T | null;
    defaultValue?: T | null;
    onChange?: (option: T | null) => void;
    anchor?: 'top' | 'bottom';
    id?: string;
    name?: string;
    placeholder?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    className?: string;
    class?: string;
    children: (option: NonNullable<T>) => RemixNode;
} & ElementProps;
export type ComboboxOptionProps<T> = {
    value: T;
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type ComboboxLabelProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type ComboboxDescriptionProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
/** Shared between `Combobox` and its inner parts (`ComboboxOption`, input, button, options). */
interface ComboboxContextValue<T = unknown> {
    keyOf: (option: T) => string;
    labelOf: (option: T) => string;
    readonly query: string;
    readonly anchor: 'top' | 'bottom';
    readonly currentKey: string | null;
    /** Display value of the option with the given key, or null when no option has that key. */
    labelForKey: (key: string) => string | null;
    readonly options: T[];
    renderOption: (option: T) => RemixNode;
    /**
     * Search values handed to the primitive for an option: `[label, query + '\0']` while the option
     * passes `filter`, `['\0']` otherwise. The arrays are stable per option and mutated in place by
     * `setQuery` so the primitive (whose `input` handler runs after ours) sees fresh matches
     * synchronously; `label` stays the only exact-match candidate.
     */
    searchValueFor: (option: T) => string[];
    /**
     * Update the query synchronously and re-render the options list only: re-rendering the combobox
     * provider while it settles a selection would abort its close sequence.
     */
    setQuery: (query: string) => void;
    updateOptions: (() => Promise<unknown>) | null;
    input: HTMLInputElement | null;
}
export declare function Combobox<T>(handle: Handle<ComboboxProps<T>, ComboboxContextValue<T>>): () => import("remix/ui").RemixElement;
export declare function ComboboxOption<T>(handle: Handle<ComboboxOptionProps<T>>): () => import("remix/ui").RemixElement;
export declare function ComboboxLabel(handle: Handle<ComboboxLabelProps>): () => import("remix/ui").RemixElement;
export declare function ComboboxDescription(handle: Handle<ComboboxDescriptionProps>): () => import("remix/ui").RemixElement;
export {};

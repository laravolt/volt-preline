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
import { type ElementProps, type Handle, type RemixElement, type RemixNode } from 'remix/ui';
export type ListboxProps = {
    id?: string;
    name?: string;
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string) => void;
    placeholder?: RemixNode;
    autoFocus?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type ListboxOptionProps = {
    value: string;
    /** Text used for typeahead and the accessible label. Defaults to the text content of `children`. */
    label?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type ListboxLabelProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export type ListboxDescriptionProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
/** Text content of a Remix node tree (used for typeahead labels and the select's default label). */
export declare function nodeText(node: RemixNode): string;
export declare function Listbox(handle: Handle<ListboxProps>): () => RemixElement;
export declare function ListboxOption(handle: Handle<ListboxOptionProps>): () => RemixElement;
export declare function ListboxLabel(handle: Handle<ListboxLabelProps>): () => RemixElement;
export declare function ListboxDescription(handle: Handle<ListboxDescriptionProps>): () => RemixElement;

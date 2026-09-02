/**
 * `switch.tsx` — Preline toggle switch with the volt-catalyst API.
 *
 * API parity with volt-catalyst:
 * - Same exports (`SwitchGroup`, `SwitchField`, `Switch`) and props (`color`, `name`, `value`,
 *   `checked`, `defaultChecked`, `disabled`, `required`, `aria-label`, `aria-describedby`,
 *   `onChange(checked, event)`).
 * - `Switch` is a native `<input type="checkbox" role="switch">` (invisible, covering the track) that
 *   is the `peer` of Preline's track + knob spans: `peer-checked:bg-primary-checked` on the track and
 *   `peer-checked:translate-x-full` on the knob. Forms post without JS and `Label` clicks toggle it.
 * - `checked`/`defaultChecked` use conditional spreads (rc.1: never pass `checked={undefined}`).
 * - `SwitchField` provides the same field context as `Field` and lays out label/description on the
 *   left with the switch on the right.
 * - `color` keys match volt-catalyst; mapped to the checked track color (default `primary-checked`).
 *
 * Hydration: no client entry is needed for form posting; `onChange` needs one.
 */
import { type ElementProps, type Handle, type RemixNode } from 'remix/ui';
import { type FieldContextValue } from './fieldset.tsx';
export type SwitchGroupProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function SwitchGroup(handle: Handle<SwitchGroupProps>): () => import("remix/ui").RemixElement;
export type SwitchFieldProps = {
    id?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function SwitchField(handle: Handle<SwitchFieldProps, FieldContextValue>): () => import("remix/ui").RemixElement;
/** Checked track color per volt-catalyst color key. */
declare const colors: {
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
export type SwitchColor = keyof typeof colors;
export type SwitchProps = {
    id?: string;
    color?: SwitchColor;
    name?: string;
    value?: string;
    checked?: boolean;
    defaultChecked?: boolean;
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
export declare function Switch(handle: Handle<SwitchProps>): () => import("remix/ui").RemixElement;
export {};

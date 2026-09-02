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
import { on, ref, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { controlAttrsFromField, registerFieldProvider, type FieldContextValue } from './fieldset.tsx'
import { cx, splitProps } from './utils.ts'

export type CheckboxGroupProps = {
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function CheckboxGroup(handle: Handle<CheckboxGroupProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div
        data-slot="control"
        {...attrs}
        className={cx(className, 'flex flex-col gap-y-3', 'has-[[data-slot=description]]:gap-y-4 has-[[data-slot=description]]:[&_[data-slot=label]]:font-medium')}
      >
        {children}
      </div>
    )
  }
}

export type CheckboxFieldProps = {
  id?: string
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

/** Shared control/label/description layout for Checkbox and Radio fields. */
export const choiceFieldClasses = [
  'relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5',
  '[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:flex [&>[data-slot=control]]:h-5 [&>[data-slot=control]]:items-center',
  '[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:leading-5',
  '[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2',
  '[&>[data-slot=error]]:col-start-2',
  'has-[[data-slot=description]]:[&_[data-slot=label]]:font-medium',
]

export function CheckboxField(handle: Handle<CheckboxFieldProps, FieldContextValue>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id, disabled, children, ...attrs } = rest
    let controlId = id || handle.id
    handle.context.set({
      controlId,
      descriptionId: `${controlId}-description`,
      errorId: `${controlId}-error`,
      disabled: disabled || undefined,
    })
    return (
      <div data-slot="field" data-disabled={disabled ? '' : undefined} {...attrs} className={cx(className, choiceFieldClasses)}>
        {children}
      </div>
    )
  }
}

registerFieldProvider(CheckboxField)

/** `@tailwindcss/forms` fills a checked box with `currentColor`, so each color is a text utility. */
export const choiceColors = {
  'dark/zinc': 'text-primary-checked',
  'dark/white': 'text-primary-checked',
  white: 'text-layer-foreground',
  dark: 'text-secondary',
  zinc: 'text-zinc-600',
  red: 'text-red-600',
  orange: 'text-orange-500',
  amber: 'text-amber-500',
  yellow: 'text-yellow-500',
  lime: 'text-lime-500',
  green: 'text-green-600',
  emerald: 'text-emerald-600',
  teal: 'text-teal-600',
  cyan: 'text-cyan-500',
  sky: 'text-sky-500',
  blue: 'text-blue-600',
  indigo: 'text-indigo-500',
  violet: 'text-violet-500',
  purple: 'text-purple-500',
  fuchsia: 'text-fuchsia-500',
  pink: 'text-pink-500',
  rose: 'text-rose-500',
}

export type CheckboxColor = keyof typeof choiceColors

/** Preline native checkbox/radio base (shape is added by the caller). */
export const choiceBaseClasses = [
  'shrink-0 size-4 border-line-3 bg-layer shadow-2xs',
  'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
  'checked:border-transparent checked:bg-current indeterminate:border-transparent indeterminate:bg-current',
  'disabled:pointer-events-none disabled:opacity-50',
]

export type CheckboxProps = {
  id?: string
  color?: CheckboxColor
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  required?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  onChange?: (checked: boolean, event: Event & { currentTarget: HTMLInputElement }) => void
  className?: string
  class?: string
} & ElementProps

export function Checkbox(handle: Handle<CheckboxProps>) {
  let input: HTMLInputElement | undefined

  function syncIndeterminate() {
    if (input) input.indeterminate = Boolean(handle.props.indeterminate)
  }

  return () => {
    let { className, rest } = splitProps(handle.props)
    let {
      color = 'dark/zinc',
      checked,
      defaultChecked,
      indeterminate: _indeterminate,
      onChange,
      id: _id,
      disabled: _disabled,
      'aria-describedby': _describedBy,
      ...attrs
    } = rest
    let { id, disabled, describedBy } = controlAttrsFromField(handle, rest)
    if (input) handle.queueTask(syncIndeterminate)

    return (
      <span data-slot="control" className={cx(className, 'inline-flex')}>
        <input
          {...attrs}
          type="checkbox"
          id={id}
          {...(checked !== undefined ? { checked } : {})}
          {...(defaultChecked !== undefined ? { defaultChecked } : {})}
          disabled={disabled || undefined}
          aria-describedby={describedBy}
          className={cx(choiceBaseClasses, 'rounded-sm', choiceColors[color as CheckboxColor] ?? choiceColors['dark/zinc'])}
          mix={[
            ref((node) => {
              input = node as HTMLInputElement
              syncIndeterminate()
            }),
            on('change', (event) => {
              let target = event.currentTarget as HTMLInputElement
              onChange?.(target.checked, event as Event & { currentTarget: HTMLInputElement })
            }),
          ]}
        />
      </span>
    )
  }
}

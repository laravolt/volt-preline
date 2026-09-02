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
import { on, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { choiceBaseClasses, choiceColors, choiceFieldClasses } from './checkbox.tsx'
import { controlAttrsFromField, registerFieldProvider, type FieldContextValue } from './fieldset.tsx'
import { cx, splitProps } from './utils.ts'

export type RadioGroupContextValue = {
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: (value: string, event: Event & { currentTarget: HTMLInputElement }) => void
}

export type RadioGroupProps = {
  name?: string
  /** Controlled value. */
  value?: string
  defaultValue?: string
  disabled?: boolean
  onChange?: RadioGroupContextValue['onChange']
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function RadioGroup(handle: Handle<RadioGroupProps, RadioGroupContextValue>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { name, value, defaultValue, disabled, onChange, children, ...attrs } = rest
    handle.context.set({ name, value, defaultValue, disabled, onChange })
    return (
      <div
        role="radiogroup"
        data-slot="control"
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        className={cx(className, 'flex flex-col gap-y-3', 'has-[[data-slot=description]]:gap-y-4 has-[[data-slot=description]]:[&_[data-slot=label]]:font-medium')}
      >
        {children}
      </div>
    )
  }
}

export type RadioFieldProps = {
  id?: string
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function RadioField(handle: Handle<RadioFieldProps, FieldContextValue>) {
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

registerFieldProvider(RadioField)

export type RadioColor = keyof typeof choiceColors

export type RadioProps = {
  id?: string
  color?: RadioColor
  /** Form value; also compared against the group's `value`/`defaultValue`. */
  value: string
  name?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  className?: string
  class?: string
} & ElementProps

export function Radio(handle: Handle<RadioProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { color = 'dark/zinc', value, name, checked, defaultChecked, id: _id, disabled: _disabled, 'aria-describedby': _describedBy, ...attrs } = rest
    let group = handle.context.get(RadioGroup)
    let field = controlAttrsFromField(handle, rest)
    let disabled = field.disabled ?? group?.disabled
    if (checked === undefined && group?.value !== undefined) checked = group.value === value
    if (defaultChecked === undefined && group?.defaultValue !== undefined) defaultChecked = group.defaultValue === value

    return (
      <span data-slot="control" className={cx(className, 'inline-flex')}>
        <input
          {...attrs}
          type="radio"
          id={field.id}
          name={name ?? group?.name}
          value={value}
          {...(checked !== undefined ? { checked } : {})}
          {...(defaultChecked ? { defaultChecked } : {})}
          disabled={disabled || undefined}
          aria-describedby={field.describedBy}
          className={cx(choiceBaseClasses, 'rounded-full', choiceColors[color as RadioColor] ?? choiceColors['dark/zinc'])}
          mix={on('change', (event) => {
            let target = event.currentTarget as HTMLInputElement
            if (target.checked) group?.onChange?.(target.value, event as Event & { currentTarget: HTMLInputElement })
          })}
        />
      </span>
    )
  }
}

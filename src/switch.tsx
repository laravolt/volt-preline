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
import { on, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { controlAttrsFromField, registerFieldProvider, type FieldContextValue } from './fieldset.tsx'
import { cx, splitProps } from './utils.ts'

export type SwitchGroupProps = {
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function SwitchGroup(handle: Handle<SwitchGroupProps>) {
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

export type SwitchFieldProps = {
  id?: string
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function SwitchField(handle: Handle<SwitchFieldProps, FieldContextValue>) {
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
      <div
        data-slot="field"
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        className={cx(
          className,
          'grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-0.5',
          '[&>[data-slot=control]]:col-start-2 [&>[data-slot=control]]:row-start-1',
          '[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:leading-6',
          '[&>[data-slot=description]]:col-start-1 [&>[data-slot=description]]:row-start-2',
          '[&>[data-slot=error]]:col-start-1',
          'has-[[data-slot=description]]:[&_[data-slot=label]]:font-medium',
        )}
      >
        {children}
      </div>
    )
  }
}

registerFieldProvider(SwitchField)

/** Checked track color per volt-catalyst color key. */
const colors = {
  'dark/zinc': 'peer-checked:bg-primary-checked',
  'dark/white': 'peer-checked:bg-primary-checked',
  white: 'peer-checked:bg-layer peer-checked:ring-1 peer-checked:ring-inset peer-checked:ring-line-3',
  dark: 'peer-checked:bg-secondary',
  zinc: 'peer-checked:bg-zinc-600',
  red: 'peer-checked:bg-red-600',
  orange: 'peer-checked:bg-orange-500',
  amber: 'peer-checked:bg-amber-500',
  yellow: 'peer-checked:bg-yellow-500',
  lime: 'peer-checked:bg-lime-500',
  green: 'peer-checked:bg-green-600',
  emerald: 'peer-checked:bg-emerald-600',
  teal: 'peer-checked:bg-teal-600',
  cyan: 'peer-checked:bg-cyan-500',
  sky: 'peer-checked:bg-sky-500',
  blue: 'peer-checked:bg-blue-600',
  indigo: 'peer-checked:bg-indigo-500',
  violet: 'peer-checked:bg-violet-500',
  purple: 'peer-checked:bg-purple-500',
  fuchsia: 'peer-checked:bg-fuchsia-500',
  pink: 'peer-checked:bg-pink-500',
  rose: 'peer-checked:bg-rose-500',
}

export type SwitchColor = keyof typeof colors

export type SwitchProps = {
  id?: string
  color?: SwitchColor
  name?: string
  value?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  onChange?: (checked: boolean, event: Event & { currentTarget: HTMLInputElement }) => void
  className?: string
  class?: string
} & ElementProps

export function Switch(handle: Handle<SwitchProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { color = 'dark/zinc', checked, defaultChecked, onChange, id: _id, disabled: _disabled, 'aria-describedby': _describedBy, ...attrs } = rest
    let { id, disabled, describedBy } = controlAttrsFromField(handle, rest)

    return (
      <span data-slot="control" className={cx(className, 'relative inline-block h-6 w-11 shrink-0 align-middle')}>
        <input
          {...attrs}
          type="checkbox"
          role="switch"
          id={id}
          {...(checked !== undefined ? { checked } : {})}
          {...(defaultChecked !== undefined ? { defaultChecked } : {})}
          disabled={disabled || undefined}
          aria-describedby={describedBy}
          className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer appearance-none rounded-full border-0 bg-transparent opacity-0 shadow-none checked:bg-transparent focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed"
          mix={on('change', (event) => {
            let target = event.currentTarget as HTMLInputElement
            onChange?.(target.checked, event as Event & { currentTarget: HTMLInputElement })
          })}
        />
        {/* Track */}
        <span
          aria-hidden="true"
          className={cx(
            'absolute inset-0 rounded-full bg-surface-1 transition-colors duration-200 ease-in-out',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            'peer-disabled:pointer-events-none peer-disabled:opacity-50',
            colors[color as SwitchColor] ?? colors['dark/zinc'],
          )}
        />
        {/* Knob */}
        <span
          aria-hidden="true"
          className={cx(
            'absolute start-0.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-switch shadow-sm transition-transform duration-200 ease-in-out',
            'peer-checked:translate-x-full peer-disabled:pointer-events-none peer-disabled:opacity-50',
            color === 'white' && 'ring-1 ring-line-3',
          )}
        />
      </span>
    )
  }
}

/**
 * `input.tsx` — Preline-styled text input with the velix-catalyst API.
 *
 * API parity with velix-catalyst:
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
import { on, type ElementProps, type Handle, type RemixNode } from 'remix/ui'

import { controlAttrsFromField } from './fieldset.tsx'
import { cx, splitProps } from './utils.ts'

export type InputGroupProps = {
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function InputGroup(handle: Handle<InputGroupProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <span
        data-slot="control"
        {...attrs}
        className={cx(
          className,
          'relative block w-full',
          // Icons are absolutely positioned, vertically centered, and never intercept clicks.
          '[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:absolute [&>[data-slot=icon]]:top-1/2 [&>[data-slot=icon]]:z-20 [&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:-translate-y-1/2 [&>[data-slot=icon]]:text-muted-foreground',
          '[&>[data-slot=icon]:first-child]:start-4 [&>[data-slot=icon]:last-child]:end-4',
          // Make room for a leading / trailing icon in the input.
          'has-[>[data-slot=icon]:first-child]:[&_input]:ps-11 has-[>[data-slot=icon]:last-child]:[&_input]:pe-11',
        )}
      >
        {children}
      </span>
    )
  }
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week'] as const
type DateType = (typeof dateTypes)[number]

export type InputType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType

export type InputEventHandler = (event: Event & { currentTarget: HTMLInputElement }) => void

export type InputProps = {
  id?: string
  type?: InputType
  name?: string
  value?: string | number
  defaultValue?: string | number
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  autoFocus?: boolean
  'aria-describedby'?: string
  onChange?: InputEventHandler
  onInput?: InputEventHandler
  className?: string
  class?: string
} & ElementProps

/** Preline text-input classes shared by `Input` (and reused by `Textarea`/`Select` for consistency). */
export const inputClasses = [
  // Layout
  'block w-full rounded-lg px-4 py-2.5 sm:py-3',
  // Typography
  'text-base text-layer-foreground placeholder:text-muted-foreground-1 sm:text-sm',
  // Surface
  'bg-layer border-layer-line shadow-2xs',
  // Focus (ring comes from @tailwindcss/forms; recolor it)
  'focus:z-10 focus:border-primary focus:ring-primary',
  // Invalid
  'aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive',
  // Disabled
  'disabled:pointer-events-none disabled:opacity-50',
]

export function Input(handle: Handle<InputProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { invalid, onChange, onInput, id: _id, disabled: _disabled, 'aria-describedby': _describedBy, ...attrs } = rest
    let { id, disabled, describedBy } = controlAttrsFromField(handle, rest)
    let mixins = [
      onChange && on<HTMLInputElement>('change', (event) => onChange(event as Event & { currentTarget: HTMLInputElement })),
      onInput && on<HTMLInputElement>('input', (event) => onInput(event as Event & { currentTarget: HTMLInputElement })),
    ].filter((m) => Boolean(m))

    return (
      <span data-slot="control" className={cx(className, 'relative block w-full has-disabled:opacity-100')}>
        <input
          {...attrs}
          id={id}
          disabled={disabled || undefined}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={describedBy}
          mix={mixins.length ? (mixins as any) : undefined}
          className={cx(
            inputClasses,
            // Native date pickers: keep the same height as text inputs.
            attrs.type && (dateTypes as readonly string[]).includes(attrs.type) && '[&::-webkit-date-and-time-value]:min-h-[1.5em] [&::-webkit-date-and-time-value]:text-start',
          )}
        />
      </span>
    )
  }
}

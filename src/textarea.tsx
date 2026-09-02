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
import { on, type ElementProps, type Handle } from 'remix/ui'

import { controlAttrsFromField } from './fieldset.tsx'
import { inputClasses } from './input.tsx'
import { cx, splitProps } from './utils.ts'

export type TextareaEventHandler = (event: Event & { currentTarget: HTMLTextAreaElement }) => void

export type TextareaProps = {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  resizable?: boolean
  'aria-describedby'?: string
  onChange?: TextareaEventHandler
  onInput?: TextareaEventHandler
  className?: string
  class?: string
} & ElementProps

export function Textarea(handle: Handle<TextareaProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let {
      invalid,
      resizable = true,
      onChange,
      onInput,
      id: _id,
      disabled: _disabled,
      'aria-describedby': _describedBy,
      ...attrs
    } = rest
    let { id, disabled, describedBy } = controlAttrsFromField(handle, rest)
    let mixins = [
      onChange && on<HTMLTextAreaElement>('change', (event) => onChange(event as Event & { currentTarget: HTMLTextAreaElement })),
      onInput && on<HTMLTextAreaElement>('input', (event) => onInput(event as Event & { currentTarget: HTMLTextAreaElement })),
    ].filter((m) => Boolean(m))

    return (
      <span data-slot="control" className={cx(className, 'relative block w-full')}>
        <textarea
          rows={3}
          {...attrs}
          id={id}
          disabled={disabled || undefined}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={describedBy}
          mix={mixins.length ? (mixins as any) : undefined}
          className={cx(
            inputClasses,
            // Themed scrollbar (Preline)
            '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb',
            resizable ? 'resize-y' : 'resize-none',
          )}
        />
      </span>
    )
  }
}

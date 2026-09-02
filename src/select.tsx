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
import { on, type ElementProps, type Handle, type RemixElement, type RemixNode } from 'remix/ui'

import { controlAttrsFromField } from './fieldset.tsx'
import { cx, splitProps } from './utils.ts'

export type SelectEventHandler = (event: Event & { currentTarget: HTMLSelectElement }) => void

export type SelectProps = {
  id?: string
  name?: string
  /** Controlled value (array when `multiple`). */
  value?: string | string[]
  defaultValue?: string | string[]
  multiple?: boolean
  size?: number
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  'aria-describedby'?: string
  onChange?: SelectEventHandler
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

function isElement(node: unknown): node is RemixElement {
  return typeof node === 'object' && node !== null && (node as { $rmx?: boolean }).$rmx === true
}

/** Clone `<option>` descendants (through `<optgroup>`/fragments) so those matching `values` get `selected`. */
function markSelected(node: RemixNode, values: string[]): RemixNode {
  if (Array.isArray(node)) return node.map((child) => markSelected(child as RemixNode, values))
  if (!isElement(node)) return node
  let props = node.props as { value?: unknown; selected?: boolean; children?: RemixNode }
  if (node.type === 'option') {
    let optionValue = props.value !== undefined ? String(props.value) : undefined
    if (optionValue !== undefined && values.includes(optionValue) && !props.selected) {
      return { ...node, props: { ...props, selected: true } } as RemixElement
    }
    return node
  }
  if (props.children === undefined) return node
  return { ...node, props: { ...props, children: markSelected(props.children, values) } } as RemixElement
}

export function Select(handle: Handle<SelectProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let {
      invalid,
      multiple,
      onChange,
      children,
      value,
      defaultValue,
      id: _id,
      disabled: _disabled,
      'aria-describedby': _describedBy,
      ...attrs
    } = rest
    let { id, disabled, describedBy } = controlAttrsFromField(handle, rest)
    let selected = value ?? defaultValue
    if (selected !== undefined) children = markSelected(children, Array.isArray(selected) ? selected : [String(selected)])

    return (
      <span data-slot="control" className={cx(className, 'group relative block w-full')}>
        <select
          {...attrs}
          multiple={multiple || undefined}
          {...(value !== undefined ? { value } : {})}
          id={id}
          disabled={disabled || undefined}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={describedBy}
          mix={onChange ? on<HTMLSelectElement>('change', (event) => onChange(event as Event & { currentTarget: HTMLSelectElement })) : undefined}
          className={cx(
            // Layout (space for the chevron on single selects)
            'block w-full rounded-lg py-2.5 ps-4 sm:py-3',
            multiple ? 'pe-4' : 'pe-9',
            // Typography
            'text-base text-layer-foreground sm:text-sm',
            // Surface (drop the forms-plugin chevron; we render our own)
            'bg-layer border-layer-line bg-none shadow-2xs',
            '[&_optgroup]:font-semibold [&_option]:bg-layer [&_option]:text-layer-foreground [&_option:checked]:bg-surface-1',
            // Focus
            'focus:border-primary focus:ring-primary',
            // Invalid
            'aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive',
            // Disabled
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          {children}
        </select>
        {!multiple && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 group-has-disabled:opacity-50">
            <svg
              className="size-4 shrink-0 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </span>
        )}
      </span>
    )
  }
}

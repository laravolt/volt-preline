/**
 * `fieldset.tsx` — Preline-styled form scaffolding with the velix-catalyst API.
 *
 * API parity with velix-catalyst:
 * - Same exports: `Fieldset`, `Legend`, `FieldGroup`, `Field`, `Label`, `Description`, `ErrorMessage`
 *   plus the helpers `registerFieldProvider`, `getFieldContext`, `controlAttrsFromField` and the
 *   `FieldContextValue` / `FieldsetContextValue` types.
 * - `Fieldset` is a native `<fieldset>`; `disabled` disables descendants natively and is shared through
 *   context so `Legend`/`Label`/`Description` render `data-disabled`.
 * - `Field` publishes `{ controlId, descriptionId, errorId, disabled }` through `handle.context`.
 *   `Label` gets `htmlFor`, `Description`/`ErrorMessage` get their ids, and controls read
 *   `id`/`disabled`/`aria-describedby` through `controlAttrsFromField`. Because controls render before
 *   their description, `aria-describedby` always references both ids.
 * - `CheckboxField`/`RadioField`/`SwitchField` register themselves via `registerFieldProvider` so the
 *   same `Label`/`Description`/`ErrorMessage` work inside them without circular imports.
 *
 * Styling: Preline "label / helper text / error text" typography using semantic tokens
 * (`text-foreground`, `text-muted-foreground-1`, `text-destructive`). Sibling spacing uses
 * `data-slot` markers so the order label → control → description/error just works.
 *
 * Hydration: static markup; no client entry required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { cx, splitProps } from './utils.ts'

export type FieldContextValue = {
  controlId: string
  descriptionId: string
  errorId: string
  disabled?: boolean
}

type FieldProvider = (handle: Handle<any, FieldContextValue>) => unknown

const fieldProviders = new Set<FieldProvider>()

/** Register a component that provides `FieldContextValue` (used by CheckboxField, RadioField, SwitchField). */
export function registerFieldProvider(component: FieldProvider): void {
  fieldProviders.add(component)
}

/** Read the nearest field context (from `Field` or any registered field provider). */
export function getFieldContext(handle: Handle<any, any>): FieldContextValue | undefined {
  for (let provider of fieldProviders) {
    let value = handle.context.get(provider) as FieldContextValue | undefined
    if (value) return value
  }
  return undefined
}

/** Build `{ id, disabled, aria-describedby }` defaults for a form control from field context. */
export function controlAttrsFromField(
  handle: Handle<any, any>,
  props: { id?: string; disabled?: boolean; 'aria-describedby'?: string },
): { id: string | undefined; disabled: boolean | undefined; describedBy: string | undefined } {
  let field = getFieldContext(handle)
  return {
    id: props.id ?? field?.controlId,
    disabled: props.disabled ?? field?.disabled,
    describedBy: props['aria-describedby'] ?? (field ? `${field.descriptionId} ${field.errorId}` : undefined),
  }
}

export type FieldsetContextValue = { disabled: boolean }

export type FieldsetProps = {
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Fieldset(handle: Handle<FieldsetProps, FieldsetContextValue>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { disabled, children, ...attrs } = rest
    handle.context.set({ disabled: Boolean(disabled) })
    return (
      <fieldset
        {...attrs}
        disabled={disabled || undefined}
        className={cx(className, 'min-w-0 [&>[data-slot=legend]+*]:mt-4')}
      >
        {children}
      </fieldset>
    )
  }
}

export type LegendProps = {
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Legend(handle: Handle<LegendProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    let disabled = handle.context.get(Fieldset)?.disabled
    return (
      <legend
        data-slot="legend"
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        className={cx(className, 'text-base font-semibold text-foreground data-disabled:opacity-50')}
      >
        {children}
      </legend>
    )
  }
}

export type FieldGroupProps = {
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function FieldGroup(handle: Handle<FieldGroupProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <div data-slot="control" {...attrs} className={cx(className, 'grid gap-y-6')}>
        {children}
      </div>
    )
  }
}

export type FieldProps = {
  /** Id used for the control; description/error ids derive from it. Defaults to `handle.id`. */
  id?: string
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Field(handle: Handle<FieldProps, FieldContextValue>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id, disabled, children, ...attrs } = rest
    let controlId = id || handle.id
    let isDisabled = Boolean(disabled ?? handle.context.get(Fieldset)?.disabled)
    handle.context.set({
      controlId,
      descriptionId: `${controlId}-description`,
      errorId: `${controlId}-error`,
      disabled: isDisabled || undefined,
    })
    return (
      <div
        data-slot="field"
        data-disabled={isDisabled ? '' : undefined}
        {...attrs}
        className={cx(
          className,
          // Preline: label sits 2 units above the control, helper/error text 2 units below.
          '[&>[data-slot=label]+[data-slot=control]]:mt-2',
          '[&>[data-slot=label]+[data-slot=description]]:mt-1',
          '[&>[data-slot=description]+[data-slot=control]]:mt-2',
          '[&>[data-slot=control]+[data-slot=description]]:mt-2',
          '[&>[data-slot=control]+[data-slot=error]]:mt-2',
          '[&>[data-slot=label]]:font-medium',
        )}
      >
        {children}
      </div>
    )
  }
}

registerFieldProvider(Field)

export type LabelProps = {
  htmlFor?: string
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Label(handle: Handle<LabelProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { htmlFor, children, ...attrs } = rest
    let field = getFieldContext(handle)
    let disabled = field?.disabled ?? handle.context.get(Fieldset)?.disabled
    return (
      <label
        data-slot="label"
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        htmlFor={htmlFor ?? field?.controlId}
        className={cx(className, 'block text-sm text-foreground select-none data-disabled:opacity-50')}
      >
        {children}
      </label>
    )
  }
}

export type DescriptionProps = {
  id?: string
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export function Description(handle: Handle<DescriptionProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id, children, ...attrs } = rest
    let field = getFieldContext(handle)
    let disabled = field?.disabled ?? handle.context.get(Fieldset)?.disabled
    return (
      <p
        data-slot="description"
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        id={id ?? field?.descriptionId}
        className={cx(className, 'text-sm text-muted-foreground-1 data-disabled:opacity-50')}
      >
        {children}
      </p>
    )
  }
}

export type ErrorMessageProps = DescriptionProps

export function ErrorMessage(handle: Handle<ErrorMessageProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { id, children, ...attrs } = rest
    let field = getFieldContext(handle)
    let disabled = field?.disabled ?? handle.context.get(Fieldset)?.disabled
    return (
      <p
        data-slot="error"
        data-disabled={disabled ? '' : undefined}
        {...attrs}
        id={id ?? field?.errorId}
        className={cx(className, 'text-sm text-destructive data-disabled:opacity-50')}
      >
        {children}
      </p>
    )
  }
}

/**
 * `Combobox` — Preline "ComboBox" styling on top of `remix/ui/combobox/primitives`.
 *
 * API parity with `volt-catalyst/combobox`: same exports (`Combobox`, `ComboboxOption`,
 * `ComboboxLabel`, `ComboboxDescription`) and props: `options`, `displayValue(option)`, optional
 * `filter(option, query)` (default: `displayValue` includes the query, case-insensitive),
 * `valueKey(option)`, `value` / `defaultValue` / `onChange(option | null)`, `name`, `placeholder`,
 * `anchor`, `disabled`, `invalid`, `autoFocus`, aria-*, `className`/`class`, and a
 * `children(option)` render function returning a `<ComboboxOption value={option}>`. Reads `Field`
 * context through `controlAttrsFromField` (`id`, `disabled`, `aria-describedby`).
 *
 * Behavior notes (shared with volt-catalyst, inherited from the primitive):
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
import { Fragment, on, ref, type ElementProps, type Handle, type RemixNode } from 'remix/ui'
import * as combobox from 'remix/ui/combobox/primitives'
import * as listbox from 'remix/ui/listbox'
import * as popover from 'remix/ui/popover'

import { controlAttrsFromField } from './fieldset.tsx'
import { cx, splitProps } from './utils.ts'

export type ComboboxProps<T> = {
  options: T[]
  displayValue: (option: T | null) => string | undefined
  filter?: (option: T, query: string) => boolean
  /** String form value for an option (hidden input + `onChange` lookup). */
  valueKey?: (option: T) => string
  value?: T | null
  defaultValue?: T | null
  onChange?: (option: T | null) => void
  anchor?: 'top' | 'bottom'
  id?: string
  name?: string
  placeholder?: string
  autoFocus?: boolean
  disabled?: boolean
  invalid?: boolean
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  className?: string
  class?: string
  children: (option: NonNullable<T>) => RemixNode
} & ElementProps

export type ComboboxOptionProps<T> = {
  value: T
  disabled?: boolean
  className?: string
  class?: string
  children?: RemixNode
} & ElementProps

export type ComboboxLabelProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export type ComboboxDescriptionProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

/** Shared between `Combobox` and its inner parts (`ComboboxOption`, input, button, options). */
interface ComboboxContextValue<T = unknown> {
  keyOf: (option: T) => string
  labelOf: (option: T) => string
  readonly query: string
  readonly anchor: 'top' | 'bottom'
  readonly currentKey: string | null
  /** Display value of the option with the given key, or null when no option has that key. */
  labelForKey: (key: string) => string | null
  readonly options: T[]
  renderOption: (option: T) => RemixNode
  /**
   * Search values handed to the primitive for an option: `[label, query + '\0']` while the option
   * passes `filter`, `['\0']` otherwise. The arrays are stable per option and mutated in place by
   * `setQuery` so the primitive (whose `input` handler runs after ours) sees fresh matches
   * synchronously; `label` stays the only exact-match candidate.
   */
  searchValueFor: (option: T) => string[]
  /**
   * Update the query synchronously and re-render the options list only: re-rendering the combobox
   * provider while it settles a selection would abort its close sequence.
   */
  setQuery: (query: string) => void
  updateOptions: (() => Promise<unknown>) | null
  input: HTMLInputElement | null
}

/** Row content: label + description side by side, icons/avatars sized like Preline's select items. */
const optionContentClasses = cx(
  'flex min-w-0 flex-1 items-center gap-x-2',
  '*:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-muted-foreground',
  '*:data-[slot=avatar]:size-5 *:data-[slot=avatar]:shrink-0',
)

function defaultValueKey<T>(option: T, displayValue: (option: T) => string | undefined) {
  return typeof option === 'object' && option !== null ? (displayValue(option) ?? '') : String(option)
}

export function Combobox<T>(handle: Handle<ComboboxProps<T>, ComboboxContextValue<T>>) {
  let keyOf = (option: T) => handle.props.valueKey?.(option) ?? defaultValueKey(option, handle.props.displayValue)
  let labelOf = (option: T) => handle.props.displayValue(option) ?? ''
  let keyOfNullable = (option: T | null | undefined) => (option == null ? null : keyOf(option))

  let query = ''
  let currentKey: string | null = keyOfNullable(handle.props.value ?? handle.props.defaultValue)
  let lastPropValue = handle.props.value
  let contextKey = 0
  let searchValues = new Map<string, string[]>()

  let context: ComboboxContextValue<T> = {
    keyOf,
    labelOf,
    get query() {
      return query
    },
    get anchor() {
      return handle.props.anchor ?? 'bottom'
    },
    get currentKey() {
      return currentKey
    },
    labelForKey(key) {
      let option = handle.props.options.find((o) => keyOf(o) === key)
      return option === undefined ? null : labelOf(option)
    },
    get options() {
      return handle.props.options
    },
    renderOption(option) {
      return handle.props.children(option as NonNullable<T>)
    },
    searchValueFor(option) {
      let key = keyOf(option)
      let values = searchValues.get(key)
      if (!values) {
        values = [labelOf(option), '']
        searchValues.set(key, values)
      }
      syncSearchValue(values, option)
      return values
    },
    setQuery(next) {
      if (next === query) return
      query = next
      let keys = new Set<string>()
      for (let option of handle.props.options) {
        keys.add(keyOf(option))
        context.searchValueFor(option)
      }
      for (let key of searchValues.keys()) if (!keys.has(key)) searchValues.delete(key)
      void context.updateOptions?.()
    },
    updateOptions: null,
    input: null,
  }

  function passesFilter(option: T) {
    if (query === '') return true
    let { filter, displayValue } = handle.props
    return filter ? filter(option, query) : (displayValue(option)?.toLowerCase().includes(query.toLowerCase()) ?? false)
  }

  function syncSearchValue(values: string[], option: T) {
    if (passesFilter(option)) {
      values[0] = labelOf(option)
      values[1] = query + '\0'
    } else {
      values.length = 0
      values[0] = '\0'
    }
  }

  handle.context.set(context)

  return () => {
    let props = handle.props
    let { value, placeholder, autoFocus, invalid, name, mix } = props
    let { className, rest } = splitProps(props)
    let { id, disabled, describedBy: ariaDescribedBy } = controlAttrsFromField(handle, rest)
    // Passthrough attrs for the <input>: everything not consumed above. (`Omit` over `ElementProps`
    // collapses to an index signature, hence the untyped destructuring.)
    let {
      options: _options,
      displayValue: _displayValue,
      filter: _filter,
      valueKey: _valueKey,
      value: _value,
      defaultValue: _defaultValue,
      onChange: _onChange,
      anchor: _anchor,
      id: _id,
      name: _name,
      placeholder: _placeholder,
      autoFocus: _autoFocus,
      disabled: _disabled,
      invalid: _invalid,
      'aria-describedby': _ariaDescribedBy,
      children: _children,
      mix: _mix,
      ...inputProps
    } = rest as Record<string, unknown>

    // Controlled `value`: remount the combobox context when the prop moves away from the current selection.
    if (value !== lastPropValue) {
      lastPropValue = value
      let nextKey = keyOfNullable(value)
      if (value !== undefined && nextKey !== currentKey) {
        currentKey = nextKey
        contextKey++
      }
    }

    let initialLabel = currentKey === null ? null : context.labelForKey(currentKey)

    return (
      <combobox.Context key={contextKey} name={name} defaultValue={currentKey} disabled={disabled}>
        <span data-slot="control" className={cx(className, 'relative block w-full')}>
          <ComboboxInput
            {...inputProps}
            {...(initialLabel !== null ? { defaultValue: initialLabel } : {})}
            id={id}
            autoFocus={autoFocus}
            disabled={disabled}
            placeholder={placeholder}
            aria-describedby={ariaDescribedBy}
            aria-invalid={invalid ? 'true' : undefined}
            data-invalid={invalid ? '' : undefined}
            mix={mix}
            onCommit={(key: string | null) => {
              if (key === currentKey) return
              currentKey = key
              let option = key === null ? undefined : handle.props.options.find((o) => keyOf(o) === key)
              handle.props.onChange?.(option ?? null)
              void handle.update()
            }}
            className={cx(
              // Preline combobox input
              'block w-full rounded-lg py-2.5 ps-4 pe-9 sm:py-3',
              'text-base text-layer-foreground placeholder:text-muted-foreground sm:text-sm',
              'border-layer-line bg-layer shadow-2xs',
              // Focus (ring comes from @tailwindcss/forms; recolor it)
              'focus:border-primary focus:ring-primary',
              // Invalid
              'aria-invalid:border-destructive aria-invalid:focus:border-destructive aria-invalid:focus:ring-destructive',
              // Disabled
              'disabled:pointer-events-none disabled:opacity-50',
            )}
          />
          <ComboboxButton disabled={disabled} />
          <ComboboxOptions />
          {name && <input mix={combobox.hiddenInput()} />}
        </span>
      </combobox.Context>
    )
  }
}

type ComboboxInputProps = { onCommit: (key: string | null) => void; mix?: unknown } & ElementProps

function ComboboxInput(handle: Handle<ComboboxInputProps>) {
  let listboxCtx = handle.context.get(listbox.Context)
  let outer = handle.context.get(Combobox) as ComboboxContextValue

  return () => {
    let { onCommit, mix, ...props } = handle.props

    return (
      <input
        {...props}
        mix={[
          // Runs before the primitive's own `input` handler (nested mixin descriptors are applied
          // after top-level ones), so its match computation sees the synced search values.
          on('input', (event) => outer.setQuery(event.currentTarget.value)),
          combobox.input(),
          ref((node, signal) => {
            let input = node as HTMLInputElement
            outer.input = input
            signal.addEventListener('abort', () => {
              if (outer.input === input) outer.input = null
            })
            // The primitive seeds the input text with the *value* (key). Show the option's display
            // value instead and re-select it (once the options are mounted) so the primitive's
            // exact-match logic (blur/Escape) sees the label rather than the key.
            let key = outer.currentKey
            if (key === null) return
            let label = outer.labelForKey(key)
            if (label === null || label === key) return
            // The primitive's own ref (a nested descriptor) runs after this one, so defer a frame.
            requestAnimationFrame(() => {
              if (signal.aborted) return
              input.value = label
              void listboxCtx.select(key)
            })
          }),
          combobox.onComboboxChange((event) => onCommit(event.value)),
          mix as any,
        ]}
      />
    )
  }
}

function ComboboxButton(handle: Handle<{ disabled?: boolean }>) {
  let ctx = handle.context.get(combobox.Context)
  let outer = handle.context.get(Combobox) as ComboboxContextValue

  return () => (
    <button
      type="button"
      tabIndex={-1}
      aria-haspopup="listbox"
      aria-expanded={ctx.isOpen ? 'true' : 'false'}
      aria-controls={ctx.listId}
      disabled={handle.props.disabled}
      className="group absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground disabled:pointer-events-none"
      mix={[
        // Keep focus on the input (the primitive commits/clears on blur).
        on('pointerdown', (event) => event.preventDefault()),
        // When open, the popover's outside-click handler closes it and stops this click.
        on('click', () => {
          if (ctx.disabled) return
          if (ctx.isOpen) {
            ctx.close()
            return
          }
          outer.input?.focus()
          void ctx.open('selected')
        }),
      ]}
    >
      <svg
        className="size-3.5 shrink-0"
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
    </button>
  )
}

/**
 * Popover surface + listbox root (one element). Renders the options so query changes re-render
 * only this subtree. Preline dropdown look, anchored below (or above) the input.
 */
function ComboboxOptions(handle: Handle) {
  let popoverCtx = handle.context.get(popover.Context)
  let outer = handle.context.get(Combobox) as ComboboxContextValue
  outer.updateOptions = () => handle.update()

  return () => (
    <div
      mix={[
        // Runs before the primitive reads the anchor (nested descriptors apply after top-level ones).
        on('beforetoggle', (event) => {
          if (event.newState !== 'open') return
          let anchor = popoverCtx.anchor
          if (!anchor) return
          popoverCtx.anchor = {
            target: anchor.target,
            options: { ...anchor.options, placement: outer.anchor === 'top' ? 'top-start' : 'bottom-start', offset: 8 },
          }
        }),
        on('toggle', (event) => {
          if (event.newState === 'closed') outer.setQuery('')
        }),
        combobox.popover(),
        combobox.list(),
      ]}
      className={cx(
        // Native popover resets (UA styles: margin auto, border, padding, inset 0)
        'm-0 inset-auto',
        // Preline combobox dropdown
        'z-50 max-h-72 space-y-0.5 overflow-hidden overflow-y-auto rounded-lg border border-select-line bg-select p-1 shadow-xl',
        '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb',
        'select-none focus:outline-hidden empty:invisible',
        // Transitions (native popover: fade in via @starting-style, fade out via discrete display/overlay transition)
        'opacity-0 transition-[opacity,display,overlay] transition-discrete duration-100 ease-in open:opacity-100 starting:open:opacity-0 not-open:pointer-events-none',
      )}
    >
      {outer.options.map((option) => (
        <Fragment key={outer.keyOf(option)}>{outer.renderOption(option)}</Fragment>
      ))}
    </div>
  )
}

export function ComboboxOption<T>(handle: Handle<ComboboxOptionProps<T>>) {
  let outer = handle.context.get(Combobox) as ComboboxContextValue<T>

  return () => {
    let { className, rest } = splitProps(handle.props)
    let { value, disabled, children, mix, ...divProps } = rest
    let label = outer.labelOf(value)

    return (
      <div
        {...divProps}
        mix={[
          combobox.option({
            value: outer.keyOf(value),
            label,
            disabled,
            searchValue: outer.searchValueFor(value),
          }),
          mix,
        ]}
        className={cx(
          // Preline combobox item
          'group/option flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-4 py-2 text-sm text-select-item-foreground',
          'focus:outline-hidden',
          // Highlight (keyboard/mouse) + selected
          'data-[highlighted=true]:bg-select-item-hover aria-selected:bg-select-item-active',
          // Disabled
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
        )}
      >
        <span className={cx(className, optionContentClasses)}>{children}</span>
        <svg
          className="hidden size-3.5 shrink-0 text-primary group-aria-selected/option:block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )
  }
}

export function ComboboxLabel(handle: Handle<ComboboxLabelProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <span {...props} className={cx(className, 'truncate')}>
        {children}
      </span>
    )
  }
}

export function ComboboxDescription(handle: Handle<ComboboxDescriptionProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...props } = rest
    return (
      <span {...props} className={cx(className, 'flex min-w-0 flex-1 overflow-hidden text-muted-foreground')}>
        <span className="flex-1 truncate">{children}</span>
      </span>
    )
  }
}

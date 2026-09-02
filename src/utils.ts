type ClassValue = string | number | boolean | null | undefined | ClassValue[]

/** clsx-compatible class joiner (no external deps). */
export function clsx(...args: ClassValue[]): string {
  let result = ''
  for (let arg of args) {
    if (!arg && arg !== 0) continue
    if (typeof arg === 'string' || typeof arg === 'number') {
      result += (result ? ' ' : '') + arg
    } else if (Array.isArray(arg)) {
      let inner = clsx(...arg)
      if (inner) result += (result ? ' ' : '') + inner
    }
  }
  return result
}

export const cx = clsx

/**
 * Catalyst users write `className`; Remix JSX also accepts `class`. Merge both and strip them from
 * the passthrough props.
 */
export function splitProps<P extends { class?: string; className?: string }>(
  props: P,
): { className: string | undefined; rest: Omit<P, 'class' | 'className'> } {
  let { class: klass, className, ...rest } = props
  return { className: clsx(className, klass) || undefined, rest }
}

/**
 * Preline `Avatar` / `AvatarButton` for Remix UI — API-compatible with `volt-catalyst/avatar`.
 *
 * API parity: same exports and props (`src`, `square`, `initials`, `alt`, `className`; button
 * variant adds `href`/`type`/`disabled`). The root carries `data-slot="avatar"`. When `src` is
 * given an `<img alt>` is rendered; otherwise `initials` render as an inline SVG so they scale with
 * the container. `alt` becomes the SVG `<title>` (accessible name); without `alt` the SVG is
 * `aria-hidden`. `AvatarButton` with `href` renders a `Link`, otherwise `<button type="button">`.
 *
 * Styling: Preline UI 5 avatar — `rounded-full` (or `rounded-lg` when `square`) image, initials
 * fallback on `bg-surface-4 text-foreground-inverse font-semibold`, and a hairline `ring-1
 * ring-line-2` so avatars stay visible on matching backgrounds. Size is set by the consumer
 * (`className="size-10"`) like Preline's `size-*` utilities.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { TouchTarget } from './button.tsx'
import { Link } from './link.tsx'
import { cx, splitProps } from './utils.ts'

export type AvatarProps = {
  src?: string | null
  square?: boolean
  initials?: string
  alt?: string
  className?: string
  class?: string
}

export function Avatar(handle: Handle<AvatarProps & ElementProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { src = null, square = false, initials, alt = '', ...props } = rest
    return (
      <span
        data-slot="avatar"
        {...props}
        className={cx(
          className,
          'inline-flex shrink-0 items-center justify-center overflow-hidden align-middle ring-1 ring-line-2 ring-inset',
          square ? 'rounded-lg' : 'rounded-full',
          !src && initials && 'bg-surface-4 text-foreground-inverse font-semibold',
        )}
      >
        {src ? (
          <img className="size-full object-cover" src={src} alt={alt} />
        ) : initials ? (
          <svg className="size-full fill-current uppercase select-none" viewBox="0 0 40 40" aria-hidden={alt ? undefined : 'true'}>
            {alt && <title>{alt}</title>}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="600">
              {initials}
            </text>
          </svg>
        ) : null}
      </span>
    )
  }
}

export type AvatarButtonProps = AvatarProps &
  { children?: RemixNode } & (
    | ({ href?: never; type?: 'button' | 'submit' | 'reset'; disabled?: boolean } & ElementProps)
    | ({ href: string; target?: string } & ElementProps)
  )

export function AvatarButton(handle: Handle<AvatarButtonProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { src, square = false, initials, alt, href, ...props } = rest

    let classes = cx(
      className,
      square ? 'rounded-lg' : 'rounded-full',
      'relative inline-flex focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-50 disabled:pointer-events-none',
    )

    return typeof href === 'string' ? (
      <Link {...props} href={href} className={classes}>
        <TouchTarget>
          <Avatar className="size-full" src={src} square={square} initials={initials} alt={alt} />
        </TouchTarget>
      </Link>
    ) : (
      <button type="button" {...props} className={cx(classes, 'cursor-pointer')}>
        <TouchTarget>
          <Avatar className="size-full" src={src} square={square} initials={initials} alt={alt} />
        </TouchTarget>
      </button>
    )
  }
}

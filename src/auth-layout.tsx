/**
 * `AuthLayout` for volt-preline (API parity with volt-catalyst `auth-layout.tsx`: same props,
 * `className`/`class` merged onto the outer `<main>`).
 *
 * Preline sign-in look: a full-height `bg-background` page that centers one `bg-card` card
 * (`border-card-line`, `rounded-xl`, `shadow-2xs`) holding the children (typically a form).
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui'

import { cx, splitProps } from './utils.ts'

export type AuthLayoutProps = { className?: string; class?: string; children?: RemixNode } & ElementProps

export function AuthLayout(handle: Handle<AuthLayoutProps>) {
  return () => {
    let { className, rest } = splitProps(handle.props)
    let { children, ...attrs } = rest
    return (
      <main {...attrs} className={cx(className, 'flex min-h-dvh flex-col bg-background text-foreground')}>
        <div className="flex grow items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md rounded-xl border border-card-line bg-card p-4 shadow-2xs sm:p-7">{children}</div>
        </div>
      </main>
    )
  }
}

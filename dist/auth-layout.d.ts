/**
 * `AuthLayout` for velix-preline (API parity with velix-catalyst `auth-layout.tsx`: same props,
 * `className`/`class` merged onto the outer `<main>`).
 *
 * Preline sign-in look: a full-height `bg-background` page that centers one `bg-card` card
 * (`border-card-line`, `rounded-xl`, `shadow-2xs`) holding the children (typically a form).
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type AuthLayoutProps = {
    className?: string;
    class?: string;
    children?: RemixNode;
} & ElementProps;
export declare function AuthLayout(handle: Handle<AuthLayoutProps>): () => import("remix/ui").RemixElement;

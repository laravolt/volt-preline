/**
 * Preline `Avatar` / `AvatarButton` for Remix UI — API-compatible with `velix-catalyst/avatar`.
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
import type { ElementProps, Handle, RemixNode } from 'remix/ui';
export type AvatarProps = {
    src?: string | null;
    square?: boolean;
    initials?: string;
    alt?: string;
    className?: string;
    class?: string;
};
export declare function Avatar(handle: Handle<AvatarProps & ElementProps>): () => import("remix/ui").RemixElement;
export type AvatarButtonProps = AvatarProps & {
    children?: RemixNode;
} & (({
    href?: never;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
} & ElementProps) | ({
    href: string;
    target?: string;
} & ElementProps));
export declare function AvatarButton(handle: Handle<AvatarButtonProps>): () => import("remix/ui").RemixElement;

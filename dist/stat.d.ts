/**
 * `Stat` tile for Remix UI — API-compatible with `velix-catalyst/stat` (`title`, `value`,
 * `change`; a leading `+` in `change` renders a green badge, otherwise red).
 *
 * Styling: Preline UI 5 stat card — `bg-card border border-card-line shadow-2xs rounded-xl`, an
 * uppercase `text-xs text-muted-foreground-1` label, a `text-2xl font-medium text-foreground`
 * value and a soft `Badge` next to a muted "from last week" caption.
 *
 * Hydration: none required.
 */
import type { ElementProps, Handle } from 'remix/ui';
export type StatProps = {
    title: string;
    value: string;
    change: string;
    className?: string;
    class?: string;
} & ElementProps;
export declare function Stat(handle: Handle<StatProps>): () => import("remix/ui").RemixElement;

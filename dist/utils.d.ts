type ClassValue = string | number | boolean | null | undefined | ClassValue[];
/** clsx-compatible class joiner (no external deps). */
export declare function clsx(...args: ClassValue[]): string;
export declare const cx: typeof clsx;
/**
 * Catalyst users write `className`; Remix JSX also accepts `class`. Merge both and strip them from
 * the passthrough props.
 */
export declare function splitProps<P extends {
    class?: string;
    className?: string;
}>(props: P): {
    className: string | undefined;
    rest: Omit<P, 'class' | 'className'>;
};
export {};

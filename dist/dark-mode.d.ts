/**
 * Keeps the `dark` class on `<html>` in sync with the user's preference — and keeps it there after
 * Remix frame navigations, which re-render the root element from server HTML (no `dark` class).
 *
 * Call once from the browser entry (`installDarkMode()`), optionally with `{ storageKey }` to honor
 * an explicit choice saved by `setTheme('light' | 'dark' | 'system')`.
 */
export type ThemePreference = 'light' | 'dark' | 'system';
export interface DarkModeOptions {
    /** localStorage key holding an explicit ThemePreference. Default: 'volt-theme'. */
    storageKey?: string;
}
export declare function resolveIsDark(preference: ThemePreference): boolean;
export declare function installDarkMode(options?: DarkModeOptions): () => void;
/** Persist an explicit preference and apply it immediately. */
export declare function setTheme(preference: ThemePreference, storageKey?: string): void;
/**
 * Inline this in `<head>` (as a string) to avoid a flash of light theme before the entry loads.
 * Uses the same storage key and logic as `installDarkMode()`.
 */
export declare function darkModeHeadScript(storageKey?: string): string;

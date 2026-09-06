/**
 * Keeps the `dark` class on `<html>` in sync with the user's preference — and keeps it there after
 * Remix frame navigations, which re-render the root element from server HTML (no `dark` class).
 *
 * Call once from the browser entry (`installDarkMode()`), optionally with `{ storageKey }` to honor
 * an explicit choice saved by `setTheme('light' | 'dark' | 'system')`.
 */
export type ThemePreference = 'light' | 'dark' | 'system';
export type ServerTheme = 'light' | 'dark' | null;
export interface ThemeCookieOptions {
    /** Cookie name. Default: 'volt-theme'. */
    name?: string;
    /** Max age in seconds. Default: 31536000 (1 year). */
    maxAge?: number;
    /** SameSite attribute. Default: 'Lax'. */
    sameSite?: 'Lax' | 'Strict' | 'None';
    /** Cookie path. Default: '/'. */
    path?: string;
    /** Secure attribute. Default: false. */
    secure?: boolean;
}
export interface DarkModeOptions {
    /** localStorage key holding an explicit ThemePreference. Default: 'volt-theme'. */
    storageKey?: string;
    /** Configure or disable cookie synchronization. Default: true. */
    cookie?: boolean | ThemeCookieOptions;
}
export interface SetThemeOptions {
    /** localStorage key holding an explicit ThemePreference. Default: 'volt-theme'. */
    storageKey?: string;
    /** Configure or disable cookie synchronization. Default: true. */
    cookie?: boolean | ThemeCookieOptions;
}
export declare function resolveIsDark(preference: ThemePreference): boolean;
export declare function installDarkMode(options?: DarkModeOptions): () => void;
/** Persist an explicit preference and apply it immediately. Also writes the theme cookie by default. */
export declare function setTheme(preference: ThemePreference, optionsOrKey?: string | SetThemeOptions): void;
/**
 * Reads the theme preference from the HTTP `Cookie` header string.
 * Returns 'light', 'dark', or null if absent or 'system' (meaning follow system preference).
 */
export declare function readThemeCookie(cookieHeader: string | null | undefined, cookieName?: string): ServerTheme;
/**
 * Returns HTML root element attributes to avoid theme flicker on initial server render.
 * Usage: `<html {...themeHtmlProps(theme)}>` in Document component.
 */
export declare function themeHtmlProps(theme: ServerTheme): {
    className: string;
    'data-theme'?: string;
};
/**
 * Inline this in `<head>` (as a string) to avoid a flash of light theme before the entry loads.
 * Uses the same storage key and logic as `installDarkMode()`.
 */
export declare function darkModeHeadScript(storageKey?: string): string;

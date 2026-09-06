const DEFAULT_KEY = 'volt-theme';
const DEFAULT_COOKIE_MAX_AGE = 31536000; // 1 year
function resolveCookieOptions(cookieOpt, defaultKey = DEFAULT_KEY) {
    if (cookieOpt === false)
        return null;
    let opts = typeof cookieOpt === 'object' ? cookieOpt : {};
    return {
        name: opts.name ?? defaultKey,
        maxAge: opts.maxAge ?? DEFAULT_COOKIE_MAX_AGE,
        sameSite: opts.sameSite ?? 'Lax',
        path: opts.path ?? '/',
        secure: opts.secure ?? false,
    };
}
function syncCookie(preference, cookieOpt, defaultKey = DEFAULT_KEY) {
    if (typeof document === 'undefined')
        return;
    let opts = resolveCookieOptions(cookieOpt, defaultKey);
    if (!opts)
        return;
    try {
        let name = encodeURIComponent(opts.name ?? defaultKey);
        let path = opts.path ?? '/';
        let sameSite = opts.sameSite ?? 'Lax';
        if (preference === 'system') {
            document.cookie = `${name}=; path=${path}; max-age=0; SameSite=${sameSite}`;
        }
        else {
            let sec = opts.secure ? '; Secure' : '';
            let maxAge = opts.maxAge ?? DEFAULT_COOKIE_MAX_AGE;
            document.cookie = `${name}=${encodeURIComponent(preference)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}${sec}`;
        }
    }
    catch {
        // document.cookie unavailable
    }
}
function readPreference(key) {
    try {
        let value = localStorage.getItem(key);
        if (value === 'light' || value === 'dark')
            return value;
    }
    catch {
        // storage unavailable
    }
    return 'system';
}
export function resolveIsDark(preference) {
    if (preference === 'dark')
        return true;
    if (preference === 'light')
        return false;
    if (typeof matchMedia === 'undefined')
        return false;
    return matchMedia('(prefers-color-scheme: dark)').matches;
}
export function installDarkMode(options = {}) {
    let key = options.storageKey ?? DEFAULT_KEY;
    let root = document.documentElement;
    let applying = false;
    // Sync cookie from localStorage on boot so server can render <html class="dark">
    syncCookie(readPreference(key), options.cookie, key);
    function apply() {
        if (applying)
            return;
        applying = true;
        root.classList.toggle('dark', resolveIsDark(readPreference(key)));
        root.style.colorScheme = root.classList.contains('dark') ? 'dark' : 'light';
        applying = false;
    }
    apply();
    let media = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
    media?.addEventListener('change', apply);
    // Re-apply whenever the root's class or style attribute is rewritten (Remix frame reloads, other scripts).
    let observer = typeof MutationObserver !== 'undefined' ? new MutationObserver(apply) : null;
    observer?.observe(root, { attributes: true, attributeFilter: ['class', 'style'] });
    let onStorage = (event) => {
        if (event.key === key) {
            apply();
            syncCookie(readPreference(key), options.cookie, key);
        }
    };
    if (typeof window !== 'undefined') {
        window.addEventListener('storage', onStorage);
    }
    return () => {
        media?.removeEventListener('change', apply);
        observer?.disconnect();
        if (typeof window !== 'undefined') {
            window.removeEventListener('storage', onStorage);
        }
    };
}
/** Persist an explicit preference and apply it immediately. Also writes the theme cookie by default. */
export function setTheme(preference, optionsOrKey = DEFAULT_KEY) {
    let key = typeof optionsOrKey === 'string' ? optionsOrKey : (optionsOrKey.storageKey ?? DEFAULT_KEY);
    let cookieOpt = typeof optionsOrKey === 'object' ? optionsOrKey.cookie : true;
    try {
        if (preference === 'system')
            localStorage.removeItem(key);
        else
            localStorage.setItem(key, preference);
    }
    catch {
        // storage unavailable
    }
    syncCookie(preference, cookieOpt, key);
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', resolveIsDark(preference));
    }
}
/**
 * Reads the theme preference from the HTTP `Cookie` header string.
 * Returns 'light', 'dark', or null if absent or 'system' (meaning follow system preference).
 */
export function readThemeCookie(cookieHeader, cookieName = DEFAULT_KEY) {
    if (!cookieHeader)
        return null;
    for (let part of cookieHeader.split(';')) {
        let [name, ...rest] = part.trim().split('=');
        if (name !== cookieName)
            continue;
        let value = decodeURIComponent(rest.join('='));
        if (value === 'light' || value === 'dark')
            return value;
    }
    return null;
}
/**
 * Returns HTML root element attributes to avoid theme flicker on initial server render.
 * Usage: `<html {...themeHtmlProps(theme)}>` in Document component.
 */
export function themeHtmlProps(theme) {
    return {
        className: theme === 'dark' ? 'dark' : '',
        ...(theme ? { 'data-theme': theme } : {}),
    };
}
/**
 * Inline this in `<head>` (as a string) to avoid a flash of light theme before the entry loads.
 * Uses the same storage key and logic as `installDarkMode()`.
 */
export function darkModeHeadScript(storageKey = DEFAULT_KEY) {
    return `(function(){try{var v=localStorage.getItem(${JSON.stringify(storageKey)});var d=v==='dark'||(v!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;
}

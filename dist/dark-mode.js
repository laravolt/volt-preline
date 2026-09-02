const DEFAULT_KEY = 'volt-theme';
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
    return matchMedia('(prefers-color-scheme: dark)').matches;
}
export function installDarkMode(options = {}) {
    let key = options.storageKey ?? DEFAULT_KEY;
    let root = document.documentElement;
    let applying = false;
    function apply() {
        if (applying)
            return;
        applying = true;
        root.classList.toggle('dark', resolveIsDark(readPreference(key)));
        root.style.colorScheme = root.classList.contains('dark') ? 'dark' : 'light';
        applying = false;
    }
    apply();
    let media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', apply);
    // Re-apply whenever the root's class attribute is rewritten (Remix frame reloads, other scripts).
    let observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('storage', (event) => {
        if (event.key === key)
            apply();
    });
    return () => {
        media.removeEventListener('change', apply);
        observer.disconnect();
    };
}
/** Persist an explicit preference and apply it immediately. */
export function setTheme(preference, storageKey = DEFAULT_KEY) {
    try {
        if (preference === 'system')
            localStorage.removeItem(storageKey);
        else
            localStorage.setItem(storageKey, preference);
    }
    catch {
        // storage unavailable
    }
    document.documentElement.classList.toggle('dark', resolveIsDark(preference));
}
/**
 * Inline this in `<head>` (as a string) to avoid a flash of light theme before the entry loads.
 * Uses the same storage key and logic as `installDarkMode()`.
 */
export function darkModeHeadScript(storageKey = DEFAULT_KEY) {
    return `(function(){try{var v=localStorage.getItem(${JSON.stringify(storageKey)});var d=v==='dark'||(v!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;
}

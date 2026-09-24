// js/theme.js
(function (global) {
  const STORAGE_KEY = 'theme';

  function resolveInitialTheme(storedTheme, prefersDark) {
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    if (prefersDark === true) return 'dark';
    if (prefersDark === false) return 'light';
    return 'dark';
  }

  function readStoredTheme() {
    try {
      return global.localStorage ? global.localStorage.getItem(STORAGE_KEY) : null;
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      if (global.localStorage) global.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage no disponible; el tema no persiste pero no rompe la página
    }
  }

  function detectPrefersDark() {
    if (!global.matchMedia) return undefined;
    try {
      if (global.matchMedia('(prefers-color-scheme: dark)').matches) return true;
      if (global.matchMedia('(prefers-color-scheme: light)').matches) return false;
      return undefined;
    } catch {
      return undefined;
    }
  }

  function applyTheme(theme, doc) {
    const root = doc || global.document;
    if (!root) return;
    root.documentElement.setAttribute('data-theme', theme);
  }

  function initTheme() {
    const stored = readStoredTheme();
    const prefersDark = stored ? undefined : detectPrefersDark();
    const theme = resolveInitialTheme(stored, prefersDark);
    applyTheme(theme);
    return theme;
  }

  function toggleTheme() {
    const current = global.document && global.document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
    return next;
  }

  const api = {
    resolveInitialTheme,
    readStoredTheme,
    storeTheme,
    detectPrefersDark,
    applyTheme,
    initTheme,
    toggleTheme,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.Theme = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);

// tests/theme.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const Theme = require('../js/theme.js');

test('resolveInitialTheme respeta el tema guardado en localStorage', () => {
  assert.equal(Theme.resolveInitialTheme('light', true), 'light');
  assert.equal(Theme.resolveInitialTheme('dark', false), 'dark');
});

test('resolveInitialTheme usa prefers-color-scheme cuando no hay tema guardado', () => {
  assert.equal(Theme.resolveInitialTheme(null, true), 'dark');
  assert.equal(Theme.resolveInitialTheme(null, false), 'light');
});

test('resolveInitialTheme cae a oscuro cuando no se puede detectar nada', () => {
  assert.equal(Theme.resolveInitialTheme(null, undefined), 'dark');
  assert.equal(Theme.resolveInitialTheme(undefined, undefined), 'dark');
});

test('detectPrefersDark devuelve undefined si el navegador no reconoce la media feature', () => {
  const original = globalThis.matchMedia;
  globalThis.matchMedia = (query) => ({ matches: false, media: query });
  try {
    assert.equal(Theme.detectPrefersDark(), undefined);
  } finally {
    if (original === undefined) delete globalThis.matchMedia;
    else globalThis.matchMedia = original;
  }
});

test('detectPrefersDark devuelve true o false según cuál media query coincide', () => {
  const original = globalThis.matchMedia;
  try {
    globalThis.matchMedia = (query) => ({ matches: query.includes('dark'), media: query });
    assert.equal(Theme.detectPrefersDark(), true);

    globalThis.matchMedia = (query) => ({ matches: query.includes('light'), media: query });
    assert.equal(Theme.detectPrefersDark(), false);
  } finally {
    if (original === undefined) delete globalThis.matchMedia;
    else globalThis.matchMedia = original;
  }
});

test('readStoredTheme no lanza excepción si localStorage no está disponible', () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    get() { throw new Error('localStorage bloqueado'); },
    configurable: true,
  });

  assert.doesNotThrow(() => Theme.readStoredTheme());
  assert.equal(Theme.readStoredTheme(), null);

  if (originalDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
  } else {
    delete globalThis.localStorage;
  }
});

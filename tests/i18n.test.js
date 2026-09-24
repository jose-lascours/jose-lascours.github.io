// tests/i18n.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const I18n = require('../js/i18n.js');

test('detectInitialLanguage respeta el idioma guardado', () => {
  assert.equal(I18n.detectInitialLanguage('en', 'es-AR'), 'en');
  assert.equal(I18n.detectInitialLanguage('es', 'en-US'), 'es');
});

test('detectInitialLanguage detecta variantes regionales de español', () => {
  assert.equal(I18n.detectInitialLanguage(null, 'es-AR'), 'es');
  assert.equal(I18n.detectInitialLanguage(null, 'es'), 'es');
});

test('detectInitialLanguage usa inglés para cualquier idioma que no sea español', () => {
  assert.equal(I18n.detectInitialLanguage(null, 'pt-BR'), 'en');
  assert.equal(I18n.detectInitialLanguage(null, undefined), 'en');
});

test('translate devuelve el texto correcto para una clave anidada existente', () => {
  assert.equal(I18n.translate('es', 'about.heading'), 'Sobre mí');
  assert.equal(I18n.translate('en', 'about.heading'), 'About me');
});

test('translate cae al español si la clave no existe en el idioma activo', () => {
  const originalEn = I18n.dictionaries.en.about.heading;
  delete I18n.dictionaries.en.about.heading;

  assert.equal(I18n.translate('en', 'about.heading'), 'Sobre mí');

  I18n.dictionaries.en.about.heading = originalEn;
});

test('translate devuelve string vacío si la clave no existe en ningún idioma', () => {
  assert.equal(I18n.translate('es', 'clave.inexistente'), '');
});

test('cada data-i18n de index.html existe en ambos diccionarios', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);

  assert.ok(keys.length > 0, 'no se encontraron atributos data-i18n en index.html');

  for (const key of keys) {
    assert.equal(typeof I18n.getNestedValue(I18n.dictionaries.es, key), 'string', `falta "${key}" en dictionaries.es`);
    assert.equal(typeof I18n.getNestedValue(I18n.dictionaries.en, key), 'string', `falta "${key}" en dictionaries.en`);
  }
});

test('readStoredLanguage no lanza excepción si localStorage no está disponible', () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    get() { throw new Error('localStorage bloqueado'); },
    configurable: true,
  });

  assert.doesNotThrow(() => I18n.readStoredLanguage());
  assert.equal(I18n.readStoredLanguage(), null);

  if (originalDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
  } else {
    delete globalThis.localStorage;
  }
});

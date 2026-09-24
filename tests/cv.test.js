// tests/cv.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const CvDownload = require('../js/cv.js');

function fakeLink(initialAttributes) {
  const attributes = { ...initialAttributes };
  return {
    attributes,
    getAttribute: (name) => (name in attributes ? attributes[name] : null),
    setAttribute: (name, value) => { attributes[name] = String(value); },
    removeAttribute: (name) => { delete attributes[name]; },
  };
}

const respondWith = (status) => () => Promise.resolve({ ok: status >= 200 && status < 300, status });

test('isFileAvailable devuelve true si el servidor responde 200', async () => {
  assert.equal(await CvDownload.isFileAvailable('assets/cv.pdf', respondWith(200)), true);
});

test('isFileAvailable devuelve false si el archivo no existe (404)', async () => {
  assert.equal(await CvDownload.isFileAvailable('assets/cv.pdf', respondWith(404)), false);
});

test('isFileAvailable devuelve false si la petición falla (por ejemplo, abierto con file://)', async () => {
  const failingFetch = () => Promise.reject(new TypeError('Failed to fetch'));
  assert.equal(await CvDownload.isFileAvailable('assets/cv.pdf', failingFetch), false);
});

test('initCvDownload habilita el link cuando el CV existe', async () => {
  const link = fakeLink({ 'data-href': 'assets/cv.pdf', 'aria-disabled': 'true' });

  const available = await CvDownload.initCvDownload(link, respondWith(200));

  assert.equal(available, true);
  assert.equal(link.getAttribute('href'), 'assets/cv.pdf');
  assert.equal(link.getAttribute('aria-disabled'), null);
});

test('initCvDownload deja el link deshabilitado cuando el CV no existe', async () => {
  const link = fakeLink({ 'data-href': 'assets/cv.pdf', 'aria-disabled': 'true' });

  const available = await CvDownload.initCvDownload(link, respondWith(404));

  assert.equal(available, false);
  assert.equal(link.getAttribute('href'), null);
  assert.equal(link.getAttribute('aria-disabled'), 'true');
});

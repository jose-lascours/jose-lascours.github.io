// tests/contact.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+(\.[\w-]+)+/;

function publishedTextFiles() {
  const scripts = fs.readdirSync(path.join(ROOT, 'js')).map((name) => path.join('js', name));
  return ['index.html', 'README.md', ...scripts];
}

test('los archivos publicados no contienen direcciones de email en texto plano', () => {
  for (const file of publishedTextFiles()) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    assert.doesNotMatch(content, EMAIL_PATTERN, `${file} expone una dirección de email`);
  }
});

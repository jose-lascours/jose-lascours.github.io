# jose-lascours.github.io

Portfolio personal de Jose Lascours, publicado en
https://jose-lascours.github.io/

Sitio estático (HTML/CSS/JS puro, sin build ni dependencias). Funciona
abriendo `index.html` directamente en el navegador.

## Antes de publicar

Este repo es público — revisá el contenido de estos dos archivos antes de
agregarlos, ya que quedan descargables por cualquiera:

- `assets/avatar.svg`: avatar provisorio con las iniciales "JL". Para usar
  una foto real, agregá `assets/avatar.jpg` (120×120px recomendado, se
  recorta a círculo) y cambiá el `src` del `<img>` del Hero en
  `index.html`.
- `assets/cv.pdf`: CV descargable desde el botón del final de la página.
  Mientras el archivo no exista, el botón aparece deshabilitado. Confirmá
  que no incluya datos que no quieras exponer públicamente (domicilio,
  DNI, teléfono, etc.).

## Desarrollo local

No requiere servidor: abrí `index.html` directo en el navegador (los
scripts son clásicos, no módulos ES, así que cargan sin problemas de CORS
vía `file://`). Abierto así, el botón de CV queda deshabilitado aunque el
PDF exista, porque el navegador no permite comprobarlo; con un servidor
local (por ejemplo `python -m http.server`) funciona igual que publicado.

## Tests

La lógica de tema (`js/theme.js`), idioma (`js/i18n.js`) y descarga del
CV (`js/cv.js`) tiene tests con
el test runner integrado de Node.js (requiere Node.js 18+, sin
dependencias adicionales):

```bash
node --test
```

## Estructura

- `index.html` — markup y contenido.
- `css/styles.css` — estilos y variables de tema (oscuro por defecto).
- `js/theme.js` — toggle de tema claro/oscuro y persistencia.
- `js/i18n.js` — diccionario ES/EN y toggle de idioma.
- `js/cv.js` — habilita el botón de descarga solo si `assets/cv.pdf` existe.
- `tests/` — tests de la lógica de `theme.js`, `i18n.js` y `cv.js`, y de
  que no haya direcciones de email en los archivos publicados.
- `favicon.ico` y `assets/apple-touch-icon.png` — ícono de la pestaña y de
  acceso directo en móviles.
- `assets/og-image.png` — imagen de vista previa (1200×630) que muestran
  LinkedIn y otras redes al compartir el link.
- `assets/icons/` — íconos de marca (SVG, Simple Icons, CC0) para la
  sección de Tecnologías y los links de contacto.
- `assets/` — foto y CV (no versionados en este README hasta agregarlos).

// js/cv.js
(function (global) {
  // Consulta con HEAD si el archivo existe; cualquier error cuenta como no disponible
  function isFileAvailable(url, fetchFn) {
    const doFetch = fetchFn || global.fetch;
    if (typeof doFetch !== 'function') return Promise.resolve(false);
    return Promise.resolve()
      .then(() => doFetch(url, { method: 'HEAD', cache: 'no-store' }))
      .then((response) => Boolean(response && response.ok))
      .catch(() => false);
  }

  // Habilita el link de descarga (toma la ruta de data-href) solo si el archivo existe
  function initCvDownload(link, fetchFn) {
    if (!link) return Promise.resolve(false);
    const url = link.getAttribute('data-href');
    return isFileAvailable(url, fetchFn).then((available) => {
      if (available) {
        link.setAttribute('href', url);
        link.removeAttribute('aria-disabled');
      }
      return available;
    });
  }

  const api = { isFileAvailable, initCvDownload };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.CvDownload = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);

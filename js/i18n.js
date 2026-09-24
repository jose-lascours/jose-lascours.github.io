// js/i18n.js
(function (global) {
  const STORAGE_KEY = 'lang';

  const dictionaries = {
    es: {
      hero: {
        title: 'Técnico en Análisis y Desarrollo de Software · Desarrollador Backend',
        cta: 'Descargar CV',
      },
      about: {
        heading: 'Sobre mí',
        body: 'Soy desarrollador de software y hace 5 años trabajo en una empresa que crea sistemas de atención de emergencias. Los usan centros de despacho 911, fuerzas de seguridad, servicios de emergencias médicas, bomberos y defensa civil, así que es software crítico que tiene que funcionar las 24 horas.',
        body2: 'Desarrollo y mantengo servicios backend y APIs en PHP y Go, aplicaciones de escritorio en Delphi y componentes de mapas y GIS sobre GeoServer y renderd. En ese trabajo uso la IA como una herramienta más. Me enfoco en integrar el sistema central con servicios satélite y sistemas externos, y en modernizar sistemas heredados. Además, instalo y pongo en marcha mis servicios y APIs en los servidores Linux y Windows de los clientes.',
      },
      tech: {
        heading: 'Tecnologías',
      },
      contact: {
        heading: 'Contacto',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        email: 'Email',
      },
    },
    en: {
      hero: {
        title: 'Software Analysis & Development Technician · Backend Developer',
        cta: 'Download CV',
      },
      about: {
        heading: 'About me',
        body: 'I am a software developer, and for the past 5 years I have worked at a company that builds emergency response systems. They are used by 911 dispatch centers, law enforcement, emergency medical services, and fire and civil defense agencies, so the software is mission critical and has to run around the clock.',
        body2: 'I develop and maintain backend services and APIs in PHP and Go, desktop applications in Delphi, and mapping and GIS components built on GeoServer and renderd. AI is one more tool I use in that work. My focus is on integrating the core system with satellite services and external systems, and on modernizing legacy systems. I also install and set up my services and APIs on clients\' Linux and Windows servers.',
      },
      tech: {
        heading: 'Technologies',
      },
      contact: {
        heading: 'Contact',
        github: 'GitHub',
        linkedin: 'LinkedIn',
        email: 'Email',
      },
    },
  };

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), obj);
  }

  function translate(lang, key) {
    const dict = dictionaries[lang] || dictionaries.es;
    const value = getNestedValue(dict, key);
    if (typeof value === 'string') return value;
    const fallback = getNestedValue(dictionaries.es, key);
    return typeof fallback === 'string' ? fallback : '';
  }

  function detectInitialLanguage(storedLang, navigatorLanguage) {
    if (storedLang === 'es' || storedLang === 'en') return storedLang;
    if (typeof navigatorLanguage === 'string' && navigatorLanguage.toLowerCase().startsWith('es')) {
      return 'es';
    }
    return 'en';
  }

  function readStoredLanguage() {
    try {
      return global.localStorage ? global.localStorage.getItem(STORAGE_KEY) : null;
    } catch {
      return null;
    }
  }

  function storeLanguage(lang) {
    try {
      if (global.localStorage) global.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage no disponible; el idioma no persiste pero no rompe la página
    }
  }

  function applyLanguage(lang, doc) {
    const root = doc || global.document;
    if (!root) return;
    root.documentElement.setAttribute('lang', lang);
    root.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      node.textContent = translate(lang, key);
    });
  }

  function initLanguage() {
    const stored = readStoredLanguage();
    const navigatorLanguage = global.navigator ? global.navigator.language : undefined;
    const lang = detectInitialLanguage(stored, navigatorLanguage);
    applyLanguage(lang);
    return lang;
  }

  function setLanguage(lang) {
    applyLanguage(lang);
    storeLanguage(lang);
    return lang;
  }

  const api = {
    dictionaries,
    translate,
    detectInitialLanguage,
    readStoredLanguage,
    storeLanguage,
    applyLanguage,
    initLanguage,
    setLanguage,
    getNestedValue,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.I18n = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);

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
        body: 'Desarrollador de software con 5 años de trayectoria en el diseño y mantenimiento de sistemas de misión crítica para centros de despacho 911, fuerzas de seguridad, emergencias médicas, bomberos y defensa civil. Trabajo sobre el núcleo del sistema, los servicios satélite y las integraciones externas. Son sistemas que operan 24/7 con alta concurrencia, por eso pongo el foco en evitar condiciones de carrera, mantener la consistencia de las transacciones cuando algo falla y que los servicios sigan operando.',
        body2: 'Desarrollo APIs y servicios backend en PHP y Go, aplicaciones de escritorio en Delphi y componentes GIS sobre GeoServer y renderd. Trabajo con bases de datos relacionales (SQL Server, MySQL y PostgreSQL) en todo el ciclo, desde el diseño de esquemas hasta la optimización de consultas y stored procedures. También tengo experiencia en la modernización de sistemas heredados y en el despliegue y la puesta en marcha de servicios sobre infraestructura Linux y Windows Server. Uso la IA como herramienta para agilizar el trabajo de desarrollo.',
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
        body: 'Software developer with 5 years of experience designing and maintaining mission-critical systems for 911 dispatch centers, law enforcement, emergency medical services, fire departments, and civil defense. I work on the system core, satellite services, and external integrations. These systems run 24/7 under high concurrency, so I focus on preventing race conditions, keeping transactions consistent when something fails, and keeping services running.',
        body2: 'I build APIs and backend services in PHP and Go, desktop applications in Delphi, and GIS components on GeoServer and renderd. I work with relational databases (SQL Server, MySQL, and PostgreSQL) across the whole cycle, from schema design to query and stored procedure optimization. I also have experience modernizing legacy systems and deploying and setting up services on Linux and Windows Server infrastructure. I use AI as a tool to speed up development work.',
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

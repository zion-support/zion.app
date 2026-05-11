export const translations = {
  en: {
    common: {
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      contact: 'Contact Us',
      pricing: 'Pricing',
      services: 'Services',
      about: 'About',
      blog: 'Blog'
    },
    hero: {
      title: 'Transform Your Business with AI',
      subtitle: '200+ AI-powered solutions to accelerate your growth'
    },
    nav: {
      aiSolutions: 'AI Solutions',
      industries: 'Industries',
      resources: 'Resources',
      company: 'Company'
    }
  },
  es: {
    common: {
      getStarted: 'Empezar',
      learnMore: 'Más Información',
      contact: 'Contáctenos',
      pricing: 'Precios',
      services: 'Servicios',
      about: 'Nosotros',
      blog: 'Blog'
    },
    hero: {
      title: 'Transforma Tu Negocio con IA',
      subtitle: '200+ soluciones de IA para acelerar tu crecimiento'
    },
    nav: {
      aiSolutions: 'Soluciones IA',
      industries: 'Industrias',
      resources: 'Recursos',
      company: 'Empresa'
    }
  },
  fr: {
    common: {
      getStarted: 'Commencer',
      learnMore: 'En Savoir Plus',
      contact: 'Contactez-nous',
      pricing: 'Tarifs',
      services: 'Services',
      about: 'À Propos',
      blog: 'Blog'
    },
    hero: {
      title: 'Transformez Votre Entreprise avec l\'IA',
      subtitle: '200+ solutions alimentées par l\'IA pour accélérer votre croissance'
    },
    nav: {
      aiSolutions: 'Solutions IA',
      industries: 'Industries',
      resources: 'Ressources',
      company: 'Entreprise'
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.en;

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  pricing: {
    basic: number;
    pro: number;
    enterprise: number;
  }
  benefits: string[];
  useCases: string[];
  marketPrice: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  link: string;
}
import type { Metadata } from 'next';
import { allServices } from '@/data/servicesData';

export const metadata: Metadata = {
  title: 'Products & Platforms | Zion Tech Group',
  description: 'Six product families, ' + allServices.length + ' services — AI, IT, Cloud, Security, Data, and Automation platforms for enterprise.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}

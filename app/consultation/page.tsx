import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Free Consultation',
  description:
    'Book a free consultation with the Zion Tech Group team to discuss AI, automation, and enterprise IT solutions tailored to your business.',
  alternates: { canonical: '/consultation/' },
};

export default function ConsultationPage() {
  redirect('/contact/');
}

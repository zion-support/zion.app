import React, { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import SkipLink from './components/SkipLink';
import Header from './components/Header';
import Footer from './components/Footer';
import Analytics from './components/Analytics';
import CtaTracking from './components/CtaTracking';
import BackToTop from './components/BackToTop';
import ReadingProgressBar from './components/ReadingProgressBar';
import StickyMobileCTA from './components/StickyMobileCTA';
import AIChatWidget from './components/AIChatWidget';
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';
import StickyDonateBanner from './components/StickyDonateBanner';
import ChatWidget from './components/ChatWidget';
import CookieConsentBanner from './components/CookieConsentBanner';
import AiSolutionsArchitectWidget from './components/ai/AiSolutionsArchitectWidget';
import AIExperienceLoader from './components/AIExperienceLoader';
import './globals.css';

const siteUrl = 'https://ziontechgroup.com';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Zion Tech Group | AI & IT Solutions',
    template: '%s | Zion Tech Group',
  },
  description:
    'AI applications, secure engineering, and scalable delivery for modern teams. Zion Tech Group.',
  applicationName: 'Zion Tech Group',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  referrer: 'strict-origin-when-cross-origin',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zion Tech Group',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1221' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Analytics />
        <CtaTracking />
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          <SkipLink />
          <ReadingProgressBar />
          <Header />
          <main className="relative z-10 flex-1" id="main-content" tabIndex={-1} role="main">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <AiSolutionsArchitectWidget />
          <AIChatWidget />
          <AIExperienceLoader />
          <StickyMobileCTA />
          <ServiceWorkerRegistration />
          <StickyDonateBanner />
          <CookieConsentBanner />
        </div>
      </body>
    </html>
  );
}
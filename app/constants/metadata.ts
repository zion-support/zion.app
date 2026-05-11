import Metadata from 'next';

export const metadata = {
  title: 'Zion Tech Group - Advanced AI & IT Solutions',
  description:
    'Leading provider of AI-powered solutions, cybersecurity, and digital transformation services.',
  keywords: 'AI solutions, IT services, cybersecurity, cloud computing, digital transformation, consulting, implementation',
  authors: [{ name: 'Zion Tech Group' }],
  creator: 'Zion Tech Group',
  publisher: 'Zion Tech Group',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ziontechgroup.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zion Tech Group - AI-Powered Business Solutions',
    description:
      'Leading provider of AI-powered business solutions, cloud infrastructure, and digital transformation services.',
    url: 'https://ziontechgroup.com',
    siteName: 'Zion Tech Group',
    images: [
      {
        url: '/og-home.svg',
        width: 1200,
        height: 630,
        type: 'image/svg+xml',
        alt: 'Zion Tech Group - AI-Powered Business Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zion Tech Group - AI-Powered Business Solutions',
    description:
      'Leading provider of AI-powered business solutions, cloud infrastructure, and digital transformation services.',
    images: ['/og-home.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
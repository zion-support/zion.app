import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Mobile App Development | Zion Tech Group',
  description:
    'Build cross-platform and native mobile applications with AI-powered features, offline-first architecture, and enterprise-grade security.',
  alternates: { canonical: '/it-services/mobile-development' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Mobile App Development',
        category: 'Software Engineering',
        description:
          'Build cross-platform and native mobile applications with AI-powered features, offline-first architecture, and enterprise-grade security. From concept to App Store, we deliver mobile experiences that drive engagement and revenue.',
        iconEmoji: '📱',
        features: [
          {
            title: 'Cross-Platform Development',
            description:
              'Build once, deploy everywhere with React Native or Flutter. Shared codebases that deliver native-quality experiences on iOS and Android.',
          },
          {
            title: 'Native iOS & Android',
            description:
              'Platform-specific development with Swift/SwiftUI and Kotlin/Jetpack Compose for performance-critical applications.',
          },
          {
            title: 'Offline-First Architecture',
            description:
              'Local data persistence, background sync, and conflict resolution for reliable operation in low-connectivity environments.',
          },
          {
            title: 'AI-Powered Features',
            description:
              'On-device ML models, camera-based recognition, voice interfaces, and intelligent recommendations built into the mobile experience.',
          },
          {
            title: 'Push Notifications & Engagement',
            description:
              'Targeted push campaigns, in-app messaging, and behavioral triggers to drive user retention and re-engagement.',
          },
          {
            title: 'App Store Optimization',
            description:
              'Submission management, metadata optimization, and A/B testing for improved discoverability and conversion in app stores.',
          },
        ],
        useCases: [
          {
            title: 'Enterprise Mobile Apps',
            description:
              'Internal tools, field service apps, and workforce management solutions with SSO, MDM integration, and role-based access.',
            icon: '🏢',
          },
          {
            title: 'Consumer Applications',
            description:
              'User-facing apps with onboarding flows, payment processing, social features, and personalized content delivery.',
            icon: '👥',
          },
          {
            title: 'IoT Companion Apps',
            description:
              'Mobile interfaces for IoT devices with Bluetooth/Wi-Fi connectivity, real-time monitoring, and device management.',
            icon: '📡',
          },
        ],
        benefits: [
          'Faster time-to-market with cross-platform development',
          'Native performance where it matters most',
          'Reliable offline experiences for field workers',
          'AI-powered personalization and automation',
          'Comprehensive analytics and user behavior tracking',
          'Ongoing maintenance and feature iteration support',
        ],
        ctaLabel: 'Get Started with Mobile Development',
      }}
    />
  );
}

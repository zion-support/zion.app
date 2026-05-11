import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Zion AI Route Optimizer | Zion Tech Group',
  description:
    'Minimize delivery time and costs with AI-powered route planning that factors in traffic, weather, and constraints.',
  alternates: { canonical: '/zion-ai-route-optimizer' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Zion AI Route Optimizer',
        category: 'Operations',
        description:
          'Minimize delivery time and costs with AI-powered route planning that factors in traffic, weather, capacity, and time windows for last-mile and field operations.',
        iconEmoji: '🗺️',
        features: [
          {
            title: 'Multi-Stop Optimization',
            description:
              'Optimize routes for dozens or hundreds of stops. Respect time windows, capacity, and driver hours while minimizing distance and time.',
          },
          {
            title: 'Traffic & Weather',
            description:
              'Incorporate real-time and predicted traffic and weather. Adjust routes dynamically when conditions change.',
          },
          {
            title: 'Fleet & Resource Constraints',
            description:
              'Model vehicle capacity, skills, and availability. Balance workload across drivers and respect break and shift rules.',
          },
          {
            title: 'Dynamic Replanning',
            description:
              'Handle new orders, cancellations, and delays with quick re-optimization. Drivers get updated turn-by-turn instructions.',
          },
          {
            title: 'Dispatch & Mobile',
            description:
              'Push routes to driver apps. Capture proof of delivery and status updates. Integrate with WMS or TMS.',
          },
          {
            title: 'Analytics & Reporting',
            description:
              'Track on-time performance, miles saved, and cost per delivery. Optimize over time with historical and what-if analysis.',
          },
        ],
        useCases: [
          {
            title: 'Last-Mile Delivery',
            description:
              'Plan and execute efficient delivery routes for e-commerce, retail, or field service. Meet time windows and reduce cost per drop.',
            icon: '📦',
          },
          {
            title: 'Field Service',
            description:
              'Schedule technicians and optimize drive time. Balance workload and respect appointment windows and parts availability.',
            icon: '🔧',
          },
          {
            title: 'Fleet & Logistics',
            description:
              'Reduce miles and fuel, improve on-time delivery, and scale routing without adding dispatchers. Full audit trail for compliance.',
            icon: '🚛',
          },
        ],
        benefits: [
          'Lower fuel and drive time costs',
          'Higher on-time delivery and customer satisfaction',
          'Efficient use of fleet and drivers',
          'Dynamic replanning for changes',
          'Integration with dispatch and TMS',
        ],
        ctaLabel: 'Get Started with Zion AI Route Optimizer',
      }}
    />
  );
}

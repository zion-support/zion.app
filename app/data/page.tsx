import ProductPageLayout from '../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Data | Zion Tech Group',
  description:
    'Data transforms raw data into actionable intelligence with real-time dashboards, automated reporting, and predictive models. Make faster, more confident de',
  alternates: { canonical: '/data' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Data',
        category: 'Data & Analytics',
        description:
          'Data transforms raw data into actionable intelligence with real-time dashboards, automated reporting, and predictive models. Make faster, more confident decisions backed by production-grade analytics.',
        iconEmoji: '📊',
        features: [
                  {
                            "title": "Real-Time Dashboards",
                            "description": "Live operational dashboards that surface key metrics, anomalies, and trends as they happen across your business."
                  },
                  {
                            "title": "Predictive Models",
                            "description": "Machine learning models trained on your data to forecast outcomes, identify risks, and surface hidden opportunities."
                  },
                  {
                            "title": "Data Pipeline Automation",
                            "description": "Automated ETL workflows that clean, transform, and load data from multiple sources into a unified analytics layer."
                  },
                  {
                            "title": "Self-Service Reporting",
                            "description": "Empower teams to build their own reports and explore data with intuitive query builders and visualization tools."
                  },
                  {
                            "title": "Data Quality Monitoring",
                            "description": "Continuous validation of data accuracy, completeness, and freshness with automated alerts on quality degradation."
                  },
                  {
                            "title": "Cross-System Integration",
                            "description": "Connect data from CRM, ERP, marketing tools, and operational systems into a single source of truth."
                  }
        ],
        useCases: [
                  {
                            "title": "Executive Reporting",
                            "description": "Deliver polished, automated reports to leadership with KPIs, trends, and actionable recommendations.",
                            "icon": "📈"
                  },
                  {
                            "title": "Operational Visibility",
                            "description": "Monitor business health in real time across departments, teams, and product lines.",
                            "icon": "👁️"
                  },
                  {
                            "title": "Predictive Planning",
                            "description": "Forecast demand, revenue, and resource needs using ML models trained on your historical data.",
                            "icon": "🔮"
                  }
        ],
        benefits: ["Real-time operational visibility","Faster decision making","Improved forecast accuracy","Automated report generation","Cross-system data unification","Self-service analytics for teams"],
        ctaLabel: 'Get Started with Data',
      }}
    />
  );
}

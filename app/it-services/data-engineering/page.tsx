import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Data Engineering | Zion Tech Group',
  description:
    'Build robust data pipelines, modern data warehouses, and real-time streaming architectures. Transform raw data into reliable, analytics-ready assets at scale.',
  alternates: { canonical: '/it-services/data-engineering' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'Data Engineering',
        category: 'Data & Analytics',
        description:
          'Build robust data pipelines, modern data warehouses, and real-time streaming architectures. Transform raw data into reliable, analytics-ready assets at scale with production-grade orchestration and governance.',
        iconEmoji: '🔗',
        features: [
          {
            title: 'ETL/ELT Pipeline Design',
            description:
              'Build scalable extract-transform-load pipelines with automated scheduling, error recovery, and data quality checks at every stage.',
          },
          {
            title: 'Real-Time Streaming',
            description:
              'Process event streams in real time using Kafka, Flink, or Spark Streaming for time-sensitive analytics and operational dashboards.',
          },
          {
            title: 'Data Warehouse Architecture',
            description:
              'Design and implement modern data warehouses on Snowflake, BigQuery, or Redshift with optimized schemas and query performance.',
          },
          {
            title: 'Data Lake & Lakehouse',
            description:
              'Unify structured and unstructured data in a cost-effective lakehouse architecture with Delta Lake, Iceberg, or Hudi.',
          },
          {
            title: 'Data Quality & Observability',
            description:
              'Automated data quality monitoring, anomaly detection, and lineage tracking to ensure trustworthy analytics and reporting.',
          },
          {
            title: 'Orchestration & Scheduling',
            description:
              'Production-grade workflow orchestration with Airflow, Dagster, or Prefect for reliable, auditable data pipeline execution.',
          },
        ],
        useCases: [
          {
            title: 'Analytics Foundation',
            description:
              'Build a reliable data platform that powers business intelligence, reporting, and predictive analytics across the organization.',
            icon: '📊',
          },
          {
            title: 'Real-Time Decisioning',
            description:
              'Enable real-time fraud detection, personalization, and operational alerts with streaming data architectures.',
            icon: '⚡',
          },
          {
            title: 'Data Migration',
            description:
              'Migrate from legacy databases and on-premise data warehouses to modern cloud-native platforms with zero data loss.',
            icon: '🔄',
          },
        ],
        benefits: [
          'Reliable, automated data pipelines',
          'Faster time-to-insight for analytics teams',
          'Reduced data quality incidents',
          'Scalable architecture for growing data volumes',
          'Lower infrastructure costs with cloud-native design',
          'Full data lineage and audit trails',
        ],
        ctaLabel: 'Get Started with Data Engineering',
      }}
    />
  );
}

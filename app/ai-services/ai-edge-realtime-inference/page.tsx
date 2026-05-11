import ProductPageLayout from '../../components/ProductPageLayout';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'AI Edge & Real-Time Inference | Zion Tech Group',
  description:
    'Deploy AI at the edge and in real time. Low-latency inference, on-device models, and streaming pipelines for mission-critical applications.',
  alternates: { canonical: '/ai-services/ai-edge-realtime-inference' },
};

export default function Page() {
  return (
    <ProductPageLayout
      data={{
        title: 'AI Edge & Real-Time Inference',
        category: 'Advanced AI Services',
        description:
          'Run AI where it matters most — at the edge and in real time. Low-latency inference, on-device and edge-deployed models, and streaming pipelines for mission-critical applications. Reduce round-trip latency, cut cloud costs, and meet strict SLAs for voice, video, and high-frequency decision systems.',
        iconEmoji: '⚡',
        features: [
          {
            title: 'Edge-Deployed Models',
            description:
              'Deploy compact, optimized models to edge devices, gateways, and regional nodes. Run inference locally for sub-50ms response times and offline-capable workflows.',
          },
          {
            title: 'Real-Time Streaming Pipelines',
            description:
              'Stream audio, video, and text through AI pipelines with minimal latency. Support live transcription, real-time translation, and continuous analysis.',
          },
          {
            title: 'Hybrid Cloud-Edge Orchestration',
            description:
              'Route requests by latency, cost, and capability. Fall back to cloud for complex tasks while keeping hot paths on the edge.',
          },
          {
            title: 'Model Optimization & Quantization',
            description:
              'Compress and quantize models for edge deployment without sacrificing accuracy. Support ONNX, TensorFlow Lite, and custom runtimes.',
          },
          {
            title: 'Low-Latency APIs',
            description:
              'Design APIs and SDKs for real-time use cases: voice assistants, live moderation, fraud detection, and interactive copilots.',
          },
          {
            title: 'Observability at the Edge',
            description:
              'Monitor latency, throughput, and errors across edge nodes. Centralized dashboards and alerts for distributed inference.',
          },
        ],
        useCases: [
          {
            title: 'Voice & Conversational AI',
            description:
              'Real-time speech-to-text, intent detection, and response generation for contact centers and voice assistants.',
            icon: '🎙️',
          },
          {
            title: 'Live Video & Content Moderation',
            description:
              'Frame-by-frame or stream-based analysis for moderation, object detection, and compliance in live video.',
            icon: '📹',
          },
          {
            title: 'High-Frequency Trading & Risk',
            description:
              'Sub-millisecond inference for trading signals, risk checks, and compliance in financial systems.',
            icon: '📈',
          },
        ],
        benefits: [
          'Sub-50ms inference at the edge for critical workflows',
          'Lower cloud spend by keeping high-volume inference on the edge',
          'Offline and low-connectivity operation where needed',
          'Streaming pipelines for voice, video, and text',
          'Unified orchestration across cloud and edge',
          'Production-ready SLAs and observability',
        ],
        ctaLabel: 'Explore Edge & Real-Time AI',
        ctaHref: '/contact',
        secondaryCtaLabel: 'View AI Services',
        secondaryCtaHref: '/ai-services',
        breadcrumb: [
          { label: 'Home', href: '/' },
          { label: 'AI Services', href: '/ai-services' },
          { label: 'AI Edge & Real-Time Inference' },
        ],
      }}
    />
  );
}

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the AI components to avoid SSR issues
const AIVoiceAssistant = dynamic(
  () => import('./AIVoiceAssistant'),
  { ssr: false, loading: () => null }
);

const SmartRecommendationEngine = dynamic(
  () => import('./SmartRecommendationEngine'),
  { ssr: false, loading: () => null }
);

const IntelligentNotifications = dynamic(
  () => import('./IntelligentNotifications'),
  { ssr: false, loading: () => null }
);

export default function AIExperienceLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AIVoiceAssistant position="bottom-right" />
      <SmartRecommendationEngine />
    </>
  );
}

// Export individual components for selective use
export { AIVoiceAssistant, SmartRecommendationEngine, IntelligentNotifications };
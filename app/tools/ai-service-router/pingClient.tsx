// ai-service-router/pingClient.tsx — tiny client-only ping wrapper
'use client';
import { pingTool } from '@/data/tools_ping_client';

export default function RouterPing() {
  pingTool('ai-service-router');
  return null;
}

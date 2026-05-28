// roi-calculator/pingClient.tsx — tiny client-only ping wrapper
'use client';
import { pingTool } from '@/data/tools_ping_client';

export default function RouterPing() {
  pingTool('roi-calculator');
  return null;
}

// Generic ping wrapper — import this in server component tools and drop <ToolPing slug="..." /> in the return
'use client';
import { pingTool } from '@/data/tools_ping_client';

interface Props { slug: string }
export default function ToolPing({ slug }: Props) {
  pingTool(slug);
  return null;
}

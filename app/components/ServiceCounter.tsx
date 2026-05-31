'use client';
export default function ServiceCounter({ count }: { count?: number }) {
  return <div className="service-counter">{count}</div>;
}

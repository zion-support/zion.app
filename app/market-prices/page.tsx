import MarketPriceTracker from '../components/MarketPriceTracker';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Market Prices | Zion Tech Group',
  description: 'View real-time market pricing for all AI products and services',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <MarketPriceTracker />
    </div>
  );
}
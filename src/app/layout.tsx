import './globals.css';
import Navigation from '../components/Navigation';
import PricingCalculator from './components/marketing/PricingCalculator';

export const metadata = {
  title: 'Zion Tech Group',
  description: 'AI-Powered Technology Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen">
        <Navigation />
        <main>{children}</main>
        <PricingCalculator />
      </body>
    </html>
  );
}
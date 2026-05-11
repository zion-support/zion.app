// import _ErrorBoundary from '../../components/GlobalErrorBoundary';


export const metadata = {
  title: 'Offline | Zion Tech Group',
  description: 'You are currently offline',
  keywords: 'offline, no internet',
  openGraph: {
    title: 'Offline | Zion Tech Group',
    description: 'You are currently offline',
    type: 'website',
  }};
export default function Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          You&apos;re Offline
        </h1>
        <p className="text-xl text-gray-600">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
}

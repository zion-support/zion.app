import { useEffect } from 'react';

const propertyId = process.env.NEXT_PUBLIC_TAWK_TO_PROPERTY_ID || 'YOUR_PROPERTY_ID';
const widgetId = process.env.NEXT_PUBLIC_TAWK_TO_WIDGET_ID || 'default';

export default function ChatWidget() {
  useEffect(() => {
    if (propertyId === 'YOUR_PROPERTY_ID') {
      console.warn('Tawk.to property ID not set. Please configure NEXT_PUBLIC_TAWK_TO_PROPERTY_ID and NEXT_PUBLIC_TAWK_TO_WIDGET_ID in .env.local');
      return;
    }
    const script = document.createElement('script');
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return null;
}

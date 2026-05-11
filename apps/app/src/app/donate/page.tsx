import Head from 'next/head';
import Link from 'next/link';

export default function Donate() {
  return (
    <main>
      <Head>
        <title>Donate | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <h1>Support the Project</h1>
      <p>Help us keep the site running free with a small donation.</p>
      <div style={{marginBottom: '1rem'}}>
        <a href={process.env.PAYPAL_URL!} target="_blank" rel="noopener noreferrer">
          Donate via PayPal
        </a>
      </div>
      <div style={{marginBottom: '1rem'}}>
        <a href={process.env.KO_FI_URL!} target="_blank" rel="noopener noreferrer">
          Donate via Ko-fi
        </a>
      </div>
      <div style={{marginBottom: '1rem'}}>
        <a href={process.env.AMAZON_AF_LINK!} target="_blank" rel="noopener noreferrer">
          Buy My Merch on Amazon
        </a>
      </div>
      <p>
        <Link href="/">← Back to home</Link>
      </p>
    </main>
  );
}

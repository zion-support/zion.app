import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blockchain & Web3 Services | Zion Tech Group",
  description: "Blockchain development, smart contracts, DeFi, NFT platforms, and Web3 infrastructure",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=blockchain" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Blockchain & Web3 Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=blockchain" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=blockchain" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

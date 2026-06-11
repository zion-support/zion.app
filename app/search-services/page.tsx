import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search & Discovery Services | Zion Tech Group",
  description: "Enterprise search — Elasticsearch, Algolia, vector search, and AI-powered site search",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=search" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Search & Discovery Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=search" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=search" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Management Services | Zion Tech Group",
  description: "API platforms — gateway management, API design, developer portals, and API monetization",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=api" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to API Management Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=api" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=api" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

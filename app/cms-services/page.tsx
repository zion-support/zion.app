import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS Services | Zion Tech Group",
  description: "Content management systems — headless CMS, enterprise content platforms, and custom CMS development",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=cms" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to CMS Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=cms" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=cms" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

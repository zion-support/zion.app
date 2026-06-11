import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinTech Services | Zion Tech Group",
  description: "Financial technology — payment processing, banking APIs, lending platforms, and regulatory compliance",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=fintech" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to FinTech Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=fintech" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=fintech" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

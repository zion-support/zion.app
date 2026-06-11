import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Observability Services | Zion Tech Group",
  description: "Full-stack observability — APM, distributed tracing, log management, and service health monitoring",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=observability" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Observability Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=observability" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=observability" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

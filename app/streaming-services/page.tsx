import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Streaming Services | Zion Tech Group",
  description: "Real-time data streaming — Kafka, Pulsar, event-driven architectures, and stream processing",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=streaming" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Data Streaming Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=streaming" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=streaming" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

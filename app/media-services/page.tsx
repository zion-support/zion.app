import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media & Streaming Services | Zion Tech Group",
  description: "Media technology — video streaming, content delivery, OTT platforms, and digital media management",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=media" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Media & Streaming Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=media" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=media" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Low-Code/No-Code Services | Zion Tech Group",
  description: "Low-code platforms — rapid application development, citizen developers, and business process automation",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=low-code" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Low-Code/No-Code Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=low-code" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=low-code" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

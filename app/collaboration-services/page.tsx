import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaboration Services | Zion Tech Group",
  description: "Team collaboration tools — project communication, workflow management, and team productivity",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=collaboration" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Collaboration Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=collaboration" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=collaboration" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

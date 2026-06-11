import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identity & Access Management | Zion Tech Group",
  description: "Identity services — SSO, MFA, directory services, and zero-trust identity",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=identity" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Identity & Access Management...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=identity" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=identity" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

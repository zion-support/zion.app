import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevSecOps Services | Zion Tech Group",
  description: "Security-integrated DevOps — shift-left security, SAST/DAST, container security, and compliance automation",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=devsecops" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to DevSecOps Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=devsecops" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=devsecops" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

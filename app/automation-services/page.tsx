import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automation Services | Zion Tech Group",
  description: "Enterprise automation solutions — RPA, workflow automation, and intelligent process automation",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=automation" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Automation Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=automation" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=automation" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

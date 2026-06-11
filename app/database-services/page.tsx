import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database Services | Zion Tech Group",
  description: "Database design, optimization, migration, and management — SQL, NoSQL, and NewSQL",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=database" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Database Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=database" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=database" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

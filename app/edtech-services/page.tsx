import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EdTech Services | Zion Tech Group",
  description: "Education technology — LMS platforms, adaptive learning, virtual classrooms, and student analytics",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=edtech" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to EdTech Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=edtech" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=edtech" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

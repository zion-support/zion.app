import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthcare IT Services | Zion Tech Group",
  description: "Healthcare technology — EHR integration, telemedicine, HIPAA compliance, and medical data analytics",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=healthcare" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Healthcare IT Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=healthcare" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=healthcare" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

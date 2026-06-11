import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infrastructure as Code Services | Zion Tech Group",
  description: "IaC solutions — Terraform, Pulumi, CloudFormation, and infrastructure automation",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=iac" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Infrastructure as Code Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=iac" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=iac" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

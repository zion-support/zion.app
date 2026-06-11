import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Commerce Services | Zion Tech Group",
  description: "E-commerce platforms — Shopify, WooCommerce, custom storefronts, and payment integration",
  alternates: { canonical: "https://ziontechgroup.com/services/?category=ecommerce" },
};

export default function CategoryPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to E-Commerce Services...</p>
        <meta httpEquiv="refresh" content="0;url=/services/?category=ecommerce" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/services/?category=ecommerce" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

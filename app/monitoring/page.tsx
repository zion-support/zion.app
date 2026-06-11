import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Monitoring Dashboard | Zion Tech Group",
  description: "Real-time monitoring of Zion Tech Group AI agent fleet. Watch autonomous agents build, test, and deploy services 24/7.",
  alternates: { canonical: "https://ziontechgroup.com/agents-monitoring" },
  robots: { index: false, follow: true },
};

export default function MonitoringRedirect() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Redirecting to Agent Operations Center...</p>
        <meta httpEquiv="refresh" content="0;url=/agents-monitoring" />
        <p style={{ marginTop: "1rem" }}>
          <a href="/agents-monitoring" style={{ color: "#a78bfa", textDecoration: "underline" }}>
            Click here if not redirected
          </a>
        </p>
      </div>
    </main>
  );
}

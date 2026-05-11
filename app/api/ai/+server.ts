// Route to serve live AI product metrics
export async function GET() {
  return new Response(JSON.stringify({
    metrics: [
      {
        id: 1,
        metric: "AI Product Engagement",
        percentage: 85,
        value: 342,
        score: 342
      },
      {
        id: 2,
        metric: "User Growth Rate",
        percentage: 72,
        value: 520,
        measurement: 520
      },
      {
        id: 3,
        metric: "Content Quality Score",
        percentage: 68,
        value: 410,
        score: 410
      }
    ],
    version: "2.0.1"
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

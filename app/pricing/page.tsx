import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PricingPage() {
  const [stripe, setStripe] = useState<ReturnType<typeof loadStripe> | null>(null)

  useEffect(() => {
    stripePromise.then((s) => setStripe(s))
  }, [])

  const handleCheckout = async (plan: string) => {
    if (!stripe) return
    const res = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    })
    const data = await res.json()
    const result = await stripe.redirectToCheckout({ sessionId: data.sessionId })
    if (result.error) alert(result.error.message)
  }

  return (
    <div>
      <h1>Pricing</h1>
      <div>
        <h2>Pro</h2>
        <p>$15/month – Unlimited features</p>
        <button onClick={() => handleCheckout('pro')}>Subscribe Pro</button>
      </div>
      <div>
        <h2>Enterprise</h2>
        <p>$99/month – All features with SLA</p>
        <button onClick={() => handleCheckout('enterprise')}>Subscribe Enterprise</button>
      </div>
    </div>
  )
}

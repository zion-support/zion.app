"use client"
import { useState } from "react"
import Head from "next/head"
import Link from "next/link"

export default function LinkPreview() {
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchPreview = async () => {
    if (!url) return
    setLoading(true)
    try {
      // Using Jina AI's summarizer endpoint to get a simple text summary.
      const response = await fetch(`https://r.jina.ai/http://${encodeURIComponent(url)}`)
      const text = await response.text()
      setPreview(text)
    } catch (e) {
      setPreview('Failed to fetch preview')
    }
    setLoading(false)
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Head><title>Link Preview</title></Head>
      <h1 className="text-3xl font-bold mb-4">Link Preview</h1>
      <input
        type="text"
        placeholder="Enter URL (without https://)"
        value={url}
        onChange={e=>setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button onClick={fetchPreview} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded mb-4">{loading ? 'Loading...' : 'Fetch Preview'}</button>
      {preview && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{preview}</pre>
      )}
      <div className="mt-8"><Link href="/free-tools-hub" className="text-sm text-blue-400 hover:underline">← Back to Free Tools Hub</Link></div>
    </main>
  )
}

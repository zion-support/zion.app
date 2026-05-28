"use client";

import { useState } from 'react'
import Link from 'next/link'

export default function MarkdownPreview() {

export const metadata = {
  title: "Free Markdown Preview | Zion Tech Group",
  description: "",
};


  const [markdown, setMarkdown] = useState('# Welcome to the Markdown Preview\n\nType some *markdown* on the left pane to see the rendered output.')

  return (
    <main className="mx-auto max-w-5xl p-8">
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Markdown Input
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-96 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            rows="20"
          >
          </textarea>
        </div>
        <div className="w-full md:w-1/2">
          <div className="prose prose-sm max-w-full">
            <p>{markdown}</p>
          </div>
        </div>
      </div>
    </main>
  )
}

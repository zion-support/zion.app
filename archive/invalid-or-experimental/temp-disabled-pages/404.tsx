'use client'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { AlertTriangle, Search, Home, ArrowLeft, RefreshCw } from 'lucide-react'

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Zion Tech Group</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-9xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text animate-pulse">
              404
            </div>
            <div className="absolute -top-4 -right-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Page Not Found
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or doesn&apos;t exist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>

            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-all duration-300 flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12">
            <p className="text-gray-400 mb-4">Looking for something specific?</p>
            <div className="flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-400">Try searching our site or contact support</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
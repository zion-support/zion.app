#!/bin/bash

# Function to create a clean page
create_clean_page() {
  local file_path="$1"
  local page_name="$2"
  local title="$3"
  local description="$4"
  
  cat > "$file_path" << PAGE_EOF
'use client';

import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const ${page_name}: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main>
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.3)_0%,transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3)_0%,transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">${title}</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">${description}</p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Features</h2>
              <p className="text-xl text-gray-300">Advanced AI solutions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">AI-Powered</h3>
                <p className="text-gray-300">Leverage artificial intelligence for enhanced performance and insights.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Scalable</h3>
                <p className="text-gray-300">Built to scale with your business needs and growth.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Secure</h3>
                <p className="text-gray-300">Enterprise-grade security and compliance features.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ${page_name};
PAGE_EOF
}

# Get all page files and replace them
find app -name "page.tsx" -type f | while read file; do
  # Extract page name from path
  page_dir=$(dirname "$file")
  page_name=$(basename "$page_dir" | sed 's/-/ /g' | sed 's/\b\w/\U&/g' | sed 's/ //g')Page
  title=$(basename "$page_dir" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
  description="Advanced AI solutions for modern businesses."
  
  echo "Fixing: $file"
  create_clean_page "$file" "$page_name" "$title" "$description"
done

echo "All pages have been replaced with clean versions"

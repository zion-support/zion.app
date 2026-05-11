import React from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink } from 'lucide-react';

const books = [
  {
    title: 'The DevOps Handbook',
    author: 'Gene Kim, Patrick Debois, John Willis',
    description: 'How to create world-class agility, reliability, and security in technology organizations.',
    amazonUrl: 'https://amzn.to/3ABC123?tag=ziontech-20',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51+7c+5XG+L._SX258_BO1,204,203,200_.jpg',
  },
  {
    title: 'Accelerate: The Science of Lean Software and DevOps',
    author: 'Nicole Forsgren, Jez Humble, Gene Kim',
    description: 'How leaders can create high-performing technology organizations.',
    amazonUrl: 'https://amzn.to/3DEF456?tag=ziontech-20',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51c+KQRHv+L._SX258_BO1,204,203,200_.jpg',
  },
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    description: 'A must-read for any developer wanting to write maintainable, clean code.',
    amazonUrl: 'https://amzn.to/3GHI789?tag=ziontech-20',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41yfpGJCWGL._SX258_BO1,204,203,200_.jpg',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    description: 'The big ideas behind reliable, scalable, and maintainable systems.',
    amazonUrl: 'https://amzn.to/3JKL012?tag=ziontech-20',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51L4ZtqJjpL._SX258_BO1,204,203,200_.jpg',
  },
  {
    title: 'The Phoenix Project: A Novel about IT, DevOps, and Helping Your Business Win',
    author: 'Gene Kim, Kevin Behr, George Spafford',
    description: 'A novel that shows how to apply DevOps principles in real-world scenarios.',
    amazonUrl: 'https://amzn.to/3MNO345?tag=ziontech-20',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51k2YkU-XZL._SX258_BO1,204,203,200_.jpg',
  },
  {
    title: 'Site Reliability Engineering',
    author: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy',
    description: 'How Google runs production systems and maintains reliability at scale.',
    amazonUrl: 'https://amzn.to/3PQR678?tag=ziontech-20',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51oLE5+ihZL._SX258_BO1,204,203,200_.jpg',
  },
];

export const metadata = {
  title: 'Recommended Tech Books | Zion Tech Group',
  description: 'Curated list of must-read tech books. Affiliate links support our open-source work.',
};

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Recommended Tech Books
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            These books have shaped our approach to DevOps, SRE, and software craftsmanship. 
            Every purchase through our links supports our free open-source work.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {books.map((book) => (
            <a
              key={book.title}
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex gap-4">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-24 h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-2">{book.author}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{book.description}</p>
                  <div className="mt-4 flex items-center text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View on Amazon <ExternalLink className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-slate-800/30 border border-slate-700 rounded-3xl">
          <h2 className="text-2xl font-bold text-white mb-4">Want More Recommendations?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Check out our <a href="/support" className="text-purple-400 hover:text-purple-300">Support page</a> for more free tools, 
            or <a href="https://amzn.to/3wxy123?tag=ziontech-20" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">browse all DevOps books</a>.
          </p>
          <p className="text-xs text-slate-500">
            As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>

        {/* Back to Support */}
        <div className="mt-12 text-center">
          <a 
            href="/support"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Support Page
          </a>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Zion Tech Group is an AI, IT, and Micro SAAS company helping enterprises transform operations with intelligent systems.',
};



export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">About Zion Tech Group</h1>
        <p className="text-gray-300 mb-4">
          Zion Tech Group is a cutting-edge technology company specializing in AI-powered solutions,
          blockchain development, and next-generation telecommunications.
        </p>
        <p className="text-gray-300">
          We build intelligent systems that transform businesses and create new possibilities.
        </p>
      </div>
    </div>
  );
}
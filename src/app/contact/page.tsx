import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">Contact Us</h1>
        <div className="text-gray-300 mb-4">
          <p className="mb-2">Email: <a href="mailto:kleber@ziontechgroup.com" className="text-emerald-400">kleber@ziontechgroup.com</a></p>
          <p className="mb-2">Phone: +1 302 464 0950</p>
          <p className="mb-2">Address: 364 E Main St STE 1008, Middletown, DE</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-400 mb-4">Get in Touch</h2>
          <p className="text-gray-300">
            Ready to transform your business with cutting-edge technology?
            Contact us today for a consultation.
          </p>
        </div>
      </div>
    </div>
  );
}
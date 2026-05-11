import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    try {
      // In a real app, you would send this to your email service or API
      // For now, we'll simulate a delay and show a success message
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('Thanks for subscribing! We\'ll keep you updated.');
      setEmail('');
    } catch (err) {
      setMessage('Oops! Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-12 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl">
      <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
      <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
        Get the latest on new free tools, automation tips, and Zion Tech Group updates.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder:text-slate-400"
            disabled={sending}
          />
          {sending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          )}
        </div>
        {message && (
          <p className={`mt-2 text-sm text-center ${
            message.includes('Thanks') ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={sending || !email}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50"
        >
          {sending ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}

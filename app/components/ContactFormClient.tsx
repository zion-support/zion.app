'use client';

import React, { FormEvent, useCallback, useState } from 'react';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { CONTACT_INFO } from '../utils/seoConstants';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactFormClient() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setStatus('submitting');

      const subject = encodeURIComponent(
        `New Project Inquiry from ${formData.firstName} ${formData.lastName}`,
      );
      const body = encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`,
      );

      window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        setStatus('success');
      }, 500);
    },
    [formData],
  );

  const resetForm = useCallback(() => {
    setFormData({ firstName: '', lastName: '', email: '', company: '', message: '' });
    setStatus('idle');
  }, []);

  const inputClass =
    'block w-full rounded-xl border border-slate-600/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40';

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-purple-500/30 bg-slate-900/70 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-md sm:p-8">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Message Ready to Send</h2>
          <p className="mt-3 max-w-md text-sm text-slate-300">
            Your email client should have opened with your message pre-filled. If it didn&apos;t, you
            can reach us directly at{' '}
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-purple-300 underline hover:text-purple-200"
            >
              {CONTACT_INFO.email}
            </a>
          </p>
          <button
            type="button"
            onClick={resetForm}
            className="mt-6 rounded-xl border border-purple-500/40 px-5 py-2.5 text-sm font-medium text-purple-300 transition hover:border-purple-400 hover:text-white"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-slate-900/70 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-md sm:p-8">
      <h2 className="text-2xl font-bold text-white">Send us a message</h2>
      <p className="mt-2 text-sm text-slate-300">
        Tell us about your project and we will get back to you within one business day.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-200">First name</span>
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              required
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Jane"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-200">Last name</span>
            <input
              type="text"
              name="lastName"
              autoComplete="family-name"
              required
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Doe"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-200">Work email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder="jane@company.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-200">Company</span>
          <input
            type="text"
            name="company"
            autoComplete="organization"
            value={formData.company}
            onChange={handleChange}
            className={inputClass}
            placeholder="Acme Inc."
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-200">How can we help?</span>
          <textarea
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            className={inputClass}
            placeholder="Tell us about your project, goals, and timeline..."
          />
        </label>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-700/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 sm:w-auto"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              Send Message
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

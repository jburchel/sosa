'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear any previous error when user starts typing again
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side validation
    if (!form.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!form.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!form.message.trim()) {
      setError('Message is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Submission failed. Please try again.');
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full bg-sosa-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-sosa-orange focus:outline-none transition-colors duration-200 placeholder:text-gray-600';

  if (success) {
    return (
      <div className="bg-sosa-gray border border-sosa-orange rounded-lg p-8 text-center">
        <div className="w-16 h-1 bg-sosa-orange mx-auto mb-6" />
        <h3 className="text-xl font-bold mb-3">Message Sent!</h3>
        <p className="text-gray-300">Thank you! We will get back to you soon.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sosa-orange underline text-sm hover:text-orange-400 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Full Name <span className="text-sosa-orange">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Jane Smith"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email Address <span className="text-sosa-orange">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@example.com"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
          Subject <span className="text-gray-600 text-xs">(optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="How can we help?"
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
          Message <span className="text-sosa-orange">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Write your message here..."
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-700 rounded px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sosa-orange hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest px-8 py-3 rounded-lg transition-colors duration-300 text-sm"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

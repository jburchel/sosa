'use client';

import { useState } from 'react';

interface FormData {
  businessName: string;
  contactName: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  cityStateZip: string;
  website: string;
  sponsorshipTier: string;
  message: string;
  signature: string;
}

const TIERS = [
  { value: 'bronze', label: 'Bronze - $250', description: 'Logo on game day jerseys' },
  { value: 'silver', label: 'Silver - $500', description: 'Bronze benefits + social media recognition' },
  { value: 'gold', label: 'Gold - $1,000', description: 'All benefits + hosted team event at your business + custom promotional commercial' },
];

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-sosa-orange ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-sosa-dark border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sosa-orange transition-colors text-sm';

export default function SponsorForm() {
  const [form, setForm] = useState<FormData>({
    businessName: '',
    contactName: '',
    title: '',
    phone: '',
    email: '',
    address: '',
    cityStateZip: '',
    website: '',
    sponsorshipTier: '',
    message: '',
    signature: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-sosa-gray border border-gray-800 rounded-2xl p-10 text-center">
        <div className="w-16 h-1 bg-sosa-orange mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">Application Received!</h3>
        <p className="text-gray-300 text-lg mb-2">
          Thank you for your interest in sponsoring SOSA Basketball.
        </p>
        <p className="text-gray-400">
          Our Community Outreach Director will be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Business Information */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Business Information
        </h3>
        <div className="space-y-4">
          <FormField label="Business / Organization Name" required>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => update('businessName', e.target.value)}
              required
              className={inputClass}
              placeholder="Your business name"
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Contact Name" required>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => update('contactName', e.target.value)}
                required
                className={inputClass}
                placeholder="Full name"
              />
            </FormField>
            <FormField label="Title / Position">
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className={inputClass}
                placeholder="e.g. Owner, Marketing Director"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Phone Number" required>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                required
                className={inputClass}
                placeholder="(555) 555-5555"
              />
            </FormField>
            <FormField label="Email Address" required>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                className={inputClass}
                placeholder="you@business.com"
              />
            </FormField>
          </div>
          <FormField label="Business Address">
            <input
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              className={inputClass}
              placeholder="Street address"
            />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="City / State / Zip">
              <input
                type="text"
                value={form.cityStateZip}
                onChange={(e) => update('cityStateZip', e.target.value)}
                className={inputClass}
                placeholder="City, ST 30301"
              />
            </FormField>
            <FormField label="Website">
              <input
                type="text"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                className={inputClass}
                placeholder="www.yourbusiness.com"
              />
            </FormField>
          </div>
        </div>
      </section>

      {/* Sponsorship Tier */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Sponsorship Level
        </h3>
        <p className="text-gray-400 text-sm mb-4">Select your preferred sponsorship tier</p>
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <label
              key={tier.value}
              className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                form.sponsorshipTier === tier.value
                  ? 'border-sosa-orange bg-sosa-orange/10'
                  : 'border-gray-700 bg-sosa-dark hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="sponsorshipTier"
                value={tier.value}
                checked={form.sponsorshipTier === tier.value}
                onChange={(e) => update('sponsorshipTier', e.target.value)}
                className="mt-1 accent-orange-500"
              />
              <div>
                <p className="text-white font-semibold text-sm">{tier.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{tier.description}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Additional Info */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Additional Information
        </h3>
        <FormField label="Questions or comments">
          <textarea
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Anything else you'd like us to know..."
          />
        </FormField>
      </section>

      {/* Signature */}
      <section>
        <FormField label="Digital Signature (type your full name)" required>
          <input
            type="text"
            value={form.signature}
            onChange={(e) => update('signature', e.target.value)}
            required
            className={inputClass}
            placeholder="Your full legal name"
          />
        </FormField>
        <p className="text-gray-500 text-xs mt-2">
          By signing, you confirm your interest in sponsoring SOSA Basketball at the selected tier. A member of our team will follow up with payment details and next steps.
        </p>
      </section>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-sosa-orange hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-lg py-4 rounded-lg transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Sponsorship Application'}
      </button>
    </form>
  );
}

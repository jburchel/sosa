'use client';

import { useState } from 'react';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  cityStateZip: string;
  dateOfBirth: string;
  areasOfInterest: string[];
  experience: string;
  whyVolunteer: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  backgroundCheckConsent: boolean;
  codeOfConductConsent: boolean;
  mediaReleaseConsent: boolean;
  signature: string;
}

const AREAS_OF_INTEREST = [
  'Coach',
  'Assistant Coach',
  'Team Parent',
  'Event Volunteer',
  'Fundraising',
  'Mentorship / Tutoring',
  'Administrative Support',
  'Concessions / Game Day Help',
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

export default function VolunteerForm() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    cityStateZip: '',
    dateOfBirth: '',
    areasOfInterest: [],
    experience: '',
    whyVolunteer: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    backgroundCheckConsent: false,
    codeOfConductConsent: false,
    mediaReleaseConsent: false,
    signature: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof FormData, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleInterest(value: string) {
    setForm((prev) => {
      const arr = prev.areasOfInterest;
      return {
        ...prev,
        areasOfInterest: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/volunteer', {
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
        <h3 className="text-2xl font-bold mb-4">Application Submitted!</h3>
        <p className="text-gray-300 text-lg mb-2">
          Thank you for your interest in volunteering with SOSA Basketball.
        </p>
        <p className="text-gray-400">
          We will review your application and reach out to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Personal Information
        </h3>
        <div className="space-y-4">
          <FormField label="Full Name" required>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              required
              className={inputClass}
              placeholder="Your full name"
            />
          </FormField>
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
                placeholder="you@example.com"
              />
            </FormField>
          </div>
          <FormField label="Address" required>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              required
              className={inputClass}
              placeholder="Street address"
            />
          </FormField>
          <FormField label="City / State / Zip" required>
            <input
              type="text"
              value={form.cityStateZip}
              onChange={(e) => update('cityStateZip', e.target.value)}
              required
              className={inputClass}
              placeholder="City, ST 30301"
            />
          </FormField>
          <FormField label="Date of Birth" required>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              required
              className={inputClass}
            />
          </FormField>
        </div>
      </section>

      {/* Areas of Interest */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Areas of Interest
        </h3>
        <p className="text-gray-400 text-sm mb-3">Check all that apply</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {AREAS_OF_INTEREST.map((role) => (
            <label key={role} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.areasOfInterest.includes(role)}
                onChange={() => toggleInterest(role)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {role}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Experience & Motivation */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Experience Working with Youth
        </h3>
        <FormField label="Please describe any experience working with children, coaching, mentoring, or community service">
          <textarea
            value={form.experience}
            onChange={(e) => update('experience', e.target.value)}
            rows={4}
            className={inputClass}
            placeholder="Describe your experience..."
          />
        </FormField>
        <div className="mt-4">
          <FormField label="Why do you want to volunteer with SOSA?" required>
            <textarea
              value={form.whyVolunteer}
              onChange={(e) => update('whyVolunteer', e.target.value)}
              required
              rows={4}
              className={inputClass}
              placeholder="Tell us what motivates you..."
            />
          </FormField>
        </div>
      </section>

      {/* Emergency Contact */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Name" required>
            <input
              type="text"
              value={form.emergencyName}
              onChange={(e) => update('emergencyName', e.target.value)}
              required
              className={inputClass}
              placeholder="Contact name"
            />
          </FormField>
          <FormField label="Phone" required>
            <input
              type="tel"
              value={form.emergencyPhone}
              onChange={(e) => update('emergencyPhone', e.target.value)}
              required
              className={inputClass}
              placeholder="(555) 555-5555"
            />
          </FormField>
          <FormField label="Relationship" required>
            <input
              type="text"
              value={form.emergencyRelationship}
              onChange={(e) => update('emergencyRelationship', e.target.value)}
              required
              className={inputClass}
              placeholder="Spouse, parent, etc."
            />
          </FormField>
        </div>
      </section>

      {/* Agreements */}
      <section>
        <h3 className="text-lg font-bold text-sosa-orange uppercase tracking-wider mb-4">
          Agreements & Signature
        </h3>

        <div className="space-y-4">
          {/* Background Check */}
          <div className="bg-sosa-dark border border-gray-700 rounded-lg p-5">
            <h4 className="text-sm font-bold text-white mb-2">Background Check Authorization</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              I understand that because SOSA works with youth, a background check may be required for certain volunteer positions. I authorize SOSA Basketball to conduct a background check if necessary.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.backgroundCheckConsent}
                onChange={(e) => update('backgroundCheckConsent', e.target.checked)}
                required
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-300">
                I agree to the Background Check Authorization
                <span className="text-sosa-orange ml-1">*</span>
              </span>
            </label>
          </div>

          {/* Code of Conduct */}
          <div className="bg-sosa-dark border border-gray-700 rounded-lg p-5">
            <h4 className="text-sm font-bold text-white mb-2">Volunteer Code of Conduct</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              Volunteers agree to treat all athletes with respect, promote positive sportsmanship, follow the policies of SOSA Basketball, and maintain appropriate boundaries with youth participants.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.codeOfConductConsent}
                onChange={(e) => update('codeOfConductConsent', e.target.checked)}
                required
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-300">
                I agree to the Volunteer Code of Conduct
                <span className="text-sosa-orange ml-1">*</span>
              </span>
            </label>
          </div>

          {/* Media Release */}
          <div className="bg-sosa-dark border border-gray-700 rounded-lg p-5">
            <h4 className="text-sm font-bold text-white mb-2">Media / Photo Release</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              I grant SOSA Basketball permission to use photos or video taken during events or activities for promotional, website, or social media purposes.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.mediaReleaseConsent}
                onChange={(e) => update('mediaReleaseConsent', e.target.checked)}
                required
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm text-gray-300">
                I agree to the Media / Photo Release
                <span className="text-sosa-orange ml-1">*</span>
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <FormField label="Volunteer Signature (type your full name)" required>
            <input
              type="text"
              value={form.signature}
              onChange={(e) => update('signature', e.target.value)}
              required
              className={inputClass}
              placeholder="Your full legal name"
            />
          </FormField>
        </div>
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
        {submitting ? 'Submitting Application...' : 'Submit Volunteer Application'}
      </button>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SHIRT_SIZES = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL', 'A2XL'];

const SHIRT_SIZE_LABELS: Record<string, string> = {
  YS: 'Youth Small',
  YM: 'Youth Medium',
  YL: 'Youth Large',
  AS: 'Adult Small',
  AM: 'Adult Medium',
  AL: 'Adult Large',
  AXL: 'Adult XL',
  A2XL: 'Adult 2XL',
};

export default function EventSignupForm({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [tshirtSize, setTshirtSize] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent, addAnother: boolean) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/events/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          name: name.trim(),
          age: Number(age),
          tshirtSize,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit sign-up');
        return;
      }

      if (addAnother) {
        setName('');
        setAge('');
        setTshirtSize('');
        setSuccess(`${name.trim()} has been signed up for ${eventTitle}!`);
      } else {
        router.push('/events');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          className="w-full bg-sosa-dark border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sosa-orange transition-colors"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm text-gray-300 mb-2">
          Age
        </label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          required
          min="1"
          max="120"
          className="w-full bg-sosa-dark border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-sosa-orange transition-colors"
        />
      </div>

      <div>
        <label htmlFor="tshirtSize" className="block text-sm text-gray-300 mb-2">
          T-Shirt Size
        </label>
        <select
          id="tshirtSize"
          value={tshirtSize}
          onChange={(e) => setTshirtSize(e.target.value)}
          required
          className="w-full bg-sosa-dark border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-sosa-orange transition-colors"
        >
          <option value="" disabled>
            Select a size
          </option>
          {SHIRT_SIZES.map((size) => (
            <option key={size} value={size}>
              {SHIRT_SIZE_LABELS[size]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={submitting || !name.trim() || !age || !tshirtSize}
          className="flex-1 bg-sosa-orange hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-colors"
        >
          {submitting ? 'Submitting…' : 'Save and Submit'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={submitting || !name.trim() || !age || !tshirtSize}
          className="flex-1 border border-sosa-orange text-sosa-orange hover:bg-sosa-orange hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded transition-colors"
        >
          {submitting ? 'Submitting…' : 'Submit and Add Another'}
        </button>
      </div>
    </form>
  );
}

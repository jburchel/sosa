'use client';

import { useState } from 'react';

interface FormState {
  playerName: string;
  playerDob: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyName: string;
  emergencyPhone: string;
  medicalConditions: string;
  signature: string;
  consentChecked: boolean;
}

const initialForm: FormState = {
  playerName: '',
  playerDob: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  emergencyName: '',
  emergencyPhone: '',
  medicalConditions: '',
  signature: '',
  consentChecked: false,
};

const today = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const inputClass =
  'w-full bg-sosa-dark border border-gray-700 rounded px-4 py-2 text-white focus:border-sosa-orange focus:outline-none';

const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

export default function WaiverForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ signedAt: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? (target as HTMLInputElement).checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const required: (keyof FormState)[] = [
      'playerName',
      'playerDob',
      'parentName',
      'parentEmail',
      'parentPhone',
      'emergencyName',
      'emergencyPhone',
      'signature',
    ];
    for (const field of required) {
      if (!form[field]) {
        setError(`Please fill in all required fields.`);
        return;
      }
    }

    if (
      form.signature.toLowerCase().trim() !==
      form.parentName.toLowerCase().trim()
    ) {
      setError('Signature must match the parent/guardian name exactly.');
      return;
    }

    if (!form.consentChecked) {
      setError('You must agree to the terms to submit.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/waiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: form.playerName,
          playerDob: form.playerDob,
          parentName: form.parentName,
          parentEmail: form.parentEmail,
          parentPhone: form.parentPhone,
          emergencyName: form.emergencyName,
          emergencyPhone: form.emergencyPhone,
          medicalConditions: form.medicalConditions,
          signature: form.signature,
          consentChecked: form.consentChecked,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.');
        return;
      }

      setSuccess({ signedAt: data.signedAt });
      setForm(initialForm);
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-sosa-dark border border-green-700 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-400 mb-2">
          Waiver Submitted Successfully
        </h3>
        <p className="text-gray-300">
          Your waiver was signed and recorded on{' '}
          <span className="text-white font-medium">
            {new Date(success.signedAt).toLocaleString()}
          </span>
          .
        </p>
        <button
          onClick={() => setSuccess(null)}
          className="mt-6 px-6 py-2 bg-sosa-orange text-white font-bold rounded hover:opacity-90 transition-opacity"
        >
          Submit Another Waiver
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-sosa-gray border border-gray-700 rounded-lg p-6 md:p-8"
      noValidate
    >
      {/* Player Information */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide text-sosa-orange mb-4">
          Player Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="playerName" className={labelClass}>
              Player Full Name <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="playerName"
              name="playerName"
              type="text"
              required
              value={form.playerName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Last"
            />
          </div>
          <div>
            <label htmlFor="playerDob" className={labelClass}>
              Player Date of Birth <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="playerDob"
              name="playerDob"
              type="date"
              required
              value={form.playerDob}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Parent / Guardian Information */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide text-sosa-orange mb-4">
          Parent / Guardian Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="parentName" className={labelClass}>
              Full Name <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="parentName"
              name="parentName"
              type="text"
              required
              value={form.parentName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Last"
            />
          </div>
          <div>
            <label htmlFor="parentEmail" className={labelClass}>
              Email Address <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="parentEmail"
              name="parentEmail"
              type="email"
              required
              value={form.parentEmail}
              onChange={handleChange}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="parentPhone" className={labelClass}>
              Phone Number <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="parentPhone"
              name="parentPhone"
              type="tel"
              required
              value={form.parentPhone}
              onChange={handleChange}
              className={inputClass}
              placeholder="(555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide text-sosa-orange mb-4">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyName" className={labelClass}>
              Contact Name <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="emergencyName"
              name="emergencyName"
              type="text"
              required
              value={form.emergencyName}
              onChange={handleChange}
              className={inputClass}
              placeholder="First Last"
            />
          </div>
          <div>
            <label htmlFor="emergencyPhone" className={labelClass}>
              Contact Phone <span className="text-sosa-orange">*</span>
            </label>
            <input
              id="emergencyPhone"
              name="emergencyPhone"
              type="tel"
              required
              value={form.emergencyPhone}
              onChange={handleChange}
              className={inputClass}
              placeholder="(555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Medical Conditions */}
      <div>
        <label htmlFor="medicalConditions" className={labelClass}>
          Medical Conditions / Allergies{' '}
          <span className="text-gray-500">(optional)</span>
        </label>
        <textarea
          id="medicalConditions"
          name="medicalConditions"
          rows={3}
          value={form.medicalConditions}
          onChange={handleChange}
          className={inputClass}
          placeholder="List any relevant medical conditions, allergies, or medications..."
        />
      </div>

      {/* Waiver Agreement */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide text-sosa-orange mb-4">
          Waiver Agreement
        </h3>
        <div className="max-h-48 overflow-y-auto bg-sosa-dark p-4 rounded border border-gray-700 text-sm text-gray-300 space-y-4">
          <div>
            <p className="font-semibold text-white mb-1">
              1. Assumption of Risk
            </p>
            <p>
              I acknowledge that participation in basketball activities involves
              inherent risks, including but not limited to physical injury,
              illness, or accident. I voluntarily assume all such risks on
              behalf of the above-named player and agree that SOSA Basketball,
              its coaches, volunteers, and affiliated staff shall not be held
              liable for any injury sustained during participation.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">2. Medical Release</p>
            <p>
              I authorize SOSA Basketball staff to seek emergency medical
              treatment for the above-named player in the event that I cannot be
              reached. I agree to be responsible for any medical expenses
              incurred as a result of such treatment.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">
              3. Photo / Video Release
            </p>
            <p>
              I grant SOSA Basketball permission to photograph and record the
              above-named player during practices, games, and events. These
              images and recordings may be used for promotional, educational, or
              social media purposes without compensation.
            </p>
          </div>
        </div>
      </div>

      {/* Digital Signature */}
      <div>
        <h3 className="text-lg font-bold uppercase tracking-wide text-sosa-orange mb-4">
          Digital Signature
        </h3>
        <div>
          <label htmlFor="signature" className={labelClass}>
            Type your full legal name as signature{' '}
            <span className="text-sosa-orange">*</span>
          </label>
          <input
            id="signature"
            name="signature"
            type="text"
            required
            value={form.signature}
            onChange={handleChange}
            className={inputClass}
            placeholder="Must match parent/guardian name above"
          />
        </div>

        <div className="mt-4 flex items-start gap-3">
          <input
            id="consentChecked"
            name="consentChecked"
            type="checkbox"
            required
            checked={form.consentChecked}
            onChange={handleChange}
            className="mt-1 accent-sosa-orange"
          />
          <label htmlFor="consentChecked" className="text-sm text-gray-300">
            I agree to the above terms and acknowledge this constitutes a
            legally binding electronic signature under the{' '}
            <span className="text-white font-medium">ESIGN Act</span>.
          </label>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Date</label>
          <input
            type="text"
            readOnly
            value={today}
            className={`${inputClass} cursor-not-allowed opacity-60`}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm font-medium">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sosa-orange text-white font-bold py-3 rounded uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting…' : 'Submit Waiver'}
      </button>
    </form>
  );
}

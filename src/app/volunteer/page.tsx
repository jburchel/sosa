import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import VolunteerForm from '@/components/VolunteerForm';

export const metadata: Metadata = {
  title: 'Volunteer | SOSA Basketball',
  description:
    'Apply to volunteer with SOSA Basketball — coaching, mentoring, event support, and more. Join our mission to develop youth on and off the court.',
};

export default function VolunteerPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Volunteer Application"
            subtitle="Join the SOSA family and help us develop youth through athletics, mentorship, leadership, and community service."
          />
        </div>
      </section>

      {/* Download + Intro */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-sosa-gray border border-gray-800 rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">Prefer a printable version?</p>
              <p className="text-gray-400 text-sm">
                Open the printable version and use your browser&apos;s print function to save as PDF.
              </p>
            </div>
            <Link
              href="/volunteer/print"
              target="_blank"
              className="flex-shrink-0 bg-sosa-orange hover:bg-orange-500 text-black font-bold text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save as PDF
            </Link>
          </div>

          <p className="text-gray-400 text-sm mb-8 text-center">
            Or fill out the application online below. All fields marked with <span className="text-sosa-orange">*</span> are required.
          </p>

          {/* Online Form */}
          <VolunteerForm />
        </div>
      </section>

    </div>
  );
}

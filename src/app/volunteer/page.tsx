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
                Download the volunteer application as a PDF to print and fill out by hand.
              </p>
            </div>
            <Link
              href="/downloads/SOSA_Volunteer_APP.pdf"
              target="_blank"
              className="flex-shrink-0 bg-sosa-orange hover:bg-orange-500 text-black font-bold text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
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

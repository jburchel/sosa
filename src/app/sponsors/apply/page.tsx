import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import SponsorForm from '@/components/SponsorForm';

export const metadata: Metadata = {
  title: 'Become a Sponsor | SOSA Basketball',
  description:
    'Apply to become a sponsor of SOSA Basketball. Support youth development through athletics, mentorship, and community service.',
};

export default function SponsorApplyPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Sponsorship Application"
            subtitle="Partner with SOSA Basketball and invest in the next generation of leaders."
          />
        </div>
      </section>

      {/* Download + Intro */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-sosa-gray border border-gray-800 rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold mb-1">Want the full sponsorship packet?</p>
              <p className="text-gray-400 text-sm">
                Download the Community Sponsorship document with full details on tiers and benefits.
              </p>
            </div>
            <Link
              href="https://docs.google.com/document/d/1QWijUtJKds5cl864idgzrYuZw8DCN2isMGb9npfS6YA/export?format=pdf"
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
            Or fill out the sponsorship application online below. All fields marked with <span className="text-sosa-orange">*</span> are required.
          </p>

          {/* Online Form */}
          <SponsorForm />
        </div>
      </section>

    </div>
  );
}

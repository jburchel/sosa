import type { Metadata } from 'next';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Sponsors | SOSA Basketball',
  description:
    'Meet the sponsors and partners who help make SOSA Basketball programs possible for youth athletes.',
};

const PLACEHOLDER_SPONSORS = [
  { id: 1, label: 'Platinum Sponsor' },
  { id: 2, label: 'Gold Sponsor' },
  { id: 3, label: 'Silver Sponsor' },
  { id: 4, label: 'Community Partner' },
];

function BuildingIcon() {
  return (
    <svg
      className="w-12 h-12 text-gray-600 mb-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16M3 21h18M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );
}

export default function SponsorsPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Our Sponsors"
            subtitle="SOSA Basketball is grateful for the support of our sponsors and partners who help make our programs possible."
          />
        </div>
      </section>

      {/* Sponsor Logo Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-8 text-center">
            Current Sponsors &amp; Partners
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PLACEHOLDER_SPONSORS.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-sosa-gray border border-gray-800 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-sosa-orange transition-colors duration-300 min-h-[180px]"
              >
                <BuildingIcon />
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                  Your Logo Here
                </p>
                <p className="text-gray-600 text-xs mt-1">{sponsor.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Sponsor CTA */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHeading
            title="Become a Sponsor"
            subtitle="Partner with SOSA Basketball and invest in the next generation of leaders."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-sosa-gray rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-1 bg-sosa-orange mb-4 mx-auto" />
              <h4 className="text-lg font-bold uppercase tracking-wide mb-3">Community Visibility</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your brand featured on our website, social media, uniforms, and event signage — reaching thousands of local families.
              </p>
            </div>
            <div className="bg-sosa-gray rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-1 bg-sosa-orange mb-4 mx-auto" />
              <h4 className="text-lg font-bold uppercase tracking-wide mb-3">Real Impact</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your sponsorship directly funds program fees, equipment, and travel costs so that no athlete is turned away due to finances.
              </p>
            </div>
            <div className="bg-sosa-gray rounded-xl p-6 border border-gray-800">
              <div className="w-10 h-1 bg-sosa-orange mb-4 mx-auto" />
              <h4 className="text-lg font-bold uppercase tracking-wide mb-3">Tax-Deductible</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                SOSA Basketball is a faith-driven non-profit. Sponsorship contributions may be tax-deductible. Consult your tax advisor.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-block bg-sosa-orange hover:bg-orange-600 text-black font-bold uppercase tracking-widest px-10 py-4 rounded-lg transition-colors duration-300 text-sm"
          >
            Contact Us to Sponsor
          </Link>
        </div>
      </section>

    </div>
  );
}

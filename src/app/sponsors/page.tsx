import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Sponsors | SOSA Basketball',
  description:
    'Support SOSA Basketball through community sponsorship. Learn about our Bronze, Silver, and Gold sponsorship tiers.',
};

const OPEN_SLOTS = [
  { id: 1, label: 'Gold Sponsor' },
  { id: 2, label: 'Gold Sponsor' },
  { id: 3, label: 'Silver Sponsor' },
  { id: 4, label: 'Bronze Sponsor' },
  { id: 5, label: 'Bronze Sponsor' },
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

const TIERS = [
  {
    name: 'Bronze',
    price: '$250',
    color: 'border-amber-700',
    accentBg: 'bg-amber-700',
    benefits: [
      'Logo placement on game day jerseys',
      'Donation receipt for tax purposes',
    ],
  },
  {
    name: 'Silver',
    price: '$500',
    color: 'border-gray-400',
    accentBg: 'bg-gray-400',
    benefits: [
      'Everything in Bronze',
      'Social media recognition and shout-outs',
      'Donation receipt for tax purposes',
    ],
  },
  {
    name: 'Gold',
    price: '$1,000',
    color: 'border-sosa-orange',
    accentBg: 'bg-sosa-orange',
    benefits: [
      'Everything in Silver',
      'Hosted team event at your business',
      'Custom promotional commercial',
      'Donation receipt for tax purposes',
    ],
  },
];

export default function SponsorsPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Community Sponsorship"
            subtitle="SOSA Basketball is a veteran-operated nonprofit that leverages basketball to develop young athletes in discipline, leadership, accountability, community service, and faith."
          />
        </div>
      </section>

      {/* What Your Support Enables */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-3 text-center">
            Your Impact
          </h3>
          <h2 className="text-3xl font-bold text-center mb-4">What Your Sponsorship Supports</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Your support enables SOSA to provide structure and opportunity, developing emerging leaders both athletically and personally.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Tournament Access', icon: '🏆' },
              { label: 'Uniforms & Gear', icon: '👕' },
              { label: 'Training Programs', icon: '🏀' },
              { label: 'Mentorship', icon: '🤝' },
              { label: 'Community Service', icon: '🌟' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-sosa-gray border border-gray-800 rounded-xl p-5 text-center hover:border-sosa-orange transition-colors"
              >
                <span className="text-3xl block mb-2" aria-hidden="true">{item.icon}</span>
                <p className="text-white text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Sponsorship Tiers"
            subtitle="Choose the level of partnership that works for you. Every dollar directly supports youth in our community."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`bg-black rounded-2xl border-2 ${tier.color} overflow-hidden flex flex-col`}
              >
                <div className={`${tier.accentBg} py-1`} />
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {tier.name}
                  </h4>
                  <p className="text-4xl font-black text-white mb-6">{tier.price}</p>
                  <ul className="space-y-3 flex-1">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <span className="text-sosa-orange mt-0.5 flex-shrink-0">&#10003;</span>
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sponsors/apply"
                    className={`block text-center font-bold text-sm uppercase tracking-wide py-3 rounded-lg mt-6 transition-colors ${
                      tier.name === 'Gold'
                        ? 'bg-sosa-orange text-black hover:bg-orange-500'
                        : 'border border-gray-600 text-gray-300 hover:border-sosa-orange hover:text-sosa-orange'
                    }`}
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Tax info */}
          <div className="bg-sosa-gray border border-gray-800 rounded-xl p-6 text-center max-w-2xl mx-auto">
            <p className="text-gray-300 text-sm leading-relaxed">
              SOSA Basketball is a registered <span className="text-white font-semibold">501(c)(3) nonprofit organization</span>.
              All sponsorship contributions may be tax-deductible. Sponsors receive donation receipts for their records.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sponsor */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-8 text-center">
            Our Sponsors
          </h3>

          {/* Parks GMC - Silver Sponsor */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-sosa-gray border-2 border-gray-400 rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-gray-400" />
              <div className="p-6">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="/images/parks-gmc-sponsor.png"
                    alt="Parks GMC Kernersville — Silver Tier Sponsor of SOSA Basketball"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-block bg-gray-400/20 border border-gray-400 text-gray-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Silver Tier Sponsor
                  </span>
                  <h4 className="text-2xl font-bold text-white mt-3">Parks GMC Kernersville</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Thank you for your generous support of SOSA Basketball!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Open Sponsor Slots */}
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 text-center">
            Sponsor Slots Available
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {OPEN_SLOTS.map((slot) => (
              <Link
                key={slot.id}
                href="/sponsors/apply"
                className="bg-sosa-gray border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-sosa-orange transition-colors duration-300 min-h-[140px] group"
              >
                <BuildingIcon />
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide group-hover:text-sosa-orange transition-colors">
                  Your Logo Here
                </p>
                <p className="text-gray-600 text-xs mt-1">{slot.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Download */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join the SOSA family and help us build the next generation of leaders — on and off the court.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/sponsors/apply"
              className="bg-sosa-orange hover:bg-orange-500 text-black font-bold uppercase tracking-wide px-10 py-4 rounded-lg transition-colors text-sm"
            >
              Apply to Sponsor
            </Link>
            <Link
              href="https://docs.google.com/document/d/1QWijUtJKds5cl864idgzrYuZw8DCN2isMGb9npfS6YA/export?format=pdf"
              target="_blank"
              className="border border-gray-600 text-gray-300 hover:border-sosa-orange hover:text-sosa-orange font-bold uppercase tracking-wide px-10 py-4 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Sponsorship Packet
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-black border border-gray-800 rounded-xl p-6 inline-block text-left">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Questions? Contact our Community Outreach Director</p>
            <p className="text-white font-semibold">Verna Spivey</p>
            <p className="text-gray-400 text-sm">(336) 405-7125</p>
            <p className="text-gray-400 text-sm">squareonetigers@gmail.com</p>
          </div>
        </div>
      </section>

    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Register | SOSA Basketball',
  description:
    'Register a new player for SOSA Basketball — Square One Sports Academy.',
};

export default function RegisterPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Player Registration"
            subtitle="Join the SOSA Tigers family."
          />
        </div>
      </section>

      {/* Registration Closed Notice */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-sosa-gray border border-gray-800 rounded-2xl p-10 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <Image
                  src="/images/s1-logo.png"
                  alt="SOSA Logo"
                  fill
                  className="object-contain opacity-60"
                  sizes="80px"
                />
              </div>
            </div>

            <div className="w-16 h-1 bg-sosa-orange mx-auto mb-6" />

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Registration Closed for the 2026 Season
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Registration will open for the <span className="text-sosa-orange font-semibold">2027 season</span> on{' '}
              <span className="text-white font-semibold">January 1st, 2027</span>.
            </p>

            <p className="text-gray-400 mb-8">
              Want to be notified when registration opens? Reach out to us and we&apos;ll keep you in the loop.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-sosa-orange hover:bg-orange-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/"
                className="border border-gray-600 text-gray-300 hover:border-sosa-orange hover:text-sosa-orange font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

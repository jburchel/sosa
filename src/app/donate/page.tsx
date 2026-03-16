import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { getManifest, resolveSlotSrc } from '@/lib/image-slots';

export const metadata: Metadata = {
  title: 'Donate | SOSA Basketball',
  description:
    'Support SOSA Basketball and help us provide youth with structured mentorship, competitive athletic opportunities, and a safe environment to grow.',
};

export default async function DonatePage() {
  const manifest = await getManifest();
  const communitySrc = resolveSlotSrc('donate-community', manifest);
  const heartSrc = resolveSlotSrc('donate-heart', manifest);

  function isApi(src: string) {
    return src.startsWith('/api/');
  }

  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Support SOSA Basketball"
            subtitle="Your generous contributions help us provide youth with structured mentorship, competitive athletic opportunities, and a safe environment to grow. Every dollar makes a difference in a young athlete's life."
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Coming Soon Card */}
            <div className="md:w-1/2 w-full">
              <div className="bg-sosa-gray border border-sosa-orange rounded-lg p-8 text-center">
                <div className="w-16 h-1 bg-sosa-orange mx-auto mb-6" />
                <h3 className="text-2xl font-bold uppercase tracking-wide mb-4">
                  Online Donations Coming Soon
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  We are working on a secure online donation platform. In the meantime, please contact
                  us to learn how you can support our youth programs.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-sosa-orange hover:bg-orange-600 text-black font-bold uppercase tracking-widest px-8 py-3 rounded-lg transition-colors duration-300 text-sm"
                >
                  Contact Us
                </Link>
              </div>

              {/* Impact Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-sosa-gray rounded-xl p-4 text-center border border-gray-800">
                  <p className="text-sosa-orange text-2xl font-bold">100%</p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Goes to Youth</p>
                </div>
                <div className="bg-sosa-gray rounded-xl p-4 text-center border border-gray-800">
                  <p className="text-sosa-orange text-2xl font-bold">Non</p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Profit Org</p>
                </div>
                <div className="bg-sosa-gray rounded-xl p-4 text-center border border-gray-800">
                  <p className="text-sosa-orange text-2xl font-bold">God</p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">First Always</p>
                </div>
              </div>
            </div>

            {/* Decorative Image */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-sosa-gray">
                <Image
                  src={communitySrc}
                  alt="SOSA Community"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={isApi(communitySrc)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold text-lg leading-snug">
                    Building a village where youth discover their purpose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heart of a Tiger accent section */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-48 h-48 flex-shrink-0 rounded-full overflow-hidden border-2 border-sosa-orange">
              <Image
                src={heartSrc}
                alt="Heart of a Tiger"
                fill
                className="object-cover"
                sizes="192px"
                unoptimized={isApi(heartSrc)}
              />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-2">
                Why It Matters
              </h3>
              <h2 className="text-2xl font-bold mb-4">Every Kid Deserves a Chance</h2>
              <p className="text-gray-300 leading-relaxed">
                At SOSA Basketball, we believe no child should be left behind due to financial barriers.
                Your donation helps cover registration fees, equipment, travel costs, and mentorship
                resources — giving every young athlete the opportunity to grow, compete, and thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

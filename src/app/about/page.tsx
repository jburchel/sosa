import type { Metadata } from 'next';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import { MISSION_STATEMENT, VISION_STATEMENT, CORE_VALUES, TIGER_MINDSET } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About | SOSA Basketball',
  description:
    'Learn about Square One Sports Academy — our mission, vision, core values, and the Tiger Mindset that drives everything we do.',
};

export default function AboutPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="About SOSA"
            subtitle="Square One Sports Academy — building student-athletes on and off the court."
          />
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-3">
                Our Mission
              </h3>
              <h2 className="text-3xl font-bold mb-6">What We Stand For</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{MISSION_STATEMENT}</p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-sosa-gray">
                <Image
                  src="/images/tiger-mascot.jpg"
                  alt="SOSA Tiger Mascot"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-3">
                Our Vision
              </h3>
              <h2 className="text-3xl font-bold mb-6">Where We Are Going</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{VISION_STATEMENT}</p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border border-sosa-gray">
                <Image
                  src="/images/heart-of-tiger.jpg"
                  alt="Heart of a Tiger"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Core Values"
            subtitle="The principles that guide every player, coach, and family in the SOSA community."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CORE_VALUES.map((value) => (
              <div
                key={value.name}
                className="bg-sosa-gray rounded-xl p-6 border border-sosa-dark hover:border-sosa-orange transition-colors duration-300"
              >
                <div className="w-10 h-1 bg-sosa-orange mb-4" />
                <h4 className="text-xl font-bold uppercase tracking-wide mb-3">{value.name}</h4>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiger Mindset */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="The Tiger Mindset"
            subtitle="Daily affirmations our athletes live by — on the court and beyond."
          />
          <div className="max-w-3xl mx-auto space-y-6">
            {TIGER_MINDSET.map((affirmation, index) => (
              <div key={index} className="flex items-start gap-4">
                <span className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-sosa-orange flex items-center justify-center text-black font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-xl italic font-medium text-white leading-relaxed">
                  &ldquo;{affirmation}&rdquo;
                </p>
              </div>
            ))}
          </div>

          {/* Daily Affirmation image accent */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-64 h-64 opacity-80">
              <Image
                src="/images/daily-affirmation.png"
                alt="Daily Affirmation"
                fill
                className="object-contain"
                sizes="256px"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import ProgramCard from '@/components/ProgramCard';
import ValueCard from '@/components/ValueCard';
import SectionHeading from '@/components/SectionHeading';
import { PROGRAMS, CORE_VALUES, MISSION_STATEMENT } from '@/lib/constants';

// First two sentences of the mission statement for the preview card
const MISSION_PREVIEW = MISSION_STATEMENT.split('. ').slice(0, 2).join('. ') + '.';

const GALLERY_IMAGES = [
  { src: '/images/boys-game-action-1.png', alt: 'SOSA Tigers Game Action' },
  { src: '/images/girls-game-action-1.png', alt: 'SOSA Lady Tigers Game Action' },
  { src: '/images/practice-action.jpg', alt: 'SOSA Basketball Practice' },
  { src: '/images/boys-game-action-3.png', alt: 'Tigers In Action' },
  { src: '/images/girls-game-action-2.png', alt: 'Lady Tigers In Action' },
  { src: '/images/basketball-training.jpg', alt: 'Basketball Training' },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. About Preview */}
      <section className="py-20 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <SectionHeading
            title="Who We Are"
            subtitle="A faith-driven, community-focused organization developing the next generation of leaders."
          />
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Square One Sports Academy (SOSA) is an AAU basketball club built on the belief that every young person deserves access to competitive athletics, mentorship, and positive leadership. We develop student-athletes both on and off the court — putting God first in everything we do.
          </p>
          <Link
            href="/about"
            className="inline-block border-2 border-sosa-orange text-sosa-orange font-bold px-8 py-3 rounded-lg hover:bg-sosa-orange hover:text-black transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* 3. Mission Preview */}
      <section className="py-20 bg-sosa-black">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading title="Our Mission" />
          <div className="bg-sosa-gray border border-gray-800 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="w-16 h-1 bg-sosa-orange mb-6 rounded" />
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed italic">
              &ldquo;{MISSION_PREVIEW}&rdquo;
            </p>
            <div className="w-16 h-1 bg-sosa-orange mt-6 ml-auto rounded" />
          </div>
        </div>
      </section>

      {/* 4. Programs */}
      <section className="py-20 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Our Programs"
            subtitle="Everything we offer is designed to grow athletes in skill, character, and purpose."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROGRAMS.map((program) => (
              <ProgramCard
                key={program.title}
                title={program.title}
                description={program.description}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/programs"
              className="inline-block border-2 border-sosa-orange text-sosa-orange font-bold px-8 py-3 rounded-lg hover:bg-sosa-orange hover:text-black transition-colors"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Values — The SOSA Way */}
      <section className="py-20 bg-sosa-black">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="The SOSA Way"
            subtitle="The six pillars that guide everything we do."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CORE_VALUES.map((value) => (
              <ValueCard
                key={value.name}
                name={value.name}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Gallery Preview */}
      <section className="py-20 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading title="Gallery" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.src}
                className="relative aspect-square rounded-xl overflow-hidden bg-sosa-gray border border-gray-800 hover:border-sosa-orange transition-colors"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-block border-2 border-sosa-orange text-sosa-orange font-bold px-8 py-3 rounded-lg hover:bg-sosa-orange hover:text-black transition-colors"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Sponsors */}
      <section className="py-20 bg-sosa-black">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <SectionHeading
            title="Our Sponsors"
            subtitle="We are grateful for the organizations and individuals who make SOSA possible."
          />
          <p className="text-gray-400 text-lg mb-8">
            Interested in supporting our youth? Partner with SOSA Basketball and help us build the next generation of leaders.
          </p>
          <Link
            href="/sponsors"
            className="inline-block bg-sosa-orange text-black font-bold px-8 py-3 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Become a Sponsor
          </Link>
        </div>
      </section>

      {/* 8. Donate CTA - commented out until non-profit status is established
      <section className="py-20 bg-gradient-to-br from-sosa-dark via-sosa-gray to-sosa-dark">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Support Our Youth
          </h2>
          <div className="w-20 h-1 bg-sosa-orange mx-auto mb-6 rounded" />
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Your donation helps us provide uniforms, tournament fees, training equipment, and mentorship to youth who need it most. Every dollar goes directly to supporting our student-athletes.
          </p>
          <Link
            href="/donate"
            className="inline-block bg-sosa-orange text-black font-bold text-lg px-10 py-4 rounded-lg hover:bg-orange-500 transition-colors shadow-lg shadow-sosa-orange/20"
          >
            Donate Now
          </Link>
        </div>
      </section>
      */}
    </>
  );
}

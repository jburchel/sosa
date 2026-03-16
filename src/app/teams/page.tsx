import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { getManifest, resolveSlotSrc } from '@/lib/image-slots';

export const metadata: Metadata = {
  title: 'Teams | SOSA Basketball',
  description:
    'Meet the SOSA Tigers and SOSA Lady Tigers — competitive youth basketball teams built on faith, character, and excellence.',
};

export default async function TeamsPage() {
  const manifest = await getManifest();
  const tigersBadge = resolveSlotSrc('teams-tigers-badge', manifest);
  const boysAction1 = resolveSlotSrc('teams-boys-action-1', manifest);
  const boysAction2 = resolveSlotSrc('teams-boys-action-2', manifest);
  const ladyTigersBadge = resolveSlotSrc('teams-lady-tigers-badge', manifest);
  const girlsAction1 = resolveSlotSrc('teams-girls-action-1', manifest);
  const girlsAction2 = resolveSlotSrc('teams-girls-action-2', manifest);

  function isApi(src: string) {
    return src.startsWith('/api/');
  }

  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Our Teams"
            subtitle="Two programs. One mission. Faith-driven athletes competing with heart and purpose."
          />
        </div>
      </section>

      {/* SOSA Tigers — Boys */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl border border-sosa-orange overflow-hidden">
            {/* Orange accent header bar */}
            <div className="h-2 bg-sosa-orange" />
            <div className="p-8 md:p-12 bg-sosa-dark">
              <div className="flex flex-col md:flex-row items-center gap-10">

                {/* Badge image */}
                <div className="flex-shrink-0 flex justify-center">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    <Image
                      src={tigersBadge}
                      alt="SOSA Tigers Badge"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 192px, 224px"
                      unoptimized={isApi(tigersBadge)}
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm font-bold uppercase tracking-widest text-sosa-orange mb-2">
                    Boys Program
                  </p>
                  <h2 className="text-4xl font-bold text-sosa-orange mb-5">SOSA Tigers</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    The SOSA Tigers are our boys&apos; competitive travel basketball program, fielding
                    teams across multiple age groups in AAU and local league play. Built on a
                    foundation of faith, discipline, and relentless effort, our Tigers compete to
                    win — but more importantly, they compete with character. Every athlete in the
                    Tigers program is held to high standards academically and athletically, with
                    coaches and mentors who invest personally in their growth. We develop the
                    complete athlete: skilled on the court, accountable in the classroom, and a
                    leader in the community.
                  </p>

                  {/* Roster Coming Soon card */}
                  <div className="inline-block border border-sosa-orange rounded-xl px-6 py-4 text-center">
                    <p className="text-sosa-orange font-bold uppercase tracking-wide text-sm mb-1">
                      Roster
                    </p>
                    <p className="text-white font-semibold text-lg">Coming Soon</p>
                    <p className="text-gray-500 text-sm mt-1">Season roster will be posted here</p>
                  </div>
                </div>
              </div>

              {/* Boys action photo showcase */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={boysAction1}
                    alt="SOSA Tigers game action"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={isApi(boysAction1)}
                  />
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={boysAction2}
                    alt="SOSA Tigers dunking and layup highlights"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={isApi(boysAction2)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOSA Lady Tigers — Girls */}
      <section className="py-16 bg-sosa-dark">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl border border-sosa-pink overflow-hidden">
            {/* Pink accent header bar */}
            <div className="h-2 bg-sosa-pink" />
            <div className="p-8 md:p-12 bg-black">
              <div className="flex flex-col md:flex-row-reverse items-center gap-10">

                {/* Lady Tigers image */}
                <div className="flex-shrink-0 flex justify-center">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    <Image
                      src={ladyTigersBadge}
                      alt="SOSA Lady Tigers"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 192px, 224px"
                      unoptimized={isApi(ladyTigersBadge)}
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm font-bold uppercase tracking-widest text-sosa-pink mb-2">
                    Girls Program
                  </p>
                  <h2 className="text-4xl font-bold text-sosa-pink mb-5">SOSA Lady Tigers</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    The SOSA Lady Tigers are our girls&apos; competitive travel basketball program —
                    a space where young women are empowered to be fierce, confident, and
                    unstoppable both on and off the court. Our Lady Tigers compete in AAU and
                    local league programs while growing in leadership, sisterhood, and
                    self-belief. We are committed to creating an environment where every girl
                    feels valued, supported, and challenged to reach her full potential. With
                    strong female mentors and coaches who believe in them, our Lady Tigers are
                    learning that their voice matters, their effort counts, and their future is
                    limitless.
                  </p>

                  {/* Roster Coming Soon card */}
                  <div className="inline-block border border-sosa-pink rounded-xl px-6 py-4 text-center">
                    <p className="text-sosa-pink font-bold uppercase tracking-wide text-sm mb-1">
                      Roster
                    </p>
                    <p className="text-white font-semibold text-lg">Coming Soon</p>
                    <p className="text-gray-500 text-sm mt-1">Season roster will be posted here</p>
                  </div>
                </div>
              </div>

              {/* Lady Tigers action photo showcase */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={girlsAction1}
                    alt="SOSA Lady Tigers game action"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={isApi(girlsAction1)}
                  />
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={girlsAction2}
                    alt="SOSA Lady Tigers in action"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={isApi(girlsAction2)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Interested in Joining?</h3>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Whether your athlete is a Tiger or a Lady Tiger in the making, we want to hear
            from you. Get in touch to learn about tryouts and how to get started.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-sosa-orange text-black font-bold uppercase tracking-wide px-10 py-4 rounded-full hover:opacity-90 transition-opacity duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}

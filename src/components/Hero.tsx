import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/boys-game-action-1.png"
          alt="SOSA Basketball"
          fill
          priority
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-sosa-orange/10 border border-sosa-orange/30 text-sosa-orange text-sm font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          Square One Sports Academy
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-4">
          SOSA BASKETBALL
        </h1>

        {/* Subheadline */}
        <p className="text-2xl md:text-3xl font-bold text-sosa-orange mb-2">
          More Than Basketball
        </p>

        {/* Supporting line */}
        <p className="text-lg md:text-xl text-gray-400 mb-10">
          On and Off the Court
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#"
            className="bg-sosa-orange text-black font-bold px-8 py-3 rounded-lg text-base hover:bg-orange-500 transition-colors"
          >
            Register
          </Link>
          <Link
            href="#"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg text-base hover:border-sosa-orange hover:text-sosa-orange transition-colors"
          >
            Donate
          </Link>
          <Link
            href="/about"
            className="border-2 border-gray-600 text-gray-300 font-bold px-8 py-3 rounded-lg text-base hover:border-sosa-orange hover:text-sosa-orange transition-colors"
          >
            Join SOSA
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Gallery | SOSA Basketball',
  description:
    'View game photos, team photos, and community event images from SOSA Basketball — Square One Sports Academy.',
};

const GALLERY_IMAGES = [
  {
    src: '/images/tiger-mascot.jpg',
    alt: 'SOSA Tiger Mascot',
    width: 800,
    height: 800,
  },
  {
    src: '/images/heart-of-tiger.jpg',
    alt: 'Heart of a Tiger',
    width: 800,
    height: 800,
  },
  {
    src: '/images/community.jpg',
    alt: 'SOSA Community',
    width: 800,
    height: 600,
  },
  {
    src: '/images/sosa-tigers-badge.png',
    alt: 'SOSA Tigers Badge',
    width: 600,
    height: 600,
  },
  {
    src: '/images/sosa-lady-tigers.png',
    alt: 'SOSA Lady Tigers',
    width: 600,
    height: 600,
  },
  {
    src: '/images/lady-tigers-alt.png',
    alt: 'Lady Tigers Alternate',
    width: 600,
    height: 600,
  },
  {
    src: '/images/tiger-basketball.png',
    alt: 'Tiger Basketball',
    width: 600,
    height: 600,
  },
  {
    src: '/images/pink-tiger-dark.png',
    alt: 'Pink Tiger Dark',
    width: 600,
    height: 600,
  },
  {
    src: '/images/pink-tiger-light.png',
    alt: 'Pink Tiger Light',
    width: 600,
    height: 600,
  },
  {
    src: '/images/daily-affirmation.png',
    alt: 'Daily Affirmation',
    width: 600,
    height: 600,
  },
  {
    src: '/images/s1-logo.png',
    alt: 'Square One Sports Academy Logo',
    width: 600,
    height: 600,
  },
];

export default function GalleryPage() {
  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading
            title="Gallery"
            subtitle="Game photos, team photos, and community events. More coming soon!"
          />
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_IMAGES.map((image) => (
              <div
                key={image.src}
                className="rounded-lg overflow-hidden bg-sosa-gray border border-gray-800 hover:border-sosa-orange transition-all duration-300 hover:scale-105 aspect-square relative"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

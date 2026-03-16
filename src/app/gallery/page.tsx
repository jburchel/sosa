import type { Metadata } from 'next';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import { getManifest } from '@/lib/image-slots';

export const metadata: Metadata = {
  title: 'Gallery | SOSA Basketball',
  description:
    'View game photos, team photos, and community event images from SOSA Basketball — Square One Sports Academy.',
};

const BASE_GALLERY_IMAGES = [
  // Action shots — live game and training photography
  {
    src: '/images/boys-game-action-1.png',
    alt: 'Boys Tigers Game Action',
    width: 800,
    height: 800,
  },
  {
    src: '/images/boys-game-action-2.png',
    alt: 'Boys Tigers Team Action',
    width: 800,
    height: 800,
  },
  {
    src: '/images/boys-game-action-3.png',
    alt: 'Boys Tigers Dunk and Layup',
    width: 800,
    height: 800,
  },
  {
    src: '/images/girls-game-action-1.png',
    alt: 'Lady Tigers Game Action',
    width: 800,
    height: 800,
  },
  {
    src: '/images/girls-game-action-2.png',
    alt: 'Lady Tigers More Action',
    width: 800,
    height: 800,
  },
  {
    src: '/images/practice-action.jpg',
    alt: 'Players Training in Orange Uniforms',
    width: 800,
    height: 600,
  },
  {
    src: '/images/basketball-training.jpg',
    alt: 'Players Scrimmaging in Gym',
    width: 800,
    height: 600,
  },
  {
    src: '/images/player-portrait.png',
    alt: 'SOSA Player Portrait',
    width: 800,
    height: 1000,
  },
  // Community & brand imagery
  {
    src: '/images/community.jpg',
    alt: 'SOSA Community',
    width: 800,
    height: 600,
  },
  {
    src: '/images/heart-of-tiger.jpg',
    alt: 'Heart of a Tiger',
    width: 800,
    height: 800,
  },
  {
    src: '/images/tiger-mascot.jpg',
    alt: 'SOSA Tiger Mascot',
    width: 800,
    height: 800,
  },
  {
    src: '/images/daily-affirmation.png',
    alt: 'Daily Affirmation',
    width: 600,
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
    src: '/images/s1-logo.png',
    alt: 'Square One Sports Academy Logo',
    width: 600,
    height: 600,
  },
];

export default async function GalleryPage() {
  const manifest = await getManifest();

  // Merge base gallery with admin-uploaded images
  const uploadedImages = manifest.galleryImages.map((g) => ({
    src: `/api/images/${g.filename}`,
    alt: g.alt,
    width: 800,
    height: 800,
  }));

  const allImages = [...BASE_GALLERY_IMAGES, ...uploadedImages];

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
            {allImages.map((image) => (
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
                  unoptimized={image.src.startsWith('/api/')}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

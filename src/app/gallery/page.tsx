import type { Metadata } from 'next';
import { getManifest, IMAGE_SLOTS, GALLERY_ALBUMS } from '@/lib/image-slots';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Gallery | SOSA Basketball',
  description:
    'View game photos, team photos, and community event images from SOSA Basketball — Square One Sports Academy.',
};

const BASE_GALLERY_IMAGES = [
  // Game Action
  { src: '/images/boys-game-action-1.png', alt: 'Boys Tigers Game Action', album: 'Game Action' },
  { src: '/images/boys-game-action-2.png', alt: 'Boys Tigers Team Action', album: 'Game Action' },
  { src: '/images/boys-game-action-3.png', alt: 'Boys Tigers Dunk and Layup', album: 'Game Action' },
  { src: '/images/girls-game-action-1.png', alt: 'Lady Tigers Game Action', album: 'Game Action' },
  { src: '/images/girls-game-action-2.png', alt: 'Lady Tigers More Action', album: 'Game Action' },

  // Practice & Training
  { src: '/images/practice-action.jpg', alt: 'Players Training in Orange Uniforms', album: 'Practice & Training' },
  { src: '/images/basketball-training.jpg', alt: 'Players Scrimmaging in Gym', album: 'Practice & Training' },
  { src: '/images/player-portrait.png', alt: 'SOSA Player Portrait', album: 'Practice & Training' },

  // Community
  { src: '/images/community.jpg', alt: 'SOSA Community', album: 'Community' },
  { src: '/images/heart-of-tiger.jpg', alt: 'Heart of a Tiger', album: 'Community' },
  { src: '/images/tiger-mascot.jpg', alt: 'SOSA Tiger Mascot', album: 'Community' },
  { src: '/images/daily-affirmation.png', alt: 'Daily Affirmation', album: 'Community' },

  // Brand & Logos
  { src: '/images/sosa-tigers-badge.png', alt: 'SOSA Tigers Badge', album: 'Brand & Logos' },
  { src: '/images/sosa-lady-tigers.png', alt: 'SOSA Lady Tigers', album: 'Brand & Logos' },
  { src: '/images/lady-tigers-alt.png', alt: 'Lady Tigers Alternate', album: 'Brand & Logos' },
  { src: '/images/tiger-basketball.png', alt: 'Tiger Basketball', album: 'Brand & Logos' },
  { src: '/images/pink-tiger-dark.png', alt: 'Pink Tiger Dark', album: 'Brand & Logos' },
  { src: '/images/pink-tiger-light.png', alt: 'Pink Tiger Light', album: 'Brand & Logos' },
  { src: '/images/s1-logo.png', alt: 'Square One Sports Academy Logo', album: 'Brand & Logos' },
];

export default async function GalleryPage() {
  const manifest = await getManifest();

  // Slot replacement images
  const slotOverrideImages = Object.entries(manifest.slotOverrides).map(([slotId, filename]) => {
    const slot = IMAGE_SLOTS.find((s) => s.id === slotId);
    return {
      src: `/api/images/${filename}`,
      alt: slot ? `${slot.label} (${slot.usedIn})` : 'Uploaded image',
      album: 'Team Photos',
    };
  });

  // Gallery additions
  const uploadedImages = manifest.galleryImages.map((g) => ({
    src: `/api/images/${g.filename}`,
    alt: g.alt,
    album: g.album || 'All',
  }));

  const allImages = [...BASE_GALLERY_IMAGES, ...slotOverrideImages, ...uploadedImages];
  const albums = GALLERY_ALBUMS as unknown as string[];

  return (
    <div className="bg-black text-white">

      {/* Page Header */}
      <section className="py-16 bg-sosa-dark border-b border-sosa-gray">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold uppercase tracking-tight mb-4">Gallery</h2>
            <p className="text-gray-400 text-lg">
              Game photos, team photos, and community events. More coming soon!
            </p>
          </div>
        </div>
      </section>

      {/* Photo Grid with Album Filters */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <GalleryGrid images={allImages} albums={albums} />
        </div>
      </section>

    </div>
  );
}

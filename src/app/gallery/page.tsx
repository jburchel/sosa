import type { Metadata } from 'next';
import { getManifest, IMAGE_SLOTS, DEFAULT_ALBUMS, BASE_GALLERY_IMAGES, baseImageKey, uploadImageKey } from '@/lib/image-slots';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Gallery | SOSA Basketball',
  description:
    'View game photos, team photos, and community event images from SOSA Basketball — Square One Sports Academy.',
};

export default async function GalleryPage() {
  const manifest = await getManifest();
  const hiddenSet = new Set(manifest.hiddenBaseImages || []);

  // Base gallery images (excluding hidden ones)
  const baseImages = BASE_GALLERY_IMAGES
    .filter((img) => !hiddenSet.has(img.src))
    .map((img) => ({
      src: img.src,
      alt: img.alt,
      album: img.album,
      key: baseImageKey(img.src),
    }));

  // Slot replacement images
  const slotOverrideImages = Object.entries(manifest.slotOverrides).map(([slotId, filename]) => {
    const slot = IMAGE_SLOTS.find((s) => s.id === slotId);
    return {
      src: `/api/images/${filename}`,
      alt: slot ? `${slot.label} (${slot.usedIn})` : 'Uploaded image',
      album: 'Team Photos',
      key: `slot:${slotId}`,
    };
  });

  // Gallery additions
  const uploadedImages = manifest.galleryImages.map((g) => ({
    src: `/api/images/${g.filename}`,
    alt: g.alt,
    album: g.album || 'All',
    key: uploadImageKey(g.filename),
  }));

  const allImages = [...baseImages, ...slotOverrideImages, ...uploadedImages];

  // Apply custom image ordering if set
  const imageOrder = manifest.imageOrder;
  if (imageOrder && imageOrder.length > 0) {
    const orderMap = new Map(imageOrder.map((key, idx) => [key, idx]));
    allImages.sort((a, b) => {
      const aIdx = orderMap.get(a.key);
      const bIdx = orderMap.get(b.key);
      // Images in the order list come first, sorted by their position
      if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
      if (aIdx !== undefined) return -1;
      if (bIdx !== undefined) return 1;
      return 0; // preserve original order for unordered images
    });
  }

  // Build album list with custom ordering
  const customAlbums = manifest.customAlbums || [];
  const allAlbumNames = new Set([...DEFAULT_ALBUMS, ...customAlbums, ...allImages.map((img) => img.album)]);
  allAlbumNames.delete('All');

  let sortedAlbums: string[];
  const albumOrder = manifest.albumOrder;
  if (albumOrder && albumOrder.length > 0) {
    const orderMap = new Map(albumOrder.map((name, idx) => [name, idx]));
    sortedAlbums = Array.from(allAlbumNames).sort((a, b) => {
      const aIdx = orderMap.get(a);
      const bIdx = orderMap.get(b);
      if (aIdx !== undefined && bIdx !== undefined) return aIdx - bIdx;
      if (aIdx !== undefined) return -1;
      if (bIdx !== undefined) return 1;
      return a.localeCompare(b);
    });
  } else {
    sortedAlbums = Array.from(allAlbumNames).sort();
  }

  const albums = ['All', ...sortedAlbums];

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

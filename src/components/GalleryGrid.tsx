'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
  src: string;
  alt: string;
  album: string;
  key?: string;
}

export default function GalleryGrid({
  images,
  albums,
}: {
  images: GalleryImage[];
  albums: string[];
}) {
  const [activeAlbum, setActiveAlbum] = useState('All');

  const filtered = activeAlbum === 'All'
    ? images
    : images.filter((img) => img.album === activeAlbum);

  // Count images per album
  const albumCounts = albums.reduce(
    (acc, album) => {
      acc[album] = album === 'All' ? images.length : images.filter((img) => img.album === album).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Album Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeAlbum === album
                ? 'bg-sosa-orange text-black'
                : 'bg-sosa-gray border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {album}
            <span className="ml-1.5 opacity-60">({albumCounts[album] || 0})</span>
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((image) => (
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

      {filtered.length === 0 && (
        <div className="bg-sosa-gray border border-gray-800 rounded-lg px-6 py-12 text-center">
          <p className="text-gray-500">No images in this album yet.</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';

interface ImageSlot {
  id: string;
  defaultSrc: string;
  label: string;
  usedIn: string;
}

interface GalleryImage {
  filename: string;
  alt: string;
  addedAt: string;
}

interface ImageManifest {
  slotOverrides: Record<string, string>;
  galleryImages: GalleryImage[];
}

type Section = 'slots' | 'gallery';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Slot Card ────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  manifest,
  onUpload,
  onRevert,
}: {
  slot: ImageSlot;
  manifest: ImageManifest;
  onUpload: (slotId: string, file: File) => Promise<void>;
  onRevert: (slotId: string) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const override = manifest.slotOverrides[slot.id];
  const currentSrc = override ? `/api/images/${override}` : slot.defaultSrc;
  const isOverridden = !!override;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(slot.id, file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleRevert() {
    setUploading(true);
    try {
      await onRevert(slot.id);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg overflow-hidden">
      {/* Image preview */}
      <div className="relative aspect-video bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={slot.label}
          className="w-full h-full object-cover"
        />
        {isOverridden && (
          <span className="absolute top-2 right-2 bg-sosa-orange text-black text-xs font-bold px-2 py-1 rounded">
            Custom
          </span>
        )}
      </div>

      {/* Info & actions */}
      <div className="p-4">
        <p className="font-semibold text-white text-sm">{slot.label}</p>
        <p className="text-gray-500 text-xs mt-0.5">{slot.usedIn}</p>

        <div className="flex gap-2 mt-3">
          <label className="flex-1 cursor-pointer">
            <span className="block w-full text-center bg-sosa-orange hover:bg-orange-500 text-black font-semibold text-xs py-2 rounded transition-colors">
              {uploading ? 'Uploading...' : 'Replace'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {isOverridden && (
            <button
              onClick={handleRevert}
              disabled={uploading}
              className="px-3 py-2 text-xs border border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 rounded transition-colors disabled:opacity-50"
            >
              Revert
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Gallery Upload ───────────────────────────────────────────────────────────

function GalleryUploadForm({ onUpload }: { onUpload: (file: File, alt: string) => Promise<void> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      await onUpload(selectedFile, alt || 'Gallery image');
      setSelectedFile(null);
      setPreview(null);
      setAlt('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-sosa-gray border border-gray-800 rounded-lg p-5 mb-6">
      <h4 className="font-semibold text-white mb-4">Add New Gallery Image</h4>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Preview area */}
        <div className="w-full sm:w-40 flex-shrink-0">
          {preview ? (
            <div className="aspect-square rounded-lg overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-sosa-orange transition-colors">
              <div className="text-center">
                <p className="text-gray-400 text-2xl mb-1">+</p>
                <p className="text-gray-500 text-xs">Choose image</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Fields */}
        <div className="flex-1 flex flex-col gap-3">
          {preview && (
            <label className="cursor-pointer">
              <span className="text-xs text-gray-400">Change image</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Alt text (optional)</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image"
              className="w-full bg-sosa-dark border border-gray-700 rounded px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-sosa-orange transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="bg-sosa-orange hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm py-2 px-4 rounded transition-colors self-start"
          >
            {uploading ? 'Uploading...' : 'Add to Gallery'}
          </button>
        </div>
      </div>
    </form>
  );
}

// ── Gallery Image Card ───────────────────────────────────────────────────────

function GalleryCard({
  image,
  onDelete,
}: {
  image: GalleryImage;
  onDelete: (filename: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Remove this image from the gallery?')) return;
    setDeleting(true);
    try {
      await onDelete(image.filename);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg overflow-hidden">
      <div className="aspect-square bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/images/${image.filename}`}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-white text-xs truncate">{image.alt}</p>
        <p className="text-gray-500 text-xs mt-0.5">{formatDate(image.addedAt)}</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="mt-2 w-full text-xs py-1.5 border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 rounded transition-colors disabled:opacity-50"
        >
          {deleting ? 'Removing...' : 'Remove'}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ImageManager() {
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [manifest, setManifest] = useState<ImageManifest>({ slotOverrides: {}, galleryImages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState<Section>('slots');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch('/api/admin/images');
      if (!res.ok) throw new Error('Failed to load images');
      const data = await res.json();
      setSlots(data.slots);
      setManifest(data.manifest);
    } catch {
      setError('Failed to load image data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSlotUpload(slotId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'replace-slot');
    formData.append('slotId', slotId);

    const res = await fetch('/api/admin/images', { method: 'POST', body: formData });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Upload failed');
      return;
    }
    const data = await res.json();
    setManifest(data.manifest);
  }

  async function handleSlotRevert(slotId: string) {
    const res = await fetch('/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revert-slot', slotId }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Revert failed');
      return;
    }
    const data = await res.json();
    setManifest(data.manifest);
  }

  async function handleGalleryUpload(file: File, alt: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'add-gallery');
    formData.append('alt', alt);

    const res = await fetch('/api/admin/images', { method: 'POST', body: formData });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Upload failed');
      return;
    }
    const data = await res.json();
    setManifest(data.manifest);
  }

  async function handleGalleryDelete(filename: string) {
    const res = await fetch('/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'remove-gallery', filename }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Delete failed');
      return;
    }
    const data = await res.json();
    setManifest(data.manifest);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-sosa-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-sosa-gray border border-gray-800 rounded-lg px-6 py-12 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  // Group slots by page
  const slotsByPage = slots.reduce(
    (acc, slot) => {
      if (!acc[slot.usedIn]) acc[slot.usedIn] = [];
      acc[slot.usedIn].push(slot);
      return acc;
    },
    {} as Record<string, ImageSlot[]>
  );

  return (
    <div>
      {/* Sub-navigation */}
      <div className="flex gap-1 mb-6 bg-sosa-gray rounded-lg p-1">
        {(['slots', 'gallery'] as Section[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              section === s
                ? 'bg-sosa-orange text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {s === 'slots' ? 'App Images' : 'Gallery'}
          </button>
        ))}
      </div>

      {/* Slots Section */}
      {section === 'slots' && (
        <div>
          <p className="text-gray-400 text-sm mb-6">
            Replace images used across the site. Click &quot;Replace&quot; to upload a new image, or &quot;Revert&quot; to restore the original.
          </p>
          {Object.entries(slotsByPage).map(([page, pageSlots]) => (
            <div key={page} className="mb-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-sosa-orange mb-3">
                {page}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pageSlots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    manifest={manifest}
                    onUpload={handleSlotUpload}
                    onRevert={handleSlotRevert}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Section */}
      {section === 'gallery' && (
        <div>
          <p className="text-gray-400 text-sm mb-6">
            Add new images to the public gallery. These appear alongside the existing gallery photos.
          </p>

          <GalleryUploadForm onUpload={handleGalleryUpload} />

          {manifest.galleryImages.length > 0 && (
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-sosa-orange mb-3">
                Uploaded Gallery Images ({manifest.galleryImages.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {manifest.galleryImages.map((image) => (
                  <GalleryCard
                    key={image.filename}
                    image={image}
                    onDelete={handleGalleryDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {manifest.galleryImages.length === 0 && (
            <div className="bg-sosa-gray border border-gray-800 rounded-lg px-6 py-12 text-center">
              <p className="text-gray-500">No gallery images uploaded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

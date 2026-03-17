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
  album: string;
  addedAt: string;
}

interface ImageManifest {
  slotOverrides: Record<string, string>;
  galleryImages: GalleryImage[];
}

type Section = 'slots' | 'gallery';

const ALBUM_OPTIONS = [
  'Game Action',
  'Practice & Training',
  'Team Photos',
  'Community',
  'Brand & Logos',
];

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
      <div className="relative aspect-video bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentSrc} alt={slot.label} className="w-full h-full object-cover" />
        {isOverridden && (
          <span className="absolute top-2 right-2 bg-sosa-orange text-black text-xs font-bold px-2 py-1 rounded">
            Custom
          </span>
        )}
      </div>
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

// ── Batch Gallery Upload ─────────────────────────────────────────────────────

interface PendingFile {
  file: File;
  preview: string;
  alt: string;
}

function GalleryBatchUploadForm({ onUpload }: { onUpload: (file: File, alt: string, album: string) => Promise<void> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [album, setAlbum] = useState(ALBUM_OPTIONS[0]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newPending = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    }));
    setPendingFiles((prev) => [...prev, ...newPending]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function updateAlt(index: number, alt: string) {
    setPendingFiles((prev) => prev.map((p, i) => (i === index ? { ...p, alt } : p)));
  }

  function removeFile(index: number) {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleUploadAll() {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    setProgress({ done: 0, total: pendingFiles.length });

    for (let i = 0; i < pendingFiles.length; i++) {
      const p = pendingFiles[i];
      try {
        await onUpload(p.file, p.alt, album);
      } catch {
        // continue with remaining files
      }
      setProgress({ done: i + 1, total: pendingFiles.length });
    }

    // Clean up previews
    pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
    setPendingFiles([]);
    setUploading(false);
  }

  return (
    <div className="bg-sosa-gray border border-gray-800 rounded-lg p-5 mb-6">
      <h4 className="font-semibold text-white mb-4">Add Gallery Images</h4>

      {/* Album selector + file picker */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">Album</label>
          <select
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="w-full bg-sosa-dark border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-sosa-orange transition-colors"
          >
            {ALBUM_OPTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <label className="cursor-pointer bg-sosa-dark border border-gray-700 hover:border-sosa-orange text-gray-300 hover:text-white font-semibold text-sm py-2 px-4 rounded transition-colors flex items-center gap-2">
            <span>+ Choose Files</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Pending files grid */}
      {pendingFiles.length > 0 && (
        <div className="space-y-3 mb-4">
          {pendingFiles.map((p, index) => (
            <div key={index} className="flex items-center gap-3 bg-sosa-dark rounded-lg p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.preview} alt="Preview" className="w-14 h-14 object-cover rounded flex-shrink-0" />
              <input
                type="text"
                value={p.alt}
                onChange={(e) => updateAlt(index, e.target.value)}
                placeholder="Alt text"
                className="flex-1 bg-transparent border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-sosa-orange"
              />
              <button
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-red-400 text-lg flex-shrink-0 transition-colors"
                title="Remove"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-sosa-dark rounded-full h-2 overflow-hidden">
              <div
                className="bg-sosa-orange h-full transition-all duration-300"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{progress.done}/{progress.total}</span>
          </div>
        </div>
      )}

      {/* Upload button */}
      {pendingFiles.length > 0 && !uploading && (
        <button
          onClick={handleUploadAll}
          className="bg-sosa-orange hover:bg-orange-500 text-black font-semibold text-sm py-2 px-4 rounded transition-colors"
        >
          Upload {pendingFiles.length} {pendingFiles.length === 1 ? 'Image' : 'Images'} to &quot;{album}&quot;
        </button>
      )}

      {pendingFiles.length === 0 && !uploading && (
        <p className="text-gray-500 text-xs">Select one or more images to upload. You can edit alt text before uploading.</p>
      )}
    </div>
  );
}

// ── Gallery Image Card ───────────────────────────────────────────────────────

function GalleryCard({
  image,
  selected,
  selectMode,
  onToggleSelect,
  onDelete,
}: {
  image: GalleryImage;
  selected: boolean;
  selectMode: boolean;
  onToggleSelect: (filename: string) => void;
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
    <div
      className={`bg-sosa-gray border rounded-lg overflow-hidden relative ${
        selected ? 'border-sosa-orange ring-2 ring-sosa-orange/50' : 'border-gray-800'
      }`}
    >
      {/* Select checkbox overlay */}
      {selectMode && (
        <button
          onClick={() => onToggleSelect(image.filename)}
          className="absolute top-2 left-2 z-10 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: selected ? '#e87722' : '#666',
            background: selected ? '#e87722' : 'rgba(0,0,0,0.6)',
          }}
        >
          {selected && <span className="text-black text-xs font-bold">&#10003;</span>}
        </button>
      )}
      <div
        className="aspect-square bg-black cursor-pointer"
        onClick={() => selectMode && onToggleSelect(image.filename)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/images/${image.filename}`}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <p className="text-white text-xs truncate">{image.alt}</p>
        <p className="text-gray-500 text-xs mt-0.5">
          {image.album || 'Uncategorized'} &middot; {formatDate(image.addedAt)}
        </p>
        {!selectMode && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-2 w-full text-xs py-1.5 border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400 rounded transition-colors disabled:opacity-50"
          >
            {deleting ? 'Removing...' : 'Remove'}
          </button>
        )}
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
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchDeleting, setBatchDeleting] = useState(false);

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

  async function handleGalleryUpload(file: File, alt: string, album: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'add-gallery');
    formData.append('alt', alt);
    formData.append('album', album);

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
    setSelected((prev) => { const next = new Set(prev); next.delete(filename); return next; });
  }

  function toggleSelect(filename: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(manifest.galleryImages.map((g) => g.filename)));
  }

  function deselectAll() {
    setSelected(new Set());
  }

  async function handleBatchDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected image${selected.size > 1 ? 's' : ''}?`)) return;
    setBatchDeleting(true);
    const filenames = Array.from(selected);
    for (const filename of filenames) {
      try {
        await handleGalleryDelete(filename);
      } catch { /* continue */ }
    }
    setSelected(new Set());
    setBatchDeleting(false);
    setSelectMode(false);
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
            Add images to the public gallery. Select an album, choose multiple files, and upload in batch.
          </p>

          <GalleryBatchUploadForm onUpload={handleGalleryUpload} />

          {manifest.galleryImages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-sosa-orange">
                  Uploaded Gallery Images ({manifest.galleryImages.length})
                </h4>
                <div className="flex items-center gap-2">
                  {selectMode && (
                    <>
                      <button
                        onClick={selected.size === manifest.galleryImages.length ? deselectAll : selectAll}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {selected.size === manifest.galleryImages.length ? 'Deselect All' : 'Select All'}
                      </button>
                      {selected.size > 0 && (
                        <button
                          onClick={handleBatchDelete}
                          disabled={batchDeleting}
                          className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                        >
                          {batchDeleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
                    className={`text-xs px-3 py-1.5 rounded transition-colors ${
                      selectMode
                        ? 'bg-gray-600 text-white'
                        : 'border border-gray-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    {selectMode ? 'Cancel' : 'Select'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {manifest.galleryImages.map((image) => (
                  <GalleryCard
                    key={image.filename}
                    image={image}
                    selected={selected.has(image.filename)}
                    selectMode={selectMode}
                    onToggleSelect={toggleSelect}
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

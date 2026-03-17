import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getManifest, saveManifest, getImagesDir, IMAGE_SLOTS } from '@/lib/image-slots';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

// GET — return manifest + slot definitions
export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const manifest = await getManifest();
  return NextResponse.json({ manifest, slots: IMAGE_SLOTS });
}

// POST — upload image (slot replacement or gallery addition)
export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const action = formData.get('action') as string;
    const slotId = formData.get('slotId') as string | null;
    const alt = formData.get('alt') as string | null;
    const album = formData.get('album') as string | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Use PNG, JPG, WebP, or GIF.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
    }

    if (action !== 'replace-slot' && action !== 'add-gallery') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Determine file extension from MIME type
    const extMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const ext = extMap[file.type] || '.png';

    const imagesDir = getImagesDir();
    await fs.mkdir(imagesDir, { recursive: true });

    const manifest = await getManifest();
    const buffer = Buffer.from(await file.arrayBuffer());

    if (action === 'replace-slot') {
      if (!slotId || !IMAGE_SLOTS.find((s) => s.id === slotId)) {
        return NextResponse.json({ error: 'Invalid slot ID' }, { status: 400 });
      }

      // Delete old override if it exists
      const oldOverride = manifest.slotOverrides[slotId];
      if (oldOverride) {
        try {
          await fs.unlink(path.join(imagesDir, oldOverride));
        } catch { /* file may not exist */ }
      }

      const filename = `${slotId}-${Date.now()}${ext}`;
      await fs.writeFile(path.join(imagesDir, filename), buffer);
      manifest.slotOverrides[slotId] = filename;
    } else {
      // add-gallery
      const filename = `gallery-${Date.now()}${ext}`;
      await fs.writeFile(path.join(imagesDir, filename), buffer);
      manifest.galleryImages.push({
        filename,
        alt: alt || 'Gallery image',
        album: album || 'All',
        addedAt: new Date().toISOString(),
      });
    }

    await saveManifest(manifest);
    return NextResponse.json({ success: true, manifest });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// PATCH — update custom albums
export async function PATCH(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { customAlbums } = await request.json();
    if (!Array.isArray(customAlbums)) {
      return NextResponse.json({ error: 'Invalid albums' }, { status: 400 });
    }

    const manifest = await getManifest();
    manifest.customAlbums = customAlbums.filter((a: unknown) => typeof a === 'string' && a.trim());
    await saveManifest(manifest);
    return NextResponse.json({ success: true, manifest });
  } catch (error) {
    console.error('Album update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE — remove a gallery image or revert a slot override
export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, filename, slotId } = await request.json();
    const manifest = await getManifest();
    const imagesDir = getImagesDir();

    if (action === 'remove-gallery') {
      const index = manifest.galleryImages.findIndex((g) => g.filename === filename);
      if (index === -1) {
        return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
      }

      // Delete file
      try {
        await fs.unlink(path.join(imagesDir, filename));
      } catch { /* file may not exist */ }

      manifest.galleryImages.splice(index, 1);
    } else if (action === 'revert-slot') {
      if (!slotId || !manifest.slotOverrides[slotId]) {
        return NextResponse.json({ error: 'No override to revert' }, { status: 404 });
      }

      // Delete override file
      try {
        await fs.unlink(path.join(imagesDir, manifest.slotOverrides[slotId]));
      } catch { /* file may not exist */ }

      delete manifest.slotOverrides[slotId];
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await saveManifest(manifest);
    return NextResponse.json({ success: true, manifest });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

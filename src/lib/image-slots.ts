import fs from 'fs/promises';
import path from 'path';
import { connection } from 'next/server';

// ── Image Slot Definitions ───────────────────────────────────────────────────

export interface ImageSlot {
  id: string;
  defaultSrc: string;
  label: string;
  usedIn: string;
}

export const IMAGE_SLOTS: ImageSlot[] = [
  // Hero
  { id: 'hero', defaultSrc: '/images/boys-game-action-1.png', label: 'Hero Background', usedIn: 'Home Page' },

  // About page
  { id: 'about-banner', defaultSrc: '/images/boys-game-action-2.png', label: 'About Banner', usedIn: 'About Page' },
  { id: 'about-mission', defaultSrc: '/images/tiger-mascot.jpg', label: 'Mission Image', usedIn: 'About Page' },
  { id: 'about-vision', defaultSrc: '/images/heart-of-tiger.jpg', label: 'Vision Image', usedIn: 'About Page' },
  { id: 'about-lady-tigers-banner', defaultSrc: '/images/girls-game-action-1.png', label: 'Lady Tigers Banner', usedIn: 'About Page' },
  { id: 'about-practice', defaultSrc: '/images/practice-action.jpg', label: 'Practice Photo', usedIn: 'About Page' },
  { id: 'about-affirmation', defaultSrc: '/images/daily-affirmation.png', label: 'Daily Affirmation', usedIn: 'About Page' },

  // Teams page
  { id: 'teams-tigers-badge', defaultSrc: '/images/sosa-tigers-badge.png', label: 'Tigers Badge', usedIn: 'Teams Page' },
  { id: 'teams-boys-action-1', defaultSrc: '/images/boys-game-action-1.png', label: 'Boys Action Photo 1', usedIn: 'Teams Page' },
  { id: 'teams-boys-action-2', defaultSrc: '/images/boys-game-action-3.png', label: 'Boys Action Photo 2', usedIn: 'Teams Page' },
  { id: 'teams-lady-tigers-badge', defaultSrc: '/images/sosa-lady-tigers.png', label: 'Lady Tigers Badge', usedIn: 'Teams Page' },
  { id: 'teams-girls-action-1', defaultSrc: '/images/girls-game-action-1.png', label: 'Girls Action Photo 1', usedIn: 'Teams Page' },
  { id: 'teams-girls-action-2', defaultSrc: '/images/girls-game-action-2.png', label: 'Girls Action Photo 2', usedIn: 'Teams Page' },

  // Programs page
  { id: 'programs-travel', defaultSrc: '/images/boys-game-action-3.png', label: 'Travel Basketball', usedIn: 'Programs Page' },
  { id: 'programs-training', defaultSrc: '/images/practice-action.jpg', label: 'Skills Training', usedIn: 'Programs Page' },
  { id: 'programs-mentorship', defaultSrc: '/images/player-portrait.png', label: 'Mentorship', usedIn: 'Programs Page' },
  { id: 'programs-community', defaultSrc: '/images/community.jpg', label: 'Community Outreach', usedIn: 'Programs Page' },

  // Donate page
  { id: 'donate-community', defaultSrc: '/images/community.jpg', label: 'Community Image', usedIn: 'Donate Page' },
  { id: 'donate-heart', defaultSrc: '/images/heart-of-tiger.jpg', label: 'Heart of Tiger', usedIn: 'Donate Page' },
];

// ── Manifest ─────────────────────────────────────────────────────────────────

export const DEFAULT_ALBUMS = [
  'Game Action',
  'Practice & Training',
  'Team Photos',
  'Community',
  'Brand & Logos',
];

export interface GalleryImage {
  filename: string;
  alt: string;
  album: string;
  addedAt: string;
}

export interface ImageManifest {
  slotOverrides: Record<string, string>; // slotId -> filename in /data/images/
  galleryImages: GalleryImage[];
  customAlbums?: string[];
}

const IMAGES_DIR = path.join(process.cwd(), 'data', 'images');
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json');

function defaultManifest(): ImageManifest {
  return { slotOverrides: {}, galleryImages: [] };
}

export async function getManifest(): Promise<ImageManifest> {
  // Signal to Next.js that this page should be dynamically rendered
  await connection();
  try {
    const content = await fs.readFile(MANIFEST_PATH, 'utf-8');
    return JSON.parse(content) as ImageManifest;
  } catch {
    return defaultManifest();
  }
}

export async function saveManifest(manifest: ImageManifest): Promise<void> {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
}

export function getImagesDir(): string {
  return IMAGES_DIR;
}

// ── Resolver ─────────────────────────────────────────────────────────────────

export function resolveSlotSrc(slotId: string, manifest: ImageManifest): string {
  const override = manifest.slotOverrides[slotId];
  if (override) {
    return `/api/images/${override}`;
  }
  const slot = IMAGE_SLOTS.find((s) => s.id === slotId);
  return slot?.defaultSrc ?? '/images/s1-logo.png';
}

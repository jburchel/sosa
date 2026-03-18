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

// ── Base Gallery Images (static, shipped with the app) ───────────────────────

export interface BaseGalleryImage {
  src: string;
  alt: string;
  album: string;
}

export const BASE_GALLERY_IMAGES: BaseGalleryImage[] = [
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
  hiddenBaseImages?: string[];   // src paths of hidden base images
  albumOrder?: string[];         // custom album display order
  imageOrder?: string[];         // custom image display order (image keys)
}

// Image keys for ordering: base images use "base:<src>", uploaded use "upload:<filename>"
export function baseImageKey(src: string): string {
  return `base:${src}`;
}

export function uploadImageKey(filename: string): string {
  return `upload:${filename}`;
}

export function parseImageKey(key: string): { type: 'base' | 'upload'; id: string } {
  if (key.startsWith('base:')) return { type: 'base', id: key.slice(5) };
  if (key.startsWith('upload:')) return { type: 'upload', id: key.slice(7) };
  return { type: 'upload', id: key };
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

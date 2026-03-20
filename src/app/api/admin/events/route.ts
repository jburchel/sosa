import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EVENTS_DIR = path.join(process.cwd(), 'data', 'events');
const IMAGES_DIR = path.join(process.cwd(), 'data', 'images');
const SIGNUPS_DIR = path.join(process.cwd(), 'data', 'event-signups');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(EVENTS_DIR, { recursive: true });
    const files = await fs.readdir(EVENTS_DIR);
    const events = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(EVENTS_DIR, file), 'utf-8');
        events.push({ id: file.replace('.json', ''), ...JSON.parse(content) });
      }
    }

    events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const requiresSignup = formData.get('requiresSignup') === 'true';

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Use PNG, JPG, WebP, or GIF.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
    }

    const extMap: Record<string, string> = {
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const ext = extMap[file.type] || '.png';
    const timestamp = Date.now();
    const imageFilename = `event-${timestamp}${ext}`;
    const eventId = `event-${timestamp}`;

    await fs.mkdir(IMAGES_DIR, { recursive: true });
    await fs.mkdir(EVENTS_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(IMAGES_DIR, imageFilename), buffer);

    const eventData = {
      title: title.trim(),
      imageFilename,
      requiresSignup,
      createdAt: new Date().toISOString(),
    };

    await fs.writeFile(
      path.join(EVENTS_DIR, `${eventId}.json`),
      JSON.stringify(eventData, null, 2)
    );

    return NextResponse.json({ success: true, event: { id: eventId, ...eventData } });
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId, confirm } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const eventPath = path.join(EVENTS_DIR, `${eventId}.json`);

    try {
      await fs.access(eventPath);
    } catch {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventContent = await fs.readFile(eventPath, 'utf-8');
    const eventData = JSON.parse(eventContent);

    // Check for signups
    await fs.mkdir(SIGNUPS_DIR, { recursive: true });
    const signupFiles = await fs.readdir(SIGNUPS_DIR);
    const eventSignups = signupFiles.filter(
      (f) => f.endsWith('.json') && f.includes(`-${eventId}-`)
    );

    if (eventSignups.length > 0 && !confirm) {
      return NextResponse.json({
        warning: true,
        signupCount: eventSignups.length,
        message: `This event has ${eventSignups.length} signup(s). Send confirm: true to delete.`,
      });
    }

    // Delete event JSON
    await fs.unlink(eventPath);

    // Delete event image
    try {
      await fs.unlink(path.join(IMAGES_DIR, eventData.imageFilename));
    } catch { /* file may not exist */ }

    // Delete associated signups
    for (const signupFile of eventSignups) {
      try {
        await fs.unlink(path.join(SIGNUPS_DIR, signupFile));
      } catch { /* file may not exist */ }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

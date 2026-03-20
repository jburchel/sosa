import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EVENTS_DIR = path.join(process.cwd(), 'data', 'events');
const SIGNUPS_DIR = path.join(process.cwd(), 'data', 'event-signups');

const VALID_SHIRT_SIZES = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL', 'A2XL'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name, age, tshirtSize } = body;

    // Validate required fields
    if (!eventId || !name || !age || !tshirtSize) {
      return NextResponse.json({ error: 'All fields are required (eventId, name, age, tshirtSize)' }, { status: 400 });
    }

    if (!VALID_SHIRT_SIZES.includes(tshirtSize)) {
      return NextResponse.json({ error: `Invalid t-shirt size. Must be one of: ${VALID_SHIRT_SIZES.join(', ')}` }, { status: 400 });
    }

    // Verify event exists and requires signup
    const eventPath = path.join(EVENTS_DIR, `${eventId}.json`);
    try {
      const eventContent = await fs.readFile(eventPath, 'utf-8');
      const eventData = JSON.parse(eventContent);
      if (!eventData.requiresSignup) {
        return NextResponse.json({ error: 'This event does not accept sign-ups' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const sanitizedName = String(name).replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 30);
    const timestamp = Date.now();
    const filename = `signup-${timestamp}-${eventId}-${sanitizedName}.json`;

    const submission = {
      eventId,
      name: String(name).trim(),
      age: Number(age),
      tshirtSize,
      submittedAt: new Date().toISOString(),
    };

    await fs.mkdir(SIGNUPS_DIR, { recursive: true });
    await fs.writeFile(path.join(SIGNUPS_DIR, filename), JSON.stringify(submission, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event signup error:', error);
    return NextResponse.json({ error: 'Failed to process signup' }, { status: 500 });
  }
}

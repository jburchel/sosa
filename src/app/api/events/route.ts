import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const EVENTS_DIR = path.join(process.cwd(), 'data', 'events');

export async function GET() {
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

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SPONSORS_DIR = path.join(process.cwd(), 'data', 'sponsors');

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(SPONSORS_DIR, { recursive: true });
    const files = await fs.readdir(SPONSORS_DIR);
    const sponsors = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(SPONSORS_DIR, file), 'utf-8');
        sponsors.push({ id: file, ...JSON.parse(content) });
      }
    }

    sponsors.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ sponsors });
  } catch (error) {
    console.error('Error reading sponsors:', error);
    return NextResponse.json({ sponsors: [] });
  }
}

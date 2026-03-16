import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const VOLUNTEERS_DIR = path.join(process.cwd(), 'data', 'volunteers');

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(VOLUNTEERS_DIR, { recursive: true });
    const files = await fs.readdir(VOLUNTEERS_DIR);
    const volunteers = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(VOLUNTEERS_DIR, file), 'utf-8');
        volunteers.push({ id: file, ...JSON.parse(content) });
      }
    }

    // Sort newest first
    volunteers.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ volunteers });
  } catch (error) {
    console.error('Error reading volunteers:', error);
    return NextResponse.json({ volunteers: [] });
  }
}

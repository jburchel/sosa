import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const WAIVERS_DIR = path.join(process.cwd(), 'data', 'waivers');

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(WAIVERS_DIR, { recursive: true });
    const files = await fs.readdir(WAIVERS_DIR);
    const waivers = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(WAIVERS_DIR, file), 'utf-8');
        waivers.push({ id: file, ...JSON.parse(content) });
      }
    }

    // Sort newest first
    waivers.sort((a, b) => new Date(b.signedAt).getTime() - new Date(a.signedAt).getTime());

    return NextResponse.json({ waivers });
  } catch (error) {
    console.error('Error reading waivers:', error);
    return NextResponse.json({ waivers: [] });
  }
}

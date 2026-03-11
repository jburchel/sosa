import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONTACTS_DIR = path.join(process.cwd(), 'data', 'contacts');

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(CONTACTS_DIR, { recursive: true });
    const files = await fs.readdir(CONTACTS_DIR);
    const contacts = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(CONTACTS_DIR, file), 'utf-8');
        contacts.push({ id: file, ...JSON.parse(content) });
      }
    }

    // Sort newest first
    contacts.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error reading contacts:', error);
    return NextResponse.json({ contacts: [] });
  }
}

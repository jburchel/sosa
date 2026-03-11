import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CONTACTS_DIR = path.join(process.cwd(), 'data', 'contacts');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ['name', 'email', 'message'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    const submission = { ...body, submittedAt: new Date().toISOString() };
    await fs.mkdir(CONTACTS_DIR, { recursive: true });
    const filename = `contact-${Date.now()}.json`;
    await fs.writeFile(path.join(CONTACTS_DIR, filename), JSON.stringify(submission, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}

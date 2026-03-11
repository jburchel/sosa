import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendWaiverNotification } from '@/lib/email';

const WAIVERS_DIR = path.join(process.cwd(), 'data', 'waivers');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = [
      'playerName',
      'playerDob',
      'parentName',
      'parentEmail',
      'parentPhone',
      'emergencyName',
      'emergencyPhone',
      'signature',
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    if (
      body.signature.toLowerCase().trim() !==
      body.parentName.toLowerCase().trim()
    ) {
      return NextResponse.json(
        { error: 'Signature must match parent/guardian name' },
        { status: 400 }
      );
    }
    const waiver = {
      ...body,
      signedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };
    await fs.mkdir(WAIVERS_DIR, { recursive: true });
    const filename = `waiver-${Date.now()}-${body.playerName
      .replace(/\s+/g, '-')
      .toLowerCase()}.json`;
    await fs.writeFile(
      path.join(WAIVERS_DIR, filename),
      JSON.stringify(waiver, null, 2)
    );
    sendWaiverNotification(waiver);
    return NextResponse.json({ success: true, signedAt: waiver.signedAt });
  } catch (error) {
    console.error('Waiver submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process waiver' },
      { status: 500 }
    );
  }
}

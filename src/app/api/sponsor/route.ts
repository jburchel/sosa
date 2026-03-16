import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendSponsorNotification } from '@/lib/email';

const SPONSORS_DIR = path.join(process.cwd(), 'data', 'sponsors');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ['businessName', 'contactName', 'phone', 'email', 'signature'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const application = {
      ...body,
      submittedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    await fs.mkdir(SPONSORS_DIR, { recursive: true });
    const filename = `sponsor-${Date.now()}-${body.businessName
      .replace(/\s+/g, '-')
      .toLowerCase()}.json`;
    await fs.writeFile(
      path.join(SPONSORS_DIR, filename),
      JSON.stringify(application, null, 2)
    );

    sendSponsorNotification(application);

    return NextResponse.json({ success: true, submittedAt: application.submittedAt });
  } catch (error) {
    console.error('Sponsor application error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

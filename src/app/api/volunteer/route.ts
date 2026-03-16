import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendVolunteerNotification } from '@/lib/email';

const VOLUNTEERS_DIR = path.join(process.cwd(), 'data', 'volunteers');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = [
      'fullName',
      'phone',
      'email',
      'address',
      'cityStateZip',
      'dateOfBirth',
      'whyVolunteer',
      'emergencyName',
      'emergencyPhone',
      'emergencyRelationship',
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

    if (!body.backgroundCheckConsent || !body.codeOfConductConsent || !body.mediaReleaseConsent) {
      return NextResponse.json(
        { error: 'All agreements must be accepted' },
        { status: 400 }
      );
    }

    const application = {
      ...body,
      submittedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    await fs.mkdir(VOLUNTEERS_DIR, { recursive: true });
    const filename = `volunteer-${Date.now()}-${body.fullName
      .replace(/\s+/g, '-')
      .toLowerCase()}.json`;
    await fs.writeFile(
      path.join(VOLUNTEERS_DIR, filename),
      JSON.stringify(application, null, 2)
    );

    sendVolunteerNotification(application);

    return NextResponse.json({ success: true, submittedAt: application.submittedAt });
  } catch (error) {
    console.error('Volunteer application error:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

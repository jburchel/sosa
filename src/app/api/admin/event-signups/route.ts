import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SIGNUPS_DIR = path.join(process.cwd(), 'data', 'event-signups');

function isAuthed(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fs.mkdir(SIGNUPS_DIR, { recursive: true });
    const files = await fs.readdir(SIGNUPS_DIR);
    const signups = [];

    const { searchParams } = new URL(request.url);
    const eventIdFilter = searchParams.get('eventId');
    const format = searchParams.get('format');

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      if (eventIdFilter && !file.includes(`-${eventIdFilter}-`)) continue;

      const content = await fs.readFile(path.join(SIGNUPS_DIR, file), 'utf-8');
      signups.push({ id: file, ...JSON.parse(content) });
    }

    signups.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    if (format === 'csv') {
      const header = 'Name,Age,T-Shirt Size,Submitted At';
      const rows = signups.map((s) =>
        `"${String(s.name).replace(/"/g, '""')}",${s.age},"${s.tshirtSize}","${s.submittedAt}"`
      );
      const csv = [header, ...rows].join('\n');

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="event-signups${eventIdFilter ? `-${eventIdFilter}` : ''}.csv"`,
        },
      });
    }

    return NextResponse.json({ signups });
  } catch (error) {
    console.error('Error reading signups:', error);
    return NextResponse.json({ signups: [] });
  }
}

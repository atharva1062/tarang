import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_FILE = path.join(process.cwd(), 'data', 'team.json');
const SESSION_COOKIE = 'tarang_admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === 'authenticated';
}

export async function GET() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  return NextResponse.json(data);
}

import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const data: any[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const index = data.findIndex(m => m.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[index] = { ...data[index], ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  revalidatePath('/');
  return NextResponse.json(data[index]);
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getStore, setStore } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'tarang_admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === 'authenticated';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type) {
    const data = await getStore(type);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  // Return all content
  const [hero, about, site, journey, events] = await Promise.all([
    getStore('hero'),
    getStore('about'),
    getStore('site'),
    getStore('journey'),
    getStore('events'),
  ]);

  return NextResponse.json({
    hero,
    about,
    site,
    journey,
    events,
  });
}

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, data } = await req.json();
  if (!type || !data) {
    return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
  }

  const allowedTypes = ['hero', 'about', 'site', 'journey', 'events'];
  if (!allowedTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  await setStore(type, data);
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

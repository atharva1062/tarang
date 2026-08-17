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

export async function GET() {
  const data = (await getStore('team')) || [];
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const data: any[] = (await getStore('team')) || [];
  const index = data.findIndex(m => m.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data[index] = { ...data[index], ...body };
  await setStore('team', data);
  revalidatePath('/');
  return NextResponse.json(data[index]);
}

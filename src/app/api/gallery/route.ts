import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getStore, setStore, deleteMedia } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'tarang_admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === 'authenticated';
}

export async function GET() {
  const data = (await getStore('gallery')) || [];
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const data: any[] = (await getStore('gallery')) || [];
  const item = data.find(g => g.id === id);
  if (item && item.src) {
    await deleteMedia(item.src);
  }
  const updated = data.filter(g => g.id !== id);
  await setStore('gallery', updated);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

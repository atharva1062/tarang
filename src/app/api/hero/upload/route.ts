import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getStore, setStore, uploadMedia, deleteMedia } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'tarang_admin_session';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file     = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate type
  if (!file.type.startsWith('video/')) {
    return NextResponse.json({ error: 'Only videos allowed' }, { status: 400 });
  }

  // Upload media
  const url = await uploadMedia(file, 'hero-video');

  // Update hero.json
  const data = (await getStore('hero')) || {};
  
  // Delete old custom video if exists
  if (data.videoBg) {
    await deleteMedia(data.videoBg);
  }

  data.videoBg = url;
  await setStore('hero', data);

  revalidatePath('/');
  return NextResponse.json({ success: true, videoBg: data.videoBg });
}

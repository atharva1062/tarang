import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getStore, setStore, uploadMedia } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'tarang_admin_session';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get(SESSION_COOKIE)?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const files    = formData.getAll('files') as File[];
  const caption  = (formData.get('caption')  as string) || '';
  const category = (formData.get('category') as string) || 'General';
  const event    = (formData.get('event')    as string) || '';

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const data: any[] = (await getStore('gallery')) || [];
  const added: any[] = [];

  for (const file of files) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) continue;
    const url = await uploadMedia(file, 'gallery');

    const item = {
      id:       `g-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      src:      url,
      alt:      caption || file.name,
      category,
      event,
      caption,
    };
    data.push(item);
    added.push(item);
  }

  await setStore('gallery', data);
  revalidatePath('/');
  return NextResponse.json({ added });
}

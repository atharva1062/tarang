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
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only images allowed' }, { status: 400 });
  }

  // Upload media
  const url = await uploadMedia(file, 'logo');

  // Update site.json
  const data = (await getStore('site')) || {};
  
  // Delete old custom logo if exists
  if (data.logo) {
    await deleteMedia(data.logo);
  }

  data.logo = url;
  await setStore('site', data);

  revalidatePath('/');
  return NextResponse.json({ success: true, logo: data.logo });
}

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
  const memberId = formData.get('memberId') as string;

  if (!file || !memberId) {
    return NextResponse.json({ error: 'Missing file or memberId' }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only images allowed' }, { status: 400 });
  }

  // Upload media
  const url = await uploadMedia(file, `team-${memberId}`);

  // Update team.json
  const data: any[] = (await getStore('team')) || [];
  const index = data.findIndex(m => m.id === memberId);
  if (index !== -1) {
    // Delete old photo if exists
    if (data[index].photo) {
      await deleteMedia(data[index].photo);
    }
    data[index].photo = url;
    await setStore('team', data);
  }

  revalidatePath('/');
  return NextResponse.json({ url });
}

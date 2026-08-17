import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');
const DATA_FILE  = path.join(process.cwd(), 'data', 'gallery.json');
const SESSION_COOKIE = 'tarang_admin_session';

import { revalidatePath } from 'next/cache';

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

  const data: any[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const added: any[] = [];

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const ext      = file.name.split('.').pop();
    const filename = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const buffer   = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const item = {
      id:       `g-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      src:      `/uploads/gallery/${filename}`,
      alt:      caption || file.name,
      category,
      event,
      caption,
    };
    data.push(item);
    added.push(item);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  revalidatePath('/');
  return NextResponse.json({ added });
}

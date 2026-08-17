import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'gallery.json');
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

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const data: any[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const item = data.find(g => g.id === id);
  if (item) {
    const imgPath = path.join(process.cwd(), 'public', item.src);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  const updated = data.filter(g => g.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

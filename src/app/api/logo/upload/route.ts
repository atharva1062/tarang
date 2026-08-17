import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const DATA_FILE  = path.join(process.cwd(), 'data', 'site.json');
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

  // Ensure uploads folder exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Save file
  const ext      = file.name.split('.').pop();
  const filename = `logo-${Date.now()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const buffer   = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  // Update site.json
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  
  // Delete old custom logo if exists
  if (data.logo) {
    const oldPath = path.join(process.cwd(), 'public', data.logo);
    if (fs.existsSync(oldPath)) {
      try { fs.unlinkSync(oldPath); } catch (e) {}
    }
  }

  data.logo = `/uploads/${filename}`;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  revalidatePath('/');
  return NextResponse.json({ success: true, logo: data.logo });
}

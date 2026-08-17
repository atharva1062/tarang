import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'team');
const DATA_FILE  = path.join(process.cwd(), 'data', 'team.json');
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

  // Save file
  const ext      = file.name.split('.').pop();
  const filename = `${memberId}-${Date.now()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  const buffer   = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);

  // Update team.json
  const data: any[] = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const index = data.findIndex(m => m.id === memberId);
  if (index !== -1) {
    // Delete old photo if exists
    if (data[index].photo) {
      const oldPath = path.join(process.cwd(), 'public', data[index].photo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    data[index].photo = `/uploads/team/${filename}`;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }

  return NextResponse.json({ url: `/uploads/team/${filename}` });
}

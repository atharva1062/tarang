import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'tarang_admin_session';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === 'authenticated';
}

function getFilePath(file: string) {
  return path.join(process.cwd(), 'data', `${file}.json`);
}

function readJSON(file: string) {
  const filePath = getFilePath(file);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(file: string, data: any) {
  const filePath = getFilePath(file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  if (type) {
    const data = readJSON(type);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  // Return all content
  return NextResponse.json({
    hero: readJSON('hero'),
    about: readJSON('about'),
    site: readJSON('site'),
    journey: readJSON('journey'),
    events: readJSON('events'),
  });
}

import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type, data } = await req.json();
  if (!type || !data) {
    return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
  }

  const allowedTypes = ['hero', 'about', 'site', 'journey', 'events'];
  if (!allowedTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  writeJSON(type, data);
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}


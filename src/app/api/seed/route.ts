import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), 'data');
const KEYS = ['hero', 'about', 'site', 'journey', 'events', 'team', 'gallery'];

export async function POST() {
  if (!process.env.KV_REST_API_URL) {
    return NextResponse.json({ error: 'KV not configured' }, { status: 400 });
  }

  const results: Record<string, string> = {};

  for (const key of KEYS) {
    const filePath = path.join(DATA_DIR, `${key}.json`);
    if (!fs.existsSync(filePath)) {
      results[key] = 'skipped (file not found)';
      continue;
    }
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      await kv.set(key, data);
      results[key] = 'seeded';
    } catch (e: any) {
      results[key] = `error: ${e.message}`;
    }
  }

  return NextResponse.json({ success: true, results });
}

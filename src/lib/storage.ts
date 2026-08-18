import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';
import { put, del } from '@vercel/blob';

// Determine if we should use Vercel Storage
const useKV = Boolean(process.env.KV_REST_API_URL);
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function getStore(key: string) {
  if (useKV) {
    try {
      const kvData = await kv.get(key);
      if (kvData !== null && kvData !== undefined) {
        return kvData;
      }
      // KV returned null — try to seed from local JSON file
      const localData = readLocalJSON(key);
      if (localData !== null) {
        console.log(`KV empty for "${key}", seeding from local JSON...`);
        try { await kv.set(key, localData); } catch (e) { console.error(`KV seed error for ${key}:`, e); }
        return localData;
      }
      return null;
    } catch (e) {
      console.error(`KV GET Error for ${key}:`, e);
      // On KV error, fall back to local JSON
      return readLocalJSON(key);
    }
  }

  // No KV — use local JSON
  return readLocalJSON(key);
}

function readLocalJSON(key: string) {
  const filePath = path.join(process.cwd(), 'data', `${key}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return null;
  }
}

export async function setStore(key: string, data: any) {
  if (useKV) {
    try {
      await kv.set(key, data);
      return true;
    } catch (e) {
      console.error(`KV SET Error for ${key}:`, e);
      return false;
    }
  }

  // Fallback to local JSON
  const filePath = path.join(process.cwd(), 'data', `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return true;
}

export async function uploadMedia(file: File, prefix: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  if (useBlob) {
    try {
      const blob = await put(filename, file, { access: 'public' });
      return blob.url;
    } catch (e) {
      console.error('Blob Upload Error:', e);
      throw e;
    }
  }

  // Fallback to local fs
  const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const filepath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function deleteMedia(url: string) {
  if (!url) return;
  if (useBlob && url.startsWith('http')) {
    try {
      await del(url);
    } catch (e) {
      console.error('Blob Delete Error:', e);
    }
  } else if (!useBlob && url.startsWith('/uploads/')) {
    const oldPath = path.join(process.cwd(), 'public', url);
    if (fs.existsSync(oldPath)) {
      try { fs.unlinkSync(oldPath); } catch (e) {}
    }
  }
}

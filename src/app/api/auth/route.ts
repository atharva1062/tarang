import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TarangDIT@2026';
const SESSION_COOKIE = 'tarang_admin_session';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, 'authenticated', {
      httpOnly: true,
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
      sameSite: 'lax',
    });
    return res;
  }
  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return NextResponse.json({ authenticated: session?.value === 'authenticated' });
}

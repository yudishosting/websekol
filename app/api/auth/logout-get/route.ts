import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  cookies().delete('auth_token');
  return NextResponse.redirect(new URL('/login', 'http://localhost:3000'), { status: 302 });
}

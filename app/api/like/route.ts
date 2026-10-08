import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();

    const res = await query(
      `UPDATE github_roasts
       SET likes = likes + 1
       WHERE username = $1
       RETURNING likes`,
      [cleanUsername]
    );

    if (res.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: res[0].likes });
  } catch (error: any) {
    console.error('[GitVibeAI] Error in /api/like:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

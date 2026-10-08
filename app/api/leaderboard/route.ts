import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const roasts = await query(
      `SELECT id, username, name, avatar_url, vibe_type, stats, likes, created_at
       FROM github_roasts
       ORDER BY likes DESC, id DESC
       LIMIT 12`
    );

    const formattedRoasts = roasts.map(row => ({
      id: row.id,
      username: row.username,
      name: row.name,
      avatarUrl: row.avatar_url,
      vibeType: row.vibe_type,
      stats: typeof row.stats === 'string' ? JSON.parse(row.stats) : row.stats,
      likes: row.likes,
      createdAt: row.created_at
    }));

    return NextResponse.json({ roasts: formattedRoasts });
  } catch (error: any) {
    console.error('[GitVibeAI] Error in /api/leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

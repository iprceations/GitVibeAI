import { NextRequest, NextResponse } from 'next/server';
import { getRecentPaginated } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const search = searchParams.get('search') || searchParams.get('q') || '';

    const result = await getRecentPaginated(page, limit, search);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[GitVibeAI] Error in /api/recent:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

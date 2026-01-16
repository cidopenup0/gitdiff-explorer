import { NextResponse } from 'next/server';
import { getCommits, resolveRepoPath } from '@/lib/git';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoPath = searchParams.get('repoPath');
  const limit = Number(searchParams.get('limit') || '10');
  const skip = Number(searchParams.get('skip') || '0');
  if (!repoPath) return NextResponse.json({ error: 'Missing repoPath' }, { status: 400 });
  try {
    const resolved = resolveRepoPath(repoPath);
    const commits = await getCommits(resolved, limit, skip);
    return NextResponse.json(commits);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

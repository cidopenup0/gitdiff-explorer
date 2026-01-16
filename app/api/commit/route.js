import { NextResponse } from 'next/server';
import { getCommitDetails, resolveRepoPath } from '@/lib/git';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoPath = searchParams.get('repoPath');
  const hash = searchParams.get('hash');
  if (!repoPath || !hash) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  try {
    const resolved = resolveRepoPath(repoPath);
    const commit = await getCommitDetails(resolved, hash);
    if (commit.diffTooLarge) {
      return NextResponse.json({ ...commit, diff: null, diffTooLarge: true });
    }
    return NextResponse.json(commit);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

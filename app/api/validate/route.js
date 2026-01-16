import { NextResponse } from 'next/server';
import { resolveRepoPath, validateWorktree } from '@/lib/git';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoPath = searchParams.get('repoPath');
  if (!repoPath) {
    return NextResponse.json({ error: 'Missing repoPath' }, { status: 400 });
  }
  try {
    const resolved = resolveRepoPath(repoPath);
    await validateWorktree(resolved);
    return NextResponse.json({ ok: true, repoPath: resolved });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

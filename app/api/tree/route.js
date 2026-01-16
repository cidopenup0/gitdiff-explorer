import { NextResponse } from 'next/server';
import { getTree, resolveRepoPath } from '@/lib/git';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoPath = searchParams.get('repoPath');
  const hash = searchParams.get('hash');
  const treePath = searchParams.get('path') || '';
  if (!repoPath || !hash) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  try {
    const resolved = resolveRepoPath(repoPath);
    const entries = await getTree(resolved, hash, treePath);
    return NextResponse.json(entries);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

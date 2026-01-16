import { NextResponse } from 'next/server';
import { getBlob, resolveRepoPath } from '@/lib/git';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoPath = searchParams.get('repoPath');
  const hash = searchParams.get('hash');
  const filePath = searchParams.get('path');
  if (!repoPath || !hash || !filePath) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  try {
    const resolved = resolveRepoPath(repoPath);
    const blob = await getBlob(resolved, hash, filePath);
    return NextResponse.json(blob);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

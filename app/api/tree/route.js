import { NextResponse } from 'next/server';
import { getTree, resolveRepoPath } from '@/lib/git';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoPath = searchParams.get('repoPath');
  const hash = searchParams.get('hash');
  const treePath = searchParams.get('path') || '';
  
  console.log('[Tree API] Request:', { repoPath, hash, treePath });
  
  if (!repoPath || !hash) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  try {
    const resolved = resolveRepoPath(repoPath);
    console.log('[Tree API] Resolved repo path:', resolved);
    const entries = await getTree(resolved, hash, treePath);
    console.log('[Tree API] Retrieved entries:', entries.length);
    return NextResponse.json(entries);
  } catch (err) {
    console.error('[Tree API] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

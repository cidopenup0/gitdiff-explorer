import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const MAX_DIFF_BYTES = 2 * 1024 * 1024;
const MAX_BLOB_BYTES = 1 * 1024 * 1024;
const cache = new Map();
const CACHE_LIMIT = 50;

function setCache(key, value) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);
  if (cache.size > CACHE_LIMIT) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
}

function getCache(key) {
  if (!cache.has(key)) return undefined;
  const value = cache.get(key);
  cache.delete(key);
  cache.set(key, value);
  return value;
}

export function validateHash(hash) {
  if (!hash || !/^[a-f0-9]{7,40}$/i.test(hash)) {
    throw new Error('Invalid commit hash');
  }
}

export function sanitizePath(inputPath) {
  if (!inputPath) return '';
  if (inputPath.includes('..')) throw new Error('Invalid path');
  if (/^[\\/]/.test(inputPath)) throw new Error('Path must be relative');
  if (/^[A-Za-z]:/.test(inputPath)) throw new Error('Absolute paths are not allowed');
  return inputPath;
}

export function resolveRepoPath(repoPath) {
  if (!repoPath || typeof repoPath !== 'string') throw new Error('Missing repoPath');
  const normalized = path.resolve(repoPath);
  const gitDir = path.join(normalized, '.git');
  if (!fs.existsSync(normalized) || !fs.statSync(normalized).isDirectory()) {
    throw new Error('Repository path does not exist');
  }
  if (!fs.existsSync(gitDir)) {
    throw new Error('No .git directory found');
  }
  return normalized;
}

function runGit(args, repoPath, { maxBuffer = MAX_DIFF_BYTES, asBuffer = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd: repoPath, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    let total = 0;
    const chunks = [];

    child.stdout.on('data', (chunk) => {
      total += chunk.length;
      if (total > maxBuffer) {
        child.kill();
        const err = new Error('Response too large');
        err.code = 'SIZE_EXCEEDED';
        reject(err);
        return;
      }
      chunks.push(chunk);
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || 'Git command failed'));
      } else {
        resolve(asBuffer ? Buffer.concat(chunks) : Buffer.concat(chunks).toString('utf8'));
      }
    });
  });
}

export async function validateWorktree(repoPath) {
  const resolved = resolveRepoPath(repoPath);
  await runGit(['rev-parse', '--is-inside-work-tree'], resolved, { maxBuffer: 1024 });
  return resolved;
}

export async function getCommits(repoPath, limit = 10, skip = 0) {
  const key = `commits:${repoPath}:${limit}:${skip}`;
  const cached = getCache(key);
  if (cached) return cached;
  const resolved = resolveRepoPath(repoPath);
  const output = await runGit(
    ['log', '--date=iso', `--pretty=format:%H|%an|%ae|%ad|%s`, '-n', String(limit), `--skip=${skip}`],
    resolved,
    { maxBuffer: 512 * 1024 }
  );
  const commits = output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, authorName, authorEmail, date, message] = line.split('|');
      return {
        hash,
        shortHash: hash.slice(0, 7),
        authorName,
        authorEmail,
        date,
        message
      };
    });
  setCache(key, commits);
  return commits;
}

export async function getCommitDetails(repoPath, hash) {
  validateHash(hash);
  const key = `commit:${repoPath}:${hash}`;
  const cached = getCache(key);
  if (cached) return cached;
  const resolved = resolveRepoPath(repoPath);
  const meta = await runGit(['show', '-s', '--date=iso', '--format=%H|%an|%ae|%ad|%s', hash], resolved, {
    maxBuffer: 64 * 1024
  });
  const [fullHash, authorName, authorEmail, date, subject] = meta.trim().split('|');
  const changedRaw = await runGit(['show', '--name-status', '--format=', hash], resolved, { maxBuffer: 256 * 1024 });
  const changedFiles = changedRaw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, ...rest] = line.trim().split(/\s+/);
      return { status, path: rest.join(' ') };
    });
  let diff;
  try {
    diff = await runGit(['show', '--format=', hash], resolved, { maxBuffer: MAX_DIFF_BYTES });
  } catch (err) {
    if (err.code === 'SIZE_EXCEEDED') {
      diff = null;
    } else {
      throw err;
    }
  }
  const result = { hash: fullHash, authorName, authorEmail, date, subject, changedFiles, diff, diffTooLarge: diff === null };
  setCache(key, result);
  return result;
}

export async function getTree(repoPath, hash, treePath = '') {
  validateHash(hash);
  const safePath = sanitizePath(treePath);
  const key = `tree:${repoPath}:${hash}:${safePath}`;
  const cached = getCache(key);
  if (cached) return cached;
  const resolved = resolveRepoPath(repoPath);
  const args = safePath ? ['ls-tree', hash, safePath] : ['ls-tree', hash];
  const output = await runGit(args, resolved, { maxBuffer: 256 * 1024 });
  const entries = output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const type = parts[1];
      const name = parts[3];
      const fullPath = safePath ? `${safePath}/${name}` : name;
      return { type, name, path: fullPath };
    });
  setCache(key, entries);
  return entries;
}

function detectBinary(buf) {
  const sample = buf.slice(0, 8000);
  for (let i = 0; i < sample.length; i += 1) {
    if (sample[i] === 0) return true;
  }
  return false;
}

export async function getBlob(repoPath, hash, filePath) {
  validateHash(hash);
  const safePath = sanitizePath(filePath);
  const resolved = resolveRepoPath(repoPath);
  const sizeOutput = await runGit(['cat-file', '-s', `${hash}:${safePath}`], resolved, { maxBuffer: 64 * 1024 });
  const size = Number(sizeOutput.trim());
  if (Number.isNaN(size)) throw new Error('Unable to determine file size');
  if (size > MAX_BLOB_BYTES) {
    return { tooLarge: true, size };
  }
  const buffer = await runGit(['show', `${hash}:${safePath}`], resolved, { maxBuffer: MAX_BLOB_BYTES, asBuffer: true });
  if (detectBinary(buffer)) {
    return { isBinary: true, size };
  }
  const content = buffer.toString('utf8');
  return { content, size };
}

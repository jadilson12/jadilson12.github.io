import path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// In-memory virtual filesystem used to back the mocked `fs` module. Keys are
// absolute paths (as produced by Node's `path` module on this platform).
type VFile = { type: 'dir'; children: string[] } | { type: 'file'; content: string };

let vfs: Map<string, VFile>;

function resetVfs() {
  vfs = new Map();
}

function addDir(dirPath: string) {
  if (vfs.has(dirPath)) return;
  vfs.set(dirPath, { type: 'dir', children: [] });
  const parent = path.dirname(dirPath);
  if (parent !== dirPath) {
    addDir(parent);
    const parentEntry = vfs.get(parent);
    if (parentEntry && parentEntry.type === 'dir' && !parentEntry.children.includes(path.basename(dirPath))) {
      parentEntry.children.push(path.basename(dirPath));
    }
  }
}

function addFile(filePath: string, content: string) {
  const dir = path.dirname(filePath);
  addDir(dir);
  vfs.set(filePath, { type: 'file', content });
  const dirEntry = vfs.get(dir);
  if (dirEntry && dirEntry.type === 'dir') {
    const base = path.basename(filePath);
    if (!dirEntry.children.includes(base)) dirEntry.children.push(base);
  }
}

vi.mock('fs', () => {
  return {
    default: {
      existsSync: (p: string) => vfs.has(p),
      readdirSync: (p: string) => {
        const entry = vfs.get(p);
        if (!entry || entry.type !== 'dir') throw new Error(`ENOENT: not a directory: ${p}`);
        return entry.children;
      },
      statSync: (p: string) => {
        const entry = vfs.get(p);
        if (!entry) throw new Error(`ENOENT: no such file or directory: ${p}`);
        return { isDirectory: () => entry.type === 'dir' };
      },
      readFileSync: (p: string) => {
        const entry = vfs.get(p);
        if (!entry || entry.type !== 'file') throw new Error(`ENOENT: no such file: ${p}`);
        return entry.content;
      },
    },
  };
});

const postsDirectory = path.join(process.cwd(), 'content/blog');

describe('lib/posts', () => {
  beforeEach(() => {
    resetVfs();
    vi.resetModules();
  });

  describe('getSortedPostsData', () => {
    it('returns an empty array when the posts directory does not exist', async () => {
      const { getSortedPostsData } = await import('./posts');
      expect(getSortedPostsData()).toEqual([]);
    });

    it('recursively collects markdown/mdx posts, ignoring other file types, and sorts by date desc', async () => {
      addDir(postsDirectory);
      addFile(
        path.join(postsDirectory, '2024', '01', '10', 'older-post.md'),
        '---\ntitle: Older Post\ndate: "2024-01-10"\n---\nOlder body'
      );
      addFile(
        path.join(postsDirectory, '2025', '02', '20', 'newer-post.mdx'),
        '---\ntitle: Newer Post\ndate: "2025-02-20"\n---\nNewer body'
      );
      addFile(
        path.join(postsDirectory, '2025', '06', '01', 'newest-post.mdx'),
        '---\ntitle: Newest Post\ndate: "2025-06-01"\n---\nNewest body'
      );
      // Non-post file that must be ignored by getAllFiles.
      addFile(path.join(postsDirectory, '2025', '02', '20', 'notes.txt'), 'ignore me');

      const { getSortedPostsData } = await import('./posts');
      const posts = getSortedPostsData();

      expect(posts).toHaveLength(3);
      expect(posts.map((p) => p.slug)).toEqual([
        '2025-06-01-newest-post',
        '2025-02-20-newer-post',
        '2024-01-10-older-post',
      ]);
      expect(posts[0].title).toBe('Newest Post');
      expect(posts[0].id).toBe(posts[0].slug);
      // Listing view should not eagerly include the markdown body content.
      expect(posts[0].content).toBeUndefined();
    });

    it('exercises both branches of the date comparator regardless of on-disk traversal order', async () => {
      addDir(postsDirectory);
      // Both files live in the same directory, and the mock's readdirSync
      // preserves insertion order, so the newer post is discovered *before*
      // the older one. That forces the sort comparator to be invoked with an
      // already-newer "sorted" element compared against an older candidate
      // (hitting the `a.date < b.date` === true branch), complementing the
      // ascending-traversal case above (which only ever hits the false branch).
      addFile(
        path.join(postsDirectory, 'same-dir', 'a-newer.md'),
        '---\ntitle: A Newer\ndate: "2025-01-01"\n---\nBody'
      );
      addFile(
        path.join(postsDirectory, 'same-dir', 'b-older.md'),
        '---\ntitle: B Older\ndate: "2020-01-01"\n---\nBody'
      );

      const { getSortedPostsData } = await import('./posts');
      const posts = getSortedPostsData();

      expect(posts.map((p) => p.title)).toEqual(['A Newer', 'B Older']);
    });
  });

  describe('getPostData', () => {
    it('loads a post whose slug matches the YYYY-MM-DD-filename convention as .md', async () => {
      addDir(postsDirectory);
      addFile(
        path.join(postsDirectory, '2024', '01', '10', 'hello-world.md'),
        '---\ntitle: Hello World\ndate: "2024-01-10"\n---\nBody text'
      );

      const { getPostData } = await import('./posts');
      const post = getPostData('2024-01-10-hello-world');

      expect(post.title).toBe('Hello World');
      expect(post.content?.trim()).toBe('Body text');
      expect(post.id).toBe('2024-01-10-hello-world');
    });

    it('falls back to .mdx when .md is not present for the dated path', async () => {
      addDir(postsDirectory);
      addFile(
        path.join(postsDirectory, '2024', '01', '10', 'hello-world.mdx'),
        '---\ntitle: Hello World MDX\ndate: "2024-01-10"\n---\nMDX body'
      );

      const { getPostData } = await import('./posts');
      const post = getPostData('2024-01-10-hello-world');

      expect(post.title).toBe('Hello World MDX');
    });

    it('falls back to scanning all files when the slug does not match the dated pattern', async () => {
      addDir(postsDirectory);
      addFile(
        path.join(postsDirectory, 'misc', 'evergreen.md'),
        '---\ntitle: Evergreen\ndate: "2023-05-01"\n---\nEvergreen body'
      );

      const { getPostData } = await import('./posts');
      const post = getPostData('misc-evergreen');

      expect(post.title).toBe('Evergreen');
    });

    it('falls back to scanning all files when the dated path pattern matches but no file exists there', async () => {
      addDir(postsDirectory);
      // The slug matches the YYYY-MM-DD-filename convention, so getPostData
      // computes a possiblePath of content/blog/2024/01/11/hello-world, but the
      // file actually sits flat at the posts root. Both the .md and .mdx
      // existsSync checks against possiblePath must fail here, forcing the
      // fallback full-tree scan (which matches by flattened slug instead).
      addFile(
        path.join(postsDirectory, '2024-01-11-hello-world.md'),
        '---\ntitle: Hello World Later\ndate: "2024-01-11"\n---\nBody'
      );

      const { getPostData } = await import('./posts');
      const post = getPostData('2024-01-11-hello-world');

      expect(post.title).toBe('Hello World Later');
    });

    it('throws when no post matches the slug even after the fallback scan', async () => {
      addDir(postsDirectory);
      addFile(
        path.join(postsDirectory, '2024', '01', '10', 'hello-world.md'),
        '---\ntitle: Hello World\ndate: "2024-01-10"\n---\nBody'
      );

      const { getPostData } = await import('./posts');
      expect(() => getPostData('does-not-exist')).toThrow('Post not found: does-not-exist');
    });
  });
});

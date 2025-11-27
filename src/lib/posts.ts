import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface PostData {
  id: string;
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  content?: string;
  [key: string]: any;
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  // Recursively find all MD/MDX files
  const fileNames = getAllFiles(postsDirectory);
  
  const allPostsData = fileNames.map((fileName) => {
    // Read markdown file as string
    const fullPath = fileName;
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Get relative path for slug
    const relativePath = path.relative(postsDirectory, fileName);
    // Convert YYYY/MM/DD/filename.mdx to YYYY-MM-DD-filename
    const slug = relativePath
      .replace(/\.mdx?$/, '')
      .replace(/\\/g, '/') // Normalize windows paths
      .split('/')
      .join('-'); // Join with dashes

    const id = slug;

    return {
      id,
      slug: slug,
      ...matterResult.data,
    } as PostData;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

export function getPostData(slug: string): PostData {
  // Try to parse YYYY-MM-DD-filename format
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  
  let fullPath = '';
  
  if (match) {
    const [, year, month, day, filename] = match;
    // Try constructing the path based on the date pattern
    const possiblePath = path.join(postsDirectory, year, month, day, `${filename}`);
    
    if (fs.existsSync(`${possiblePath}.md`)) {
      fullPath = `${possiblePath}.md`;
    } else if (fs.existsSync(`${possiblePath}.mdx`)) {
      fullPath = `${possiblePath}.mdx`;
    }
  }
  
  // Fallback: If strict pattern matching fails or file not found, try to find it by iterating
  // This handles cases where the slug might not strictly follow YYYY-MM-DD-name or if the file structure is different
  if (!fullPath) {
    const allFiles = getAllFiles(postsDirectory);
    const foundFile = allFiles.find(file => {
      const relativePath = path.relative(postsDirectory, file);
      const generatedSlug = relativePath
        .replace(/\.mdx?$/, '')
        .replace(/\\/g, '/')
        .split('/')
        .join('-');
      return generatedSlug === slug;
    });
    
    if (foundFile) {
      fullPath = foundFile;
    }
  }

  if (!fullPath || !fs.existsSync(fullPath)) {
     throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return {
    id: slug,
    slug: slug,
    content: matterResult.content,
    ...matterResult.data,
  } as PostData;
}

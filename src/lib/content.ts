import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
  htmlContent?: string;
}

export interface PageContent extends Record<string, any> {
  menu: Record<string, string>;
  home: {
    title: string;
    content: string;
    links?: Record<string, string>;
  };
  experiences: Record<string, any>;
  projects: Record<string, any>;
  metadata: Record<string, any>;
}

const contentDirectory = path.join(process.cwd(), 'content');

async function getContentForLocaleFromPath(localeDir: string): Promise<PageContent> {
  const content: PageContent = {
    menu: {},
    home: { title: '', content: '' },
    experiences: {},
    projects: {},
    metadata: {}
  };

  // Read all markdown files in the locale directory
  const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(localeDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(fileContents);
    
    const slug = file.replace('.md', '');
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(markdownContent);
    const htmlContent = processedContent.toString();

    // Organize content based on slug/frontmatter
    if (slug === 'menu') {
      content.menu = frontmatter;
    } else if (slug === 'home') {
      // Extract links from frontmatter (exclude 'title' field)
      const { title, ...links } = frontmatter;

      content.home = {
        title: title || '',
        content: htmlContent,
        links: links
      };
    } else if (slug === 'metadata') {
      content.metadata = frontmatter;
    } else if (slug.startsWith('experience-')) {
      const experienceKey = slug.replace('experience-', '');
      content.experiences[experienceKey] = {
        ...frontmatter,
        description: htmlContent
      };
    } else if (slug.startsWith('project-')) {
      const projectKey = slug.replace('project-', '');
      content.projects[projectKey] = {
        ...frontmatter,
        description: htmlContent
      };
    }
  }

  return content;
}

export async function getContentForLocale(locale: string): Promise<PageContent> {
  const localeDir = path.join(contentDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    // Try alternative paths common in deployment environments
    const altContentDir1 = path.join(__dirname, '../../content');
    const altContentDir2 = path.join(__dirname, '../../../content'); 
    const altContentDir3 = path.join(process.cwd(), '.next/content');
    
    const altLocaleDir1 = path.join(altContentDir1, locale);
    const altLocaleDir2 = path.join(altContentDir2, locale);
    const altLocaleDir3 = path.join(altContentDir3, locale);
    
    if (fs.existsSync(altLocaleDir1)) {
      return getContentForLocaleFromPath(altLocaleDir1);
    } else if (fs.existsSync(altLocaleDir2)) {
      return getContentForLocaleFromPath(altLocaleDir2);
    } else if (fs.existsSync(altLocaleDir3)) {
      return getContentForLocaleFromPath(altLocaleDir3);
    }
    
    throw new Error(`Content directory for locale ${locale} not found. Searched: ${localeDir}, ${altLocaleDir1}, ${altLocaleDir2}, ${altLocaleDir3}`);
  }

  return getContentForLocaleFromPath(localeDir);
}

export async function saveContentItem(locale: string, slug: string, frontmatter: Record<string, any>, content: string): Promise<void> {
  const localeDir = path.join(contentDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }

  const filePath = path.join(localeDir, `${slug}.md`);
  
  const fileContent = matter.stringify(content, frontmatter);
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

export function getAllContentFiles(locale: string): ContentItem[] {
  const localeDir = path.join(contentDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir).filter(file => file.endsWith('.md'));
  
  return files.map(file => {
    const filePath = path.join(localeDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);
    
    return {
      slug: file.replace('.md', ''),
      frontmatter,
      content
    };
  });
}

export function getContentItem(locale: string, slug: string): ContentItem | null {
  const localeDir = path.join(contentDirectory, locale);
  const filePath = path.join(localeDir, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  
  return {
    slug,
    frontmatter,
    content
  };
}
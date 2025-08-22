import { NextRequest, NextResponse } from 'next/server';
import { getAllContentFiles, getContentItem, saveContentItem } from '@/lib/content';
import { contentRateLimit, getRealIP } from '@/lib/rate-limit';

async function verifyToken(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin-token')?.value;
  
  if (!token) {
    return false;
  }

  try {
    // Simple token verification (in production, use proper JWT verification)
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    
    // Validate timestamp format
    const parsedTimestamp = parseInt(timestamp);
    if (isNaN(parsedTimestamp) || parsedTimestamp < 0) {
      return false;
    }
    
    // Check if token is not older than 24 hours
    const tokenAge = Date.now() - parsedTimestamp;
    if (tokenAge > 60 * 60 * 24 * 1000 || tokenAge < 0) {
      return false;
    }

    // Validate username format
    if (!username || username.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const ip = getRealIP(request);
  const rateLimitResult = contentRateLimit.check(ip);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': '50',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
        }
      }
    );
  }

  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const content = getContentItem(locale, slug);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json(content);
    } else {
      const files = getAllContentFiles(locale);
      return NextResponse.json(files);
    }
  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const ip = getRealIP(request);
  const rateLimitResult = contentRateLimit.check(ip);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { locale, slug, frontmatter, content } = await request.json();

    // Enhanced input validation
    if (!locale || !slug || !frontmatter || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Missing required fields: locale, slug, frontmatter, content' },
        { status: 400 }
      );
    }

    // Validate locale
    if (!['en', 'it'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale. Must be "en" or "it"' },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-zA-Z0-9-_]+$/.test(slug) || slug.length > 100) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      );
    }

    // Validate content length (max 50KB)
    if (content.length > 50000) {
      return NextResponse.json(
        { error: 'Content too large' },
        { status: 400 }
      );
    }

    await saveContentItem(locale, slug, frontmatter, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getRealIP(request);
  const rateLimitResult = contentRateLimit.check(ip);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { locale, slug, frontmatter, content } = await request.json();

    if (!locale || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: locale, slug' },
        { status: 400 }
      );
    }

    // Check if file already exists
    const existingContent = getContentItem(locale, slug);
    if (existingContent) {
      return NextResponse.json({ error: 'File already exists' }, { status: 409 });
    }

    // Create new file with default content
    const defaultFrontmatter = frontmatter || { title: slug };
    const defaultContent = content || `# ${slug}\n\nNew content goes here...`;

    await saveContentItem(locale, slug, defaultFrontmatter, defaultContent);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Content creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const ip = getRealIP(request);
  const rateLimitResult = contentRateLimit.check(ip);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  if (!(await verifyToken(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const slug = searchParams.get('slug');

    if (!locale || !slug) {
      return NextResponse.json(
        { error: 'Missing required parameters: locale, slug' },
        { status: 400 }
      );
    }

    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'content', locale, `${slug}.md`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Content deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

export class AdminService {
  /**
   * Sync metadata between locales for projects and experiences
   * Only syncs metadata, not content
   */
  static async syncMetadataBetweenLocales(
    slug: string, 
    frontmatter: Record<string, any>,
    currentLocale: string
  ): Promise<boolean> {
    try {
      const targetLocale = currentLocale === 'en' ? 'it' : 'en';
      
      // Only sync if it's a project or experience
      if (!slug.startsWith('project-') && !slug.startsWith('experience-')) {
        return true;
      }

      // Get the target file
      const response = await fetch(`/api/admin/content?locale=${targetLocale}&slug=${slug}`);
      
      if (response.ok) {
        const targetFile = await response.json();
        
        // Sync metadata but keep original content
        const syncResponse = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale: targetLocale,
            slug,
            frontmatter,
            content: targetFile.content
          }),
        });

        return syncResponse.ok;
      }
      
      return true; // Don't fail if target file doesn't exist
    } catch (error) {
      console.error('Failed to sync metadata:', error);
      return false;
    }
  }

  /**
   * Update order for multiple files
   */
  static async updateFilesOrder(files: ContentItem[], locale: string): Promise<boolean> {
    try {
      const updatePromises = files.map(file => 
        fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale,
            slug: file.slug,
            frontmatter: file.frontmatter,
            content: file.content
          }),
        })
      );

      const results = await Promise.all(updatePromises);
      return results.every(response => response.ok);
    } catch (error) {
      console.error('Failed to update files order:', error);
      return false;
    }
  }

  /**
   * Download file as markdown
   */
  static downloadAsMarkdown(file: ContentItem): void {
    try {
      // Create frontmatter string
      const frontmatterString = Object.keys(file.frontmatter).length > 0 
        ? `---\n${Object.entries(file.frontmatter)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
              } else if (typeof value === 'object' && value !== null) {
                return `${key}:\n${Object.entries(value)
                  .map(([k, v]) => `  ${k}: ${v}`)
                  .join('\n')}`;
              } else {
                return `${key}: ${value}`;
              }
            })
            .join('\n')}\n---\n\n`
        : '';

      const content = frontmatterString + file.content;
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.slug}.md`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate file name
   */
  static validateFileName(fileName: string): { valid: boolean; error?: string } {
    if (!fileName.trim()) {
      return { valid: false, error: 'File name cannot be empty' };
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(fileName)) {
      return { valid: false, error: 'File name can only contain letters, numbers, hyphens, and underscores' };
    }

    if (fileName.length > 100) {
      return { valid: false, error: 'File name is too long' };
    }

    return { valid: true };
  }

  /**
   * Validate metadata JSON
   */
  static validateMetadata(metadataText: string): { valid: boolean; data?: any; error?: string } {
    try {
      const data = JSON.parse(metadataText);
      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  }
}
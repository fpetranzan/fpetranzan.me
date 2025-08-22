interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

interface CreateFileOptions {
  slug: string;
  frontmatter?: Record<string, any>;
  content?: Record<string, string>; // locale -> content
  createForAllLocales?: boolean;
}

interface LocaleContent {
  [locale: string]: {
    frontmatter: Record<string, any>;
    content: string;
  };
}

export class MultiLocaleService {
  private static readonly SUPPORTED_LOCALES = ['en', 'it'];
  
  /**
   * Create file for all locales or specific locale
   */
  static async createFile({
    slug,
    frontmatter = {},
    content = {},
    createForAllLocales = true
  }: CreateFileOptions): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    const promises: Promise<Response>[] = [];
    
    const locales = createForAllLocales ? this.SUPPORTED_LOCALES : [Object.keys(content)[0] || 'en'];
    
    for (const locale of locales) {
      const localeContent = content[locale] || this.getDefaultContent(slug, locale);
      const localeFrontmatter = this.prepareLocaleFrontmatter(frontmatter, locale);
      
      promises.push(
        fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale,
            slug,
            frontmatter: localeFrontmatter,
            content: localeContent
          }),
        })
      );
    }
    
    try {
      const results = await Promise.all(promises);
      
      for (let i = 0; i < results.length; i++) {
        const response = results[i];
        const locale = locales[i];
        
        if (!response.ok) {
          const errorData = await response.json();
          errors.push(`${locale}: ${errorData.error || 'Unknown error'}`);
        }
      }
      
      return {
        success: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Network error occurred during file creation']
      };
    }
  }
  
  /**
   * Delete file from all locales
   */
  static async deleteFile(slug: string): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    const promises: Promise<Response>[] = [];
    
    for (const locale of this.SUPPORTED_LOCALES) {
      promises.push(
        fetch(`/api/admin/content?locale=${locale}&slug=${slug}`, {
          method: 'DELETE'
        })
      );
    }
    
    try {
      const results = await Promise.all(promises);
      
      for (let i = 0; i < results.length; i++) {
        const response = results[i];
        const locale = this.SUPPORTED_LOCALES[i];
        
        // 404 is acceptable (file might not exist in all locales)
        if (!response.ok && response.status !== 404) {
          const errorData = await response.json();
          errors.push(`${locale}: ${errorData.error || 'Unknown error'}`);
        }
      }
      
      return {
        success: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Network error occurred during file deletion']
      };
    }
  }
  
  /**
   * Sync order changes across all locales
   */
  static async syncOrderAcrossLocales(
    files: ContentItem[], 
    currentLocale: string
  ): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    const otherLocales = this.SUPPORTED_LOCALES.filter(l => l !== currentLocale);
    
    for (const locale of otherLocales) {
      try {
        // Get files for this locale
        const response = await fetch(`/api/admin/content?locale=${locale}`);
        if (!response.ok) continue;
        
        const localeFiles: ContentItem[] = await response.json();
        
        // Update order for matching files
        const updatePromises: Promise<Response>[] = [];
        
        for (const file of files) {
          const localeFile = localeFiles.find(f => f.slug === file.slug);
          if (localeFile) {
            // Update only order, keep original content and locale-specific metadata
            const updatedFrontmatter = {
              ...localeFile.frontmatter,
              order: file.frontmatter.order
            };
            
            updatePromises.push(
              fetch('/api/admin/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  locale,
                  slug: file.slug,
                  frontmatter: updatedFrontmatter,
                  content: localeFile.content
                }),
              })
            );
          }
        }
        
        const results = await Promise.all(updatePromises);
        const failedUpdates = results.filter(r => !r.ok);
        
        if (failedUpdates.length > 0) {
          errors.push(`${locale}: Failed to update ${failedUpdates.length} files`);
        }
        
      } catch (error) {
        errors.push(`${locale}: Network error during sync`);
      }
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get default content based on slug and locale
   */
  private static getDefaultContent(slug: string, locale: string): string {
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    if (locale === 'it') {
      if (slug.startsWith('project-')) {
        return `# ${title}\n\nDescrizione del progetto...`;
      } else if (slug.startsWith('experience-')) {
        return `# ${title}\n\nDescrizione dell'esperienza lavorativa...`;
      } else {
        return `# ${title}\n\nNuovo contenuto...`;
      }
    } else {
      if (slug.startsWith('project-')) {
        return `# ${title}\n\nProject description...`;
      } else if (slug.startsWith('experience-')) {
        return `# ${title}\n\nWork experience description...`;
      } else {
        return `# ${title}\n\nNew content goes here...`;
      }
    }
  }
  
  /**
   * Prepare frontmatter for specific locale
   */
  private static prepareLocaleFrontmatter(
    baseFrontmatter: Record<string, any>, 
    locale: string
  ): Record<string, any> {
    const frontmatter = { ...baseFrontmatter };
    
    // Set locale-specific title if not provided
    if (!frontmatter.title) {
      const slug = frontmatter.slug || 'untitled';
      frontmatter.title = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    }
    
    // Ensure order is set
    if (typeof frontmatter.order === 'undefined') {
      frontmatter.order = 999;
    }
    
    return frontmatter;
  }
}
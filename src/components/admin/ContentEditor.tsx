'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FileList from './FileList';
import MetadataEditor from './MetadataEditor';
import { AdminService } from '@/lib/admin-services';
import { MultiLocaleService } from '@/lib/multi-locale-service';

interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

export default function ContentEditor() {
  const [locale, setLocale] = useState('en');
  const [files, setFiles] = useState<ContentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [createForAllLocales, setCreateForAllLocales] = useState(true);
  const router = useRouter();

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/content?locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    }
    setIsLoading(false);
  }, [locale, router]);

  const loadFile = async (slug: string) => {
    try {
      const response = await fetch(`/api/admin/content?locale=${locale}&slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedFile(data);
      } else if (response.status === 401) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    
    // Parse metadata if it was edited as text
    let frontmatter = selectedFile.frontmatter;
    if ((selectedFile as any).metadataText) {
      const validation = AdminService.validateMetadata((selectedFile as any).metadataText);
      if (!validation.valid) {
        setMessage(validation.error || 'Invalid JSON in metadata');
        return;
      }
      frontmatter = validation.data;
    }
    
    setIsSaving(true);
    try {
      // Save to current locale
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          slug: selectedFile.slug,
          frontmatter,
          content: selectedFile.content
        }),
      });

      if (response.ok) {
        // Sync metadata to other locale for projects and experiences
        const syncSuccess = await AdminService.syncMetadataBetweenLocales(
          selectedFile.slug, 
          frontmatter, 
          locale
        );
        
        if (syncSuccess) {
          setMessage('Content saved and synced successfully!');
        } else {
          setMessage('Content saved (sync failed)');
        }
        
        // Update local state
        setSelectedFile(prev => prev ? { ...prev, frontmatter } : null);
        setTimeout(() => setMessage(''), 3000);
      } else if (response.status === 401) {
        router.push('/admin/login');
      } else {
        setMessage('Failed to save content');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
    setIsSaving(false);
  };

  const createFile = async () => {
    const validation = AdminService.validateFileName(newFileName);
    if (!validation.valid) {
      setMessage(validation.error || 'Invalid file name');
      return;
    }

    setIsSaving(true);
    try {
      const sanitizedName = AdminService.sanitizeInput(newFileName.trim());
      
      if (createForAllLocales) {
        // Create file for all locales using MultiLocaleService
        const result = await MultiLocaleService.createFile({
          slug: sanitizedName,
          frontmatter: { title: sanitizedName },
          createForAllLocales: true
        });
        
        if (result.success) {
          setMessage('File created successfully for all locales!');
          setNewFileName('');
          setShowCreateForm(false);
          loadFiles();
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(`Errors: ${result.errors.join(', ')}`);
        }
      } else {
        // Create only for current locale (original behavior)
        const response = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale,
            slug: sanitizedName,
            frontmatter: { title: sanitizedName },
            content: `# ${sanitizedName}\n\nNew content goes here...`
          }),
        });

        if (response.ok) {
          setMessage('File created successfully!');
          setNewFileName('');
          setShowCreateForm(false);
          loadFiles();
          setTimeout(() => setMessage(''), 3000);
        } else {
          const data = await response.json();
          setMessage(data.error || 'Failed to create file');
        }
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
    setIsSaving(false);
  };

  const handleUpdateOrder = async (updatedFiles: ContentItem[]) => {
    const success = await AdminService.updateFilesOrder(updatedFiles, locale);
    if (success) {
      // Sync order across all locales
      const syncResult = await MultiLocaleService.syncOrderAcrossLocales(updatedFiles, locale);
      
      setFiles(updatedFiles);
      
      if (syncResult.success) {
        setMessage('Order updated and synced across all locales!');
      } else {
        setMessage(`Order updated (sync errors: ${syncResult.errors.join(', ')})`);
      }
      
      setTimeout(() => setMessage(''), 3000);
      
      // Reload files to ensure consistency
      loadFiles();
    } else {
      setMessage('Failed to update order');
    }
  };

  const handleDownloadFile = () => {
    if (selectedFile) {
      AdminService.downloadAsMarkdown(selectedFile);
    }
  };

  const deleteFile = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}" from all locales?`)) {
      return;
    }

    try {
      const result = await MultiLocaleService.deleteFile(slug);
      
      if (result.success) {
        setMessage('File deleted from all locales successfully!');
        if (selectedFile?.slug === slug) {
          setSelectedFile(null);
        }
        loadFiles();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Deletion errors: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      setMessage('Network error occurred');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [locale, loadFiles]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Content Editor
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="en">English</option>
                <option value="it">Italiano</option>
              </select>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File List */}
          <FileList
            files={files}
            selectedFile={selectedFile}
            onSelectFile={loadFile}
            onDeleteFile={deleteFile}
            onUpdateOrder={handleUpdateOrder}
            showCreateForm={showCreateForm}
            onToggleCreateForm={() => setShowCreateForm(!showCreateForm)}
            newFileName={newFileName}
            onNewFileNameChange={setNewFileName}
            onCreateFile={createFile}
            createForAllLocales={createForAllLocales}
            onToggleCreateForAllLocales={() => setCreateForAllLocales(!createForAllLocales)}
            isSaving={isSaving}
            isLoading={isLoading}
            locale={locale}
          />


          {/* Editor */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {selectedFile ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Editing: {selectedFile.slug}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadFile}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      title="Download as Markdown"
                    >
                      ⬇ Download
                    </button>
                    <button
                      onClick={saveFile}
                      disabled={isSaving}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`mb-4 p-3 rounded-md ${
                    message.includes('successfully') || message.includes('synced')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {message}
                  </div>
                )}

                <MetadataEditor
                  selectedFile={selectedFile}
                  onUpdateFile={setSelectedFile}
                />

                {/* Content Editor */}
                <div>
                  <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-white">
                    Content
                  </h3>
                  <textarea
                    value={selectedFile.content}
                    onChange={(e) => 
                      setSelectedFile(prev => prev ? { ...prev, content: e.target.value } : null)
                    }
                    className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    placeholder="Content (Markdown format)"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a file to edit
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
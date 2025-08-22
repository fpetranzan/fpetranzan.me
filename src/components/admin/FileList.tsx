'use client';

import CreateFileForm from './CreateFileForm';
import FileSectionList from './FileSectionList';

interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

interface FileListProps {
  files: ContentItem[];
  selectedFile: ContentItem | null;
  onSelectFile: (slug: string) => void;
  onDeleteFile: (slug: string) => void;
  onUpdateOrder: (files: ContentItem[]) => void;
  showCreateForm: boolean;
  onToggleCreateForm: () => void;
  newFileName: string;
  onNewFileNameChange: (name: string) => void;
  onCreateFile: () => void;
  createForAllLocales: boolean;
  onToggleCreateForAllLocales: () => void;
  isSaving: boolean;
  isLoading: boolean;
  locale: string;
}


export default function FileList({
  files,
  selectedFile,
  onSelectFile,
  onDeleteFile,
  onUpdateOrder,
  showCreateForm,
  onToggleCreateForm,
  newFileName,
  onNewFileNameChange,
  onCreateFile,
  createForAllLocales,
  onToggleCreateForAllLocales,
  isSaving,
  isLoading,
  locale
}: FileListProps) {
  const projectFiles = files
    .filter(file => file.slug.startsWith('project-'))
    .sort((a, b) => {
      const orderA = a.frontmatter?.order || 999;
      const orderB = b.frontmatter?.order || 999;
      return orderA - orderB;
    });

  const experienceFiles = files
    .filter(file => file.slug.startsWith('experience-'))
    .sort((a, b) => {
      const orderA = a.frontmatter?.order || 999;
      const orderB = b.frontmatter?.order || 999;
      return orderA - orderB;
    });

  const otherFiles = files.filter(
    file => !file.slug.startsWith('project-') && !file.slug.startsWith('experience-')
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Files ({locale})
        </h2>
        <button
          onClick={onToggleCreateForm}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
        >
          + New
        </button>
      </div>

      <CreateFileForm
        showCreateForm={showCreateForm}
        onToggleCreateForm={onToggleCreateForm}
        newFileName={newFileName}
        onNewFileNameChange={onNewFileNameChange}
        onCreateFile={onCreateFile}
        createForAllLocales={createForAllLocales}
        onToggleCreateForAllLocales={onToggleCreateForAllLocales}
        isSaving={isSaving}
      />

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
        </div>
      ) : (
        <div className="space-y-2">
          <FileSectionList
            title="Projects"
            files={projectFiles}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            onUpdateOrder={onUpdateOrder}
            showOrder={true}
          />
          
          <FileSectionList
            title="Experiences"
            files={experienceFiles}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            onUpdateOrder={onUpdateOrder}
            showOrder={true}
          />
          
          <FileSectionList
            title="Other Files"
            files={otherFiles}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onDeleteFile={onDeleteFile}
            onUpdateOrder={onUpdateOrder}
          />
        </div>
      )}
    </div>
  );
}
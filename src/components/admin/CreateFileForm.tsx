'use client';

interface CreateFileFormProps {
  showCreateForm: boolean;
  onToggleCreateForm: () => void;
  newFileName: string;
  onNewFileNameChange: (name: string) => void;
  onCreateFile: () => void;
  createForAllLocales: boolean;
  onToggleCreateForAllLocales: () => void;
  isSaving: boolean;
}

export default function CreateFileForm({
  showCreateForm,
  onToggleCreateForm,
  newFileName,
  onNewFileNameChange,
  onCreateFile,
  createForAllLocales,
  onToggleCreateForAllLocales,
  isSaving
}: CreateFileFormProps) {
  if (!showCreateForm) return null;

  return (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
      <input
        type="text"
        placeholder="Enter file name (e.g., new-page)"
        value={newFileName}
        onChange={(e) => onNewFileNameChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && newFileName.trim()) {
            onCreateFile();
          }
        }}
      />
      
      <div className="mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={createForAllLocales}
            onChange={onToggleCreateForAllLocales}
            className="mr-2 w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Create for all locales (EN + IT)
          </span>
        </label>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onCreateFile}
          disabled={isSaving || !newFileName.trim()}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Creating...' : 'Create'}
        </button>
        <button
          onClick={() => {
            onToggleCreateForm();
            onNewFileNameChange('');
          }}
          disabled={isSaving}
          className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
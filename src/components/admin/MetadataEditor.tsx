'use client';

import { useState } from 'react';

interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

interface MetadataEditorProps {
  selectedFile: ContentItem;
  onUpdateFile: (updatedFile: ContentItem) => void;
}

export default function MetadataEditor({ selectedFile, onUpdateFile }: MetadataEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFrontmatter = (field: string, value: any) => {
    onUpdateFile({
      ...selectedFile,
      frontmatter: { ...selectedFile.frontmatter, [field]: value }
    });
  };

  const updateTechnologies = (newTechs: string[]) => {
    updateFrontmatter('tecnologies', newTechs);
  };

  // Convert object-based technologies to array for easier management
  const getTechnologiesArray = () => {
    const tech = selectedFile.frontmatter.tecnologies;
    if (Array.isArray(tech)) {
      return tech;
    }
    // Convert object to array (legacy support)
    return Object.values(tech || {}).filter(Boolean);
  };

  const techArray = getTechnologiesArray();

  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-4 text-gray-900 dark:text-white">
        Metadata
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name/Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name/Title
          </label>
          <input
            type="text"
            value={selectedFile.frontmatter.name || selectedFile.frontmatter.title || ''}
            onChange={(e) => {
              const field = selectedFile.frontmatter.name !== undefined ? 'name' : 'title';
              updateFrontmatter(field, e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter name or title"
          />
        </div>

        {/* Year */}
        {(selectedFile.frontmatter.year !== undefined) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Year
            </label>
            <input
              type="text"
              value={selectedFile.frontmatter.year || ''}
              onChange={(e) => updateFrontmatter('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., 2025"
            />
          </div>
        )}

        {/* Order */}
        {(selectedFile.frontmatter.order !== undefined) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order
            </label>
            <input
              type="number"
              value={selectedFile.frontmatter.order || ''}
              onChange={(e) => updateFrontmatter('order', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="0"
            />
          </div>
        )}

        {/* Link */}
        {(selectedFile.frontmatter.link !== undefined) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Link
            </label>
            <input
              type="url"
              value={selectedFile.frontmatter.link || ''}
              onChange={(e) => updateFrontmatter('link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="https://..."
            />
          </div>
        )}

        {/* Role */}
        {(selectedFile.frontmatter.role !== undefined) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              type="text"
              value={selectedFile.frontmatter.role || ''}
              onChange={(e) => updateFrontmatter('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter role"
            />
          </div>
        )}

        {/* Start Date */}
        {(selectedFile.frontmatter.start !== undefined) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="text"
              value={selectedFile.frontmatter.start || ''}
              onChange={(e) => updateFrontmatter('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., 09.2021"
            />
          </div>
        )}

        {/* End Date */}
        {(selectedFile.frontmatter.end !== undefined) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="text"
              value={selectedFile.frontmatter.end || ''}
              onChange={(e) => updateFrontmatter('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="e.g., today"
            />
          </div>
        )}
      </div>

      {/* Technologies Tags */}
      {(selectedFile.frontmatter.tecnologies !== undefined) && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technologies
          </label>
          <div className="space-y-2">
            {techArray.map((tech, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">#{index + 1}</span>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => {
                    const newTechs = [...techArray];
                    newTechs[index] = e.target.value;
                    updateTechnologies(newTechs);
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Technology name"
                />
                <button
                  onClick={() => {
                    const newTechs = techArray.filter((_, i) => i !== index);
                    updateTechnologies(newTechs);
                  }}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  title="Remove technology"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateTechnologies([...techArray, '']);
              }}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
            >
              + Add Technology
            </button>
          </div>
        </div>
      )}

      {/* Custom Fields */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer hover:text-indigo-600"
        >
          {showAdvanced ? '▼' : '▶'} Advanced/Custom Fields
        </button>
        {showAdvanced && (
          <textarea
            value={(selectedFile as any).metadataText ?? JSON.stringify(selectedFile.frontmatter, null, 2)}
            onChange={(e) => {
              onUpdateFile({ ...selectedFile, metadataText: e.target.value } as any);
            }}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            placeholder="Raw metadata (JSON format)"
          />
        )}
      </div>
    </div>
  );
}
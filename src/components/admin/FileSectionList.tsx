'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContentItem {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

interface SortableItemProps {
  file: ContentItem;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  showOrder?: boolean;
}

function SortableItem({ file, isSelected, onSelect, onDelete, showOrder = false }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
        isSelected
          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}
    >
      <div className="flex items-center flex-1">
        <button
          {...attributes}
          {...listeners}
          className="mr-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Drag to reorder"
        >
          ⋮⋮
        </button>
        <button
          onClick={onSelect}
          className="flex-1 text-left text-sm truncate"
          title={file.slug}
        >
          {showOrder && (
            <span className="text-xs text-gray-500 mr-1">#{file.frontmatter?.order || '∞'}</span>
          )} 
          {file.slug}
        </button>
      </div>
      <button
        onClick={onDelete}
        className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        title="Delete file"
      >
        ✕
      </button>
    </div>
  );
}

interface FileSectionProps {
  title: string;
  files: ContentItem[];
  selectedFile: ContentItem | null;
  onSelectFile: (slug: string) => void;
  onDeleteFile: (slug: string) => void;
  onUpdateOrder: (files: ContentItem[]) => void;
  showOrder?: boolean;
}

export default function FileSectionList({ 
  title, 
  files, 
  selectedFile, 
  onSelectFile, 
  onDeleteFile, 
  onUpdateOrder, 
  showOrder = false 
}: FileSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((file) => file.slug === active.id);
      const newIndex = files.findIndex((file) => file.slug === over?.id);
      
      const newFiles = arrayMove(files, oldIndex, newIndex);
      
      // Update order values
      const updatedFiles = newFiles.map((file, index) => ({
        ...file,
        frontmatter: {
          ...file.frontmatter,
          order: index + 1
        }
      }));
      
      onUpdateOrder(updatedFiles);
    }
  };

  if (files.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-600 pb-1">
        {title} ({files.length})
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={files.map(f => f.slug)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {files.map((file) => (
              <SortableItem
                key={file.slug}
                file={file}
                isSelected={selectedFile?.slug === file.slug}
                onSelect={() => onSelectFile(file.slug)}
                onDelete={() => onDeleteFile(file.slug)}
                showOrder={showOrder}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
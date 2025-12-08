import { useState } from "react";
import { GripVertical, X, Plus } from "lucide-react";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { Button } from "@/components/ui/button";

interface DraggableListProps<T> {
  items: T[];
  hiddenItems: T[];
  onReorder: (items: T[]) => void;
  onRemove: (index: number, item: T) => void;
  onAdd: (item: T) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderHiddenItem: (item: T) => React.ReactNode;
  getItemKey: (item: T, index: number) => string;
  itemsLabel: string;
}

function DraggableList<T>({
  items,
  hiddenItems,
  onReorder,
  onRemove,
  onAdd,
  renderItem,
  renderHiddenItem,
  getItemKey,
  itemsLabel,
}: DraggableListProps<T>) {
  const { isEditMode } = useProposalContent();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dragOverIndex, 0, draggedItem);
      onReorder(newItems);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Active items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div
            key={getItemKey(item, index)}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            className={`relative transition-all ${
              isEditMode ? "cursor-grab active:cursor-grabbing" : ""
            } ${
              dragOverIndex === index ? "ring-2 ring-primary ring-dashed" : ""
            } ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            {isEditMode && (
              <>
                <div className="absolute top-2 left-2 z-10 text-muted-foreground">
                  <GripVertical className="w-4 h-4" />
                </div>
                <button
                  onClick={() => onRemove(index, item)}
                  className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-destructive" />
                </button>
              </>
            )}
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Hidden items - available to add back */}
      {isEditMode && hiddenItems.length > 0 && (
        <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-border/50 bg-muted/20">
          <p className="text-sm text-muted-foreground mb-3">
            Available {itemsLabel} (click to add):
          </p>
          <div className="flex flex-wrap gap-2">
            {hiddenItems.map((item, index) => (
              <Button
                key={`hidden-${index}`}
                variant="outline"
                size="sm"
                onClick={() => onAdd(item)}
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                {renderHiddenItem(item)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DraggableList;

import { motion } from "framer-motion";
import { Check, X, GripVertical } from "lucide-react";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { useState } from "react";

type Pillar = { title: string; description: string };
type Differentiator = { title: string; description: string };

const ValuePage = () => {
  const { content, updateContent, isEditMode } = useProposalContent();
  const { value } = content;
  const [draggedPillarIndex, setDraggedPillarIndex] = useState<number | null>(null);
  const [dragOverPillarIndex, setDragOverPillarIndex] = useState<number | null>(null);

  const updatePillar = (index: number, field: "title" | "description", val: string) => {
    const newPillars = [...value.pillars];
    newPillars[index] = { ...newPillars[index], [field]: val };
    updateContent("value", { pillars: newPillars });
  };

  const updateDifferentiator = (index: number, field: "title" | "description", val: string) => {
    const newDiffs = [...value.differentiators];
    newDiffs[index] = { ...newDiffs[index], [field]: val };
    updateContent("value", { differentiators: newDiffs });
  };

  const handleRemovePillar = (index: number) => {
    const removedPillar = value.pillars[index];
    const newPillars = value.pillars.filter((_, i) => i !== index);
    const newHidden = [...(value.hiddenPillars || []), removedPillar];
    updateContent("value", { pillars: newPillars, hiddenPillars: newHidden });
  };

  const handleRemoveDifferentiator = (index: number) => {
    const removedDiff = value.differentiators[index];
    const newDiffs = value.differentiators.filter((_, i) => i !== index);
    const newHidden = [...(value.hiddenDifferentiators || []), removedDiff];
    updateContent("value", { differentiators: newDiffs, hiddenDifferentiators: newHidden });
  };

  // Drag handlers for pillars
  const handlePillarDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    setDraggedPillarIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePillarDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverPillarIndex(index);
  };

  const handlePillarDragEnd = () => {
    if (draggedPillarIndex !== null && dragOverPillarIndex !== null && draggedPillarIndex !== dragOverPillarIndex) {
      const newPillars = [...value.pillars];
      const [draggedItem] = newPillars.splice(draggedPillarIndex, 1);
      newPillars.splice(dragOverPillarIndex, 0, draggedItem);
      updateContent("value", { pillars: newPillars });
    }
    setDraggedPillarIndex(null);
    setDragOverPillarIndex(null);
  };

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">
            <EditableText
              value={value.sectionLabel}
              onSave={(val) => updateContent("value", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={value.title}
              onSave={(val) => updateContent("value", { title: val })}
            />
          </h2>
        </motion.div>

        <div className={`grid gap-4 md:gap-8 mb-8 md:mb-12 ${
          value.pillars.length === 1 ? 'grid-cols-1 max-w-md' :
          value.pillars.length === 2 ? 'grid-cols-2' :
          value.pillars.length === 3 ? 'grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        }`}>
          {value.pillars.map((pillar, index) => (
            <motion.div
              key={`${pillar.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              draggable={isEditMode}
              onDragStart={(e) => handlePillarDragStart(e as any, index)}
              onDragOver={(e) => handlePillarDragOver(e as any, index)}
              onDragEnd={handlePillarDragEnd}
              className={`relative p-5 rounded-lg border-2 border-border bg-muted/30 hover:border-primary/50 transition-colors ${
                isEditMode ? 'cursor-grab active:cursor-grabbing' : ''
              } ${
                dragOverPillarIndex === index ? 'ring-2 ring-primary ring-dashed' : ''
              } ${
                draggedPillarIndex === index ? 'opacity-50' : ''
              }`}
            >
              {isEditMode && (
                <>
                  <div className="absolute top-1 left-1 text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => handleRemovePillar(index)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                </>
              )}
              <div className="text-3xl md:text-4xl font-heading font-light mb-2 md:mb-4 text-primary">
                <EditableText
                  value={pillar.title}
                  onSave={(val) => updatePillar(index, "title", val)}
                />
              </div>
              <p className="text-muted-foreground leading-relaxed text-xs md:text-sm">
                <EditableText
                  value={pillar.description}
                  onSave={(val) => updatePillar(index, "description", val)}
                  multiline
                />
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t-2 border-primary pt-6 md:pt-8"
        >
          <h3 className="text-xl md:text-2xl font-heading font-semibold mb-6 text-foreground">
            <EditableText
              value={value.differentiatorsTitle}
              onSave={(val) => updateContent("value", { differentiatorsTitle: val })}
            />
          </h3>

          <div className="space-y-4">
            {value.differentiators.map((diff, index) => (
              <motion.div
                key={`${diff.title}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                className={`relative flex items-start gap-3 md:gap-4 p-3 rounded-lg ${
                  isEditMode ? 'border border-border/50 hover:border-primary/30' : ''
                }`}
              >
                {isEditMode && (
                  <button
                    onClick={() => handleRemoveDifferentiator(index)}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                )}
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <div className="pr-6">
                  <h4 className="font-heading font-semibold text-foreground mb-1 text-sm md:text-base">
                    <EditableText
                      value={diff.title}
                      onSave={(val) => updateDifferentiator(index, "title", val)}
                    />
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    <EditableText
                      value={diff.description}
                      onSave={(val) => updateDifferentiator(index, "description", val)}
                    />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ValuePage;

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ValuePage = () => {
  const { content, updateContent } = useProposalContent();
  const { value } = content;

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          {value.pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
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
          <h3 className="text-xl md:text-2xl font-heading font-semibold mb-6 text-foreground">Competitive Differentiators</h3>

          <div className="space-y-4">
            {value.differentiators.map((diff, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                className="flex items-start gap-3 md:gap-4"
              >
                <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                </div>
                <div>
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

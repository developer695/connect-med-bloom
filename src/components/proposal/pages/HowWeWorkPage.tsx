import { motion } from "framer-motion";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const HowWeWorkPage = () => {
  const { content, updateContent } = useProposalContent();
  const { howWeWork } = content;

  const updateStep = (index: number, field: "title" | "description", value: string) => {
    const newSteps = [...howWeWork.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateContent("howWeWork", { steps: newSteps });
  };

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">
            <EditableText
              value={howWeWork.sectionLabel}
              onSave={(val) => updateContent("howWeWork", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={howWeWork.title}
              onSave={(val) => updateContent("howWeWork", { title: val })}
            />
          </h2>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {howWeWork.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4 md:gap-6"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg md:text-xl font-bold">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-heading font-semibold mb-2 md:mb-3 text-foreground">
                  <EditableText
                    value={step.title}
                    onSave={(val) => updateStep(index, "title", val)}
                  />
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  <EditableText
                    value={step.description}
                    onSave={(val) => updateStep(index, "description", val)}
                    multiline
                  />
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={howWeWork.collaborativeTitle}
              onSave={(val) => updateContent("howWeWork", { collaborativeTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={howWeWork.collaborativeText}
              onSave={(val) => updateContent("howWeWork", { collaborativeText: val })}
              multiline
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HowWeWorkPage;

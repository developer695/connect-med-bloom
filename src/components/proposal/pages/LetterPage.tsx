import { motion } from "framer-motion";
import UnifiMedLogo from "../UnifiMedLogo";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const LetterPage = () => {
  const { content, updateContent } = useProposalContent();
  const { letter } = content;

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...letter.paragraphs];
    newParagraphs[index] = value;
    updateContent("letter", { paragraphs: newParagraphs });
  };

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UnifiMedLogo size="sm" className="mb-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-sm text-muted-foreground"
        >
          <EditableText
            value={letter.date}
            onSave={(val) => updateContent("letter", { date: val })}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <div className="text-foreground font-medium">
              <EditableText
                value={letter.salutation}
                onSave={(val) => updateContent("letter", { salutation: val })}
              />
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            {letter.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <EditableText
                  value={paragraph}
                  onSave={(val) => updateParagraph(index, val)}
                  multiline
                />
              </p>
            ))}
          </div>

          <div className="mt-12">
            <div className="text-foreground font-semibold">
              <EditableText
                value={letter.closing}
                onSave={(val) => updateContent("letter", { closing: val })}
              />
            </div>
            <div className="mt-8 text-foreground font-semibold">
              <EditableText
                value={letter.signature}
                onSave={(val) => updateContent("letter", { signature: val })}
              />
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground">
            <EditableText
              value={letter.footer}
              onSave={(val) => updateContent("letter", { footer: val })}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LetterPage;

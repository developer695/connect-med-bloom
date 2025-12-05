import { motion } from "framer-motion";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const MarketsPage = () => {
  const { content, updateContent } = useProposalContent();
  const { markets } = content;

  const updateSegment = (index: number, field: "title" | "description", value: string) => {
    const newSegments = [...markets.segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    updateContent("markets", { segments: newSegments });
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
              value={markets.sectionLabel}
              onSave={(val) => updateContent("markets", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={markets.title}
              onSave={(val) => updateContent("markets", { title: val })}
            />
          </h2>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {markets.segments.map((market, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-l-4 border-primary pl-4 md:pl-6"
            >
              <h3 className="text-xl md:text-2xl font-heading font-semibold mb-3 text-foreground">
                <EditableText
                  value={market.title}
                  onSave={(val) => updateSegment(index, "title", val)}
                />
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                <EditableText
                  value={market.description}
                  onSave={(val) => updateSegment(index, "description", val)}
                  multiline
                />
              </p>
              <div className="flex flex-wrap gap-2">
                {market.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs md:text-sm bg-primary text-primary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">Cross-Functional Expertise</h3>
          <p className="text-muted-foreground leading-relaxed">
            Our team's diverse experience across these market segments enables us to provide nuanced, sector-specific guidance while leveraging cross-functional insights to optimize your commercialization strategy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketsPage;

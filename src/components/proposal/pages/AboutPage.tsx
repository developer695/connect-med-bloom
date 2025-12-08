import { motion } from "framer-motion";
import { Globe, Target, TrendingUp } from "lucide-react";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const icons = [Globe, Target, TrendingUp];

const AboutPage = () => {
  const { content, updateContent } = useProposalContent();
  const { about } = content;

  const updateStat = (index: number, field: "title" | "description", value: string) => {
    const newStats = [...about.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateContent("about", { stats: newStats });
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
              value={about.sectionLabel}
              onSave={(val) => updateContent("about", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={about.title}
              onSave={(val) => updateContent("about", { title: val })}
            />
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {about.stats.map((stat, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-lg bg-primary-light"
              >
                <Icon className="w-10 h-10 mb-4 text-primary" />
                <div className="text-xl font-heading font-bold mb-2 text-foreground">
                  <EditableText
                    value={stat.title}
                    onSave={(val) => updateStat(index, "title", val)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <EditableText
                    value={stat.description}
                    onSave={(val) => updateStat(index, "description", val)}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6 text-muted-foreground"
        >
          <p className="text-lg leading-relaxed">
            <EditableText
              value={about.intro}
              onSave={(val) => updateContent("about", { intro: val })}
              multiline
            />
          </p>

          <div className="bg-secondary p-8 rounded-lg my-8">
            <h3 className="text-xl md:text-2xl font-heading font-semibold mb-4 text-foreground">
              <EditableText
                value={about.expertiseTitle}
                onSave={(val) => updateContent("about", { expertiseTitle: val })}
              />
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              <EditableText
                value={about.expertiseText}
                onSave={(val) => updateContent("about", { expertiseText: val })}
                multiline
              />
            </p>
          </div>

          <h3 className="text-xl md:text-2xl font-heading font-semibold mt-8 mb-4 text-foreground">
            <EditableText
              value={about.missionTitle}
              onSave={(val) => updateContent("about", { missionTitle: val })}
            />
          </h3>
          <p className="leading-relaxed">
            <EditableText
              value={about.missionText}
              onSave={(val) => updateContent("about", { missionText: val })}
              multiline
            />
          </p>

          <div className="border-l-4 border-primary pl-6 my-8">
            <p className="text-lg md:text-xl italic text-foreground leading-relaxed">
              "<EditableText
                value={about.quote}
                onSave={(val) => updateContent("about", { quote: val })}
                multiline
              />"
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;

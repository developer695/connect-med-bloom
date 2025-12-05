import { motion } from "framer-motion";
import { TrendingUp, Heart, Users, Target, FileText, Award } from "lucide-react";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const icons = [TrendingUp, Heart, Users, Target, FileText, Award];

const SolutionsPage = () => {
  const { content, updateContent } = useProposalContent();
  const { solutions } = content;

  const updateService = (index: number, field: "title" | "description", value: string) => {
    const newServices = [...solutions.services];
    newServices[index] = { ...newServices[index], [field]: value };
    updateContent("solutions", { services: newServices });
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
              value={solutions.sectionLabel}
              onSave={(val) => updateContent("solutions", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={solutions.title}
              onSave={(val) => updateContent("solutions", { title: val })}
            />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {solutions.services.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="border border-border rounded-lg p-5 md:p-6 hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 text-foreground">
                  <EditableText
                    value={service.title}
                    onSave={(val) => updateService(index, "title", val)}
                  />
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  <EditableText
                    value={service.description}
                    onSave={(val) => updateService(index, "description", val)}
                    multiline
                  />
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 md:p-8 rounded-lg border-2 border-primary"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">Integrated Service Model</h3>
          <p className="text-muted-foreground leading-relaxed">
            While each service can be engaged independently, our true value lies in our integrated approach. By coordinating across regulatory, clinical, commercial, and financial dimensions, we create synergies that accelerate timelines, reduce costs, and increase the probability of commercial success.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SolutionsPage;

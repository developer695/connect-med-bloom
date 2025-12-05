import { motion } from "framer-motion";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ClientsPage = () => {
  const { content, updateContent } = useProposalContent();
  const { clients } = content;

  const updateClient = (index: number, field: "title" | "description", value: string) => {
    const newClients = [...clients.clientTypes];
    newClients[index] = { ...newClients[index], [field]: value };
    updateContent("clients", { clientTypes: newClients });
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
              value={clients.sectionLabel}
              onSave={(val) => updateContent("clients", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={clients.title}
              onSave={(val) => updateContent("clients", { title: val })}
            />
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-muted-foreground mb-8 md:mb-12 leading-relaxed"
        >
          <EditableText
            value={clients.intro}
            onSave={(val) => updateContent("clients", { intro: val })}
            multiline
          />
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {clients.clientTypes.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="p-5 md:p-6 rounded-lg border-2 border-border hover:border-primary/50 transition-colors"
            >
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 text-foreground">
                <EditableText
                  value={client.title}
                  onSave={(val) => updateClient(index, "title", val)}
                />
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                <EditableText
                  value={client.description}
                  onSave={(val) => updateClient(index, "description", val)}
                  multiline
                />
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 md:mt-12 p-6 md:p-8 rounded-lg bg-primary/15"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={clients.tailoredTitle}
              onSave={(val) => updateContent("clients", { tailoredTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={clients.tailoredText}
              onSave={(val) => updateContent("clients", { tailoredText: val })}
              multiline
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientsPage;

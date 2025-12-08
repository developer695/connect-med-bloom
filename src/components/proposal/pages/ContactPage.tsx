import { motion } from "framer-motion";
import { CheckCircle, Handshake, Calendar, FileText } from "lucide-react";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ContactPage = () => {
  const { content, updateContent } = useProposalContent();
  const { contact } = content;

  const updateNextStep = (index: number, field: "title" | "description", value: string) => {
    const newSteps = [...contact.nextSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateContent("contact", { nextSteps: newSteps });
  };

  const stepIcons = [Calendar, FileText, Handshake, CheckCircle];

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/5" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/3" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12 text-center"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">
            <EditableText
              value={contact.sectionLabel}
              onSave={(val) => updateContent("contact", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={contact.title}
              onSave={(val) => updateContent("contact", { title: val })}
            />
          </h2>
        </motion.div>

        {/* Thank you message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10 md:mb-14"
        >
          <h3 className="text-xl md:text-2xl font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={contact.conversationTitle}
              onSave={(val) => updateContent("contact", { conversationTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
            <EditableText
              value={contact.intro}
              onSave={(val) => updateContent("contact", { intro: val })}
              multiline
            />
          </p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 md:mb-14"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-6 text-center text-foreground">
            <EditableText
              value={contact.nextStepsTitle}
              onSave={(val) => updateContent("contact", { nextStepsTitle: val })}
            />
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {contact.nextSteps.map((step, index) => {
              const IconComponent = stepIcons[index] || CheckCircle;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm md:text-base">
                      <EditableText
                        value={step.title}
                        onSave={(val) => updateNextStep(index, "title", val)}
                      />
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      <EditableText
                        value={step.description}
                        onSave={(val) => updateNextStep(index, "description", val)}
                      />
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact information - simplified for proposal closeout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-6 md:p-8 rounded-lg bg-primary/10 text-center"
        >
          <h3 className="text-lg md:text-xl font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={contact.ctaButton}
              onSave={(val) => updateContent("contact", { ctaButton: val })}
            />
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                <EditableText
                  value={contact.email}
                  onSave={(val) => updateContent("contact", { email: val })}
                />
              </span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                <EditableText
                  value={contact.website}
                  onSave={(val) => updateContent("contact", { website: val })}
                />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 md:mt-14 text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">
            <EditableText
              value={contact.academyText}
              onSave={(val) => updateContent("contact", { academyText: val })}
            />
          </p>
          <p className="text-lg font-heading font-semibold text-primary">
            <EditableText
              value={contact.academyTitle}
              onSave={(val) => updateContent("contact", { academyTitle: val })}
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;

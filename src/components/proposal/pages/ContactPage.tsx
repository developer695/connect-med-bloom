import { motion } from "framer-motion";
import { Mail, MapPin, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="h-full p-8 md:p-16 bg-gradient-to-br from-card to-secondary/50 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl md:text-2xl font-heading font-semibold mb-4 md:mb-6 text-foreground">
              <EditableText
                value={contact.conversationTitle}
                onSave={(val) => updateContent("contact", { conversationTitle: val })}
              />
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              <EditableText
                value={contact.intro}
                onSave={(val) => updateContent("contact", { intro: val })}
                multiline
              />
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-light flex items-center justify-center">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold text-foreground text-sm md:text-base">
                    <EditableText
                      value={contact.email}
                      onSave={(val) => updateContent("contact", { email: val })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-light flex items-center justify-center">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold text-foreground text-sm md:text-base">
                    <EditableText
                      value={contact.location}
                      onSave={(val) => updateContent("contact", { location: val })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary-light flex items-center justify-center">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">Website</div>
                  <div className="font-semibold text-foreground text-sm md:text-base">
                    <EditableText
                      value={contact.website}
                      onSave={(val) => updateContent("contact", { website: val })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-lg p-6 md:p-8 shadow-elevated"
          >
            <h3 className="text-lg md:text-xl font-heading font-semibold mb-6 text-foreground">
              <EditableText
                value={contact.nextStepsTitle}
                onSave={(val) => updateContent("contact", { nextStepsTitle: val })}
              />
            </h3>

            <div className="space-y-5 md:space-y-6">
              {contact.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-1 md:mb-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs md:text-sm font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-heading font-semibold text-foreground text-sm md:text-base">
                      <EditableText
                        value={step.title}
                        onSave={(val) => updateNextStep(index, "title", val)}
                      />
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground ml-9 md:ml-11">
                    <EditableText
                      value={step.description}
                      onSave={(val) => updateNextStep(index, "description", val)}
                    />
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 pt-6 border-t border-border">
              <Button className="w-full" size="lg">
                <EditableText
                  value={contact.ctaButton}
                  onSave={(val) => updateContent("contact", { ctaButton: val })}
                />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 md:mt-16 p-6 md:p-8 rounded-lg bg-primary-light cursor-pointer hover:bg-primary/15 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-2 text-foreground">
                <EditableText
                  value={contact.academyTitle}
                  onSave={(val) => updateContent("contact", { academyTitle: val })}
                />
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                <EditableText
                  value={contact.academyText}
                  onSave={(val) => updateContent("contact", { academyText: val })}
                />
              </p>
            </div>
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;

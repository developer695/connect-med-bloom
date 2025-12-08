import { motion } from "framer-motion";
import EditableText from "../EditableText";
import { useProposalContent } from "@/contexts/ProposalContentContext";

const ProposalPage = () => {
  const { content, updateContent } = useProposalContent();
  const { proposal } = content;

  const updatePackage = (index: number, field: "name" | "description" | "price" | "duration", value: string) => {
    const newPackages = [...proposal.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    updateContent("proposal", { packages: newPackages });
  };

  const updatePackageFeature = (pkgIndex: number, featureIndex: number, value: string) => {
    const newPackages = [...proposal.packages];
    const newFeatures = [...newPackages[pkgIndex].features];
    newFeatures[featureIndex] = value;
    newPackages[pkgIndex] = { ...newPackages[pkgIndex], features: newFeatures };
    updateContent("proposal", { packages: newPackages });
  };

  const updateDeliverable = (index: number, field: "title" | "description", value: string) => {
    const newDeliverables = [...proposal.deliverables];
    newDeliverables[index] = { ...newDeliverables[index], [field]: value };
    updateContent("proposal", { deliverables: newDeliverables });
  };

  return (
    <div className="h-full p-8 md:p-16 bg-card overflow-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="text-sm font-semibold mb-2 text-primary tracking-wide">
            <EditableText
              value={proposal.sectionLabel}
              onSave={(val) => updateContent("proposal", { sectionLabel: val })}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground">
            <EditableText
              value={proposal.title}
              onSave={(val) => updateContent("proposal", { title: val })}
            />
          </h2>
        </motion.div>

        {/* Scope Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
            <EditableText
              value={proposal.scopeTitle}
              onSave={(val) => updateContent("proposal", { scopeTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            <EditableText
              value={proposal.scopeText}
              onSave={(val) => updateContent("proposal", { scopeText: val })}
              multiline
            />
          </p>
        </motion.div>

        {/* Deliverables Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
            <EditableText
              value={proposal.deliverablesTitle}
              onSave={(val) => updateContent("proposal", { deliverablesTitle: val })}
            />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proposal.deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="bg-muted/30 rounded-lg p-4 border border-border/50"
              >
                <h4 className="font-semibold text-foreground mb-2">
                  <EditableText
                    value={deliverable.title}
                    onSave={(val) => updateDeliverable(index, "title", val)}
                  />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <EditableText
                    value={deliverable.description}
                    onSave={(val) => updateDeliverable(index, "description", val)}
                    multiline
                  />
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Packages/Pricing Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-semibold mb-4 text-primary">
            <EditableText
              value={proposal.packagesTitle}
              onSave={(val) => updateContent("proposal", { packagesTitle: val })}
            />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proposal.packages.map((pkg, pkgIndex) => (
              <motion.div
                key={pkgIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + pkgIndex * 0.1 }}
                className={`rounded-lg p-6 border-2 ${
                  pkgIndex === 1
                    ? "border-primary bg-primary/5"
                    : "border-border/50 bg-muted/20"
                }`}
              >
                <h4 className="text-lg font-heading font-semibold text-foreground mb-1">
                  <EditableText
                    value={pkg.name}
                    onSave={(val) => updatePackage(pkgIndex, "name", val)}
                  />
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  <EditableText
                    value={pkg.description}
                    onSave={(val) => updatePackage(pkgIndex, "description", val)}
                  />
                </p>
                <div className="text-2xl font-bold text-primary mb-1">
                  <EditableText
                    value={pkg.price}
                    onSave={(val) => updatePackage(pkgIndex, "price", val)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  <EditableText
                    value={pkg.duration}
                    onSave={(val) => updatePackage(pkgIndex, "duration", val)}
                  />
                </p>
                <ul className="space-y-2">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-sm text-muted-foreground">
                        <EditableText
                          value={feature}
                          onSave={(val) => updatePackageFeature(pkgIndex, featureIndex, val)}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Terms Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-6 md:p-8 rounded-lg bg-primary-light"
        >
          <h3 className="text-lg font-heading font-semibold mb-4 text-foreground">
            <EditableText
              value={proposal.termsTitle}
              onSave={(val) => updateContent("proposal", { termsTitle: val })}
            />
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            <EditableText
              value={proposal.termsText}
              onSave={(val) => updateContent("proposal", { termsText: val })}
              multiline
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProposalPage;
